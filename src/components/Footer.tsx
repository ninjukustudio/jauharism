import React from "react";
import { Scale, BookOpen, Sparkles } from "lucide-react";

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-[#060E1D] text-[#94A3B8] py-12 border-t border-[#D4AF37]/20 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[#D4AF37]/15">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0A192F] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center font-cinzel font-bold text-sm shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                J
              </div>
              <span className="font-cinzel font-bold text-[#F8F9FA] text-sm tracking-wider">
                PROJECT JAUHARI
              </span>
            </div>
            <p className="text-[#94A3B8] text-xs leading-relaxed max-w-md">
              A comprehensive manifesto for rational Islamic revivalism, reclaiming absolute transcendence (tanzīh), causal realism (asbāb), empirical verification (taṣḥīḥ), and meritocratic consultation (shūrā) rooted in the 1st-century Basran synthesis.
            </p>
          </div>

          <div>
            <h4 className="text-[#D4AF37] font-bold uppercase tracking-wider text-[11px] mb-3">
              Manifesto Sections
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab("axioms")}
                  className="hover:text-[#F8F9FA] transition-colors"
                >
                  The Seven Main Axioms
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("triad")}
                  className="hover:text-[#F8F9FA] transition-colors"
                >
                  The Triad (Jawhar, Jauh Hari, Jauhari)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("archaeology")}
                  className="hover:text-[#F8F9FA] transition-colors"
                >
                  Historical Archaeology: Basran Synthesis
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("matrix")}
                  className="hover:text-[#F8F9FA] transition-colors"
                >
                  Summary Comparative Matrix
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#D4AF37] font-bold uppercase tracking-wider text-[11px] mb-3">
              Action & Research
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab("blueprint")}
                  className="hover:text-[#F8F9FA] transition-colors"
                >
                  Implementation Blueprint
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("bibliography")}
                  className="hover:text-[#F8F9FA] transition-colors"
                >
                  Primary Classical Bibliography
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("qa")}
                  className="text-[#D4AF37] hover:text-[#F3E5AB] transition-colors flex items-center gap-1 font-semibold"
                >
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Q&A & AI Synthesizer</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("dashboard")}
                  className="text-[#CBD5E1] hover:text-[#F8F9FA] transition-colors flex items-center gap-1"
                >
                  <span>Scholar Dashboard</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[#94A3B8] text-[11px]">
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
