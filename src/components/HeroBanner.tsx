import React, { useState } from "react";
import { PREAMBLE_TEXT, TRIAD_FACETS } from "../data/manifestoData.ts";
import { Sparkles, ArrowRight, ShieldCheck, Clock, Eye, Scale } from "lucide-react";

interface HeroBannerProps {
  onExploreAxioms: () => void;
  onOpenQA: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreAxioms, onOpenQA }) => {
  const [selectedTriad, setSelectedTriad] = useState<string>("jawhar");

  const activeFacet = TRIAD_FACETS.find((f) => f.id === selectedTriad) || TRIAD_FACETS[0];

  return (
    <section className="relative overflow-hidden bg-stone-900 text-stone-100 border-b border-stone-800 pt-12 pb-16">
      {/* Subtle geometric pattern backdrop */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Scale className="w-3.5 h-3.5" />
            The Jauhari Manifesto
          </span>
          <span className="text-xs text-stone-400">
            1st-Century Basran Synthesis • Rational Islamic Revival
          </span>
        </div>

        {/* Main Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-stone-100 tracking-tight leading-tight">
              Epistemological Architecture of <span className="text-amber-400">Project Jauhari</span>
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              {PREAMBLE_TEXT.paragraph1}
            </p>

            <p className="text-stone-400 text-sm sm:text-base leading-relaxed max-w-2xl">
              {PREAMBLE_TEXT.paragraph2}
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-explore-btn"
                onClick={onExploreAxioms}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              >
                <span>Interact with 7 Axioms</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-qa-btn"
                onClick={onOpenQA}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Launch Q&A Gateway</span>
              </button>
            </div>
          </div>

          {/* Interactive Triad Card */}
          <div className="lg:col-span-5">
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-5 sm:p-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  The Triad of Jauhari
                </span>
                <span className="text-xs text-stone-500">Section 1.1</span>
              </div>

              {/* Triad Selector Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800 mb-5">
                {TRIAD_FACETS.map((facet) => {
                  const isSelected = selectedTriad === facet.id;
                  return (
                    <button
                      key={facet.id}
                      id={`triad-selector-${facet.id}`}
                      onClick={() => setSelectedTriad(facet.id)}
                      className={`py-2 px-2 rounded text-center transition-all ${
                        isSelected
                          ? "bg-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm"
                          : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
                      }`}
                    >
                      <span className="block font-amiri text-base font-bold">{facet.arabic}</span>
                      <span className="text-[11px] font-semibold block truncate">
                        {facet.id === "jawhar" ? "Jawhar" : facet.id === "jauh-hari" ? "Jauh Hari" : "Jauhari"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Triad Display */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                    {activeFacet.title}
                  </h3>
                  <span className="font-amiri text-xl font-bold text-amber-400">
                    {activeFacet.arabic}
                  </span>
                </div>

                <p className="text-xs text-amber-300 font-medium italic">
                  {activeFacet.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {activeFacet.summary}
                </p>

                <div className="p-3 rounded-lg bg-stone-900/90 border border-stone-800/80 mt-3">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                    Philosophical Application
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {activeFacet.philosophicalSignificance}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px] text-stone-400 border-t border-stone-800/60">
                  <span>Role: {activeFacet.manifestoRole}</span>
                  <span className="text-emerald-400 font-medium">Verified Archeology</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Stat Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-stone-800/80">
          <div className="p-4 rounded-lg bg-stone-950/40 border border-stone-800/60">
            <span className="text-2xl font-cinzel font-bold text-amber-400">7</span>
            <p className="text-xs font-semibold text-stone-200 mt-1">Integral Axioms</p>
            <p className="text-[11px] text-stone-400">From Tanzīh to Democratic Shūrā</p>
          </div>
          <div className="p-4 rounded-lg bg-stone-950/40 border border-stone-800/60">
            <span className="text-2xl font-cinzel font-bold text-emerald-400">1st c.</span>
            <p className="text-xs font-semibold text-stone-200 mt-1">Basran Baseline</p>
            <p className="text-[11px] text-stone-400">Al-Ḥasan al-Baṣrī, ʿAlī & Ibn ʿAbbās</p>
          </div>
          <div className="p-4 rounded-lg bg-stone-950/40 border border-stone-800/60">
            <span className="text-2xl font-cinzel font-bold text-cyan-400">3</span>
            <p className="text-xs font-semibold text-stone-200 mt-1">Early Rational Streams</p>
            <p className="text-[11px] text-stone-400">Mu'tazilite, Zaydi & Ibadi isnād</p>
          </div>
          <div className="p-4 rounded-lg bg-stone-950/40 border border-stone-800/60">
            <span className="text-2xl font-cinzel font-bold text-rose-400">1</span>
            <p className="text-xs font-semibold text-stone-200 mt-1">Unified Synthesis</p>
            <p className="text-[11px] text-stone-400">Bridging Revelation, Logic & STEM</p>
          </div>
        </div>
      </div>
    </section>
  );
};
