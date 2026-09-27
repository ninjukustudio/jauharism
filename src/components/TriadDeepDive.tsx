import React from "react";
import { TRIAD_FACETS } from "../data/manifestoData.ts";
import { Compass, Sparkles, Scale, Clock, ShieldCheck } from "lucide-react";

export const TriadDeepDive: React.FC = () => {
  return (
    <section id="triad-deep-dive-section" className="py-14 bg-[#060E1D] text-[#F8F9FA] border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3.5 py-1 rounded-full border border-[#D4AF37]/30">
            Section 1.1 of Manifesto
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-bold text-[#F8F9FA] mt-2">
            The Linguistic, Ontological & Visionary Triad
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] mt-2">
            The designation <span className="font-semibold text-[#F3E5AB]">Jauhari</span> operates on three distinct, intersecting dimensions defining the scope and methodology of rational revival.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRIAD_FACETS.map((facet, idx) => {
            return (
              <div
                key={facet.id}
                className="bg-[#0A192F] rounded-2xl p-6 sm:p-7 border border-[#D4AF37]/30 shadow-xl flex flex-col justify-between hover:border-[#D4AF37]/60 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-[#D4AF37]/20 pb-3">
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-mono">
                      Dimension {idx + 1}
                    </span>
                    <span className="font-amiri text-2xl font-bold text-[#D4AF37] group-hover:text-[#F3E5AB] transition-colors">
                      {facet.arabic}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#F8F9FA] mb-1 font-cinzel">
                    {facet.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#F3E5AB] mb-3">
                    {facet.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed mb-4">
                    {facet.summary}
                  </p>

                  <div className="p-3.5 rounded-xl bg-[#060E1D] border border-[#D4AF37]/20 mb-4">
                    <span className="text-[11px] uppercase font-bold text-[#D4AF37] block mb-1">
                      Philosophical Restoration:
                    </span>
                    <p className="text-xs text-[#CBD5E1] leading-relaxed">
                      {facet.philosophicalSignificance}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs text-[#94A3B8]">
                  <span className="font-medium text-[#CBD5E1]">Role:</span>
                  <span className="font-semibold text-[#D4AF37]">{facet.manifestoRole}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
