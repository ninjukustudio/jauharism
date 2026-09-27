import React, { useState } from "react";
import { HISTORICAL_ARCHAEOLOGY } from "../data/manifestoData.ts";
import { History, Shield, Users, Landmark, FileText, ChevronRight } from "lucide-react";

export const HistoricalArchaeology: React.FC = () => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>("mutazilism");

  const activeBranch =
    HISTORICAL_ARCHAEOLOGY.branches.find((b) => b.id === selectedBranchId) ||
    HISTORICAL_ARCHAEOLOGY.branches[0];

  return (
    <section id="archaeology-section" className="py-14 bg-[#060E1D] text-[#F8F9FA] border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3.5 py-1 rounded-full border border-[#D4AF37]/30">
            Section 2 of Manifesto
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-bold text-[#F8F9FA] mt-3">
            Historical Archaeology: The Basran Synthesis
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] mt-2">
            Unearthing the uncorrupted 1st-century Medinan and Basran baselines before imperial statecraft institutionalized radical occasionalism.
          </p>
        </div>

        {/* Part 1: The Political Shift */}
        <div className="bg-[#0A192F] text-[#F8F9FA] rounded-2xl p-6 sm:p-8 mb-10 border border-[#D4AF37]/30 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Landmark className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-wider font-bold text-[#D4AF37]">
              The Political Shift to Occasionalism
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-[#F8F9FA] mb-3">
            Statecraft, the Seljuk Empire & Niẓām al-Mulk
          </h3>
          <p className="text-[#CBD5E1] text-sm sm:text-base leading-relaxed max-w-4xl">
            {HISTORICAL_ARCHAEOLOGY.politicalShift.body}
          </p>
        </div>

        {/* Part 2: The Basran Convergence & Three Companions */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-wider font-bold text-[#D4AF37]">
              The 1st-Century Core Synthesis
            </span>
            <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-[#F8F9FA] mt-1">
              Al-Ḥasan al-Baṣrī (d. 110 AH) as Intellectual Funnel
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl mx-auto mt-1">
              Transmitting the authentic teachings of three primary Companions (Ṣaḥābah):
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HISTORICAL_ARCHAEOLOGY.figures.map((figure, idx) => (
              <div
                key={idx}
                className="bg-[#0A192F] rounded-2xl p-6 border border-[#D4AF37]/30 shadow-xl hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-[#D4AF37]/20 pb-2">
                    <span className="font-amiri text-xl font-bold text-[#D4AF37]">
                      {figure.arabicName}
                    </span>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#060E1D] text-[#F3E5AB] border border-[#D4AF37]/20">
                      {figure.dates}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-[#F8F9FA] mb-1 font-cinzel">
                    {figure.name}
                  </h4>
                  <p className="text-xs font-medium text-[#F3E5AB] mb-3">
                    {figure.role}
                  </p>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed mb-4">
                    {figure.transmission}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D4AF37]/20">
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">
                    Key Enduring Endowments:
                  </span>
                  <ul className="space-y-1">
                    {figure.corePrinciples.map((cp, i) => (
                      <li key={i} className="text-[11px] text-[#CBD5E1] flex items-start gap-1.5">
                        <ChevronRight className="w-3 h-3 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                        <span>{cp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part 3: The Three Early Rationalist Traditions */}
        <div className="bg-[#0A192F] rounded-2xl border border-[#D4AF37]/30 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#D4AF37]/20 pb-4">
            <div>
              <span className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider">
                Unbroken Lines of Transmission (Isnād)
              </span>
              <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-[#F8F9FA] mt-1">
                The Three Indigenous Rationalist Traditions
              </h3>
            </div>

            {/* Branch Switcher */}
            <div className="flex bg-[#060E1D] p-1 rounded-xl border border-[#D4AF37]/25">
              {HISTORICAL_ARCHAEOLOGY.branches.map((b) => (
                <button
                  key={b.id}
                  id={`archaeology-branch-${b.id}`}
                  onClick={() => setSelectedBranchId(b.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedBranchId === b.id
                      ? "bg-[#D4AF37] text-[#060E1D] shadow-sm font-bold"
                      : "text-[#CBD5E1] hover:text-[#F8F9FA]"
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active Branch Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#060E1D] text-[#D4AF37] border border-[#D4AF37]/30">
                  {activeBranch.dating}
                </span>
                <span className="text-xs text-[#94A3B8]">
                  Founders: {activeBranch.founders}
                </span>
              </div>

              <h4 className="text-xl font-bold text-[#F8F9FA] font-cinzel">
                {activeBranch.tradition}
              </h4>

              <div className="p-4 rounded-xl bg-[#060E1D] border border-[#D4AF37]/20">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                  Metaphysics & Causal Physics (Daqīq al-Kalām):
                </span>
                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  {activeBranch.metaphysics}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#060E1D] border border-[#D4AF37]/20">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F3E5AB] block mb-1">
                  Civic & Political Principle:
                </span>
                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  {activeBranch.politicalStance}
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#060E1D] rounded-xl p-5 border border-[#D4AF37]/25">
              <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-wider mb-2">
                <FileText className="w-4 h-4 text-[#D4AF37]" />
                <span>Manuscript Preservation</span>
              </div>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                {activeBranch.manuscriptPreservation}
              </p>
              <div className="mt-4 pt-3 border-t border-[#D4AF37]/15 text-[11px] text-[#94A3B8]">
                All three traditions predate the Abbasid translations of Aristotle and Plato by decades, proving the indigenous Islamic origins of rationalism.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
