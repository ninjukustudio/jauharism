import React from "react";
import { TRIAD_FACETS } from "../data/manifestoData.ts";
import { Compass, Sparkles, Scale, Clock, ShieldCheck } from "lucide-react";

export const TriadDeepDive: React.FC = () => {
  return (
    <section id="triad-deep-dive-section" className="py-14 bg-stone-100/80 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            Section 1.1 of Manifesto
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-bold text-stone-900 mt-2">
            The Linguistic, Ontological & Visionary Triad
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            The designation <span className="font-semibold text-stone-900">Jauhari</span> operates on three distinct, intersecting dimensions defining the scope and methodology of rational revival.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRIAD_FACETS.map((facet, idx) => {
            return (
              <div
                key={facet.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-stone-400 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider font-mono">
                      Dimension {idx + 1}
                    </span>
                    <span className="font-amiri text-2xl font-bold text-amber-600 group-hover:text-amber-500 transition-colors">
                      {facet.arabic}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 mb-1">
                    {facet.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 mb-3">
                    {facet.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                    {facet.summary}
                  </p>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 mb-4">
                    <span className="text-[11px] uppercase font-bold text-stone-600 block mb-1">
                      Philosophical Restoration:
                    </span>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {facet.philosophicalSignificance}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-medium text-stone-800">Role:</span>
                  <span className="font-semibold text-amber-700">{facet.manifestoRole}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
