import React, { useState, useRef, useEffect } from "react";
import {
  Compass,
  Sparkles,
  BookOpen,
  Layers,
  History,
  TableProperties,
  Library,
  ChevronDown,
} from "lucide-react";
import { HeaderLogo } from "./HeaderLogo.tsx";
import { PWAInstallButton } from "./PWAInstallButton.tsx";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAIQuestion?: () => void;
}

interface ArchiveItem {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAIQuestion,
}) => {
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Grouped archival items for decluttered PC navigation
  const archiveItems: ArchiveItem[] = [
    {
      id: "matrix",
      label: "Summary Matrix",
      sublabel: "Comparative theological evaluation",
      icon: TableProperties,
    },
    {
      id: "archaeology",
      label: "Basran Lineage",
      sublabel: "Historical archaeology & genealogy",
      icon: History,
    },
    {
      id: "blueprint",
      label: "Action Blueprint",
      sublabel: "Civilizational reform roadmap",
      icon: BookOpen,
    },
    {
      id: "bibliography",
      label: "Bibliography",
      sublabel: "Primary classical manuscripts & sources",
      icon: Library,
    },
  ];

  // Mobile flat nav items
  const allNavItems = [
    { id: "axioms", label: "7 Axioms", icon: Layers },
    { id: "triad", label: "The Triad", icon: Compass },
    { id: "matrix", label: "Matrix", icon: TableProperties },
    { id: "archaeology", label: "Lineage", icon: History },
    { id: "blueprint", label: "Blueprint", icon: BookOpen },
    { id: "bibliography", label: "Sources", icon: Library },
    { id: "qa", label: "Q&A Gateway", icon: Sparkles, highlight: true },
  ];

  const isArchiveActive = archiveItems.some((item) => item.id === activeTab);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsArchiveOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsArchiveOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelectArchive = (id: string) => {
    setActiveTab(id);
    setIsArchiveOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Identity using the provided Project Jauhari emblem & typography */}
          <button
            id="nav-logo-btn"
            onClick={() => {
              setActiveTab("axioms");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center text-left focus:outline-none group py-1"
            title="Project Jauhari - Islamic Rationalism Revival Framework"
          >
            <HeaderLogo className="h-16 sm:h-17 w-auto max-w-[270px] sm:max-w-[300px] transition-transform duration-200 group-hover:scale-[1.02]" />
          </button>

          {/* Decluttered PC Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            {/* 1. The 7 Axioms */}
            <button
              id="nav-item-axioms"
              onClick={() => setActiveTab("axioms")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "axioms"
                  ? "bg-stone-800 text-amber-300 shadow-sm border border-stone-700 font-semibold"
                  : "text-stone-300 hover:text-white hover:bg-stone-800/60"
              }`}
            >
              <Layers
                className={`w-3.5 h-3.5 ${
                  activeTab === "axioms" ? "text-amber-400" : "text-stone-400"
                }`}
              />
              <span>7 Axioms</span>
            </button>

            {/* 2. The Triad */}
            <button
              id="nav-item-triad"
              onClick={() => setActiveTab("triad")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "triad"
                  ? "bg-stone-800 text-amber-300 shadow-sm border border-stone-700 font-semibold"
                  : "text-stone-300 hover:text-white hover:bg-stone-800/60"
              }`}
            >
              <Compass
                className={`w-3.5 h-3.5 ${
                  activeTab === "triad" ? "text-amber-400" : "text-stone-400"
                }`}
              />
              <span>The Triad</span>
            </button>

            {/* 3. Archival & Lineage Dropdown (Groups Matrix, Lineage, Blueprint, Bibliography) */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="nav-item-archive-dropdown-btn"
                type="button"
                onClick={() => setIsArchiveOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isArchiveActive
                    ? "bg-stone-800 text-amber-300 border border-stone-700 font-semibold"
                    : isArchiveOpen
                    ? "bg-stone-800/80 text-stone-100"
                    : "text-stone-300 hover:text-white hover:bg-stone-800/60"
                }`}
                aria-expanded={isArchiveOpen}
                aria-haspopup="true"
              >
                <BookOpen
                  className={`w-3.5 h-3.5 ${
                    isArchiveActive ? "text-amber-400" : "text-stone-400"
                  }`}
                />
                <span>Archive & Lineage</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isArchiveOpen ? "rotate-180 text-amber-400" : "text-stone-400"
                  }`}
                />
              </button>

              {/* Glassmorphic Dropdown Panel */}
              {isArchiveOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-xl bg-stone-900/98 backdrop-blur-xl border border-stone-750 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 mb-1 border-b border-stone-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80">
                      Historical & Strategic Archives
                    </span>
                  </div>
                  {archiveItems.map((item) => {
                    const Icon = item.icon;
                    const isCurrent = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`nav-archive-item-${item.id}`}
                        onClick={() => handleSelectArchive(item.id)}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-all ${
                          isCurrent
                            ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                            : "hover:bg-stone-800 text-stone-200 hover:text-white"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isCurrent
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-stone-800 text-stone-400"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold leading-tight flex items-center gap-1.5">
                            <span>{item.label}</span>
                            {isCurrent && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-400 leading-snug mt-0.5">
                            {item.sublabel}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Q&A Gateway */}
            <button
              id="nav-item-qa"
              onClick={() => setActiveTab("qa")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "qa"
                  ? "bg-amber-950/60 text-amber-300 shadow-sm border border-amber-500/50 font-semibold"
                  : "text-amber-300/90 hover:text-amber-200 hover:bg-amber-950/30 border border-amber-500/20"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Q&A Gateway</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            </button>
          </nav>

          {/* Right Action Bar: PWA Install Button + Ask AI CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PWA In-App Install Button */}
            <PWAInstallButton />

            {/* Direct Ask AI Action Button */}
            <button
              id="header-ask-ai-btn"
              onClick={() => {
                setActiveTab("qa");
                if (onOpenAIQuestion) onOpenAIQuestion();
              }}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:shadow-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-950" />
              <span className="hidden sm:inline">Ask Jauhari AI</span>
              <span className="sm:hidden">Ask AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar with clean horizontal scrolling */}
      <div className="lg:hidden overflow-x-auto py-2 px-4 border-t border-stone-800/80 bg-stone-950/90 flex items-center gap-1.5 text-xs dark-scrollbar">
        {allNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md whitespace-nowrap font-medium transition-colors ${
                isActive
                  ? "bg-stone-800 text-amber-300 border border-stone-700"
                  : item.highlight
                  ? "text-amber-300/90 bg-amber-950/30 border border-amber-500/20"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
