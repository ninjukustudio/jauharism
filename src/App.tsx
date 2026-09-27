import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { initAuth } from "./services/firebase.ts";
import { Navbar } from "./components/Navbar.tsx";
import { HeroBanner } from "./components/HeroBanner.tsx";
import { AxiomsExplorer } from "./components/AxiomsExplorer.tsx";
import { TriadDeepDive } from "./components/TriadDeepDive.tsx";
import { HistoricalArchaeology } from "./components/HistoricalArchaeology.tsx";
import { SummaryMatrix } from "./components/SummaryMatrix.tsx";
import { StrategicBlueprint } from "./components/StrategicBlueprint.tsx";
import { PrimaryBibliography } from "./components/PrimaryBibliography.tsx";
import { QAModule } from "./components/QAModule.tsx";
import { UserDashboard } from "./components/UserDashboard.tsx";
import { AuthModal } from "./components/AuthModal.tsx";
import { Footer } from "./components/Footer.tsx";
import { SEVEN_AXIOMS } from "./data/manifestoData.ts";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("axioms");
  const [qaInitialQuestion, setQaInitialQuestion] = useState<string>("");
  const [qaInitialAxiomId, setQaInitialAxiomId] = useState<string>("");

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");
  const [authContextMessage, setAuthContextMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenAuth = (
    mode: "signin" | "signup" = "signin",
    contextMsg: string | null = null
  ) => {
    setAuthModalMode(mode);
    setAuthContextMessage(contextMsg);
    setIsAuthModalOpen(true);
  };

  const handleAskAboutAxiom = (axiomId: string, axiomTitle: string) => {
    const axiom = SEVEN_AXIOMS.find((a) => a.id === axiomId);
    setQaInitialAxiomId(axiomId);
    setQaInitialQuestion(
      axiom
        ? `How does Axiom ${axiom.number} (${axiom.latinTitle}: ${axiom.title}) resolve key traditionalist objections and harmonize revelation with modern reality?`
        : `How does ${axiomTitle} function in Project Jauhari?`
    );
    setActiveTab("qa");

    setTimeout(() => {
      const qaElem = document.getElementById("qa-module-section");
      if (qaElem) {
        qaElem.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleAskAIMatrix = (axiomName: string) => {
    setQaInitialQuestion(
      `Please explain the epistemological proof and scriptural anchor for ${axiomName} in Project Jauhari.`
    );
    setActiveTab("qa");
    setTimeout(() => {
      const qaElem = document.getElementById("qa-module-section");
      if (qaElem) {
        qaElem.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleNavigateToAxiomFromFaq = (axiomNumber: string) => {
    setActiveTab("axioms");
    setTimeout(() => {
      const axiomElem = document.getElementById("axioms-explorer-section");
      if (axiomElem) {
        axiomElem.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060E1D] text-[#F8F9FA] font-sans selection:bg-[#D4AF37] selection:text-[#060E1D]">
      {/* Navigation in Navy & Gold */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onOpenAIQuestion={() => {
          setActiveTab("qa");
          const qaElem = document.getElementById("qa-module-section");
          if (qaElem) qaElem.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <main className="flex-grow">
        {/* Hero Banner with Preamble & Triad (shown on home/axioms/triad or general views) */}
        {activeTab !== "dashboard" && (
          <HeroBanner
            onExploreAxioms={() => {
              setActiveTab("axioms");
              const elem = document.getElementById("axioms-explorer-section");
              if (elem) elem.scrollIntoView({ behavior: "smooth" });
            }}
            onOpenQA={() => {
              setActiveTab("qa");
              const elem = document.getElementById("qa-module-section");
              if (elem) elem.scrollIntoView({ behavior: "smooth" });
            }}
          />
        )}

        {/* Content based on Active Tab */}
        {activeTab === "axioms" && (
          <>
            <AxiomsExplorer onAskAboutAxiom={handleAskAboutAxiom} />
            <SummaryMatrix
              onSelectAxiom={() => {
                setActiveTab("axioms");
                window.scrollTo({ top: 400, behavior: "smooth" });
              }}
              onAskAI={handleAskAIMatrix}
            />
          </>
        )}

        {activeTab === "triad" && <TriadDeepDive />}

        {activeTab === "archaeology" && <HistoricalArchaeology />}

        {activeTab === "matrix" && (
          <SummaryMatrix
            onSelectAxiom={() => {
              setActiveTab("axioms");
              window.scrollTo({ top: 400, behavior: "smooth" });
            }}
            onAskAI={handleAskAIMatrix}
          />
        )}

        {activeTab === "blueprint" && <StrategicBlueprint />}

        {activeTab === "bibliography" && <PrimaryBibliography />}

        {activeTab === "qa" && (
          <QAModule
            initialQuestion={qaInitialQuestion}
            initialAxiomId={qaInitialAxiomId}
            onNavigateToAxiom={handleNavigateToAxiomFromFaq}
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onViewDashboard={() => setActiveTab("dashboard")}
          />
        )}

        {/* Protected User Dashboard */}
        {activeTab === "dashboard" && (
          <UserDashboard
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onNavigateToQA={(question, axiomId) => {
              if (question) setQaInitialQuestion(question);
              if (axiomId) setQaInitialAxiomId(axiomId);
              setActiveTab("qa");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </main>

      {/* Global Scholar Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        contextMessage={authContextMessage}
      />

      {/* Footer in Navy & Gold */}
      <Footer
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}
