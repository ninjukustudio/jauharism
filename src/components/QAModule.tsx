import React, { useState } from "react";
import { CURATED_FAQS, SEVEN_AXIOMS } from "../data/manifestoData.ts";
import { FAQItem, UserInquiryHistory } from "../types.ts";
import { MarkdownRenderer } from "./MarkdownRenderer.tsx";
import { generateSemanticAnswer } from "../services/jauhariKnowledgeEngine.ts";
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
} from "lucide-react";

interface QAModuleProps {
  initialQuestion?: string;
  initialAxiomId?: string;
  onNavigateToAxiom?: (axiomNumber: string) => void;
}

export const QAModule: React.FC<QAModuleProps> = ({
  initialQuestion = "",
  initialAxiomId = "",
  onNavigateToAxiom,
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
            question: inquiryText.trim(),
            contextAxiomId: focalAxiomId || undefined,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          generatedAnswer = data.answer || "";
          sourceName = data.source || "gemini-3.6-flash";
          isFallback = !!data.isFallback;
          warningText = data.warning || data.note || null;
        } else {
          console.warn(`Server returned status ${response.status}, engaging client-side Jauhari Manifesto Engine.`);
          generatedAnswer = generateSemanticAnswer(inquiryText.trim(), focalAxiomId || undefined);
          sourceName = "manifesto-offline-synthesizer";
          isFallback = true;
          warningText =
            response.status === 404
              ? "The backend endpoint is currently synchronizing or unavailable on this host. An authoritative response was synthesized directly from the Project Jauhari Manifesto archives."
              : `The server reported status ${response.status}. Synthesized directly from the Project Jauhari Manifesto knowledge base.`;
        }
      } catch (fetchErr: any) {
        console.warn("Network request to /api/jauhari-qa failed, falling back to local manifesto engine:", fetchErr);
        generatedAnswer = generateSemanticAnswer(inquiryText.trim(), focalAxiomId || undefined);
        sourceName = "manifesto-offline-synthesizer";
        isFallback = true;
        warningText = "Operating in offline / direct manifesto mode. Response generated directly from the Project Jauhari epistemological core.";
      }

      if (!generatedAnswer) {
        generatedAnswer = generateSemanticAnswer(inquiryText.trim(), focalAxiomId || undefined);
        isFallback = true;
      }

      setCurrentAnswer(generatedAnswer);
      setAnswerSource(sourceName);
      setIsFallbackResponse(isFallback);
      setFallbackWarning(warningText);

      // Save to session history
      const newEntry: UserInquiryHistory = {
        id: `inq-${Date.now()}`,
        question: inquiryText.trim(),
        answer: generatedAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        focalAxiomId: focalAxiomId || undefined,
        source: sourceName,
      };

      setInquiryHistory((prev) => [newEntry, ...prev.slice(0, 9)]);
    } catch (err: any) {
      console.error("Inquiry error:", err);
      // Final resilient safety net: never leave the user with an empty error
      try {
        const fallback = generateSemanticAnswer(inquiryText.trim(), focalAxiomId || undefined);
        setCurrentAnswer(fallback);
        setAnswerSource("manifesto-emergency-engine");
        setIsFallbackResponse(true);
        setFallbackWarning("Synthesized directly from the Project Jauhari Manifesto archives.");
      } catch {
        setErrorMessage(
          "Could not generate an AI response. Please verify your connection or try again."
        );
      }
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

  const filteredFaqs = CURATED_FAQS.filter(
    (faq) => selectedFaqCategory === "All" || faq.category === selectedFaqCategory
  );

  return (
    <section id="qa-module-section" className="py-14 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Q&A Module</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-bold text-stone-100">
            Manifesto Inquiries & AI Gateway
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-2">
            Explore curated foundational FAQs or submit your custom philosophical, theological, and scientific questions to the Jauhari Epistemological Synthesizer.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex p-1 rounded-xl bg-stone-950 border border-stone-800 shadow-inner">
              <button
                id="qa-mode-faqs"
                onClick={() => setQaMode("faqs")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  qaMode === "faqs"
                    ? "bg-amber-500 text-stone-950 shadow-md"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Curated FAQs ({CURATED_FAQS.length})</span>
              </button>

              <button
                id="qa-mode-ai-gateway"
                onClick={() => setQaMode("ai-gateway")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  qaMode === "ai-gateway"
                    ? "bg-amber-500 text-stone-950 shadow-md"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Inquiries Gateway</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </button>
            </div>
          </div>
        </div>

        {/* VIEW 1: CURATED FAQS */}
        {qaMode === "faqs" && (
          <div className="space-y-6">
            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-2">
              {faqCategories.map((cat) => (
                <button
                  key={cat}
                  id={`faq-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                  onClick={() => setSelectedFaqCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedFaqCategory === cat
                      ? "bg-stone-100 text-stone-950 shadow-sm"
                      : "bg-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-750"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* FAQs Accordion */}
            <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-stone-950/70 border border-stone-800 rounded-xl overflow-hidden transition-all hover:border-stone-700"
                  >
                    <button
                      id={`faq-toggle-${faq.id}`}
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full p-5 text-left flex items-start justify-between gap-4 focus:outline-none"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            {faq.category}
                          </span>
                          <span className="text-xs text-stone-400">
                            Axiom {faq.relatedAxiomNumber}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-stone-100 leading-snug">
                          {faq.question}
                        </h4>
                        {!isExpanded && (
                          <p className="text-xs text-stone-400 line-clamp-1 mt-1">
                            {faq.summary}
                          </p>
                        )}
                      </div>

                      <div className="w-6 h-6 rounded flex items-center justify-center bg-stone-900 text-stone-400 flex-shrink-0 mt-1">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-amber-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-stone-850/80 space-y-4">
                        <div className="p-3.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-amber-200/90 leading-relaxed font-medium">
                          {faq.summary}
                        </div>

                        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line font-normal">
                          {faq.answer}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-850 text-xs text-stone-400">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Scripture: {faq.keyScripture}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {onNavigateToAxiom && (
                              <button
                                onClick={() => onNavigateToAxiom(faq.relatedAxiomNumber)}
                                className="text-stone-300 hover:text-amber-300 transition-colors flex items-center gap-1 text-[11px]"
                              >
                                <span>Go to Axiom {faq.relatedAxiomNumber}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            <button
                              id={`faq-expand-ai-${faq.id}`}
                              onClick={() => handleAskFaqInAi(faq)}
                              className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                            >
                              <Sparkles className="w-3 h-3 text-amber-400" />
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
              <div className="bg-stone-950/80 rounded-2xl p-6 border border-stone-800 shadow-xl">
                <div className="flex items-center justify-between mb-4 border-b border-stone-850 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs uppercase font-bold tracking-wider text-stone-200">
                      Submit Your Inquiry
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    Model: gemini-3.6-flash
                  </span>
                </div>

                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  {/* Optional Focal Axiom Selector */}
                  <div>
                    <label
                      htmlFor="qa-focal-axiom"
                      className="block text-xs font-semibold text-stone-400 mb-1"
                    >
                      Focus Axiom (Optional Context):
                    </label>
                    <select
                      id="qa-focal-axiom"
                      value={focalAxiomId}
                      onChange={(e) => setFocalAxiomId(e.target.value)}
                      className="w-full text-xs bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
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
                      className="block text-xs font-semibold text-stone-400 mb-1"
                    >
                      Your Inquiry or Theological Dilemma:
                    </label>
                    <textarea
                      id="qa-inquiry-textarea"
                      rows={4}
                      value={inquiryText}
                      onChange={(e) => setInquiryText(e.target.value)}
                      placeholder="e.g., How does Project Jauhari resolve the tension between divine omnipotence and natural laws of physics?"
                      className="w-full text-xs sm:text-sm bg-stone-900 border border-stone-800 rounded-xl p-3.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-stone-500">
                      Grounded in 1st-c. Basran Synthesis & 7 Axioms
                    </span>
                    <button
                      type="submit"
                      id="qa-submit-btn"
                      disabled={isLoading || !inquiryText.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all focus:outline-none"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                          <span>Synthesizing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-stone-950" />
                          <span>Generate Response</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {errorMessage && (
                  <div className="mt-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
                    {errorMessage}
                  </div>
                )}
              </div>

              {/* Suggested Prompt Chips */}
              <div className="bg-stone-950/40 rounded-xl p-5 border border-stone-850">
                <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block mb-3">
                  Sample Theological & Scientific Prompts:
                </span>
                <div className="space-y-2">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      id={`suggested-prompt-${idx}`}
                      onClick={() => handleSelectSuggestedPrompt(prompt)}
                      className="w-full text-left p-2.5 rounded-lg text-xs bg-stone-900/70 hover:bg-stone-850 text-stone-300 hover:text-amber-300 border border-stone-800 transition-colors flex items-center justify-between gap-2"
                    >
                      <span className="line-clamp-1">{prompt}</span>
                      <ArrowRight className="w-3 h-3 text-stone-500 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: AI Generated Answer & History */}
            <div className="lg:col-span-6 space-y-6">
              {/* Generated Response Card */}
              <div className="bg-stone-950 rounded-2xl p-6 border border-stone-850 min-h-[380px] flex flex-col justify-between shadow-2xl relative">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-850">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-stone-200">
                        Jauhari Epistemological Response
                      </span>
                    </div>

                    {currentAnswer && (
                      <div className="flex items-center gap-2">
                        <button
                          id="copy-markdown-answer-btn"
                          onClick={handleCopyAnswer}
                          title="Copy raw markdown text including formatting characters"
                          className="flex items-center gap-1.5 text-[11px] font-medium text-stone-300 hover:text-white px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-850 border border-stone-800 transition-colors"
                        >
                          {copiedAnswer ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-semibold">Copied Markdown</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-stone-400" />
                              <span>Copy Markdown</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {isLoading ? (
                    <div className="py-16 text-center space-y-3">
                      <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
                      <p className="text-xs text-stone-300 font-medium">
                        Consulting the 7 Axioms and the Basran Synthesis...
                      </p>
                      <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
                        Harmonizing revelatory text (naql) with demonstrative logic (burhān) and causal realism (asbāb).
                      </p>
                    </div>
                  ) : currentAnswer ? (
                    <div className="space-y-4">
                      {isFallbackResponse && (
                        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                            <span>
                              {fallbackWarning || "Temporary AI model traffic spike. Synthesized from Jauhari Manifesto Archive."}
                            </span>
                          </div>
                          <button
                            id="retry-live-ai-btn"
                            type="button"
                            onClick={() => handleSubmitInquiry()}
                            className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] flex items-center gap-1 self-start sm:self-auto transition-colors"
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
                      <Compass className="w-10 h-10 text-stone-700 mx-auto" />
                      <h4 className="text-sm font-bold text-stone-400">
                        Awaiting Your Inquiry
                      </h4>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto">
                        Type a question about Islamic revivalism, reason vs occasionalism, miracles, ethics, or meritocratic governance, then click "Generate Response".
                      </p>
                    </div>
                  )}
                </div>

                {currentAnswer && (
                  <div className="pt-4 border-t border-stone-850 mt-6 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500">
                    <div className="flex items-center gap-2">
                      <span>Source: <strong className="text-stone-300">{answerSource || "Gemini"}</strong></span>
                      {isFallbackResponse ? (
                        <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px]">
                          Archive Engine
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                          Live Multi-Model AI
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        id="footer-regenerate-ai-btn"
                        onClick={() => handleSubmitInquiry()}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Re-synthesize</span>
                      </button>
                      <span className="text-emerald-400 font-medium">Project Jauhari Manifesto</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Inquiry History */}
              {inquiryHistory.length > 1 && (
                <div className="bg-stone-950/60 rounded-xl p-4 border border-stone-850">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-400 mb-2">
                    <History className="w-3.5 h-3.5" />
                    <span>Recent Session Inquiries</span>
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {inquiryHistory.slice(1).map((hist) => (
                      <button
                        key={hist.id}
                        onClick={() => {
                          setInquiryText(hist.question);
                          setCurrentAnswer(hist.answer);
                          setAnswerSource(hist.source || null);
                        }}
                        className="w-full text-left p-2 rounded bg-stone-900/60 hover:bg-stone-850 text-xs text-stone-300 flex items-center justify-between gap-2 transition-colors"
                      >
                        <span className="truncate">{hist.question}</span>
                        <span className="text-[10px] text-stone-500 font-mono flex-shrink-0">
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
