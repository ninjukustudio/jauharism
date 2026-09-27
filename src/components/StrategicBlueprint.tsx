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
    <section id="blueprint-section" className="py-14 bg-[#060E1D] text-[#F8F9FA] border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3.5 py-1 rounded-full border border-[#D4AF37]/30">
            Section 5 of Manifesto
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-bold text-[#F8F9FA] mt-3">
            Implementation Blueprint & Action Plan
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] mt-2">
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
                className="bg-[#0A192F] rounded-2xl p-6 sm:p-7 border border-[#D4AF37]/30 shadow-xl flex flex-col justify-between hover:border-[#D4AF37]/60 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-[#D4AF37]/20 pb-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#060E1D] text-[#D4AF37] border border-[#D4AF37]/30">
                      Phase {phase.phase}
                    </span>
                    <span className="font-amiri text-lg font-bold text-[#F3E5AB]">
                      {phase.arabic}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#060E1D] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-3 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold text-[#F8F9FA] mb-1 font-cinzel">
                    {phase.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#D4AF37] mb-3 uppercase tracking-wider">
                    {phase.theme}
                  </p>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed mb-6">
                    {phase.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D4AF37]/20">
                  <span className="text-[11px] uppercase font-bold text-[#D4AF37] block mb-2">
                    Action Directives:
                  </span>
                  <ul className="space-y-2">
                    {phase.actions.map((act, i) => (
                      <li key={i} className="text-xs text-[#CBD5E1] flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
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
