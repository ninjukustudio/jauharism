import { GoogleGenAI } from "@google/genai";
import {
  JAUHARI_SYSTEM_INSTRUCTION,
  generateSemanticAnswer,
} from "../src/services/jauhariKnowledgeEngine.ts";

const CANDIDATE_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-3.8-flash",
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function parseBody(req: any): Promise<any> {
  if (req.body) {
    if (typeof req.body === "string") {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    return req.body;
  }

  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk: any) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
    req.on("error", () => {
      resolve({});
    });
  });
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const body = await parseBody(req);
    const { question, contextAxiomId } = body || {};

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return res.status(400).json({ error: "A valid inquiry question is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("[Vercel QA] GEMINI_API_KEY environment variable is not set. Using Jauhari knowledge engine.");
      const answer = generateSemanticAnswer(question, contextAxiomId);
      return res.status(200).json({
        answer,
        source: "jauhari-manifesto-engine",
        model: "manifesto-offline-synthesizer",
        isFallback: true,
        note: "API Key not configured in Vercel environment variables. Answer synthesized from Project Jauhari manifesto database.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build-vercel",
        },
      },
    });

    const promptText = `
User Inquiry: "${question.trim()}"
${contextAxiomId ? `Context / Focal Axiom: ${contextAxiomId}` : ""}

Please provide a comprehensive, directly relevant, and intellectually rigorous response strictly derived from the Project Jauhari Manifesto. Ensure you answer the specific dilemma or question asked.
`;

    let lastError: any = null;

    for (const modelName of CANDIDATE_MODELS) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
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
            return res.status(200).json({
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
          console.warn(`[Vercel QA] Model ${modelName} attempt ${attempt} failed: Status ${statusCode}, ${errorMessage}`);

          if (statusCode === 503 || statusCode === 429 || errorMessage.includes("high demand") || errorMessage.includes("UNAVAILABLE")) {
            await wait(attempt * 300);
          } else {
            break;
          }
        }
      }
    }

    console.error("[Vercel QA] AI models exhausted or unavailable. Synthesizing manifesto response.", lastError);
    const tailoredAnswer = generateSemanticAnswer(question, contextAxiomId);

    return res.status(200).json({
      answer: tailoredAnswer,
      source: "jauhari-epistemic-synthesizer",
      model: "manifesto-semantic-engine",
      isFallback: true,
      warning: "The AI service is temporarily experiencing high server demand. A tailored response was generated directly from the Project Jauhari Manifesto archives.",
    });
  } catch (globalErr: any) {
    console.error("[Vercel QA] Unhandled serverless error:", globalErr);
    const fallbackAnswer = generateSemanticAnswer(
      typeof req.body?.question === "string" ? req.body.question : "Islamic rationalism principles"
    );
    return res.status(200).json({
      answer: fallbackAnswer,
      source: "jauhari-emergency-fallback",
      isFallback: true,
      error: globalErr?.message || "Internal error handled gracefully.",
    });
  }
}
