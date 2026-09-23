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
    <section id="summary-matrix-section" className="py-14 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              Section 4 of Manifesto
            </span>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-stone-900 mt-2">
              Summary Matrix of the Seven Axioms
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              Comparative matrix correlating scriptural anchors, historical baselines, modern scientific disciplines, and traditionalist occasionalist contrasts.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="matrix-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search concepts, verses, sciences..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>

        {/* Matrix Table */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-stone-900 text-stone-100 font-cinzel text-xs tracking-wider border-b border-stone-800">
                  <th className="py-3.5 px-4 font-bold">Axiom</th>
                  <th className="py-3.5 px-4 font-bold">Core Concept</th>
                  <th className="py-3.5 px-4 font-bold">Quranic Anchor</th>
                  <th className="py-3.5 px-4 font-bold">Sunnah / Historical</th>
                  <th className="py-3.5 px-4 font-bold">Scientific & Civic Alignment</th>
                  <th className="py-3.5 px-4 font-bold">Traditionalist Contrast</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRows.map((row) => (
                  <tr key={row.number} className="hover:bg-stone-50/80 transition-colors">
                    {/* Axiom Number & Name */}
                    <td className="py-4 px-4 font-medium text-stone-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded flex items-center justify-center bg-stone-100 text-stone-800 font-cinzel font-bold text-xs border border-stone-200">
                          {row.number}
                        </span>
                        <div>
                          <div className="font-bold text-xs">{row.name}</div>
                          <div className="text-[10px] text-stone-500 font-mono">{row.latinTitle}</div>
                        </div>
                      </div>
                    </td>

                    {/* Core Concept */}
                    <td className="py-4 px-4 text-xs text-stone-700 max-w-[220px]">
                      {row.coreConcept}
                    </td>

                    {/* Primary Quran Anchor */}
                    <td className="py-4 px-4 text-xs text-stone-800 font-medium whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/60 block text-[11px]">
                        {row.primaryQuranAnchor}
                      </span>
                    </td>

                    {/* Primary Sunnah Anchor */}
                    <td className="py-4 px-4 text-xs text-stone-700 max-w-[180px]">
                      {row.primarySunnahAnchor}
                    </td>

                    {/* Modern Alignment */}
                    <td className="py-4 px-4 text-xs text-stone-800 max-w-[200px]">
                      <span className="text-[11px] font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 block">
                        {row.modernAlignment}
                      </span>
                    </td>

                    {/* Traditionalist Contrast */}
                    <td className="py-4 px-4 text-[11px] text-rose-800 bg-rose-50/30 max-w-[200px]">
                      {row.traditionalistContrast}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`matrix-view-btn-${row.number}`}
                          onClick={() => onSelectAxiom(row.number)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                          title="View Full Axiom"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          id={`matrix-ask-btn-${row.number}`}
                          onClick={() => onAskAI(row.name)}
                          className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded transition-colors"
                          title="Ask AI on this Axiom"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRows.length === 0 && (
            <div className="p-8 text-center text-stone-500 text-xs">
              No matching axioms found for "{searchTerm}".
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
