import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  JAUHARI_SYSTEM_INSTRUCTION,
  generateSemanticAnswer,
} from "./src/services/jauhariKnowledgeEngine.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI:", err);
      return null;
    }
  }
  return aiClient;
}

// Candidate models for graceful fallback when a model suffers high demand (503/429)
const CANDIDATE_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-3.8-flash",
];

// Helper delay
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Q&A endpoint using Gemini API with multi-model fallback and retry logic
app.post("/api/jauhari-qa", async (req: Request, res: Response) => {
  const { question, contextAxiomId } = req.body;

  if (!question || typeof question !== "string" || question.trim().length === 0) {
    return res.status(400).json({ error: "A valid inquiry question is required." });
  }

  const ai = getGeminiClient();

  if (!ai) {
    console.warn("Gemini client not initialized (missing GEMINI_API_KEY). Using semantic knowledge engine.");
    const fallback = generateSemanticAnswer(question, contextAxiomId);
    return res.json({
      answer: fallback,
      source: "jauhari-manifesto-engine",
      model: "manifesto-offline-synthesizer",
      isFallback: true,
      note: "API Key not configured. Answer synthesized from Project Jauhari manifesto database.",
    });
  }

  const promptText = `
User Inquiry: "${question.trim()}"
${contextAxiomId ? `Context / Focal Axiom: ${contextAxiomId}` : ""}

Please provide a comprehensive, directly relevant, and intellectually rigorous response strictly derived from the Project Jauhari Manifesto. Ensure you answer the specific dilemma or question asked.
`;

  // Attempt generation across candidate models with retries on 503/429/UNAVAILABLE
  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Jauhari QA] Attempting model: ${modelName} (attempt ${attempt})`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: promptText,
          config: {
            systemInstruction: JAUHARI_SYSTEM_INSTRUCTION,
            temperature: 0.4,
          },
        });

        const responseText = response.text?.trim();
        if (responseText && responseText.length > 50) {
          return res.json({
            answer: responseText,
            source: modelName,
            model: modelName,
            isFallback: false,
          });
        }
      } catch (err: any) {
        lastError = err;
        const statusCode = err?.status || err?.code || (err?.error && err.error.code);
        const errorMessage = err?.message || JSON.stringify(err);
        console.warn(`[Jauhari QA] Model ${modelName} attempt ${attempt} failed: Status ${statusCode}, ${errorMessage}`);

        // If it's a 503 (high demand) or 429 (rate limit), wait briefly before retrying or switching
        if (statusCode === 503 || statusCode === 429 || errorMessage.includes("high demand") || errorMessage.includes("UNAVAILABLE")) {
          await wait(attempt * 400);
        } else {
          // If other error, switch to next model immediately
          break;
        }
      }
    }
  }

  // If all live AI models failed due to persistent 503 or network issues:
  console.error("[Jauhari QA] All candidate models exhausted. Generating tailored semantic synthesis.", lastError);
  const tailoredAnswer = generateSemanticAnswer(question, contextAxiomId);

  return res.json({
    answer: tailoredAnswer,
    source: "jauhari-epistemic-synthesizer",
    model: "manifesto-semantic-engine",
    isFallback: true,
    warning: "The AI service is temporarily experiencing high server demand across clusters. A tailored response was generated directly from the Project Jauhari Manifesto archives.",
  });
});

// Start Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Project Jauhari server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
