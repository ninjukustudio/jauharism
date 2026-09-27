import React, { useState } from "react";
import { BIBLIOGRAPHY_ENTRIES } from "../data/manifestoData.ts";
import { Library, Search, BookOpen, Bookmark } from "lucide-react";

export const PrimaryBibliography: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "All",
    "Classical Hadith",
    "Kalam & Theology",
    "Zaydi & Ibadi Primary",
    "Historical & Sectarian",
  ];

  const filteredEntries = BIBLIOGRAPHY_ENTRIES.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.work.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.citations.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.relevance.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="bibliography-section" className="py-14 bg-[#060E1D] text-[#F8F9FA] border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3.5 py-1 rounded-full border border-[#D4AF37]/30">
            Section 6 of Manifesto
          </span>
          <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#F8F9FA] mt-2">
            Primary Bibliography & Archival Sources
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Original codices, early kalām manuscripts, classical hadith compilations, and historical treatises underpinning Project Jauhari.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 bg-[#0A192F] p-1 rounded-xl border border-[#D4AF37]/25 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`bib-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#D4AF37] text-[#060E1D] shadow-sm font-bold"
                    : "text-[#CBD5E1] hover:text-[#F8F9FA]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="bib-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search author, work, hadith..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#0A192F] border border-[#D4AF37]/30 rounded-xl text-[#F8F9FA] placeholder-[#64748B] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Bibliography Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-[#0A192F] rounded-2xl p-5 border border-[#D4AF37]/30 shadow-xl flex flex-col justify-between hover:border-[#D4AF37]/60 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      entry.category === "Classical Hadith"
                        ? "bg-[#D4AF37]/15 text-[#F3E5AB] border border-[#D4AF37]/40"
                        : entry.category === "Kalam & Theology"
                        ? "bg-[#060E1D] text-cyan-300 border border-cyan-500/40"
                        : entry.category === "Zaydi & Ibadi Primary"
                        ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
                        : "bg-[#060E1D] text-[#D4AF37] border border-[#D4AF37]/30"
                    }`}
                  >
                    {entry.category}
                  </span>
                  {entry.arabicWork && (
                    <span className="font-amiri text-xs font-bold text-[#D4AF37]">
                      {entry.arabicWork}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-[#F8F9FA] leading-snug font-cinzel">
                  {entry.work}
                </h4>
                <p className="text-xs font-medium text-[#F3E5AB] mb-3">
                  {entry.author}
                </p>

                <div className="p-2.5 rounded-lg bg-[#060E1D] border border-[#D4AF37]/20 mb-3">
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-0.5">
                    Cited Narration / Edition:
                  </span>
                  <p className="text-xs text-[#CBD5E1] font-mono">
                    {entry.citations}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D4AF37]/20">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">
                  Epistemological Relevance:
                </span>
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  {entry.relevance}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="p-8 text-center text-[#94A3B8] text-xs bg-[#0A192F] rounded-xl border border-[#D4AF37]/30">
            No bibliography entries match the current filter.
          </div>
        )}
      </div>
    </section>
  );
};
