import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import {
  fetchAllUserInquiriesFromFirestore,
  updateInquiryDriveStatusInFirestore,
  deleteInquiryFromFirestore,
  bookmarkInquiryInFirestore,
  syncLocalInquiriesToFirestore,
  StoredInquiry,
  logOutUser,
  hasDriveToken,
  authorizeGoogleDrive,
  onDriveTokenChange,
} from "../services/firebase.ts";
import {
  uploadInquiryToGoogleDrive,
  downloadInquiryAsMarkdown,
  SaveDriveResult,
} from "../services/googleDriveService.ts";
import { GoogleDriveSaveDialog } from "./GoogleDriveSaveDialog.tsx";
import { MarkdownRenderer } from "./MarkdownRenderer.tsx";
import {
  Sparkles,
  Lock,
  Search,
  ExternalLink,
  Trash2,
  RefreshCw,
  FolderSync,
  CheckCircle,
  Clock,
  Compass,
  ChevronDown,
  ChevronUp,
  Loader2,
  FileText,
  LogOut,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Cloud,
  Check,
  Download,
  AlertCircle,
} from "lucide-react";

interface UserDashboardProps {
  currentUser: User | null;
  onOpenAuth: (mode?: "signin" | "signup", contextMsg?: string) => void;
  onNavigateToQA: (question?: string, axiomId?: string) => void;
  targetInquiryId?: string | null;
  targetInquiry?: StoredInquiry | null;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  onOpenAuth,
  onNavigateToQA,
  targetInquiryId = null,
  targetInquiry = null,
}) => {
  const [savedInquiries, setSavedInquiries] = useState<StoredInquiry[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<StoredInquiry[]>([]);
  const [allInquiries, setAllInquiries] = useState<StoredInquiry[]>([]);
  const [viewMode, setViewMode] = useState<"saved" | "recent" | "all">("saved");
  const [loading, setLoading] = useState(false);
  const [savingDriveId, setSavingDriveId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDriveActive, setIsDriveActive] = useState<boolean>(hasDriveToken());
  const [isConnectingDrive, setIsConnectingDrive] = useState<boolean>(false);

  // Google Drive Save Dialogue State
  const [driveDialogInquiry, setDriveDialogInquiry] = useState<StoredInquiry | null>(null);
  const [isDriveDialogOpen, setIsDriveDialogOpen] = useState<boolean>(false);

  // Cloud Firestore Sync State
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);
  const [isSyncingToCloud, setIsSyncingToCloud] = useState<boolean>(false);

  // Sync Google Drive token state
  useEffect(() => {
    setIsDriveActive(hasDriveToken());
    const unsub = onDriveTokenChange((token) => {
      setIsDriveActive(!!token);
    });
    return unsub;
  }, []);

  // Handle targetInquiry navigation from QAModule
  useEffect(() => {
    if (targetInquiry) {
      // Ensure targetInquiry is in state immediately so it never shows "No saved inquiries"
      const mergeInquiry = (list: StoredInquiry[]) => {
        const filtered = list.filter((i) => i.id !== targetInquiry.id);
        return [targetInquiry, ...filtered];
      };

      setSavedInquiries(mergeInquiry);
      setRecentInquiries(mergeInquiry);
      setAllInquiries(mergeInquiry);
      setExpandedId(targetInquiry.id);
      setViewMode("saved");

      // Auto-scroll to focused inquiry
      setTimeout(() => {
        const elem = document.getElementById(`inquiry-card-${targetInquiry.id}`);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);
    } else if (targetInquiryId) {
      setExpandedId(targetInquiryId);
    }
  }, [targetInquiry, targetInquiryId]);

  // Load inquiries whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      loadInquiries();
    } else {
      setSavedInquiries([]);
      setRecentInquiries([]);
      setAllInquiries([]);
    }
  }, [currentUser]);

  const loadInquiries = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await fetchAllUserInquiriesFromFirestore(currentUser.uid);

      // If user came via "View in Dashboard", preserve targetInquiry in lists
      if (targetInquiry) {
        if (!data.saved.some((i) => i.id === targetInquiry.id)) {
          data.saved.unshift(targetInquiry);
        }
        if (!data.recent.some((i) => i.id === targetInquiry.id)) {
          data.recent.unshift(targetInquiry);
        }
        if (!data.all.some((i) => i.id === targetInquiry.id)) {
          data.all.unshift(targetInquiry);
        }
      }

      setRecentInquiries(data.recent);
      setSavedInquiries(data.saved);
      setAllInquiries(data.all);
      setCloudSyncError(data.cloudError || null);

      // Auto-expand target inquiry, or first item if none is expanded
      if (targetInquiry) {
        setExpandedId(targetInquiry.id);
      } else if (targetInquiryId) {
        setExpandedId(targetInquiryId);
      } else {
        const currentList =
          viewMode === "saved"
            ? data.saved
            : viewMode === "recent"
            ? data.recent
            : data.all;
        if (currentList.length > 0 && !expandedId) {
          setExpandedId(currentList[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Unified Bidirectional Sync: Pushes unsynced local inquiries to Firestore and pulls latest remote records
   */
  const handleBidirectionalSync = async () => {
    if (!currentUser) return;
    setIsSyncingToCloud(true);
    setStatusMessage(null);
    try {
      // 1. Push local cached inquiries to Cloud Firestore
      const res = await syncLocalInquiriesToFirestore(currentUser.uid);

      // 2. Pull / refresh latest inquiries from Cloud Firestore
      await loadInquiries();

      if (res.success) {
        setStatusMessage({
          type: "success",
          text:
            res.syncedCount > 0
              ? `Synchronized ${res.syncedCount} inquiry${res.syncedCount === 1 ? "" : "s"} with Cloud Firestore database.`
              : "Inquiries archive refreshed and synchronized with Cloud Firestore.",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: `Sync note: ${res.failedCount} item(s) could not sync to Cloud Firestore (${res.error || "Permission Denied"}).`,
        });
      }
    } catch (err: any) {
      console.error("Bidirectional sync error:", err);
      setStatusMessage({
        type: "error",
        text: `Sync error: ${err?.message || "Check network/permissions"}.`,
      });
    } finally {
      setIsSyncingToCloud(false);
    }
  };

  /**
   * One-click Connect/Authorize Google Drive from direct user gesture
   */
  const handleConnectDrive = async () => {
    setIsConnectingDrive(true);
    setStatusMessage(null);
    try {
      await authorizeGoogleDrive(true);
      setIsDriveActive(true);
      setStatusMessage({
        text: "Google Drive successfully connected! You can now sync inquiries directly to your Drive.",
        type: "success",
      });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: any) {
      console.error("Connect Drive error:", err);
      if (err.code === "auth/popup-blocked") {
        setStatusMessage({
          text: "Authorization popup was blocked by browser. Please allow popups and try again.",
          type: "error",
        });
      } else {
        setStatusMessage({
          text: err.message || "Failed to authorize Google Drive.",
          type: "error",
        });
      }
      setTimeout(() => setStatusMessage(null), 6000);
    } finally {
      setIsConnectingDrive(false);
    }
  };

  /**
   * Opens the Google Drive Save Dialogue for this inquiry
   */
  const handleOpenDriveDialog = (inquiry: StoredInquiry) => {
    setDriveDialogInquiry(inquiry);
    setIsDriveDialogOpen(true);
  };

  /**
   * Called when Google Drive Save Dialogue succeeds
   */
  const handleDriveDialogSuccess = (result: SaveDriveResult) => {
    if (!driveDialogInquiry) return;
    const inquiryId = driveDialogInquiry.id;

    const updater = (prev: StoredInquiry[]) =>
      prev.map((item) =>
        item.id === inquiryId
          ? {
              ...item,
              isSaved: true,
              savedToDrive: true,
              driveFileId: result.fileId,
              driveFileUrl: result.webViewLink,
              driveFileName: result.fileName,
              savedAt: new Date().toISOString(),
            }
          : item
      );

    setRecentInquiries(updater);
    setAllInquiries(updater);
    setSavedInquiries((prev) => {
      const exists = prev.some((item) => item.id === inquiryId);
      if (exists) return updater(prev);
      return [
        {
          ...driveDialogInquiry,
          isSaved: true,
          savedToDrive: true,
          driveFileId: result.fileId,
          driveFileUrl: result.webViewLink,
          driveFileName: result.fileName,
          savedAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });

    setStatusMessage({
      text: `Inquiry saved successfully to Google Drive: '${result.fileName}'!`,
      type: "success",
    });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  /**
   * Toggle bookmarking an inquiry in the permanent Saved Inquiries archive
   */
  const handleToggleBookmark = async (inquiry: StoredInquiry) => {
    if (!currentUser) return;
    const newSavedStatus = !inquiry.isSaved;

    try {
      await bookmarkInquiryInFirestore(currentUser.uid, inquiry.id, newSavedStatus);

      const updateItem = (item: StoredInquiry): StoredInquiry =>
        item.id === inquiry.id
          ? {
              ...item,
              isSaved: newSavedStatus,
              savedAt: newSavedStatus ? new Date().toISOString() : null,
            }
          : item;

      setRecentInquiries((prev) => prev.map(updateItem));
      setAllInquiries((prev) => prev.map(updateItem));

      if (newSavedStatus) {
        setSavedInquiries((prev) => [
          {
            ...inquiry,
            isSaved: true,
            savedAt: new Date().toISOString(),
          },
          ...prev.filter((i) => i.id !== inquiry.id),
        ]);
        setStatusMessage({
          text: "Inquiry added to your permanent Saved Archive (unlimited).",
          type: "success",
        });
      } else {
        setSavedInquiries((prev) => prev.filter((i) => i.id !== inquiry.id));
        setStatusMessage({
          text: "Inquiry removed from your Saved Archive.",
          type: "success",
        });
      }
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error("Error toggling bookmark:", err);
      setStatusMessage({
        text: "Could not update bookmark in archive.",
        type: "error",
      });
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleDelete = async (inquiryId: string) => {
    if (!currentUser) return;
    setConfirmDeleteId(null);

    try {
      await deleteInquiryFromFirestore(currentUser.uid, inquiryId);
      setRecentInquiries((prev) => prev.filter((item) => item.id !== inquiryId));
      setSavedInquiries((prev) => prev.filter((item) => item.id !== inquiryId));
      setAllInquiries((prev) => prev.filter((item) => item.id !== inquiryId));
      if (expandedId === inquiryId) {
        setExpandedId(null);
      }
      setStatusMessage({
        text: "Inquiry successfully removed from your records.",
        type: "success",
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error("Failed to delete inquiry:", err);
      setStatusMessage({
        text: err.message || "Failed to delete inquiry from archive.",
        type: "error",
      });
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  // Determine current active list based on view mode
  const activeInquiries =
    viewMode === "saved"
      ? savedInquiries
      : viewMode === "recent"
      ? recentInquiries
      : allInquiries;

  const filteredInquiries = activeInquiries.filter(
    (inq) =>
      inq.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (inq.focalAxiomId && inq.focalAxiomId.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const totalDriveSaved = allInquiries.filter((inq) => inq.savedToDrive).length;

  // Unauthenticated Protected Screen
  if (!currentUser) {
    return (
      <section className="py-16 sm:py-20 bg-[#060E1D] text-[#F8F9FA] min-h-[70vh] flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-[#0A192F] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.25)] mb-6">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-[#D4AF37]" />
          </div>

          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3.5 py-1 rounded-full border border-[#D4AF37]/30">
            Protected Scholar Portal
          </span>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-bold text-[#F8F9FA] mt-4 mb-3">
            Scholar Inquiries Dashboard
          </h1>

          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed mb-8">
            Access your unlimited archive of saved inquiries, review your 10 most recent AI interrogations, and sync Markdown proofs directly to your Google Drive.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuth("signin", "Sign in to access your inquiry history and Google Drive integration")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] hover:brightness-105 text-[#060E1D] font-bold text-sm shadow-[0_4px_15px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In with Scholar ID</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuth("signup", "Create an account to start tracking inquiries and syncing with Google Drive")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0A192F] hover:bg-[#0E2445] border border-[#D4AF37]/40 text-[#F3E5AB] font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Create Free Account</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Authenticated Dashboard
  return (
    <section className="py-10 sm:py-14 bg-[#060E1D] text-[#F8F9FA] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header / Profile Card */}
        <div className="rounded-2xl bg-[#0A192F] border border-[#D4AF37]/30 p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#060E1D] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-cinzel font-bold text-xl shadow-[0_0_15px_rgba(212,175,55,0.3)] flex-shrink-0">
                {currentUser.displayName
                  ? currentUser.displayName[0].toUpperCase()
                  : currentUser.email
                  ? currentUser.email[0].toUpperCase()
                  : "S"}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-cinzel font-bold text-[#F8F9FA]">
                    {currentUser.displayName || "Distinguished Scholar"}
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                    Firebase Auth
                  </span>
                  {cloudSyncError ? (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/70 border border-amber-500/50 text-amber-300 flex items-center gap-1"
                      title="Cloud Firestore rules check pending - inquiry cache stored locally"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      Rules Pending
                    </span>
                  ) : (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 flex items-center gap-1"
                      title="Connected and synchronized with Cloud Firestore database"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Cloud Synced
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
                  {currentUser.email}
                </p>
              </div>
            </div>

            {/* Drive Session Status */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Google Drive Status / Connect Button */}
              {isDriveActive ? (
                <div className="px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                      Google Drive
                    </div>
                    <div className="text-xs font-semibold text-emerald-100 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Ready ({totalDriveSaved} synced)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleConnectDrive}
                  disabled={isConnectingDrive}
                  className="px-3.5 py-2 rounded-xl bg-[#060E1D] hover:bg-[#0E2445] border border-[#D4AF37]/50 text-[#F3E5AB] hover:text-[#D4AF37] text-xs font-semibold transition-all flex items-center gap-2 shadow-sm disabled:opacity-60"
                  title="Connect Google Drive to enable saving Markdown documents to your Drive"
                >
                  {isConnectingDrive ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                  ) : (
                    <Cloud className="w-3.5 h-3.5 text-[#D4AF37]" />
                  )}
                  <span>Connect Google Drive</span>
                </button>
              )}

              {/* Sign Out */}
              <button
                onClick={() => logOutUser()}
                className="px-3 py-2 rounded-xl bg-[#060E1D] hover:bg-red-950/40 border border-red-500/30 text-red-300 hover:text-red-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Sign out of Firebase Auth"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in ${
              statusMessage.type === "success"
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
                : "bg-red-950/80 border-red-500/50 text-red-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {statusMessage.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="text-xs sm:text-sm font-medium leading-relaxed block">
                  {statusMessage.text.replace("GOOGLE_DRIVE_API_DISABLED: ", "").replace("INSUFFICIENT_DRIVE_SCOPES: ", "")}
                </span>
                {statusMessage.text.includes("GOOGLE_DRIVE_API_DISABLED") && (
                  <p className="text-[11px] text-red-300">
                    Note: Granting IAM permissions to <code className="bg-red-900/60 px-1 py-0.5 rounded font-mono text-[10px]">jauharism.firebaseapp.com</code> does not enable the Google Drive API service. You must enable it in APIs & Services.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
              {statusMessage.text.includes("GOOGLE_DRIVE_API_DISABLED") && (
                <a
                  href="https://console.cloud.google.com/apis/library/drive.googleapis.com?project=jauharism"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#060E1D] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap"
                >
                  <span>Enable in GCP Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => setStatusMessage(null)}
                className="text-red-400 hover:text-red-200 text-xs px-2 py-1"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Inquiries Management Section */}
        <div className="rounded-2xl bg-[#0A192F] border border-[#D4AF37]/30 p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {/* Section Header with Streamlined Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-5 border-b border-[#D4AF37]/20">
            {/* Category Selector Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setViewMode("saved")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  viewMode === "saved"
                    ? "bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#060E1D] shadow-sm"
                    : "bg-[#060E1D] hover:bg-[#0E2445] text-[#CBD5E1] border border-[#D4AF37]/25"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Saved</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 font-mono">
                  {savedInquiries.length}
                </span>
              </button>

              <button
                onClick={() => setViewMode("recent")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  viewMode === "recent"
                    ? "bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#060E1D] shadow-sm"
                    : "bg-[#060E1D] hover:bg-[#0E2445] text-[#CBD5E1] border border-[#D4AF37]/25"
                }`}
              >
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Recent</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 font-mono">
                  {recentInquiries.length}
                </span>
              </button>

              <button
                onClick={() => setViewMode("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  viewMode === "all"
                    ? "bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#060E1D] shadow-sm"
                    : "bg-[#060E1D] hover:bg-[#0E2445] text-[#CBD5E1] border border-[#D4AF37]/25"
                }`}
              >
                <span>All</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 font-mono">
                  {allInquiries.length}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Search filter */}
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Filter inquiries..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full sm:w-44 pl-8 pr-3 py-1.5 rounded-lg bg-[#060E1D] border border-[#D4AF37]/30 text-xs text-[#F8F9FA] placeholder-[#64748B] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Unified Bidirectional Sync (Push & Pull) */}
              <button
                onClick={handleBidirectionalSync}
                disabled={loading || isSyncingToCloud}
                className="p-2 rounded-lg bg-[#060E1D] hover:bg-[#0E2445] border border-[#D4AF37]/30 text-[#D4AF37] hover:text-[#F3E5AB] transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
                title="Sync with Cloud Firestore (Push & Pull)"
                aria-label="Sync with Cloud Firestore"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading || isSyncingToCloud ? "animate-spin" : ""}`} />
              </button>

              {/* Ask New Question */}
              <button
                onClick={() => onNavigateToQA()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#060E1D] text-xs font-bold shadow-sm hover:brightness-105 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Inquire</span>
              </button>
            </div>
          </div>

          {/* List of Inquiries */}
          {loading && activeInquiries.length === 0 ? (
            <div className="py-16 text-center text-[#94A3B8]">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#D4AF37] mb-2" />
              <p className="text-xs">Accessing Firestore inquiry records...</p>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="w-12 h-12 mx-auto text-[#94A3B8]/40 mb-3" />
              <h3 className="text-base font-semibold text-[#F8F9FA]">
                {viewMode === "saved"
                  ? "No saved inquiries yet"
                  : viewMode === "recent"
                  ? "No recent inquiries"
                  : "No inquiries found"}
              </h3>
              <p className="text-xs text-[#94A3B8] max-w-md mx-auto mt-1 mb-5">
                {searchFilter
                  ? "No inquiries match your filter criteria."
                  : viewMode === "saved"
                  ? "Save inquiries from the Q&A Gateway or your Recent History to keep an unlimited archive."
                  : "Ask the Jauhari AI Gateway about any of the 7 Axioms to start your research trail."}
              </p>
              <button
                onClick={() => onNavigateToQA()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-[#060E1D] font-bold text-xs hover:bg-[#F3E5AB] transition-colors shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Jauhari AI Now</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#D4AF37]/15 mt-2">
              {filteredInquiries.map((inquiry, index) => {
                const isExpanded = expandedId === inquiry.id;
                const isSavingThis = savingDriveId === inquiry.id;
                const formattedDate = new Date(inquiry.timestamp).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={inquiry.id}
                    id={`inquiry-card-${inquiry.id}`}
                    className={`py-4 group transition-colors rounded-xl px-2 sm:px-3 mb-2 ${
                      targetInquiryId === inquiry.id
                        ? "bg-[#D4AF37]/5 border border-[#D4AF37]/40 shadow-md"
                        : ""
                    }`}
                  >
                    {/* Inquiry Row Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : inquiry.id)}
                      >
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <span className="text-[11px] font-mono font-bold text-[#D4AF37]">
                            #{index + 1}
                          </span>
                          {inquiry.focalAxiomId && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#060E1D] text-[#D4AF37] border border-[#D4AF37]/30">
                              <Compass className="w-2.5 h-2.5" />
                              {inquiry.focalAxiomId.replace("axiom-", "Axiom ").toUpperCase()}
                            </span>
                          )}
                          <span className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formattedDate}
                          </span>

                          {/* Saved to Archive Badge */}
                          {inquiry.isSaved && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/35">
                              <BookmarkCheck className="w-2.5 h-2.5" />
                              Saved Archive
                            </span>
                          )}

                          {/* Google Drive Status Badge */}
                          {inquiry.savedToDrive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                              <Cloud className="w-2.5 h-2.5 text-emerald-400" />
                              Saved in Drive
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#060E1D] text-[#94A3B8] border border-[#94A3B8]/30">
                              Firestore History
                            </span>
                          )}

                          {targetInquiryId === inquiry.id && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37] text-[#060E1D]">
                              Focused from Q&A
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm sm:text-base font-semibold text-[#F8F9FA] group-hover:text-[#F3E5AB] transition-colors line-clamp-2">
                          "{inquiry.question}"
                        </h3>
                      </div>

                      {/* Row Action Buttons */}
                      <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0">
                        {/* Bookmark / Archive Toggle */}
                        <button
                          onClick={() => handleToggleBookmark(inquiry)}
                          className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
                            inquiry.isSaved
                              ? "bg-[#D4AF37]/15 border-[#D4AF37]/50 text-[#D4AF37]"
                              : "bg-[#060E1D] hover:bg-[#0E2445] border-[#D4AF37]/25 text-[#94A3B8] hover:text-[#D4AF37]"
                          }`}
                          title={
                            inquiry.isSaved
                              ? "Saved in permanent archive. Click to remove from saved list."
                              : "Bookmark into permanent Saved Archive (unlimited storage)"
                          }
                        >
                          {inquiry.isSaved ? (
                            <BookmarkCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Save to Google Drive Button */}
                        {inquiry.savedToDrive && inquiry.driveFileUrl ? (
                          <a
                            href={inquiry.driveFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#060E1D] hover:bg-[#0E2445] border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all shadow-sm"
                            title="Open document directly in Google Drive"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Open Drive</span>
                          </a>
                        ) : (
                          <button
                            onClick={() => handleOpenDriveDialog(inquiry)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#060E1D] hover:bg-[#0E2445] border border-[#D4AF37]/50 text-[#F3E5AB] hover:text-[#D4AF37] text-xs font-semibold transition-all shadow-sm"
                            title="Save inquiry to Google Drive"
                          >
                            <FolderSync className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Save to Drive</span>
                          </button>
                        )}

                        {/* Export Markdown (.md) direct download */}
                        <button
                          onClick={() => {
                            downloadInquiryAsMarkdown({
                              question: inquiry.question,
                              answer: inquiry.answer,
                              focalAxiomId: inquiry.focalAxiomId || undefined,
                              answerSource: inquiry.answerSource,
                              timestamp: inquiry.timestamp,
                            });
                          }}
                          className="p-1.5 rounded-lg bg-[#060E1D] hover:bg-[#0E2445] border border-[#D4AF37]/30 text-[#D4AF37] hover:text-[#F3E5AB] transition-colors"
                          title="Download as Markdown (.md) file to your computer"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Re-ask in QA */}
                        <button
                          onClick={() => onNavigateToQA(inquiry.question, inquiry.focalAxiomId || undefined)}
                          className="p-1.5 rounded-lg bg-[#060E1D] hover:bg-[#0E2445] border border-[#D4AF37]/20 text-[#94A3B8] hover:text-[#F8F9FA] transition-colors"
                          title="Open in Q&A Gateway"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </button>

                        {/* Delete with inline confirmation */}
                        {confirmDeleteId === inquiry.id ? (
                          <div className="flex items-center gap-1 bg-[#060E1D] p-0.5 rounded-lg border border-red-500/40 animate-in fade-in">
                            <button
                              onClick={() => handleDelete(inquiry.id)}
                              className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold transition-colors"
                              title="Confirm deletion"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-1.5 py-1 text-[#94A3B8] hover:text-[#F8F9FA] rounded text-[10px] transition-colors"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(inquiry.id)}
                            className="p-1.5 rounded-lg bg-[#060E1D] hover:bg-red-950/50 border border-[#D4AF37]/20 text-[#94A3B8] hover:text-red-300 transition-colors"
                            title="Delete from records"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Accordion Toggle */}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : inquiry.id)}
                          className="p-1.5 rounded-lg bg-[#060E1D] hover:bg-[#0E2445] border border-[#D4AF37]/20 text-[#D4AF37] transition-colors"
                          title={isExpanded ? "Collapse response" : "Expand response"}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Epistemological Response Content */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-[#D4AF37]/20 rounded-xl bg-[#060E1D] border border-[#D4AF37]/30 p-4 sm:p-6 shadow-inner animate-in fade-in duration-200">
                        {/* Prominent Complete Question Prompt */}
                        <div className="mb-5 p-4 rounded-xl bg-[#0A192F] border border-[#D4AF37]/35 shadow-sm">
                          <div className="flex items-center justify-between mb-1.5 text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider">
                            <span>Theological & Epistemological Question Prompt:</span>
                            {inquiry.focalAxiomId && (
                              <span className="px-2 py-0.5 rounded bg-[#060E1D] border border-[#D4AF37]/30 text-[10px]">
                                {inquiry.focalAxiomId.replace("axiom-", "Axiom ").toUpperCase()}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm sm:text-base font-semibold text-[#F8F9FA] leading-relaxed">
                            "{inquiry.question}"
                          </h4>
                        </div>

                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#D4AF37]/20">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                            <span className="text-xs font-cinzel font-bold text-[#D4AF37] tracking-wider uppercase">
                              Synthesized Epistemological Response
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-[#94A3B8]">
                            Source: {inquiry.answerSource || "Gemini Jauhari Core"}
                          </span>
                        </div>

                        {/* Markdown with KaTeX equations */}
                        <div className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                          <MarkdownRenderer content={inquiry.answer} />
                        </div>

                        {/* Footer action within expanded card */}
                        <div className="mt-5 pt-3 border-t border-[#D4AF37]/15 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-[#94A3B8]">
                              {inquiry.savedToDrive
                                ? `Archived in Google Drive: ${inquiry.driveFileName || "Saved Inquiry"}`
                                : "Not yet synced to Google Drive."}
                            </span>
                            {inquiry.isSaved && (
                              <span className="text-[11px] text-[#D4AF37] flex items-center gap-1 font-semibold">
                                <BookmarkCheck className="w-3 h-3" />
                                Preserved in Saved Archive
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleBookmark(inquiry)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#060E1D] hover:bg-[#0E2445] border border-[#D4AF37]/30 text-[#F3E5AB] text-xs font-medium transition-colors"
                            >
                              <Bookmark className="w-3 h-3 text-[#D4AF37]" />
                              <span>{inquiry.isSaved ? "Remove from Saved" : "Save to Archive"}</span>
                            </button>

                            {!inquiry.savedToDrive && (
                              <button
                                onClick={() => handleOpenDriveDialog(inquiry)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#060E1D] font-bold text-xs transition-colors shadow-sm"
                              >
                                <FolderSync className="w-3 h-3 text-[#060E1D]" />
                                <span>Save to Google Drive</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Google Drive Save Dialogue */}
      {driveDialogInquiry && (
        <GoogleDriveSaveDialog
          isOpen={isDriveDialogOpen}
          onClose={() => {
            setIsDriveDialogOpen(false);
            setDriveDialogInquiry(null);
          }}
          inquiry={driveDialogInquiry}
          currentUser={currentUser}
          onSaveSuccess={handleDriveDialogSuccess}
        />
      )}
    </section>
  );
};
