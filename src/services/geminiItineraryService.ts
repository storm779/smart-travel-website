import { getModel, isGeminiAvailable, parseJsonResponse, getCached, setCache } from "./geminiApi";

interface Preferences {
  travelType: "domestic" | "international";
  destination: string;
  travelMonth?: string;
  month?: string;
  duration: string;
  travelers: string | number;
  budget: string;
  interests: string[];
  accommodation: string;
  specialNeeds: string[];
  culturalPreferences: string[];
}

interface EnhancedActivity {
  type: "place";
  name: string;
  time: string;
  description: string;
  category: string;
  estimatedCost?: string;
  duration?: string;
}

interface DayMeals {
  breakfast?: string;
  lunch?: string;
  dinner?: string;
}

interface GeminiDayPlan {
  day: number;
  city: string;
  title: string;
  shortSummary: string;
  travelTip?: string;
  meals: DayMeals;
  activities: string[];
  enhancedActivities: EnhancedActivity[];
}

interface GeminiItineraryTier {
  type: "economic" | "middle_luxury" | "luxury";
  totalPrice: number;
  pricePerPerson: number;
  hotelName: string;
  hotelDescription?: string;
  transportDetails: string[];
  inclusions: string[];
  exclusions: string[];
  days: GeminiDayPlan[];
  highlights: string[];
  cities: string[];
  attractions: string[];
  packingTips?: string[];
  weatherNote?: string;
}

interface GeminiItineraryResponse {
  itineraries: GeminiItineraryTier[];
}

function getDurationDays(duration: string): number {
  if (duration === "3-5 days") return 4;
  if (duration === "6-8 days") return 7;
  if (duration === "9-12 days") return 10;
  if (duration === "13-15 days") return 14;
  return 18;
}

function parseTravelers(travelers: string | number): number {
  if (typeof travelers === "number") return travelers;
  if (travelers === "Solo") return 1;
  const match = travelers.match(/\d+/);
  return match ? parseInt(match[0]) : 2;
}

function buildItineraryPrompt(preferences: Preferences): string {
  const days = getDurationDays(preferences.duration);
  const numTravelers = parseTravelers(preferences.travelers);
  const month = preferences.travelMonth || preferences.month || "any month";

  return `You are "Ravi," a veteran Indian travel planner with 20 years of experience. You've personally visited every destination you recommend. You're known for crafting itineraries so detailed that travelers never need to open Google Maps.

A client has come to you with these requirements:

TRIP DETAILS:
- Destination: ${preferences.destination}
- Type: ${preferences.travelType} trip from India
- Travel month: ${month}
- Duration: ${days} days / ${days - 1} nights
- Travelers: ${numTravelers} ${numTravelers === 1 ? "person" : "people"}
- Budget preference: ${preferences.budget}
- Interests: ${preferences.interests?.join(", ") || "General sightseeing"}
- Accommodation style: ${preferences.accommodation || "Standard hotels"}
- Special needs: ${preferences.specialNeeds?.join(", ") || "None"}
- Cultural preferences: ${preferences.culturalPreferences?.join(", ") || "Open to everything"}

Create 3 GENUINELY DIFFERENT itinerary tiers. Each tier must feel like a completely different trip, not just the same trip with different hotels.

Return a JSON object with this structure:

{
  "itineraries": [
    {
      "type": "economic",
      "totalPrice": <total INR for all ${numTravelers} travelers>,
      "pricePerPerson": <INR per person>,
      "hotelName": "<REAL hotel name that exists in ${preferences.destination}>",
      "hotelDescription": "<1 sentence about the hotel - what makes it good for this tier>",
      "transportDetails": [
        "<specific transport: e.g. 'Sleeper bus from Jaipur to Udaipur via RSRTC (8hrs, ~₹600)'>",
        "<another specific transport detail>",
        "<another>",
        "<another>"
      ],
      "inclusions": ["<8 specific items>"],
      "exclusions": ["<6 specific items>"],
      "weatherNote": "<What to expect weather-wise in ${preferences.destination} in ${month}. Temperature range, rain chances, what to wear.>",
      "packingTips": ["<5 specific packing tips for this destination and month>"],
      "days": [
        {
          "day": 1,
          "city": "<city name>",
          "title": "<creative, evocative day title - NOT generic like 'Arrival Day'>",
          "shortSummary": "<exciting one-liner that makes you want to read more>",
          "travelTip": "<insider tip for this specific day - e.g. 'Book the 6AM slot for Taj Mahal to avoid crowds and catch golden hour light'>",
          "meals": {
            "breakfast": "<specific restaurant/cafe name + must-try dish + approx cost. e.g. 'Sharma Ji Nashta Corner - Aloo Paratha with Lassi (~₹80)'>",
            "lunch": "<specific restaurant + dish + cost>",
            "dinner": "<specific restaurant + dish + cost>"
          },
          "activities": [],
          "enhancedActivities": [
            {
              "type": "place",
              "name": "<place/activity name>",
              "time": "<specific time: e.g. '9:00 AM - 11:30 AM'>",
              "description": "<2-3 vivid sentences. Include: what you'll see/do, why it's special, a local insider tip. Write like a friend giving advice, not a guidebook.>",
              "category": "<one of: temple, beach, market, museum, restaurant, adventure, nature, heritage, nightlife, wellness, transport>",
              "estimatedCost": "<e.g. '₹500 per person' or 'Free entry'>",
              "duration": "<e.g. '2 hours'>"
            }
          ]
        }
        // ... CONTINUE WITH day 2, day 3, ... up to day ${days}. The "days" array MUST contain exactly ${days} entries — one full object for EACH day from 1 to ${days}. Do not stop at day 1.
      ],
      "highlights": ["<8 top attraction names>"],
      "cities": ["<cities visited in order>"],
      "attractions": ["<10 key attractions>"]
    },
    {
      "type": "middle_luxury",
      "...same structure but DIFFERENT places, restaurants, experiences..."
    },
    {
      "type": "luxury",
      "...same structure but DIFFERENT places, restaurants, experiences..."
    }
  ]
}

CRITICAL RULES FOR QUALITY:

0. DAYS ARRAY LENGTH IS NON-NEGOTIABLE: For each tier, the "days" array MUST contain exactly ${days} day objects — one for day 1, one for day 2, ..., one for day ${days}. Do NOT return fewer days. Do NOT abbreviate or use placeholders like "...same as above". If the trip is ${days} days long, I expect ${days} fully-written day objects per tier. The example above shows only day 1 to save space — you must expand it to all ${days} days.

1. REAL PLACES ONLY: Every hotel, restaurant, attraction MUST be a real place that exists today. No made-up names.

2. TIME-SLOTTED ACTIVITIES: Each activity needs a specific time range (e.g. "9:00 AM - 11:00 AM"). Account for:
   - Travel time between locations
   - Queue/wait times at popular spots
   - Rest breaks after intense activities
   - Realistic meal times

3. GENUINELY DIFFERENT TIERS - this is the most important rule:
   ECONOMIC: Backpacker/budget style. Hostels, dharamshalas, street food stalls (name the specific cart/stall), local buses, walking tours, free attractions, local experiences tourists miss. The charm is in authenticity.
   MID-LUXURY: Comfortable traveler. Boutique hotels, well-reviewed restaurants (name them + their signature dish), private cab, professional guides, curated experiences, popular attractions with skip-the-line. Balance of comfort and exploration.
   LUXURY: Premium exclusive. 5-star resorts/heritage properties, award-winning restaurants, private chauffeur, helicopter rides/yacht experiences where applicable, private museum tours, personal butler service, spa treatments. Money-no-object experiences.

4. MEAL RECOMMENDATIONS: Every meal must name a REAL restaurant/food stall with:
   - The restaurant's name
   - Their must-try dish
   - Approximate cost per person
   - Why it's worth going there

5. LOCAL INSIDER KNOWLEDGE: Each day needs a travelTip that only a local would know. NOT generic advice like "carry water." Instead: "The side entrance of Mehrangarh Fort at 7AM has no queue and the morning light on the sandstone is magical for photos."

6. PRICING: All in INR. Be realistic:
   - Economic: ₹2,000-5,000/day per person for domestic, ₹5,000-10,000 for international
   - Mid-Luxury: ₹5,000-12,000/day per person for domestic, ₹10,000-25,000 for international
   - Luxury: ₹15,000-40,000/day per person for domestic, ₹30,000-80,000 for international

7. DAY STRUCTURE: Each day should have 4-6 activities with clear time slots. Day 1 starts with arrival (afternoon activities), last day ends with departure (morning activities only).

8. The "activities" array should be left empty []. Only populate "enhancedActivities" - the activities array exists for backward compatibility.

9. WEATHER-AWARE: Consider ${month} weather for ${preferences.destination}. Don't schedule outdoor activities during typical rain hours in monsoon, or desert activities in peak afternoon heat.

10. Respond with ONLY the JSON object. No markdown, no explanation, no code fences.`;
}

export async function generateItinerariesWithGemini(
  preferences: Preferences
): Promise<GeminiItineraryResponse | null> {
  if (!isGeminiAvailable()) {
    return null;
  }

  // Check cache
  const cacheKey = JSON.stringify(preferences);
  const cached = getCached<GeminiItineraryResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  const expectedDays = getDurationDays(preferences.duration);
  const model = getModel();
  const basePrompt = buildItineraryPrompt(preferences);

  const runOnce = async (prompt: string): Promise<GeminiItineraryResponse | null> => {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = parseJsonResponse<GeminiItineraryResponse>(text);

    if (
      !parsed.itineraries ||
      !Array.isArray(parsed.itineraries) ||
      parsed.itineraries.length !== 3
    ) {
      console.error("Invalid Gemini itinerary response structure:", parsed);
      return null;
    }
    return parsed;
  };

  const tierShortfall = (resp: GeminiItineraryResponse): number[] =>
    resp.itineraries
      .map((t, i) => (Array.isArray(t.days) ? t.days.length : 0) < expectedDays ? i : -1)
      .filter((i) => i >= 0);

  try {
    let parsed = await runOnce(basePrompt);
    if (!parsed) return null;

    const shortTiers = tierShortfall(parsed);
    if (shortTiers.length > 0) {
      const tierNames = shortTiers.map((i) => parsed!.itineraries[i].type).join(", ");
      const counts = parsed.itineraries.map((t) => t.days?.length ?? 0).join("/");
      console.warn(
        `Gemini returned short days arrays (got ${counts}, expected ${expectedDays} per tier). Retrying for tiers: ${tierNames}`
      );

      const retryPrompt =
        basePrompt +
        `\n\nIMPORTANT RETRY INSTRUCTION: Your previous response had only ${counts} days in the three tiers, but the trip is ${expectedDays} days long. EVERY tier's "days" array MUST contain exactly ${expectedDays} fully-written day objects (day 1 through day ${expectedDays}). Do not stop early. Do not use placeholders. Generate all ${expectedDays} days for all three tiers.`;

      const retried = await runOnce(retryPrompt);
      if (retried && tierShortfall(retried).length < shortTiers.length) {
        parsed = retried;
      }
    }

    setCache(cacheKey, parsed);
    return parsed;
  } catch (error) {
    console.error("Gemini itinerary generation failed:", error);
    return null;
  }
}

export function formatGeminiItineraries(
  response: GeminiItineraryResponse,
  preferences: Preferences
) {
  const days = getDurationDays(preferences.duration);

  return response.itineraries.map((tier) => {
    const titleMap = {
      economic: "Economic Package",
      middle_luxury: "Mid-Luxury Package",
      luxury: "Luxury Package",
    };

    // Derive activities from enhancedActivities for backward compat
    const processedDays = tier.days.map((day) => ({
      ...day,
      activities:
        day.activities && day.activities.length > 0
          ? day.activities
          : (day.enhancedActivities || []).map(
              (a) => `${a.time ? a.time + " - " : ""}${a.name}`
            ),
    }));

    return {
      title: `${preferences.destination} - ${titleMap[tier.type]}`,
      type: tier.type,
      totalPrice: tier.totalPrice,
      pricePerPerson: tier.pricePerPerson,
      hotelName: tier.hotelName,
      hotelDescription: tier.hotelDescription || "",
      transportDetails: tier.transportDetails,
      inclusions: tier.inclusions,
      exclusions: tier.exclusions,
      duration: `${days} Days / ${days - 1} Nights`,
      days: processedDays,
      highlights: tier.highlights,
      images: getDestinationImagesForGemini(
        preferences.destination,
        preferences.travelType
      ),
      destination: preferences.destination,
      cities: tier.cities,
      attractions: tier.attractions,
      weatherNote: tier.weatherNote || "",
      packingTips: tier.packingTips || [],
    };
  });
}

function getDestinationImagesForGemini(
  destination: string,
  _travelType: "domestic" | "international"
): string[] {
  const imageMap: { [key: string]: string[] } = {
    Maharashtra: [
      "https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg",
      "https://images.pexels.com/photos/2467558/pexels-photo-2467558.jpeg",
    ],
    Rajasthan: [
      "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg",
      "https://images.pexels.com/photos/3186654/pexels-photo-3186654.jpeg",
    ],
    Kerala: [
      "https://images.pexels.com/photos/1583582/pexels-photo-1583582.jpeg",
      "https://images.pexels.com/photos/5214413/pexels-photo-5214413.jpeg",
    ],
    Maldives: [
      "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
    ],
    Dubai: [
      "https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg",
      "https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg",
    ],
    Thailand: [
      "https://images.pexels.com/photos/1031659/pexels-photo-1031659.jpeg",
      "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg",
    ],
    Goa: [
      "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg",
      "https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg",
    ],
    Ladakh: [
      "https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg",
      "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg",
    ],
    "Himachal Pradesh": [
      "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg",
      "https://images.pexels.com/photos/2335126/pexels-photo-2335126.jpeg",
    ],
    "Jammu & Kashmir": [
      "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg",
      "https://images.pexels.com/photos/2437291/pexels-photo-2437291.jpeg",
    ],
    Singapore: [
      "https://images.pexels.com/photos/777059/pexels-photo-777059.jpeg",
      "https://images.pexels.com/photos/1842332/pexels-photo-1842332.jpeg",
    ],
    Bali: [
      "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg",
      "https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg",
    ],
    Switzerland: [
      "https://images.pexels.com/photos/1586795/pexels-photo-1586795.jpeg",
      "https://images.pexels.com/photos/1562/italian-landscape-mountains-nature.jpg",
    ],
    Paris: [
      "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg",
      "https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg",
    ],
  };

  return imageMap[destination] || [
    "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg",
    "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg",
  ];
}
