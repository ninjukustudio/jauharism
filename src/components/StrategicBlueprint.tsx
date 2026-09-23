import React from "react";
import { IMPLEMENTATION_BLUEPRINT } from "../data/manifestoData.ts";
import { Compass, BookCheck, Cpu, CheckCircle } from "lucide-react";

export const StrategicBlueprint: React.FC = () => {
  const getIcon = (phase: string) => {
    switch (phase) {
      case "5.1":
        return Compass;
      case "5.2":
        return BookCheck;
      default:
        return Cpu;
    }
  };

  return (
    <section id="blueprint-section" className="py-14 bg-stone-100/60 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-cyan-800 bg-cyan-100 px-3 py-1 rounded-full border border-cyan-300">
            Section 5 of Manifesto
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-bold text-stone-900 mt-3">
            Implementation Blueprint & Action Plan
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            An action-oriented roadmap for educational reform, scientific reclamation, ideological deconstruction, and institutional infrastructure.
          </p>
        </div>

        {/* 3 Phases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {IMPLEMENTATION_BLUEPRINT.map((phase) => {
            const Icon = getIcon(phase.phase);
            return (
              <div
                key={phase.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-stone-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                      Phase {phase.phase}
                    </span>
                    <span className="font-amiri text-lg font-bold text-stone-800">
                      {phase.arabic}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 mb-3">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 mb-1">
                    {phase.title}
                  </h3>
                  <p className="text-xs font-semibold text-amber-700 mb-3 uppercase tracking-wider">
                    {phase.theme}
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed mb-6">
                    {phase.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <span className="text-[11px] uppercase font-bold text-stone-500 block mb-2">
                    Action Directives:
                  </span>
                  <ul className="space-y-2">
                    {phase.actions.map((act, i) => (
                      <li key={i} className="text-xs text-stone-700 flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
