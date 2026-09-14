import { getChatModel, isGeminiAvailable } from "./geminiApi";
import { ChatSession } from "@google/generative-ai";

let chatSession: ChatSession | null = null;

const SYSTEM_PROMPT = `You are a friendly and knowledgeable travel assistant for "Travellah", a smart travel booking platform specializing in cultural, religious, and adventure travel.

ABOUT THE PLATFORM:
- We offer curated travel packages across India and international destinations
- Users can browse packages or use our Smart Planner to generate personalized AI itineraries
- We support Economic, Mid-Luxury, and Luxury tiers
- Payment methods: UPI, Credit Card, Debit Card, Net Banking, Wallet
- Destinations include: Maharashtra, Rajasthan, Kerala, Goa, Ladakh, Himachal Pradesh, Kashmir, Maldives, Dubai, Thailand, Singapore, Bali, Switzerland, Paris, London, and more

POLICIES:
- Cancellation: 30+ days = 90% refund, 15-29 days = 50%, 7-14 days = 25%, <7 days = no refund
- Modifications: Subject to availability, may incur charges
- Refunds: Processed within 7-10 business days
- Support hours: 9 AM - 9 PM IST
- Phone: +91 98765 43210
- Email: support@smarttravel.com

YOUR BEHAVIOR:
- Be warm, helpful, and concise (2-4 sentences per response)
- For travel recommendations, suggest using the Smart Planner feature
- For specific pricing, direct users to the Packages page
- Never make up specific prices for custom trips
- If asked about something outside travel/platform scope, politely redirect
- Use a conversational, friendly tone
- Suggest relevant follow-up actions when appropriate`;

export async function getGeminiChatResponse(
  userMessage: string,
  conversationHistory: Array<{ role: "user" | "bot"; text: string }>
): Promise<{ response: string; suggestions: string[] }> {
  if (!isGeminiAvailable()) {
    throw new Error("Gemini not available");
  }

  try {
    // Create a new chat session if needed or if history is empty
    if (!chatSession || conversationHistory.length <= 1) {
      const model = getChatModel();
      chatSession = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: `System instructions: ${SYSTEM_PROMPT}\n\nPlease acknowledge and start helping users.` }],
          },
          {
            role: "model",
            parts: [{ text: "I understand! I'm ready to help travelers with their queries about Travellah's services, packages, and travel planning. How can I assist?" }],
          },
          // Add previous conversation history
          ...conversationHistory.slice(0, -1).flatMap((msg) => [
            ...(msg.role === "user"
              ? [{ role: "user" as const, parts: [{ text: msg.text }] }]
              : [{ role: "model" as const, parts: [{ text: msg.text }] }]),
          ]),
        ],
      });
    }

    const result = await chatSession.sendMessage(
      `${userMessage}\n\n(After your response, on a new line write "SUGGESTIONS:" followed by 2-3 short follow-up questions the user might want to ask, separated by "|". Example: "SUGGESTIONS: What packages do you offer?|How do I book?|Tell me about cancellation policy")`
    );
    const text = result.response.text();

    // Parse response and suggestions
    const parts = text.split("SUGGESTIONS:");
    const response = parts[0].trim();
    const suggestions = parts[1]
      ? parts[1]
          .trim()
          .split("|")
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
          .slice(0, 3)
      : [];

    return { response, suggestions };
  } catch (error) {
    console.error("Gemini chat error:", error);
    // Reset session on error
    chatSession = null;
    throw error;
  }
}

export function resetChatSession(): void {
  chatSession = null;
}
