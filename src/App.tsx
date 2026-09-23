import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar.tsx";
import { HeroBanner } from "./components/HeroBanner.tsx";
import { AxiomsExplorer } from "./components/AxiomsExplorer.tsx";
import { TriadDeepDive } from "./components/TriadDeepDive.tsx";
import { HistoricalArchaeology } from "./components/HistoricalArchaeology.tsx";
import { SummaryMatrix } from "./components/SummaryMatrix.tsx";
import { StrategicBlueprint } from "./components/StrategicBlueprint.tsx";
import { PrimaryBibliography } from "./components/PrimaryBibliography.tsx";
import { QAModule } from "./components/QAModule.tsx";
import { Footer } from "./components/Footer.tsx";
import { SEVEN_AXIOMS } from "./data/manifestoData.ts";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("axioms");
  const [qaInitialQuestion, setQaInitialQuestion] = useState<string>("");
  const [qaInitialAxiomId, setQaInitialAxiomId] = useState<string>("");

  const handleAskAboutAxiom = (axiomId: string, axiomTitle: string) => {
    const axiom = SEVEN_AXIOMS.find((a) => a.id === axiomId);
    setQaInitialAxiomId(axiomId);
    setQaInitialQuestion(
      axiom
        ? `How does Axiom ${axiom.number} (${axiom.latinTitle}: ${axiom.title}) resolve key traditionalist objections and harmonize revelation with modern reality?`
        : `How does ${axiomTitle} function in Project Jauhari?`
    );
    setActiveTab("qa");

    // Scroll smoothly to Q&A section
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
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAIQuestion={() => {
          setActiveTab("qa");
          const qaElem = document.getElementById("qa-module-section");
          if (qaElem) qaElem.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <main className="flex-grow">
        {/* Hero Banner with Preamble & Triad */}
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

        {/* Content based on Active Tab or All View */}
        {activeTab === "axioms" && (
          <>
            <AxiomsExplorer onAskAboutAxiom={handleAskAboutAxiom} />
            <SummaryMatrix
              onSelectAxiom={(num) => {
                setActiveTab("axioms");
                window.scrollTo({ top: 400, behavior: "smooth" });
              }}
              onAskAI={handleAskAIMatrix}
            />
          </>
        )}

        {activeTab === "triad" && (
          <TriadDeepDive />
        )}

        {activeTab === "archaeology" && (
          <HistoricalArchaeology />
        )}

        {activeTab === "matrix" && (
          <SummaryMatrix
            onSelectAxiom={(num) => {
              setActiveTab("axioms");
              window.scrollTo({ top: 400, behavior: "smooth" });
            }}
            onAskAI={handleAskAIMatrix}
          />
        )}

        {activeTab === "blueprint" && (
          <StrategicBlueprint />
        )}

        {activeTab === "bibliography" && (
          <PrimaryBibliography />
        )}

        {activeTab === "qa" && (
          <QAModule
            initialQuestion={qaInitialQuestion}
            initialAxiomId={qaInitialAxiomId}
            onNavigateToAxiom={handleNavigateToAxiomFromFaq}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }} />
    </div>
  );
}
