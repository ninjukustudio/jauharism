export interface ScripturalEvidence {
  quote: string;
  arabic?: string;
  source: string;
  category: "quran" | "hadith" | "tradition";
  commentary?: string;
}

export interface AxiomData {
  id: string;
  number: string;
  title: string;
  arabicTitle: string;
  latinTitle: string;
  coreConcept: string;
  statement: string;
  corollaries: string[];
  textualEvidence: ScripturalEvidence[];
  traditionalistCounter: string;
  jauhariRebuttal: string;
  scientificCivicAlignment: string[];
  modernDisciplines: string;
  keywords: string[];
  accentColor: string;
}

export interface TriadFacet {
  id: "jawhar" | "jauh-hari" | "jauhari";
  title: string;
  arabic: string;
  subtitle: string;
  summary: string;
  philosophicalSignificance: string;
  manifestoRole: string;
}

export interface HistoricalFigure {
  name: string;
  arabicName: string;
  dates: string;
  role: string;
  transmission: string;
  corePrinciples: string[];
}

export interface HistoricalBranch {
  id: string;
  name: string;
  founders: string;
  dating: string;
  tradition: string;
  metaphysics: string;
  politicalStance: string;
  manuscriptPreservation: string;
}

export interface MatrixRow {
  number: string;
  name: string;
  latinTitle: string;
  coreConcept: string;
  primaryQuranAnchor: string;
  primarySunnahAnchor: string;
  modernAlignment: string;
  traditionalistContrast: string;
}

export interface FAQItem {
  id: string;
  question: string;
  category: "Theology & Metaphysics" | "Science & Causality" | "Epistemology & Reason" | "Governance & Ethics";
  summary: string;
  answer: string;
  relatedAxiomNumber: string;
  keyScripture: string;
}

export interface BibliographyEntry {
  id: string;
  author: string;
  arabicAuthor?: string;
  work: string;
  arabicWork?: string;
  category: "Classical Hadith" | "Kalam & Theology" | "Zaydi & Ibadi Primary" | "Historical & Sectarian";
  citations: string;
  relevance: string;
}

export interface UserInquiryHistory {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  focalAxiomId?: string;
  source?: string;
}
