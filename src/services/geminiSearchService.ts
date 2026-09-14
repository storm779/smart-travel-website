import { getModel, isGeminiAvailable, parseJsonResponse, getCached, setCache } from "./geminiApi";

interface ParsedFilters {
  destination?: string;
  theme?: string;
  maxPrice?: number;
  minPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  category?: "domestic" | "international";
}

// Cache for parsed queries to avoid re-parsing identical queries
const queryCache = new Map<string, ParsedFilters>();

function isNaturalLanguageQuery(query: string): boolean {
  // Detect NL if query has 3+ words or contains budget/duration terms
  const words = query.trim().split(/\s+/);
  if (words.length >= 3) return true;
  const nlTerms = /\b(under|below|above|between|cheap|budget|luxury|days|nights|week|month|beach|adventure|honeymoon|family|cultural|religious|heritage)\b/i;
  return nlTerms.test(query);
}

export async function parseSearchQuery(query: string): Promise<ParsedFilters | null> {
  if (!isGeminiAvailable() || !isNaturalLanguageQuery(query)) {
    return null;
  }

  // Check in-memory cache first
  if (queryCache.has(query)) {
    return queryCache.get(query)!;
  }

  // Check session cache
  const sessionCached = getCached<ParsedFilters>(`search_${query}`);
  if (sessionCached) {
    queryCache.set(query, sessionCached);
    return sessionCached;
  }

  try {
    const model = getModel();
    const result = await model.generateContent(
      `Parse this travel search query into structured filters. Return ONLY a JSON object.

Query: "${query}"

Available themes: adventure, honeymoon, family, cultural, religious, beach, heritage
Available categories: domestic, international

Return JSON with these optional fields (only include fields that are clearly mentioned or implied):
{
  "destination": "<destination name if mentioned>",
  "theme": "<one of the available themes if mentioned or implied>",
  "maxPrice": <max price in INR if mentioned, as number>,
  "minPrice": <min price in INR if mentioned, as number>,
  "minDuration": <min days if mentioned, as number>,
  "maxDuration": <max days if mentioned, as number>,
  "category": "<domestic or international if mentioned>"
}

If the query doesn't clearly indicate any filter, return {}.
Respond with ONLY the JSON, no other text.`
    );

    const text = result.response.text();
    const parsed = parseJsonResponse<ParsedFilters>(text);

    // Cache the result
    queryCache.set(query, parsed);
    setCache(`search_${query}`, parsed);
    return parsed;
  } catch (error) {
    console.error("Smart search parse failed:", error);
    return null;
  }
}

export function formatParsedFilters(filters: ParsedFilters): string[] {
  const chips: string[] = [];
  if (filters.destination) chips.push(`Destination: ${filters.destination}`);
  if (filters.theme) chips.push(`Theme: ${filters.theme.charAt(0).toUpperCase() + filters.theme.slice(1)}`);
  if (filters.maxPrice) chips.push(`Under ₹${filters.maxPrice.toLocaleString("en-IN")}`);
  if (filters.minPrice) chips.push(`Above ₹${filters.minPrice.toLocaleString("en-IN")}`);
  if (filters.minDuration && filters.maxDuration) {
    chips.push(`${filters.minDuration}-${filters.maxDuration} days`);
  } else if (filters.minDuration) {
    chips.push(`${filters.minDuration}+ days`);
  } else if (filters.maxDuration) {
    chips.push(`Up to ${filters.maxDuration} days`);
  }
  if (filters.category) chips.push(filters.category.charAt(0).toUpperCase() + filters.category.slice(1));
  return chips;
}
