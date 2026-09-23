import React, { useState } from "react";
import { SEVEN_AXIOMS } from "../data/manifestoData.ts";
import { AxiomData } from "../types.ts";
import {
  BookOpen,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Microscope,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react";

interface AxiomsExplorerProps {
  onAskAboutAxiom: (axiomId: string, axiomTitle: string) => void;
}

export const AxiomsExplorer: React.FC<AxiomsExplorerProps> = ({ onAskAboutAxiom }) => {
  const [selectedAxiomId, setSelectedAxiomId] = useState<string>("axiom-i");
  const [activeSectionTab, setActiveSectionTab] = useState<"statement" | "naql" | "crucible" | "science">("statement");
  const [copiedQuote, setCopiedQuote] = useState<string | null>(null);

  const activeAxiom: AxiomData = SEVEN_AXIOMS.find((a) => a.id === selectedAxiomId) || SEVEN_AXIOMS[0];

  const handleCopyQuote = (quote: string) => {
    navigator.clipboard.writeText(quote);
    setCopiedQuote(quote);
    setTimeout(() => setCopiedQuote(null), 2000);
  };

  return (
    <section id="axioms-explorer-section" className="py-12 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
            Section 3 of Manifesto
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-bold text-stone-900 mt-3">
            The Seven Main Axioms
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            An integrated, non-contradictory epistemological architecture harmonizing absolute transcendence, intrinsic causality, demonstrative reason, and meritocratic governance.
          </p>
        </div>

        {/* 7 Axioms Horizontal Tab Strip */}
        <div className="flex overflow-x-auto gap-2 pb-3 mb-8 no-scrollbar scroll-smooth">
          {SEVEN_AXIOMS.map((axiom) => {
            const isSelected = activeAxiom.id === axiom.id;
            return (
              <button
                key={axiom.id}
                id={`axiom-tab-btn-${axiom.id}`}
                onClick={() => {
                  setSelectedAxiomId(axiom.id);
                  setActiveSectionTab("statement");
                }}
                className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? "bg-stone-900 text-stone-100 border-stone-800 shadow-md ring-2 ring-amber-500/50"
                    : "bg-white text-stone-700 border-stone-200 hover:border-stone-400 hover:bg-stone-50"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded flex items-center justify-center font-cinzel font-bold text-xs ${
                    isSelected
                      ? "bg-amber-500 text-stone-950"
                      : "bg-stone-100 text-stone-600 border border-stone-200"
                  }`}
                >
                  {axiom.number}
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                    <span>{axiom.latinTitle}</span>
                  </div>
                  <div className={`text-[10px] truncate max-w-[140px] ${isSelected ? "text-stone-400" : "text-stone-500"}`}>
                    {axiom.coreConcept}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Axiom Detailed Explorer Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {/* Axiom Header Bar */}
          <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-stone-100 p-6 sm:p-8 border-b border-stone-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-cinzel text-xs font-bold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    AXIOM {activeAxiom.number}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    {activeAxiom.latinTitle}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-stone-100 tracking-tight">
                  {activeAxiom.title}
                </h3>
                <p className="text-sm text-stone-300 mt-1">
                  {activeAxiom.coreConcept}
                </p>
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-center">
                <span className="font-amiri text-2xl sm:text-3xl font-bold text-amber-400">
                  {activeAxiom.arabicTitle}
                </span>
                <span className="text-[11px] text-stone-400 mt-1 uppercase tracking-wider">
                  Baseline of Faith
                </span>
              </div>
            </div>

            {/* Quick Internal Nav Tabs */}
            <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-stone-800/80">
              <button
                id={`axiom-tab-statement-${activeAxiom.id}`}
                onClick={() => setActiveSectionTab("statement")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeSectionTab === "statement"
                    ? "bg-amber-500 text-stone-950 shadow-sm"
                    : "text-stone-300 hover:text-white bg-stone-800/70 hover:bg-stone-800"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Statement & Corollaries</span>
              </button>

              <button
                id={`axiom-tab-naql-${activeAxiom.id}`}
                onClick={() => setActiveSectionTab("naql")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeSectionTab === "naql"
                    ? "bg-amber-500 text-stone-950 shadow-sm"
                    : "text-stone-300 hover:text-white bg-stone-800/70 hover:bg-stone-800"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Textual Evidence (Naql) ({activeAxiom.textualEvidence.length})</span>
              </button>

              <button
                id={`axiom-tab-crucible-${activeAxiom.id}`}
                onClick={() => setActiveSectionTab("crucible")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeSectionTab === "crucible"
                    ? "bg-amber-500 text-stone-950 shadow-sm"
                    : "text-stone-300 hover:text-white bg-stone-800/70 hover:bg-stone-800"
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Dialectical Crucible & Rebuttal</span>
              </button>

              <button
                id={`axiom-tab-science-${activeAxiom.id}`}
                onClick={() => setActiveSectionTab("science")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeSectionTab === "science"
                    ? "bg-amber-500 text-stone-950 shadow-sm"
                    : "text-stone-300 hover:text-white bg-stone-800/70 hover:bg-stone-800"
                }`}
              >
                <Microscope className="w-3.5 h-3.5" />
                <span>Modern Alignment</span>
              </button>

              <button
                id={`axiom-ask-ai-trigger-${activeAxiom.id}`}
                onClick={() => onAskAboutAxiom(activeAxiom.id, activeAxiom.title)}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Inquire about Axiom {activeAxiom.number}</span>
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="p-6 sm:p-8">
            {/* TAB 1: Statement & Corollaries */}
            {activeSectionTab === "statement" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-stone-500 mb-2">
                    Primary Axiomatic Statement
                  </h4>
                  <div className="p-5 rounded-xl bg-stone-50 border border-stone-200">
                    <p className="text-base sm:text-lg font-medium text-stone-900 leading-relaxed">
                      "{activeAxiom.statement}"
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-stone-500 mb-3">
                    Axiomatic Corollaries & Deductions
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeAxiom.corollaries.map((cor, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-4 rounded-lg bg-stone-50/70 border border-stone-200/80"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                          {cor}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-stone-500 font-medium">Associated Concepts:</span>
                  {activeAxiom.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Textual Evidence (Naql) */}
            {activeSectionTab === "naql" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-stone-500">
                    Authoritative Revelatory & Historical Anchors
                  </h4>
                  <span className="text-xs text-stone-500">
                    Quranic Naṣṣ & Authentic Sunnah
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {activeAxiom.textualEvidence.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition-all shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            item.category === "quran"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : item.category === "hadith"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {item.category === "quran"
                            ? "Quranic Verse"
                            : item.category === "hadith"
                            ? "Prophetic Hadith"
                            : "Early Basran / Medinan Transmission"}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyQuote(item.quote)}
                            className="text-stone-400 hover:text-stone-600 p-1 rounded hover:bg-stone-100 transition-colors"
                            title="Copy translation"
                          >
                            {copiedQuote === item.quote ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <span className="text-xs font-semibold text-stone-600 font-mono">
                            {item.source}
                          </span>
                        </div>
                      </div>

                      {item.arabic && (
                        <div className="text-right py-2 mb-2 font-amiri text-lg sm:text-xl font-bold text-stone-800 leading-loose border-b border-stone-100">
                          {item.arabic}
                        </div>
                      )}

                      <p className="text-stone-800 text-sm sm:text-base font-medium italic mb-2">
                        "{item.quote}"
                      </p>

                      {item.commentary && (
                        <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded border border-stone-200/60 mt-2">
                          <span className="font-bold text-stone-700">Epistemological Analysis: </span>
                          {item.commentary}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Dialectical Crucible */}
            {activeSectionTab === "crucible" && (
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-stone-100 border border-stone-200 text-xs text-stone-700 leading-relaxed">
                  <span className="font-bold text-stone-900">The Dialectical Crucible: </span>
                  Evaluating traditionalist occasionalist/fatalist objections against the rigorous rationalist methodology of Project Jauhari.
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Traditionalist Counter */}
                  <div className="p-6 rounded-xl bg-rose-50/60 border border-rose-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-3">
                        <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                        <span>Traditionalist & Occasionalist Counter-Argument</span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                        {activeAxiom.traditionalistCounter}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-rose-200/80 text-[11px] text-rose-700 font-medium">
                      Status: Hermeneutical & Theological Fallacy
                    </div>
                  </div>

                  {/* Jauhari Rationalist Rebuttal */}
                  <div className="p-6 rounded-xl bg-emerald-50/60 border border-emerald-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Project Jauhari Rationalist Rebuttal</span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                        {activeAxiom.jauhariRebuttal}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-emerald-200/80 text-[11px] text-emerald-700 font-medium">
                      Status: Proven Epistemological Resolution (Burhān)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Modern Alignment */}
            {activeSectionTab === "science" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-stone-500 mb-2">
                    Contemporary Scientific, Empirical & Civic Alignment
                  </h4>
                  <p className="text-sm text-stone-600">
                    How Axiom {activeAxiom.number} bridges revelatory truth with established physical laws and democratic governance:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeAxiom.scientificCivicAlignment.map((field, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-stone-900">
                          {field}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Field: {activeAxiom.modernDisciplines}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-stone-800 leading-relaxed">
                  <span className="font-bold text-amber-900 block mb-1">
                    Epistemological Synthesis:
                  </span>
                  Far from viewing modern empirical sciences as alien secular importations, Project Jauhari recognizes them as the systematic reading of God's unwritten scripture—the Book of Creation (Kitāb al-Kawn).
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-stone-500">
                Viewing <span className="font-semibold text-stone-800">Axiom {activeAxiom.number}</span> of VII in Project Jauhari
              </div>

              <div className="flex items-center gap-3">
                <button
                  id={`axiom-inquire-ai-bottom-${activeAxiom.id}`}
                  onClick={() => onAskAboutAxiom(activeAxiom.id, activeAxiom.title)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold text-xs sm:text-sm transition-all shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ask AI about Axiom {activeAxiom.number}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
