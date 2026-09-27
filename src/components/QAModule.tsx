import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { CURATED_FAQS, SEVEN_AXIOMS } from "../data/manifestoData.ts";
import { FAQItem, UserInquiryHistory } from "../types.ts";
import { MarkdownRenderer } from "./MarkdownRenderer.tsx";
import { generateSemanticAnswer } from "../services/jauhariKnowledgeEngine.ts";
import {
  saveInquiryToFirestore,
  updateInquiryDriveStatusInFirestore,
  bookmarkInquiryInFirestore,
  hasDriveToken,
  authorizeGoogleDrive,
  onDriveTokenChange,
  StoredInquiry,
} from "../services/firebase.ts";
import { uploadInquiryToGoogleDrive } from "../services/googleDriveService.ts";
import {
  Sparkles,
  HelpCircle,
  MessageSquare,
  Send,
  Loader2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRight,
  History,
  RotateCcw,
  Compass,
  Cloud,
  FolderSync,
  ExternalLink,
  Lock,
  UserPlus,
  LogIn,
  AlertCircle,
} from "lucide-react";

interface QAModuleProps {
  initialQuestion?: string;
  initialAxiomId?: string;
  onNavigateToAxiom?: (axiomNumber: string) => void;
  currentUser?: User | null;
  onOpenAuth?: (mode?: "signin" | "signup", contextMsg?: string) => void;
  onViewDashboard?: () => void;
}

export const QAModule: React.FC<QAModuleProps> = ({
  initialQuestion = "",
  initialAxiomId = "",
  onNavigateToAxiom,
  currentUser = null,
  onOpenAuth,
  onViewDashboard,
}) => {
  const [qaMode, setQaMode] = useState<"faqs" | "ai-gateway">("faqs");
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>("All");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>("faq-1");

  // AI Inquiry State
  const [inquiryText, setInquiryText] = useState<string>(initialQuestion);
  const [focalAxiomId, setFocalAxiomId] = useState<string>(initialAxiomId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [answerSource, setAnswerSource] = useState<string | null>(null);
  const [isFallbackResponse, setIsFallbackResponse] = useState<boolean>(false);
  const [fallbackWarning, setFallbackWarning] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedAnswer, setCopiedAnswer] = useState<boolean>(false);
  const [inquiryHistory, setInquiryHistory] = useState<UserInquiryHistory[]>([]);

  // Drive Save State for the currently displayed answer
  const [currentInquiryId, setCurrentInquiryId] = useState<string | null>(null);
  const [isSavingToDrive, setIsSavingToDrive] = useState<boolean>(false);
  const [savedDriveResult, setSavedDriveResult] = useState<{
    fileId: string;
    webViewLink: string;
    fileName: string;
  } | null>(null);
  const [saveAuthPromptOpen, setSaveAuthPromptOpen] = useState<boolean>(false);
  const [driveSaveError, setDriveSaveError] = useState<string | null>(null);
  const [isDriveAuthorized, setIsDriveAuthorized] = useState<boolean>(hasDriveToken());
  const [isSavedToArchive, setIsSavedToArchive] = useState<boolean>(false);

  useEffect(() => {
    setIsDriveAuthorized(hasDriveToken());
    const unsub = onDriveTokenChange((token) => {
      setIsDriveAuthorized(!!token);
    });
    return unsub;
  }, []);

  const faqCategories = [
    "All",
    "Theology & Metaphysics",
    "Science & Causality",
    "Epistemology & Reason",
    "Governance & Ethics",
  ];

  const suggestedPrompts = [
    "Why does Project Jauhari reject radical occasionalism in favor of intrinsic causes?",
    "How does the date-palm pollination Hadith establish the autonomy of empirical science?",
    "What is the theological difference between ʿaql (formal logic) and raʾy (speculation)?",
    "How does Project Jauhari explain miracles without breaking the cosmic order (niẓām)?",
    "Why is Quietist Salafism (Madkhalism) considered a dynastic deviation in Axiom VII?",
    "How does the Hermeneutical Conjunction of Surah 3:7 sanction rational allegorical exegesis?",
  ];

  const handleSelectSuggestedPrompt = (prompt: string, axiomHint?: string) => {
    setInquiryText(prompt);
    if (axiomHint) setFocalAxiomId(axiomHint);
    setQaMode("ai-gateway");
  };

  const handleAskFaqInAi = (faq: FAQItem) => {
    setInquiryText(faq.question);
    const matchingAxiom = SEVEN_AXIOMS.find((a) => a.number === faq.relatedAxiomNumber);
    if (matchingAxiom) setFocalAxiomId(matchingAxiom.id);
    setQaMode("ai-gateway");
  };

  const handleSubmitInquiry = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inquiryText.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    setCurrentAnswer(null);
    setIsFallbackResponse(false);
    setFallbackWarning(null);
    setSavedDriveResult(null);
    setSaveAuthPromptOpen(false);
    setDriveSaveError(null);
    setIsSavedToArchive(false);

    const newInquiryId = `inq-${Date.now()}`;
    setCurrentInquiryId(newInquiryId);

    try {
      let generatedAnswer = "";
      let sourceName = "gemini-3.6-flash";
      let isFallback = false;
      let warningText: string | null = null;

      try {
        const response = await fetch("/api/jauhari-qa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: inquiryText,
            focalAxiomId: focalAxiomId || undefined,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.answer) {
            generatedAnswer = data.answer;
            sourceName = data.source || "gemini-3.6-flash";
          } else {
            throw new Error("Invalid response format received from serverless gateway.");
          }
        } else {
          // If serverless route returned non-200, synthesize gracefully via local knowledge engine
          const localSynthesis = generateSemanticAnswer(inquiryText, focalAxiomId);
          generatedAnswer = localSynthesis;
          sourceName = "Jauhari Canonical Archive";
          isFallback = true;
          warningText =
            "Live server endpoint was momentarily busy. Synthesized directly from Jauhari Manifesto Archive.";
        }
      } catch (fetchErr) {
        // Fallback to local semantic synthesis
        const localSynthesis = generateSemanticAnswer(inquiryText, focalAxiomId);
        generatedAnswer = localSynthesis;
        sourceName = "Jauhari Canonical Archive";
        isFallback = true;
        warningText =
          "Live server endpoint unavailable. Synthesized directly from Jauhari Manifesto Archive.";
      }

      setCurrentAnswer(generatedAnswer);
      setAnswerSource(sourceName);
      setIsFallbackResponse(isFallback);
      setFallbackWarning(warningText);

      // Add to session history
      const newHistoryItem: UserInquiryHistory = {
        id: newInquiryId,
        question: inquiryText,
        answer: generatedAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        focalAxiomId: focalAxiomId || undefined,
        source: sourceName,
      };
      setInquiryHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]);

      // If user is logged in, automatically save to recent inquiries in Firestore
      if (currentUser) {
        try {
          await saveInquiryToFirestore(currentUser.uid, {
            id: newInquiryId,
            question: inquiryText,
            focalAxiomId: focalAxiomId || undefined,
            answer: generatedAnswer,
            answerSource: sourceName,
            isFallback: isFallback,
            timestamp: new Date().toISOString(),
            savedToDrive: false,
          });
        } catch (dbErr) {
          console.warn("Could not auto-record inquiry to Firestore:", dbErr);
        }
      }
    } catch (err: any) {
      console.error("Inquiry error:", err);
      setErrorMessage(
        "Could not generate an epistemological response. Please verify your connection or try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAnswer = () => {
    if (!currentAnswer) return;
    navigator.clipboard.writeText(currentAnswer);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  /**
   * Save directly to scholar archive in Firestore
   */
  const handleSaveToArchiveOnly = async () => {
    if (!currentAnswer || !currentUser || !currentInquiryId) return;
    try {
      await bookmarkInquiryInFirestore(currentUser.uid, currentInquiryId, true);
      setIsSavedToArchive(true);
      setSaveAuthPromptOpen(false);
      setDriveSaveError(null);
    } catch (err: any) {
      console.error("Save to archive error:", err);
    }
  };

  /**
   * Directly authorize Google Drive and upload (triggered synchronously from user click)
   */
  const handleAuthorizeAndSaveDrive = async () => {
    if (!currentAnswer) return;
    if (!currentUser) {
      setSaveAuthPromptOpen(true);
      return;
    }

    setIsSavingToDrive(true);
    setDriveSaveError(null);

    try {
      // 1. Authorize Google Drive directly from this click gesture
      const token = await authorizeGoogleDrive();

      // 2. Upload to Google Drive using the acquired token
      const driveResult = await uploadInquiryToGoogleDrive({
        question: inquiryText,
        answer: currentAnswer,
        focalAxiomId: focalAxiomId || undefined,
        answerSource: answerSource || undefined,
        token,
      });

      setSavedDriveResult(driveResult);
      setIsSavedToArchive(true);
      setSaveAuthPromptOpen(false);

      // 3. Update Firestore record
      if (currentInquiryId) {
        await updateInquiryDriveStatusInFirestore(currentUser.uid, currentInquiryId, {
          driveFileId: driveResult.fileId,
          driveFileUrl: driveResult.webViewLink,
          driveFileName: driveResult.fileName,
        });
      }
    } catch (err: any) {
      console.error("Save to Drive error:", err);
      if (err.code === "auth/popup-blocked") {
        setDriveSaveError(
          "The authorization popup was blocked by your browser. Please allow popups for this site and click again."
        );
      } else {
        setDriveSaveError(err.message || "Failed to save inquiry to Google Drive.");
      }
    } finally {
      setIsSavingToDrive(false);
    }
  };

  /**
   * Handle Save Inquiry action
   */
  const handleSaveInquiryClick = async () => {
    if (!currentAnswer) return;

    // 1. If user is logged out, show offer prompt to log in or create an account
    if (!currentUser) {
      setSaveAuthPromptOpen(true);
      return;
    }

    // 2. If Drive is already authorized in memory, upload directly!
    if (isDriveAuthorized) {
      setIsSavingToDrive(true);
      setDriveSaveError(null);
      try {
        const driveResult = await uploadInquiryToGoogleDrive({
          question: inquiryText,
          answer: currentAnswer,
          focalAxiomId: focalAxiomId || undefined,
          answerSource: answerSource || undefined,
        });

        setSavedDriveResult(driveResult);
        setIsSavedToArchive(true);

        // Update Firestore record
        if (currentInquiryId) {
          await updateInquiryDriveStatusInFirestore(currentUser.uid, currentInquiryId, {
            driveFileId: driveResult.fileId,
            driveFileUrl: driveResult.webViewLink,
            driveFileName: driveResult.fileName,
          });
        }
      } catch (err: any) {
        console.error("Save to Drive error:", err);
        setSaveAuthPromptOpen(true);
        setDriveSaveError(err.message || "Please re-authorize Google Drive to continue.");
      } finally {
        setIsSavingToDrive(false);
      }
    } else {
      // 3. Drive not yet authorized in this session:
      // Bookmark into Firestore archive immediately, and prompt for Drive connection
      if (currentInquiryId) {
        await bookmarkInquiryInFirestore(currentUser.uid, currentInquiryId, true);
        setIsSavedToArchive(true);
      }
      setSaveAuthPromptOpen(true);
    }
  };

  const filteredFaqs =
    selectedFaqCategory === "All"
      ? CURATED_FAQS
      : CURATED_FAQS.filter((f) => f.category === selectedFaqCategory);

  return (
    <section id="qa-module-section" className="py-12 bg-[#060E1D] text-[#F8F9FA] border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3.5 py-1 rounded-full border border-[#D4AF37]/30">
            Interactive Inquiry Engine
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-bold text-[#F8F9FA] mt-3">
            Epistemological Q&A & AI Synthesis
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-2">
            Interrogate common theological dilemmas or generate real-time philosophical proofs anchored in the 7 Axioms and the Basran synthesis.
          </p>

          {/* Mode Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-[#0A192F] border border-[#D4AF37]/30 mt-6 shadow-md">
            <button
              id="qa-mode-faqs-btn"
              onClick={() => setQaMode("faqs")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                qaMode === "faqs"
                  ? "bg-[#D4AF37] text-[#060E1D] shadow-sm"
                  : "text-[#CBD5E1] hover:text-[#F8F9FA]"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Curated Theological FAQs</span>
            </button>
            <button
              id="qa-mode-ai-gateway-btn"
              onClick={() => setQaMode("ai-gateway")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                qaMode === "ai-gateway"
                  ? "bg-[#D4AF37] text-[#060E1D] shadow-sm"
                  : "text-[#CBD5E1] hover:text-[#F8F9FA]"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Jauhari AI Gateway</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: CURATED THEOLOGICAL FAQS */}
        {qaMode === "faqs" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2 pb-2">
              {faqCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFaqCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedFaqCategory === cat
                      ? "bg-[#D4AF37] text-[#060E1D] font-bold shadow-sm"
                      : "bg-[#0A192F] text-[#CBD5E1] hover:text-[#F8F9FA] border border-[#D4AF37]/25"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Accordion FAQ List */}
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    id={`faq-item-${faq.id}`}
                    className="rounded-xl border border-[#D4AF37]/25 bg-[#0A192F] overflow-hidden transition-all shadow-sm hover:border-[#D4AF37]/45"
                  >
                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 focus:outline-none"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#060E1D] text-[#D4AF37] border border-[#D4AF37]/30">
                            Axiom {faq.relatedAxiomNumber}
                          </span>
                          <span className="text-[10px] text-[#94A3B8]">{faq.category}</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold text-[#F8F9FA] pt-0.5">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="p-1 rounded-full bg-[#060E1D] text-[#D4AF37] flex-shrink-0 mt-1">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#D4AF37]/15 space-y-4 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                        <p className="bg-[#060E1D] p-4 rounded-xl border border-[#D4AF37]/20 text-[#CBD5E1]">
                          {faq.answer}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D4AF37]/15 text-xs text-[#94A3B8]">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Scripture: {faq.keyScripture}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {onNavigateToAxiom && (
                              <button
                                onClick={() => onNavigateToAxiom(faq.relatedAxiomNumber)}
                                className="text-[#CBD5E1] hover:text-[#F3E5AB] transition-colors flex items-center gap-1 text-[11px]"
                              >
                                <span>Go to Axiom {faq.relatedAxiomNumber}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            <button
                              id={`faq-expand-ai-${faq.id}`}
                              onClick={() => handleAskFaqInAi(faq)}
                              className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#F3E5AB] border border-[#D4AF37]/40 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                            >
                              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                              <span>Deep Dive with AI</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: AI INQUIRIES GATEWAY */}
        {qaMode === "ai-gateway" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            {/* Left Column: Input Form & Suggested Questions */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-[#0A192F] rounded-2xl p-6 border border-[#D4AF37]/30 shadow-xl">
                <div className="flex items-center justify-between mb-4 border-b border-[#D4AF37]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs uppercase font-bold tracking-wider text-[#F8F9FA]">
                      Submit Your Inquiry
                    </span>
                  </div>
                  <span className="text-[11px] text-[#D4AF37] font-mono">
                    Model: gemini-3.6-flash
                  </span>
                </div>

                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  {/* Optional Focal Axiom Selector */}
                  <div>
                    <label
                      htmlFor="qa-focal-axiom"
                      className="block text-xs font-semibold text-[#CBD5E1] mb-1"
                    >
                      Focus Axiom (Optional Context):
                    </label>
                    <select
                      id="qa-focal-axiom"
                      value={focalAxiomId}
                      onChange={(e) => setFocalAxiomId(e.target.value)}
                      className="w-full text-xs bg-[#060E1D] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-[#F8F9FA] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    >
                      <option value="">All Axioms (General Epistemological Synthesis)</option>
                      {SEVEN_AXIOMS.map((ax) => (
                        <option key={ax.id} value={ax.id}>
                          Axiom {ax.number}: {ax.latinTitle} ({ax.title})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Question Textarea */}
                  <div>
                    <label
                      htmlFor="qa-inquiry-textarea"
                      className="block text-xs font-semibold text-[#CBD5E1] mb-1"
                    >
                      Your Inquiry or Theological Dilemma:
                    </label>
                    <textarea
                      id="qa-inquiry-textarea"
                      rows={4}
                      value={inquiryText}
                      onChange={(e) => setInquiryText(e.target.value)}
                      placeholder="e.g., How does Project Jauhari resolve the tension between divine omnipotence and natural laws of physics?"
                      className="w-full text-xs sm:text-sm bg-[#060E1D] border border-[#D4AF37]/30 rounded-xl p-3.5 text-[#F8F9FA] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#94A3B8]">
                      Grounded in 1st-c. Basran Synthesis & 7 Axioms
                    </span>
                    <button
                      type="submit"
                      id="qa-submit-btn"
                      disabled={isLoading || !inquiryText.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed text-[#060E1D] font-bold text-xs sm:text-sm shadow-md transition-all focus:outline-none"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#060E1D]" />
                          <span>Synthesizing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-[#060E1D]" />
                          <span>Generate Response</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {errorMessage && (
                  <div className="mt-4 p-3 rounded-lg bg-red-950/60 border border-red-500/30 text-xs text-red-200">
                    {errorMessage}
                  </div>
                )}
              </div>

              {/* Suggested Prompt Chips */}
              <div className="bg-[#0A192F]/60 rounded-xl p-5 border border-[#D4AF37]/20">
                <span className="text-xs uppercase font-bold tracking-wider text-[#D4AF37] block mb-3">
                  Sample Theological & Scientific Prompts:
                </span>
                <div className="space-y-2">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      id={`suggested-prompt-${idx}`}
                      onClick={() => handleSelectSuggestedPrompt(prompt)}
                      className="w-full text-left p-2.5 rounded-lg text-xs bg-[#060E1D] hover:bg-[#0E2445] text-[#CBD5E1] hover:text-[#F3E5AB] border border-[#D4AF37]/20 transition-colors flex items-center justify-between gap-2"
                    >
                      <span className="line-clamp-1">{prompt}</span>
                      <ArrowRight className="w-3 h-3 text-[#D4AF37] flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: AI Generated Answer & Actions */}
            <div className="lg:col-span-6 space-y-6">
              {/* Generated Response Card */}
              <div className="bg-[#0A192F] rounded-2xl p-6 border border-[#D4AF37]/35 min-h-[380px] flex flex-col justify-between shadow-2xl relative">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#D4AF37]/20 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-[#F8F9FA]">
                        Jauhari Epistemological Response
                      </span>
                    </div>

                    {/* Actions Header Bar: Save Inquiry Button & Copy Button */}
                    {currentAnswer && (
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {/* Save Inquiry Button */}
                        {savedDriveResult ? (
                          <a
                            href={savedDriveResult.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 px-3 py-1 rounded-lg transition-all shadow-sm"
                            title="Open saved markdown document in Google Drive"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Saved in Drive ↗</span>
                          </a>
                        ) : (
                          <div className="relative">
                            <button
                              id="save-inquiry-drive-btn"
                              onClick={handleSaveInquiryClick}
                              disabled={isSavingToDrive}
                              title="Save this inquiry and synthesized response to your personal Google Drive"
                              className="flex items-center gap-1.5 text-[11px] font-semibold text-[#060E1D] bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] hover:brightness-105 px-3 py-1 rounded-lg transition-all shadow-sm disabled:opacity-60"
                            >
                              {isSavingToDrive ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#060E1D]" />
                                  <span>Saving...</span>
                                </>
                              ) : (
                                <>
                                  <FolderSync className="w-3.5 h-3.5 text-[#060E1D]" />
                                  <span>Save Inquiry</span>
                                </>
                              )}
                            </button>

                            {/* Offer Modal / Popover for logged out users or visitors */}
                            {saveAuthPromptOpen && !currentUser && (
                              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#060E1D] border border-[#D4AF37]/40 shadow-2xl p-4 z-40 animate-in fade-in duration-150 text-left">
                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#D4AF37]/20">
                                  <Cloud className="w-4 h-4 text-[#D4AF37]" />
                                  <span className="text-xs font-bold text-[#F8F9FA]">
                                    Save to Google Drive
                                  </span>
                                </div>

                                <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
                                  Saved inquiries are archived in your personal Google Drive storage and accessible via your scholar dashboard.
                                </p>

                                <div className="space-y-2">
                                  <button
                                    onClick={() => {
                                      setSaveAuthPromptOpen(false);
                                      if (onOpenAuth) {
                                        onOpenAuth("signin", "Sign in to save this inquiry directly to your Google Drive");
                                      }
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#060E1D] text-xs font-bold transition-colors"
                                  >
                                    <LogIn className="w-3.5 h-3.5" />
                                    <span>Sign In to Save</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setSaveAuthPromptOpen(false);
                                      if (onOpenAuth) {
                                        onOpenAuth("signup", "Create an account to save this inquiry to your personal Google Drive");
                                      }
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-[#0A192F] hover:bg-[#0E2445] border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-semibold transition-colors"
                                  >
                                    <UserPlus className="w-3.5 h-3.5 text-[#D4AF37]" />
                                    <span>Create Account (Visitor)</span>
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Drive Connect Popover for logged in users when Drive is not yet active */}
                            {saveAuthPromptOpen && currentUser && !savedDriveResult && (
                              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#0A192F] border border-[#D4AF37]/50 shadow-2xl p-4 z-40 animate-in fade-in duration-150 text-left">
                                <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#D4AF37]/20">
                                  <div className="flex items-center gap-2">
                                    <Cloud className="w-4 h-4 text-[#D4AF37]" />
                                    <span className="text-xs font-bold text-[#F8F9FA]">
                                      Google Drive Sync
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => setSaveAuthPromptOpen(false)}
                                    className="text-[#94A3B8] hover:text-[#F8F9FA] text-xs p-1"
                                  >
                                    ✕
                                  </button>
                                </div>

                                <p className="text-[11px] text-[#CBD5E1] leading-relaxed mb-3">
                                  {isSavedToArchive
                                    ? "✓ Inquiry is saved in your Scholar Archive. Authorize Google Drive to export a formatted Markdown document to your Drive."
                                    : "Connect your Google Drive to export this inquiry and synthesized response into your personal Drive folder."}
                                </p>

                                <div className="space-y-2">
                                  <button
                                    onClick={handleAuthorizeAndSaveDrive}
                                    disabled={isSavingToDrive}
                                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#060E1D] text-xs font-bold transition-all shadow-sm hover:brightness-105"
                                  >
                                    {isSavingToDrive ? (
                                      <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Connecting & Uploading...</span>
                                      </>
                                    ) : (
                                      <>
                                        <FolderSync className="w-3.5 h-3.5" />
                                        <span>Authorize & Save to Drive</span>
                                      </>
                                    )}
                                  </button>

                                  {!isSavedToArchive && (
                                    <button
                                      onClick={handleSaveToArchiveOnly}
                                      className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-[#060E1D] hover:bg-[#0E2445] border border-[#D4AF37]/30 text-[#F3E5AB] text-xs font-medium transition-colors"
                                    >
                                      <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                                      <span>Save to Scholar Archive Only</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Copy Markdown Button */}
                        <button
                          id="copy-markdown-answer-btn"
                          onClick={handleCopyAnswer}
                          title="Copy raw markdown text including formatting characters"
                          className="flex items-center gap-1.5 text-[11px] font-medium text-[#CBD5E1] hover:text-[#F8F9FA] px-2.5 py-1 rounded-lg bg-[#060E1D] hover:bg-[#0E2445] border border-[#D4AF37]/30 transition-colors"
                        >
                          {copiedAnswer ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-semibold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {driveSaveError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-start justify-between gap-2 animate-in fade-in">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-100">Unable to save to Google Drive</p>
                          <p className="text-[11px] text-red-300 mt-0.5">{driveSaveError}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setDriveSaveError(null)}
                        className="text-red-400 hover:text-red-200 text-xs font-bold px-1"
                        aria-label="Dismiss error"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {isLoading ? (
                    <div className="py-16 text-center space-y-3">
                      <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mx-auto" />
                      <p className="text-xs text-[#CBD5E1] font-medium">
                        Consulting the 7 Axioms and the Basran Synthesis...
                      </p>
                      <p className="text-[11px] text-[#94A3B8] max-w-xs mx-auto">
                        Harmonizing revelatory text (naql) with demonstrative logic (burhān) and causal realism (asbāb).
                      </p>
                    </div>
                  ) : currentAnswer ? (
                    <div className="space-y-4">
                      {isFallbackResponse && (
                        <div className="p-3 rounded-lg bg-[#060E1D] border border-[#D4AF37]/40 text-xs text-[#F3E5AB] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
                            <span>
                              {fallbackWarning || "Temporary AI model traffic spike. Synthesized from Jauhari Manifesto Archive."}
                            </span>
                          </div>
                          <button
                            id="retry-live-ai-btn"
                            type="button"
                            onClick={() => handleSubmitInquiry()}
                            className="px-2.5 py-1 rounded bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#060E1D] font-bold text-[11px] flex items-center gap-1 self-start sm:self-auto transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Retry Live AI</span>
                          </button>
                        </div>
                      )}

                      <div className="max-h-[480px] overflow-y-auto pr-2 dark-scrollbar">
                        <MarkdownRenderer content={currentAnswer} />
                      </div>
                    </div>
                  ) : (
                    <div className="py-16 text-center space-y-3">
                      <Compass className="w-10 h-10 text-[#D4AF37]/40 mx-auto" />
                      <h4 className="text-sm font-bold text-[#CBD5E1]">
                        Awaiting Your Inquiry
                      </h4>
                      <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
                        Type a question about Islamic revivalism, reason vs occasionalism, miracles, ethics, or meritocratic governance, then click "Generate Response".
                      </p>
                    </div>
                  )}
                </div>

                {currentAnswer && (
                  <div className="pt-4 border-t border-[#D4AF37]/20 mt-6 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#94A3B8]">
                    <div className="flex items-center gap-2">
                      <span>Source: <strong className="text-[#F8F9FA]">{answerSource || "Gemini"}</strong></span>
                      {isFallbackResponse ? (
                        <span className="px-1.5 py-0.5 rounded bg-[#060E1D] text-[#D4AF37] border border-[#D4AF37]/40 text-[10px]">
                          Archive Engine
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-[10px]">
                          Live Multi-Model AI
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {currentUser && onViewDashboard && (
                        <button
                          onClick={onViewDashboard}
                          className="text-[#D4AF37] hover:text-[#F3E5AB] flex items-center gap-1 font-semibold transition-colors"
                        >
                          <span>View in Dashboard →</span>
                        </button>
                      )}
                      <button
                        id="footer-regenerate-ai-btn"
                        onClick={() => handleSubmitInquiry()}
                        className="text-[#F3E5AB] hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Re-synthesize</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Inquiry History */}
              {inquiryHistory.length > 1 && (
                <div className="bg-[#0A192F]/60 rounded-xl p-4 border border-[#D4AF37]/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37]">
                      <History className="w-3.5 h-3.5" />
                      <span>Recent Session Inquiries</span>
                    </div>
                    {currentUser && onViewDashboard && (
                      <button
                        onClick={onViewDashboard}
                        className="text-[11px] text-[#D4AF37] hover:underline"
                      >
                        All Saved Inquiries →
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {inquiryHistory.slice(1).map((hist) => (
                      <button
                        key={hist.id}
                        onClick={() => {
                          setInquiryText(hist.question);
                          setCurrentAnswer(hist.answer);
                          setAnswerSource(hist.source || null);
                          setSavedDriveResult(null);
                        }}
                        className="w-full text-left p-2 rounded-lg bg-[#060E1D] hover:bg-[#0E2445] text-xs text-[#CBD5E1] hover:text-[#F8F9FA] flex items-center justify-between gap-2 transition-colors border border-[#D4AF37]/15"
                      >
                        <span className="truncate">{hist.question}</span>
                        <span className="text-[10px] text-[#94A3B8] font-mono flex-shrink-0">
                          {hist.timestamp}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
