import React from "react";
import { Scale, BookOpen, Sparkles } from "lucide-react";

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-stone-850">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-cinzel font-bold text-sm">
                J
              </div>
              <span className="font-cinzel font-bold text-stone-100 text-sm tracking-wider">
                PROJECT JAUHARI
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-md">
              A comprehensive manifesto for rational Islamic revivalism, reclaiming absolute transcendence (tanzīh), causal realism (asbāb), empirical verification (taṣḥīḥ), and meritocratic consultation (shūrā) rooted in the 1st-century Basran synthesis.
            </p>
          </div>

          <div>
            <h4 className="text-stone-200 font-bold uppercase tracking-wider text-[11px] mb-3">
              Manifesto Sections
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab("axioms")}
                  className="hover:text-stone-200 transition-colors"
                >
                  The Seven Main Axioms
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("triad")}
                  className="hover:text-stone-200 transition-colors"
                >
                  The Triad (Jawhar, Jauh Hari, Jauhari)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("archaeology")}
                  className="hover:text-stone-200 transition-colors"
                >
                  Historical Archaeology: Basran Synthesis
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("matrix")}
                  className="hover:text-stone-200 transition-colors"
                >
                  Summary Comparative Matrix
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-stone-200 font-bold uppercase tracking-wider text-[11px] mb-3">
              Action & Research
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab("blueprint")}
                  className="hover:text-stone-200 transition-colors"
                >
                  Implementation Blueprint
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("bibliography")}
                  className="hover:text-stone-200 transition-colors"
                >
                  Primary Classical Bibliography
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("qa")}
                  className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Q&A & AI Synthesizer</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            Project Jauhari Manifesto • Epistemological Architecture of Rational Islamic Revival
          </div>
          <div>
            Derived from classical Medinan and Basran baselines of faith.
          </div>
        </div>
      </div>
    </footer>
  );
};
