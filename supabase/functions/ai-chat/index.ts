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
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: packages, error } = await supabase
      .from("travel_packages")
      .select("*")
      .limit(50);

    if (error) {
      console.error("Error fetching packages:", error);
      return "No package information available.";
    }

    if (!packages || packages.length === 0) {
      return "No packages currently available.";
    }

    const packagesList = packages
      .map(
        (pkg) =>
          `- ${pkg.name} (${pkg.destination}): ${pkg.duration} days, ${pkg.category} package, Price: ₹${pkg.base_price} per person. Description: ${pkg.description || "N/A"}`
      )
      .join("\n");

    const destinations = [...new Set(packages.map((p) => p.destination))].join(", ");
    const categories = [...new Set(packages.map((p) => p.category))].join(", ");

    return `Available Travel Packages:\n${packagesList}\n\nAvailable Destinations: ${destinations}\n\nPackage Categories: ${categories}`;
  } catch (error) {
    console.error("Error in fetchPackagesContext:", error);
    return "Unable to fetch package information at the moment.";
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, sessionId }: ChatRequest = await req.json();

    if (!message || typeof message !== "string") {
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

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not configured");
    }

    const context = await fetchPackagesContext(supabaseUrl, supabaseKey);

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const fullPrompt = `${SYSTEM_PROMPT}\n\n${context}\n\nUser Question: ${message}\n\nProvide a helpful, accurate response based only on the context provided above.`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const reply = response.text();

    const newSessionId = sessionId || crypto.randomUUID();

    const chatResponse: ChatResponse = {
      reply: reply.trim(),
      sessionId: newSessionId,
    };

    return new Response(JSON.stringify(chatResponse), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in ai-chat function:", error);

    return new Response(
      JSON.stringify({
        error: "An error occurred processing your request",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});