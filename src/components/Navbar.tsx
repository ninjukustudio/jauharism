import React, { useState, useRef, useEffect } from "react";
import { User } from "firebase/auth";
import {
  Compass,
  Sparkles,
  BookOpen,
  Layers,
  History,
  TableProperties,
  Library,
  ChevronDown,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { HeaderLogo } from "./HeaderLogo.tsx";
import { PWAInstallButton } from "./PWAInstallButton.tsx";
import { logOutUser } from "../services/firebase.ts";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAIQuestion?: () => void;
  currentUser?: User | null;
  onOpenAuth?: (mode?: "signin" | "signup", contextMsg?: string) => void;
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
  currentUser = null,
  onOpenAuth,
}) => {
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Grouped archival items for decluttered PC navigation in Manifesto section order (Sections 4, 5, 6)
  const archiveItems: ArchiveItem[] = [
    {
      id: "matrix",
      label: "Summary Matrix",
      sublabel: "Section 4 • Comparative theological evaluation",
      icon: TableProperties,
    },
    {
      id: "blueprint",
      label: "Action Blueprint",
      sublabel: "Section 5 • Civilizational reform roadmap",
      icon: BookOpen,
    },
    {
      id: "bibliography",
      label: "Primary Bibliography",
      sublabel: "Section 6 • Classical manuscripts & sources",
      icon: Library,
    },
  ];

  // Mobile navigation items in exact Manifesto section order (Sections 1-6 + Tools)
  const allNavItems = [
    { id: "triad", label: "The Triad", icon: Compass },
    { id: "archaeology", label: "Lineage", icon: History },
    { id: "axioms", label: "7 Axioms", icon: Layers },
    { id: "matrix", label: "Matrix", icon: TableProperties },
    { id: "blueprint", label: "Blueprint", icon: BookOpen },
    { id: "bibliography", label: "Sources", icon: Library },
    { id: "qa", label: "Q&A Gateway", icon: Sparkles, highlight: true },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  const isArchiveActive = archiveItems.some((item) => item.id === activeTab);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsArchiveOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsArchiveOpen(false);
        setIsUserMenuOpen(false);
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
    <header className="sticky top-0 z-50 bg-[#060E1D]/95 backdrop-blur-md border-b border-[#D4AF37]/25 text-[#F8F9FA] transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
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

          {/* Decluttered PC Navigation in Navy & Gold in Manifesto Section Order */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            {/* 1. Section 1: The Triad */}
            <button
              id="nav-item-triad"
              onClick={() => setActiveTab("triad")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "triad"
                  ? "bg-[#0A192F] text-[#F3E5AB] shadow-sm border border-[#D4AF37]/50 font-semibold"
                  : "text-[#CBD5E1] hover:text-[#F8F9FA] hover:bg-[#0A192F]/60"
              }`}
            >
              <Compass
                className={`w-3.5 h-3.5 ${
                  activeTab === "triad" ? "text-[#D4AF37]" : "text-[#94A3B8]"
                }`}
              />
              <span>The Triad</span>
            </button>

            {/* 2. Section 2: Basran Lineage */}
            <button
              id="nav-item-archaeology"
              onClick={() => setActiveTab("archaeology")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "archaeology"
                  ? "bg-[#0A192F] text-[#F3E5AB] shadow-sm border border-[#D4AF37]/50 font-semibold"
                  : "text-[#CBD5E1] hover:text-[#F8F9FA] hover:bg-[#0A192F]/60"
              }`}
            >
              <History
                className={`w-3.5 h-3.5 ${
                  activeTab === "archaeology" ? "text-[#D4AF37]" : "text-[#94A3B8]"
                }`}
              />
              <span>Basran Lineage</span>
            </button>

            {/* 3. Section 3: The 7 Axioms */}
            <button
              id="nav-item-axioms"
              onClick={() => setActiveTab("axioms")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "axioms"
                  ? "bg-[#0A192F] text-[#F3E5AB] shadow-sm border border-[#D4AF37]/50 font-semibold"
                  : "text-[#CBD5E1] hover:text-[#F8F9FA] hover:bg-[#0A192F]/60"
              }`}
            >
              <Layers
                className={`w-3.5 h-3.5 ${
                  activeTab === "axioms" ? "text-[#D4AF37]" : "text-[#94A3B8]"
                }`}
              />
              <span>7 Axioms</span>
            </button>

            {/* 4. Sections 4–6: Archive & Action Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="nav-item-archive-dropdown-btn"
                type="button"
                onClick={() => setIsArchiveOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isArchiveActive
                    ? "bg-[#0A192F] text-[#F3E5AB] border border-[#D4AF37]/50 font-semibold"
                    : isArchiveOpen
                    ? "bg-[#0A192F]/80 text-[#F8F9FA]"
                    : "text-[#CBD5E1] hover:text-[#F8F9FA] hover:bg-[#0A192F]/60"
                }`}
                aria-expanded={isArchiveOpen}
                aria-haspopup="true"
              >
                <BookOpen
                  className={`w-3.5 h-3.5 ${
                    isArchiveActive ? "text-[#D4AF37]" : "text-[#94A3B8]"
                  }`}
                />
                <span>Archive & Action</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isArchiveOpen ? "rotate-180 text-[#D4AF37]" : "text-[#94A3B8]"
                  }`}
                />
              </button>

              {/* Glassmorphic Dropdown Panel in Navy & Gold */}
              {isArchiveOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-xl bg-[#0A192F]/98 backdrop-blur-xl border border-[#D4AF37]/40 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 mb-1 border-b border-[#D4AF37]/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                      Manifesto Archives & Blueprint
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
                            ? "bg-[#D4AF37]/15 text-[#F3E5AB] border border-[#D4AF37]/40"
                            : "hover:bg-[#0E2445] text-[#CBD5E1] hover:text-[#F8F9FA]"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isCurrent
                              ? "bg-[#D4AF37]/25 text-[#D4AF37]"
                              : "bg-[#060E1D] text-[#94A3B8] border border-[#D4AF37]/20"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold leading-tight flex items-center gap-1.5">
                            <span>{item.label}</span>
                            {isCurrent && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#94A3B8] leading-snug mt-0.5">
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
                  ? "bg-[#D4AF37] text-[#060E1D] shadow-md border border-[#F3E5AB] font-bold"
                  : "text-[#F3E5AB] hover:text-[#FFF8DC] hover:bg-[#0A192F] border border-[#D4AF37]/40"
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${activeTab === "qa" ? "text-[#060E1D]" : "text-[#D4AF37]"}`} />
              <span>Q&A Gateway</span>
            </button>

            {/* 5. User Dashboard & Auth Portal */}
            <button
              id="nav-item-dashboard"
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "dashboard"
                  ? "bg-[#0A192F] text-[#F3E5AB] shadow-sm border border-[#D4AF37]/50 font-semibold"
                  : "text-[#CBD5E1] hover:text-[#F8F9FA] hover:bg-[#0A192F]/60 border border-transparent"
              }`}
            >
              <LayoutDashboard
                className={`w-3.5 h-3.5 ${
                  activeTab === "dashboard" ? "text-[#D4AF37]" : "text-[#94A3B8]"
                }`}
              />
              <span>Dashboard</span>
            </button>
          </nav>

          {/* Right Action Icons & Scholar Auth Indicator */}
          <div className="flex items-center gap-2.5">
            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* User Profile / Auth Toggle */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-[#0A192F] hover:bg-[#0E2445] border border-[#D4AF37]/40 text-[#F8F9FA] transition-all shadow-sm"
                  title="Scholar Profile"
                >
                  <div className="w-6 h-6 rounded-full bg-[#060E1D] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] text-xs font-bold font-cinzel">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : currentUser.email ? currentUser.email[0].toUpperCase() : "S"}
                  </div>
                  <span className="text-xs font-semibold max-w-[80px] sm:max-w-[120px] truncate hidden sm:inline">
                    {currentUser.displayName || currentUser.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#D4AF37]" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0A192F] border border-[#D4AF37]/40 shadow-2xl p-1.5 z-50 animate-in fade-in duration-150">
                    <div className="px-3 py-2 border-b border-[#D4AF37]/20">
                      <p className="text-xs font-semibold text-[#F8F9FA] truncate">
                        {currentUser.displayName || "Scholar"}
                      </p>
                      <p className="text-[11px] text-[#94A3B8] truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab("dashboard");
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#CBD5E1] hover:text-[#F8F9FA] hover:bg-[#0E2445] rounded-lg transition-colors text-left"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Inquiries Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        logOutUser();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-300 hover:text-red-200 hover:bg-red-950/40 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth && onOpenAuth("signin")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A192F] hover:bg-[#0E2445] border border-[#D4AF37]/50 text-[#F3E5AB] text-xs font-semibold transition-all shadow-sm"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Scroll Strip in Navy & Gold */}
        <div className="lg:hidden flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar border-t border-[#D4AF37]/15">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  isSelected
                    ? item.highlight
                      ? "bg-[#D4AF37] text-[#060E1D] font-bold"
                      : "bg-[#0A192F] text-[#F3E5AB] border border-[#D4AF37]/50 font-semibold"
                    : "text-[#CBD5E1] hover:text-[#F8F9FA] hover:bg-[#0A192F]/60"
                }`}
              >
                <Icon
                  className={`w-3 h-3 ${
                    isSelected
                      ? item.highlight
                        ? "text-[#060E1D]"
                        : "text-[#D4AF37]"
                      : "text-[#94A3B8]"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
