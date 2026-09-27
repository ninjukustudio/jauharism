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
    <section className="relative overflow-hidden bg-[#060E1D] text-[#F8F9FA] border-b border-[#D4AF37]/20 pt-12 pb-16">
      {/* Subtle geometric pattern backdrop */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
            <Scale className="w-3.5 h-3.5" />
            The Jauhari Manifesto
          </span>
          <span className="text-xs text-[#94A3B8]">
            1st-Century Basran Synthesis • Rational Islamic Revival
          </span>
        </div>

        {/* Main Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-[#F8F9FA] tracking-tight leading-tight">
              Epistemological Architecture of <span className="text-[#D4AF37]">Project Jauhari</span>
            </h1>

            <p className="text-[#CBD5E1] text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              {PREAMBLE_TEXT.paragraph1}
            </p>

            <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed max-w-2xl">
              {PREAMBLE_TEXT.paragraph2}
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-explore-btn"
                onClick={onExploreAxioms}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] hover:brightness-105 text-[#060E1D] font-bold text-sm transition-all shadow-[0_4px_15px_rgba(212,175,55,0.3)] focus:outline-none"
              >
                <span>Interact with 7 Axioms</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-qa-btn"
                onClick={onOpenQA}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#0E2445] text-[#F3E5AB] border border-[#D4AF37]/40 font-semibold text-sm transition-all focus:outline-none shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Launch Q&A Gateway</span>
              </button>
            </div>
          </div>

          {/* Interactive Triad Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#0A192F] border border-[#D4AF37]/30 rounded-2xl p-5 sm:p-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3 mb-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  The Triad of Jauhari
                </span>
                <span className="text-xs text-[#94A3B8]">Section 1.1</span>
              </div>

              {/* Triad Selector Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-[#060E1D] p-1 rounded-xl border border-[#D4AF37]/20 mb-5">
                {TRIAD_FACETS.map((facet) => {
                  const isSelected = selectedTriad === facet.id;
                  return (
                    <button
                      key={facet.id}
                      id={`triad-selector-${facet.id}`}
                      onClick={() => setSelectedTriad(facet.id)}
                      className={`py-2 px-2 rounded-lg text-center transition-all ${
                        isSelected
                          ? "bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/50 shadow-sm"
                          : "text-[#94A3B8] hover:text-[#F8F9FA] hover:bg-[#0A192F]/50"
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
                  <h3 className="text-base font-bold text-[#F8F9FA] flex items-center gap-2">
                    {activeFacet.title}
                  </h3>
                  <span className="font-amiri text-xl font-bold text-[#D4AF37]">
                    {activeFacet.arabic}
                  </span>
                </div>

                <p className="text-xs text-[#F3E5AB] font-medium italic">
                  {activeFacet.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  {activeFacet.summary}
                </p>

                <div className="p-3.5 rounded-xl bg-[#060E1D] border border-[#D4AF37]/20 mt-3">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#D4AF37] block mb-1">
                    Philosophical Application
                  </span>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
                    {activeFacet.philosophicalSignificance}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px] text-[#94A3B8] border-t border-[#D4AF37]/15">
                  <span>Role: {activeFacet.manifestoRole}</span>
                  <span className="text-[#D4AF37] font-medium">Verified Archeology</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Stat Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-[#D4AF37]/20">
          <div className="p-4 rounded-xl bg-[#0A192F] border border-[#D4AF37]/25">
            <span className="text-2xl font-cinzel font-bold text-[#D4AF37]">7</span>
            <p className="text-xs font-semibold text-[#F8F9FA] mt-1">Integral Axioms</p>
            <p className="text-[11px] text-[#94A3B8]">From Tanzīh to Democratic Shūrā</p>
          </div>
          <div className="p-4 rounded-xl bg-[#0A192F] border border-[#D4AF37]/25">
            <span className="text-2xl font-cinzel font-bold text-[#F3E5AB]">1st c.</span>
            <p className="text-xs font-semibold text-[#F8F9FA] mt-1">Basran Baseline</p>
            <p className="text-[11px] text-[#94A3B8]">Al-Ḥasan al-Baṣrī, ʿAlī & Ibn ʿAbbās</p>
          </div>
          <div className="p-4 rounded-xl bg-[#0A192F] border border-[#D4AF37]/25">
            <span className="text-2xl font-cinzel font-bold text-[#D4AF37]">3</span>
            <p className="text-xs font-semibold text-[#F8F9FA] mt-1">Early Rational Streams</p>
            <p className="text-[11px] text-[#94A3B8]">Mu'tazilite, Zaydi & Ibadi isnād</p>
          </div>
          <div className="p-4 rounded-xl bg-[#0A192F] border border-[#D4AF37]/25">
            <span className="text-2xl font-cinzel font-bold text-[#F3E5AB]">1</span>
            <p className="text-xs font-semibold text-[#F8F9FA] mt-1">Unified Synthesis</p>
            <p className="text-[11px] text-[#94A3B8]">Bridging Revelation, Logic & STEM</p>
          </div>
        </div>
      </div>
    </section>
  );
};
