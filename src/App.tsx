import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { initAuth, StoredInquiry } from "./services/firebase.ts";
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
  const [selectedAxiomId, setSelectedAxiomId] = useState<string>("axiom-i");
  const [qaInitialQuestion, setQaInitialQuestion] = useState<string>("");
  const [qaInitialAxiomId, setQaInitialAxiomId] = useState<string>("");
  const [dashboardTargetInquiry, setDashboardTargetInquiry] = useState<StoredInquiry | null>(null);

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

  const handleAskAIMatrix = (axiomNumber: string, axiomName: string) => {
    const matchedAxiom = SEVEN_AXIOMS.find(
      (a) =>
        a.number.toUpperCase() === axiomNumber.trim().toUpperCase() ||
        a.id.toLowerCase() === axiomNumber.trim().toLowerCase() ||
        a.title.toLowerCase().includes(axiomName.toLowerCase()) ||
        a.latinTitle.toLowerCase().includes(axiomName.toLowerCase())
    );

    const axiomId = matchedAxiom ? matchedAxiom.id : "";

    const exampleInquiries: Record<string, string> = {
      "axiom-i":
        "How does Axiom I (Absolute Transcendence and Cosmic Order) establish natural laws (sunan Allāh) and refute anthropomorphic literalism?",
      "axiom-ii":
        "How does Axiom II (Objective Justice and Intrinsic Causality) establish moral free will and refute radical occasionalism?",
      "axiom-iii":
        "How does Axiom III (Epistemic Primacy of Intellect & Evidence) harmonize revelatory text (naql) with demonstrative logic (burhān) through linguistic taʾwīl?",
      "axiom-iv":
        "How does Axiom IV (Empirical Verification and Falsification) ground scientific inquiry and falsifiability in the classical date-palm pollination Hadith?",
      "axiom-v":
        "How does Axiom V (Ethical Teleology and Dynamic Adaptation) govern human welfare (maṣlaḥah) and ongoing institutional ijtihād?",
      "axiom-vi":
        "How does Axiom VI (Historical Lineage and Basran Synthesis) prove that rationalism was an indigenous 1st-century Basran tradition rather than Greek borrowing?",
      "axiom-vii":
        "How does Axiom VII (Meritocratic Civic Governance) formulate political authority as a revocable civic contract (bayʿah) and reject quietist submission to tyranny?",
    };

    const tailoredQuestion =
      (axiomId && exampleInquiries[axiomId]) ||
      `Please explain the epistemological proof and scriptural anchor for Axiom ${axiomNumber} (${axiomName}) in Project Jauhari, and how it resolves classical theological debates.`;

    setQaInitialAxiomId(axiomId);
    setQaInitialQuestion(tailoredQuestion);
    setActiveTab("qa");

    setTimeout(() => {
      const submissionCard =
        document.getElementById("qa-inquiry-submission-card") ||
        document.getElementById("qa-inquiry-textarea") ||
        document.getElementById("qa-module-section");

      if (submissionCard) {
        submissionCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      const textarea = document.getElementById("qa-inquiry-textarea") as HTMLTextAreaElement | null;
      if (textarea) {
        textarea.focus();
      }
    }, 120);
  };

  const handleSelectAxiomFromMatrix = (axiomIdentifier: string) => {
    const matched = SEVEN_AXIOMS.find(
      (a) =>
        a.number.toUpperCase() === axiomIdentifier.trim().toUpperCase() ||
        a.id.toLowerCase() === axiomIdentifier.trim().toLowerCase()
    );
    if (matched) {
      setSelectedAxiomId(matched.id);
    }
    setActiveTab("axioms");
    setTimeout(() => {
      const axiomElem = document.getElementById("axioms-explorer-section");
      if (axiomElem) {
        axiomElem.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 560, behavior: "smooth" });
      }
    }, 50);
  };

  const handleNavigateToAxiomFromFaq = (axiomNumber: string) => {
    handleSelectAxiomFromMatrix(axiomNumber);
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
          <AxiomsExplorer
            selectedAxiomId={selectedAxiomId}
            onSelectAxiomId={setSelectedAxiomId}
            onAskAboutAxiom={handleAskAboutAxiom}
          />
        )}

        {activeTab === "triad" && <TriadDeepDive />}

        {activeTab === "archaeology" && <HistoricalArchaeology />}

        {activeTab === "matrix" && (
          <SummaryMatrix
            onSelectAxiom={handleSelectAxiomFromMatrix}
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
            onViewDashboard={(targetData) => {
              if (targetData) {
                setDashboardTargetInquiry({
                  id: targetData.id,
                  userId: currentUser?.uid || "current-scholar",
                  question: targetData.question,
                  answer: targetData.answer,
                  focalAxiomId: targetData.focalAxiomId,
                  answerSource: targetData.answerSource || "gemini-3.6-flash",
                  isFallback: targetData.isFallback,
                  timestamp: targetData.timestamp || new Date().toISOString(),
                  isSaved: true,
                  savedAt: new Date().toISOString(),
                  savedToDrive: targetData.savedToDrive,
                  driveFileUrl: targetData.driveFileUrl,
                  driveFileName: targetData.driveFileName,
                });
              }
              setActiveTab("dashboard");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {/* Protected User Dashboard */}
        {activeTab === "dashboard" && (
          <UserDashboard
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            targetInquiry={dashboardTargetInquiry}
            targetInquiryId={dashboardTargetInquiry?.id}
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
