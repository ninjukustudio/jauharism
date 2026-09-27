import React, { useState, useEffect } from "react";
import {
  Cloud,
  CheckCircle,
  AlertCircle,
  Download,
  ExternalLink,
  Loader2,
  X,
  FileText,
  Folder,
  FolderPlus,
  Compass,
} from "lucide-react";
import {
  uploadInquiryToGoogleDrive,
  downloadInquiryAsMarkdown,
  SaveDriveResult,
} from "../services/googleDriveService.ts";
import {
  getDriveAccessToken,
  authorizeGoogleDrive,
  hasDriveToken,
  updateInquiryDriveStatusInFirestore,
  saveInquiryToFirestore,
} from "../services/firebase.ts";
import { User } from "firebase/auth";

export interface GoogleDriveSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: {
    id: string;
    question: string;
    answer: string;
    focalAxiomId?: string | null;
    answerSource?: string;
    timestamp?: string;
    isSaved?: boolean;
    savedToDrive?: boolean;
    driveFileUrl?: string;
    driveFileName?: string;
  };
  currentUser?: User | null;
  onSaveSuccess?: (result: SaveDriveResult) => void;
}

export const GoogleDriveSaveDialog: React.FC<GoogleDriveSaveDialogProps> = ({
  isOpen,
  onClose,
  inquiry,
  currentUser,
  onSaveSuccess,
}) => {
  // Generate initial file name from inquiry question
  const generateDefaultFileName = () => {
    const dateStr = new Date().toISOString().split("T")[0];
    const sanitizedQuestionSlug = inquiry.question
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .trim()
      .slice(0, 32)
      .replace(/\s+/g, "_");
    return `Jauhari_${sanitizedQuestionSlug || "Inquiry"}_${dateStr}.md`;
  };

  const [fileName, setFileName] = useState<string>(generateDefaultFileName());
  const [saveDestination, setSaveDestination] = useState<"root" | "custom">("root");
  const [customFolderName, setCustomFolderName] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessResult, setSaveSuccessResult] = useState<SaveDriveResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state whenever dialog opens with a new inquiry
  useEffect(() => {
    if (isOpen) {
      setFileName(inquiry.driveFileName || generateDefaultFileName());
      setSaveDestination("root");
      setCustomFolderName("");
      setIsSaving(false);
      setSaveSuccessResult(
        inquiry.savedToDrive && inquiry.driveFileUrl
          ? {
              fileId: "",
              webViewLink: inquiry.driveFileUrl,
              fileName: inquiry.driveFileName || "Saved Inquiry.md",
            }
          : null
      );
      setErrorMessage(null);
    }
  }, [isOpen, inquiry.id]);

  if (!isOpen) return null;

  const handleSaveToDrive = async () => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      // 1. Ensure user is authenticated for Drive
      let token = await getDriveAccessToken(false);
      if (!token) {
        token = await authorizeGoogleDrive();
      }

      // 2. Perform upload directly without auto-creating unwanted folders
      const cleanFileName = fileName.trim().endsWith(".md")
        ? fileName.trim()
        : `${fileName.trim()}.md`;

      const result = await uploadInquiryToGoogleDrive({
        question: inquiry.question,
        answer: inquiry.answer,
        focalAxiomId: inquiry.focalAxiomId || undefined,
        answerSource: inquiry.answerSource,
        timestamp: inquiry.timestamp,
        token,
        customFileName: cleanFileName,
        customFolderName: saveDestination === "custom" && customFolderName.trim() ? customFolderName.trim() : null,
      });

      setSaveSuccessResult(result);

      // 3. Persist sync record to Firestore if user is authenticated
      if (currentUser && inquiry.id) {
        try {
          await saveInquiryToFirestore(currentUser.uid, {
            id: inquiry.id,
            question: inquiry.question,
            answer: inquiry.answer,
            focalAxiomId: inquiry.focalAxiomId || null,
            answerSource: inquiry.answerSource || "gemini-3.6-flash",
            timestamp: inquiry.timestamp || new Date().toISOString(),
            isSaved: true,
            savedAt: new Date().toISOString(),
            savedToDrive: true,
            driveFileId: result.fileId,
            driveFileUrl: result.webViewLink,
            driveFileName: result.fileName,
          });
        } catch (dbErr) {
          console.warn("Could not update Firestore drive status:", dbErr);
        }
      }

      if (onSaveSuccess) {
        onSaveSuccess(result);
      }
    } catch (err: any) {
      console.error("Save to Google Drive failed:", err);
      if (err.code === "auth/popup-blocked") {
        setErrorMessage(
          "The Google authorization popup was blocked by your browser. Please allow popups for this site and try again."
        );
      } else {
        setErrorMessage(err.message || "Failed to save inquiry to Google Drive.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadLocal = () => {
    downloadInquiryAsMarkdown({
      question: inquiry.question,
      answer: inquiry.answer,
      focalAxiomId: inquiry.focalAxiomId || undefined,
      answerSource: inquiry.answerSource,
      timestamp: inquiry.timestamp,
      customFileName: fileName.trim().endsWith(".md") ? fileName.trim() : `${fileName.trim()}.md`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0A192F] border border-[#D4AF37]/40 shadow-2xl p-6 text-[#F8F9FA] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#060E1D] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-inner">
              <Cloud className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-cinzel font-bold text-[#F8F9FA]">
                Save to Google Drive
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Export this epistemological inquiry to your personal Google Drive storage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8F9FA] hover:bg-[#060E1D] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {saveSuccessResult ? (
          <div className="space-y-5 animate-in fade-in">
            <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-emerald-100">
                  Successfully saved to your Google Drive!
                </p>
                <p className="text-xs text-emerald-300">
                  Document: <strong>{saveSuccessResult.fileName}</strong>
                </p>
                <p className="text-[11px] text-emerald-400/80">
                  Saved directly to your Google Drive and linked in your Scholar Dashboard.
                </p>
              </div>
            </div>

            {/* Inquiry Snippet Preview */}
            <div className="p-3.5 rounded-xl bg-[#060E1D] border border-[#D4AF37]/20 text-xs text-[#CBD5E1]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] block mb-1">
                Question Prompt:
              </span>
              <p className="italic font-medium text-[#F8F9FA] line-clamp-2">
                "{inquiry.question}"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a
                href={saveSuccessResult.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] hover:brightness-105 text-[#060E1D] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <ExternalLink className="w-4 h-4 text-[#060E1D]" />
                <span>Open in Google Drive ↗</span>
              </a>

              <button
                onClick={handleDownloadLocal}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#060E1D] hover:bg-[#0E2445] border border-[#D4AF37]/30 text-[#CBD5E1] hover:text-[#F8F9FA] font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                title="Download backup copy to your computer"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Export .md</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#060E1D] hover:bg-[#0E2445] text-[#CBD5E1] text-xs font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Configure & Save Form */
          <div className="space-y-4">
            {/* Inquiry Context Preview */}
            <div className="p-3.5 rounded-xl bg-[#060E1D] border border-[#D4AF37]/25 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                <span className="uppercase font-bold tracking-wider text-[#D4AF37]">
                  Target Inquiry
                </span>
                {inquiry.focalAxiomId && (
                  <span className="flex items-center gap-1 text-[#CBD5E1]">
                    <Compass className="w-3 h-3 text-[#D4AF37]" />
                    {inquiry.focalAxiomId.replace("axiom-", "Axiom ").toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#F8F9FA] line-clamp-2">
                "{inquiry.question}"
              </p>
            </div>

            {/* File Name Field */}
            <div>
              <label
                htmlFor="gdrive-file-name"
                className="block text-xs font-semibold text-[#CBD5E1] mb-1.5"
              >
                File Name:
              </label>
              <div className="flex items-center rounded-xl bg-[#060E1D] border border-[#D4AF37]/30 focus-within:border-[#D4AF37] px-3 py-2 text-xs">
                <FileText className="w-4 h-4 text-[#D4AF37] mr-2 flex-shrink-0" />
                <input
                  id="gdrive-file-name"
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Jauhari_Inquiry.md"
                  className="w-full bg-transparent text-[#F8F9FA] placeholder-[#64748B] focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-[#94A3B8] mt-1 block">
                Standard Markdown (.md) format with question prompt and formatted proofs.
              </span>
            </div>

            {/* Save Location Selector: Direct to My Drive vs Optional Custom Folder */}
            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-2">
                Save Destination in Google Drive:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Option 1: Direct to My Drive (Root) - Default, avoids auto folder creation */}
                <div
                  onClick={() => setSaveDestination("root")}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    saveDestination === "root"
                      ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#F3E5AB] shadow-sm"
                      : "bg-[#060E1D] border-[#D4AF37]/20 text-[#CBD5E1] hover:border-[#D4AF37]/40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="radio"
                      id="dest-root"
                      name="gdrive-destination"
                      checked={saveDestination === "root"}
                      onChange={() => setSaveDestination("root")}
                      className="accent-[#D4AF37]"
                    />
                    <label htmlFor="dest-root" className="text-xs font-bold cursor-pointer">
                      My Drive (Root)
                    </label>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] pl-5 leading-normal">
                    Directly in your Google Drive (no subfolder created).
                  </p>
                </div>

                {/* Option 2: Custom Folder Name (User-controlled) */}
                <div
                  onClick={() => setSaveDestination("custom")}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    saveDestination === "custom"
                      ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#F3E5AB] shadow-sm"
                      : "bg-[#060E1D] border-[#D4AF37]/20 text-[#CBD5E1] hover:border-[#D4AF37]/40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="radio"
                      id="dest-custom"
                      name="gdrive-destination"
                      checked={saveDestination === "custom"}
                      onChange={() => setSaveDestination("custom")}
                      className="accent-[#D4AF37]"
                    />
                    <label htmlFor="dest-custom" className="text-xs font-bold cursor-pointer">
                      Custom Folder (Optional)
                    </label>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] pl-5 leading-normal">
                    Specify your preferred folder name.
                  </p>
                </div>
              </div>

              {saveDestination === "custom" && (
                <div className="mt-2.5">
                  <div className="flex items-center rounded-xl bg-[#060E1D] border border-[#D4AF37]/30 px-3 py-2 text-xs">
                    <Folder className="w-4 h-4 text-[#D4AF37] mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      value={customFolderName}
                      onChange={(e) => setCustomFolderName(e.target.value)}
                      placeholder="e.g., Islamic Studies or Project Jauhari"
                      className="w-full bg-transparent text-[#F8F9FA] placeholder-[#64748B] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-xs text-red-200 space-y-2 animate-in fade-in">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-red-100">
                      {errorMessage.includes("GOOGLE_DRIVE_API_DISABLED")
                        ? "Google Drive API Disabled in Google Cloud"
                        : "Google Drive Save Error"}
                    </p>
                    <p className="text-[11px] text-red-300 leading-relaxed">
                      {errorMessage.replace("GOOGLE_DRIVE_API_DISABLED: ", "")}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-red-500/30 flex flex-wrap items-center justify-between gap-2">
                  {errorMessage.includes("GOOGLE_DRIVE_API_DISABLED") ? (
                    <a
                      href="https://console.cloud.google.com/apis/library/drive.googleapis.com?project=jauharism"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-lg bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#060E1D] text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Enable API in Cloud Console</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveToDrive}
                      className="px-3 py-1 rounded-lg bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#060E1D] text-[11px] font-bold transition-colors"
                    >
                      Retry Save
                    </button>
                  )}

                  {/* Fallback instant export button */}
                  <button
                    type="button"
                    onClick={handleDownloadLocal}
                    className="px-3 py-1 rounded-lg bg-[#0E2445] hover:bg-[#163665] text-[#CBD5E1] hover:text-[#F8F9FA] text-[11px] font-medium border border-[#D4AF37]/30 inline-flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3 h-3 text-[#D4AF37]" />
                    <span>Download .md to Computer</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDownloadLocal}
                className="w-full sm:w-auto text-xs text-[#CBD5E1] hover:text-[#F8F9FA] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg hover:bg-[#060E1D] transition-colors"
                title="Download directly to your computer without Google Drive"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Download .md Locally</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="w-1/2 sm:w-auto py-2 px-4 rounded-xl bg-[#060E1D] hover:bg-[#0E2445] text-[#CBD5E1] text-xs font-medium transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveToDrive}
                  disabled={isSaving || !fileName.trim()}
                  className="w-1/2 sm:w-auto py-2 px-5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] hover:brightness-105 disabled:opacity-50 text-[#060E1D] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#060E1D]" />
                      <span>Saving to Drive...</span>
                    </>
                  ) : (
                    <>
                      <Cloud className="w-3.5 h-3.5 text-[#060E1D]" />
                      <span>Confirm Save to Drive</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
