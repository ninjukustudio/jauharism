import React, { useState } from "react";
import { SUMMARY_MATRIX_ROWS } from "../data/manifestoData.ts";
import { TableProperties, Search, Sparkles, ExternalLink } from "lucide-react";

interface SummaryMatrixProps {
  onSelectAxiom: (axiomNumber: string) => void;
  onAskAI: (axiomName: string) => void;
}

export const SummaryMatrix: React.FC<SummaryMatrixProps> = ({ onSelectAxiom, onAskAI }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredRows = SUMMARY_MATRIX_ROWS.filter(
    (row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.coreConcept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.modernAlignment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.traditionalistContrast.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.primaryQuranAnchor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="summary-matrix-section" className="py-14 bg-[#060E1D] text-[#F8F9FA] border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3.5 py-1 rounded-full border border-[#D4AF37]/30">
              Section 4 of Manifesto
            </span>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#F8F9FA] mt-2">
              Summary Matrix of the Seven Axioms
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-2xl">
              Comparative matrix correlating scriptural anchors, historical baselines, modern scientific disciplines, and traditionalist occasionalist contrasts.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="matrix-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search concepts, verses, sciences..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#0A192F] border border-[#D4AF37]/30 rounded-xl text-[#F8F9FA] placeholder-[#64748B] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Matrix Table */}
        <div className="bg-[#0A192F] rounded-2xl border border-[#D4AF37]/30 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-[#060E1D] text-[#F3E5AB] font-cinzel text-xs tracking-wider border-b border-[#D4AF37]/25">
                  <th className="py-3.5 px-4 font-bold">Axiom</th>
                  <th className="py-3.5 px-4 font-bold">Core Concept</th>
                  <th className="py-3.5 px-4 font-bold">Quranic Anchor</th>
                  <th className="py-3.5 px-4 font-bold">Sunnah / Historical</th>
                  <th className="py-3.5 px-4 font-bold">Scientific & Civic Alignment</th>
                  <th className="py-3.5 px-4 font-bold">Traditionalist Contrast</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/15">
                {filteredRows.map((row) => (
                  <tr key={row.number} className="hover:bg-[#0E2445]/50 transition-colors">
                    {/* Axiom Number & Name */}
                    <td className="py-4 px-4 font-medium text-[#F8F9FA] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded flex items-center justify-center bg-[#060E1D] text-[#D4AF37] font-cinzel font-bold text-xs border border-[#D4AF37]/30">
                          {row.number}
                        </span>
                        <div>
                          <div className="font-bold text-xs text-[#F8F9FA]">{row.name}</div>
                          <div className="text-[10px] text-[#94A3B8] font-mono">{row.latinTitle}</div>
                        </div>
                      </div>
                    </td>

                    {/* Core Concept */}
                    <td className="py-4 px-4 text-xs text-[#CBD5E1] max-w-[220px]">
                      {row.coreConcept}
                    </td>

                    {/* Primary Quran Anchor */}
                    <td className="py-4 px-4 text-xs text-[#F8F9FA] font-medium whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-[#060E1D] text-emerald-300 border border-emerald-500/30 block text-[11px]">
                        {row.primaryQuranAnchor}
                      </span>
                    </td>

                    {/* Primary Sunnah Anchor */}
                    <td className="py-4 px-4 text-xs text-[#CBD5E1] max-w-[180px]">
                      {row.primarySunnahAnchor}
                    </td>

                    {/* Scientific / Civic Alignment */}
                    <td className="py-4 px-4 text-xs text-[#CBD5E1] max-w-[200px]">
                      <span className="text-[#F3E5AB] font-semibold">{row.modernAlignment}</span>
                    </td>

                    {/* Traditionalist Contrast */}
                    <td className="py-4 px-4 text-xs text-red-300 max-w-[200px] leading-relaxed">
                      {row.traditionalistContrast}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectAxiom(row.number)}
                          className="px-2.5 py-1 rounded-lg bg-[#060E1D] hover:bg-[#0E2445] text-[#CBD5E1] hover:text-[#F8F9FA] border border-[#D4AF37]/25 text-xs transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onAskAI(row.name)}
                          className="p-1 rounded-lg bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#060E1D] transition-colors"
                          title="Ask AI regarding this Axiom"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
