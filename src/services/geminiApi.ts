import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;
let chatModel: GenerativeModel | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    if (!API_KEY || API_KEY === "your_gemini_api_key_here") {
      throw new Error("Gemini API key not configured");
    }
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
}

export function getModel(): GenerativeModel {
  if (!model) {
    model = getGenAI().getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 30000,
      },
    });
  }
  return model;
}

export function getChatModel(): GenerativeModel {
  if (!chatModel) {
    chatModel = getGenAI().getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });
  }
  return chatModel;
}

export function isGeminiAvailable(): boolean {
  return !!API_KEY && API_KEY !== "your_gemini_api_key_here";
}

export function parseJsonResponse<T>(text: string): T {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  return JSON.parse(cleaned.trim()) as T;
}

// Simple cache using sessionStorage
export function getCached<T>(key: string): T | null {
  try {
    const cached = sessionStorage.getItem(`gemini_${key}`);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Cache for 30 minutes
      if (Date.now() - timestamp < 30 * 60 * 1000) {
        return data as T;
      }
      sessionStorage.removeItem(`gemini_${key}`);
    }
  } catch {
    // Ignore cache errors
  }
  return null;
}

export function setCache(key: string, data: unknown): void {
  try {
    sessionStorage.setItem(
      `gemini_${key}`,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    // Ignore cache errors (storage full, etc.)
  }
}
