import React, { useState } from "react";
import { BIBLIOGRAPHY_ENTRIES } from "../data/manifestoData.ts";
import { Library, Search, BookOpen, Bookmark } from "lucide-react";

export const PrimaryBibliography: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("" );

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
    <section id="bibliography-section" className="py-14 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-300">
            Section 6 of Manifesto
          </span>
          <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-stone-900 mt-2">
            Primary Bibliography & Archival Sources
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Original codices, early kalām manuscripts, classical hadith compilations, and historical treatises underpinning Project Jauhari.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`bib-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-stone-900 text-stone-100 shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="bib-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search author, work, hadith..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>

        {/* Bibliography Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-stone-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      entry.category === "Classical Hadith"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : entry.category === "Kalam & Theology"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : entry.category === "Zaydi & Ibadi Primary"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-purple-100 text-purple-800 border border-purple-200"
                    }`}
                  >
                    {entry.category}
                  </span>
                  {entry.arabicWork && (
                    <span className="font-amiri text-xs font-bold text-stone-400">
                      {entry.arabicWork}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-stone-900 leading-snug">
                  {entry.work}
                </h4>
                <p className="text-xs font-medium text-stone-600 mb-3">
                  {entry.author}
                </p>

                <div className="p-2.5 rounded bg-stone-50 border border-stone-100 mb-3">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block mb-0.5">
                    Cited Narration / Edition:
                  </span>
                  <p className="text-xs text-stone-700 font-mono">
                    {entry.citations}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <span className="text-[10px] uppercase font-bold text-stone-500 block mb-1">
                  Epistemological Relevance:
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {entry.relevance}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="p-8 text-center text-stone-500 text-xs bg-white rounded-xl border border-stone-200">
            No bibliography entries match the current filter.
          </div>
        )}
      </div>
    </section>
  );
};
