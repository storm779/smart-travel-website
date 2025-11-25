import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.21.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChatRequest {
  message: string;
  sessionId?: string;
}

interface ChatResponse {
  reply: string;
  sessionId: string;
}

const SYSTEM_PROMPT = `You are SmartTravel AI, an intelligent travel assistant for the SmartTravel website.

Your role:
- Help users find and book travel packages
- Provide information about destinations, itineraries, and activities
- Answer questions about pricing, accommodations, and trip details
- Assist with travel planning and recommendations

IMPORTANT RULES:
1. Use ONLY information from the provided context (packages, destinations, cities)
2. If a user asks about a package, destination, or service not in the context, respond: "This package or destination is not currently available in our catalog. Please check our website for available options or contact our support team."
3. Never invent or hallucinate package details, prices, or destinations
4. Be helpful, friendly, and concise
5. If you're unsure, ask clarifying questions
6. Always mention package names and prices when recommending trips
7. Encourage users to book through the website

Context about available packages and destinations will be provided with each query.`;

async function fetchPackagesContext(supabaseUrl: string, supabaseKey: string): Promise<string> {
  try {
    console.log("[DEBUG] Fetching packages from database...");
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: packages, error } = await supabase
      .from("packages")
      .select("*")
      .limit(50);

    if (error) {
      console.error("[ERROR] Database error fetching packages:", error);
      return "No package information available.";
    }

    if (!packages || packages.length === 0) {
      console.log("[DEBUG] No packages found in database");
      return "No packages currently available.";
    }

    console.log(`[DEBUG] Found ${packages.length} packages`);

    const packagesList = packages
      .map(
        (pkg) =>
          `- ${pkg.title} (${pkg.destination}): ${pkg.duration_days} days/${pkg.duration_nights} nights, ${pkg.theme} package, Price: ₹${pkg.price_per_person} per person. Category: ${pkg.category}. Description: ${pkg.description || "N/A"}`
      )
      .join("\n");

    const destinations = [...new Set(packages.map((p) => p.destination))].join(", ");
    const themes = [...new Set(packages.map((p) => p.theme))].join(", ");
    const categories = [...new Set(packages.map((p) => p.category))].join(", ");

    return `Available Travel Packages:\n${packagesList}\n\nAvailable Destinations: ${destinations}\n\nPackage Themes: ${themes}\n\nPackage Categories: ${categories}`;
  } catch (error) {
    console.error("[ERROR] Exception in fetchPackagesContext:", error);
    return "Unable to fetch package information at the moment.";
  }
}

Deno.serve(async (req: Request) => {
  console.log(`[DEBUG] Received ${req.method} request to ai-chat function`);

  if (req.method === "OPTIONS") {
    console.log("[DEBUG] Handling CORS preflight request");
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log("[DEBUG] Parsing request body...");
    const requestBody = await req.json();
    console.log("[DEBUG] Request body:", JSON.stringify(requestBody));

    const { message, sessionId } = requestBody as ChatRequest;

    if (!message || typeof message !== "string") {
      console.error("[ERROR] Invalid message format:", message);
      return new Response(
        JSON.stringify({ error: "Invalid message format" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("[DEBUG] User message:", message);

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    console.log("[DEBUG] Environment check:");
    console.log("  - GEMINI_API_KEY:", geminiApiKey ? "✓ Present" : "✗ Missing");
    console.log("  - SUPABASE_URL:", supabaseUrl ? "✓ Present" : "✗ Missing");
    console.log("  - SUPABASE_SERVICE_ROLE_KEY:", supabaseKey ? "✓ Present" : "✗ Missing");

    if (!geminiApiKey) {
      console.error("[ERROR] GEMINI_API_KEY not configured");
      return new Response(
        JSON.stringify({
          reply: "I'm currently unable to process requests. Please contact support.",
          sessionId: sessionId || crypto.randomUUID()
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error("[ERROR] Supabase credentials not configured");
      return new Response(
        JSON.stringify({
          reply: "I'm currently unable to access package information. Please try again later.",
          sessionId: sessionId || crypto.randomUUID()
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("[DEBUG] Fetching package context...");
    const context = await fetchPackagesContext(supabaseUrl, supabaseKey);
    console.log("[DEBUG] Context length:", context.length, "characters");

    console.log("[DEBUG] Initializing Gemini AI...");
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const fullPrompt = `${SYSTEM_PROMPT}\n\n${context}\n\nUser Question: ${message}\n\nProvide a helpful, accurate response based only on the context provided above.`;

    console.log("[DEBUG] Calling Gemini API...");
    const result = await model.generateContent(fullPrompt);
    console.log("[DEBUG] Gemini API call successful");

    const response = result.response;
    const reply = response.text();
    console.log("[DEBUG] Generated reply length:", reply.length, "characters");

    if (!reply || reply.trim().length === 0) {
      console.error("[ERROR] Empty reply from Gemini");
      return new Response(
        JSON.stringify({
          reply: "I'm sorry, I couldn't generate a response. Could you please rephrase your question?",
          sessionId: sessionId || crypto.randomUUID()
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const newSessionId = sessionId || crypto.randomUUID();

    const chatResponse: ChatResponse = {
      reply: reply.trim(),
      sessionId: newSessionId,
    };

    console.log("[DEBUG] Sending successful response");
    return new Response(JSON.stringify(chatResponse), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[ERROR] Exception in ai-chat function:", error);
    console.error("[ERROR] Stack trace:", error.stack);

    return new Response(
      JSON.stringify({
        reply: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        sessionId: crypto.randomUUID(),
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});