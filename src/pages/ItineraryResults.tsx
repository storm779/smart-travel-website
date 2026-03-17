import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Check,
  X,
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Hotel,
  Car,
  Camera,
  Clock,
  IndianRupee,
  ChevronDown,
  Star,
  Info,
  XCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { EnhancedActivity } from "../utils/enhancedItineraryGenerator";
import {
  generateItinerariesWithGemini,
  formatGeminiItineraries,
} from "../services/geminiItineraryService";
import { isGeminiAvailable } from "../services/geminiApi";
import { Reveal } from "../components/Reveal";
import { Helmet } from "react-helmet-async";
import ShareButton from "../components/ShareButton";

interface DayMeals {
  breakfast?: string;
  lunch?: string;
  dinner?: string;
}

interface Itinerary {
  title: string;
  type: "economic" | "middle_luxury" | "luxury";
  totalPrice: number;
  pricePerPerson: number;
  hotelName: string;
  hotelDescription?: string;
  transportDetails: string[];
  inclusions: string[];
  exclusions: string[];
  duration: string;
  days: Array<{
    day: number;
    city: string;
    title: string;
    shortSummary?: string;
    travelTip?: string;
    meals?: DayMeals;
    activities: string[];
    enhancedActivities?: (EnhancedActivity & { time?: string; estimatedCost?: string; duration?: string })[];
  }>;
  highlights: string[];
  images: string[];
  destination: string;
  cities: string[];
  attractions: string[];
  weatherNote?: string;
  packingTips?: string[];
}

export default function ItineraryResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [usingAI, setUsingAI] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const preferences = location.state?.preferences;

  useEffect(() => {
    if (!preferences) {
      navigate("/smart-planner");
      return;
    }
    generateItineraries();
  }, [preferences]);

  const getUserSelectedTierIndex = (): number => {
    const selectedTier = preferences.budget;
    if (selectedTier === "Economic") return 0;
    if (selectedTier === "Mid-Luxury") return 1;
    return 2;
  };

  const generateItineraries = async () => {
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2000);

    setUsingAI(true);
    setError(null);

    try {
      if (!isGeminiAvailable()) {
        throw new Error("Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.");
      }

      const geminiResult = await generateItinerariesWithGemini(preferences);
      if (!geminiResult) {
        throw new Error("Failed to generate itineraries. Gemini returned an empty response.");
      }

      const formatted = formatGeminiItineraries(geminiResult, preferences);
      setItineraries(formatted as Itinerary[]);
    } catch (err: any) {
      console.error("Itinerary generation failed:", err);
      setError(err?.message || "Something went wrong while generating your itinerary. Please try again.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const handleBookItinerary = (itinerary: Itinerary) => {
    if (!user) {
      navigate("/login", { state: { from: "/itinerary-results" } });
      return;
    }

    navigate("/book-custom", {
      state: {
        itinerary,
        preferences,
      },
    });
  };

  const toggleDay = (dayNumber: number) => {
    setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
  };

  const getRecommendedIndex = () => {
    return getUserSelectedTierIndex();
  };

  const getTierColor = (type: string) => {
    if (type === "luxury") return "from-yellow-400 to-orange-500";
    if (type === "middle_luxury") return "from-lilac-500 to-purple-500";
    return "from-green-500 to-emerald-500";
  };

  const getTierBadgeColor = (type: string) => {
    if (type === "luxury") return "bg-yellow-500";
    if (type === "middle_luxury") return "bg-lilac-500";
    return "bg-green-500";
  };

  const getTierLabel = (type: string) => {
    if (type === "luxury") return "LUXURY";
    if (type === "middle_luxury") return "MID-LUXURY";
    return "ECONOMIC";
  };

  if (error) {
    return (
      <div className="min-h-screen bg-lilac-50 pt-28 pb-16">
        <div className="max-w-xl mx-auto px-4 text-center py-20">
          <div className="bg-white rounded-3xl shadow-xl p-10">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 font-kugile">Generation Failed</h2>
            <p className="text-gray-500 mb-6 text-sm">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  setLoadingStep(0);
                  generateItineraries();
                }}
                className="px-6 py-3 bg-lilac-600 hover:bg-lilac-700 text-white rounded-xl font-medium text-sm transition">
                Try Again
              </button>
              <button
                onClick={() => navigate("/smart-planner")}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition">
                Back to Planner
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const loadingSteps = [
    { text: "Understanding your preferences...", icon: "🧠" },
    { text: "Researching destinations & attractions...", icon: "🔍" },
    { text: "Finding the best hotels & restaurants...", icon: "🏨" },
    { text: "Crafting your perfect itinerary...", icon: "✨" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-lilac-50 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-lilac-600 mx-auto"></div>
            {usingAI && (
              <div className="mt-2 inline-flex items-center gap-1.5 bg-gradient-to-r from-lilac-100 to-purple-100 text-lilac-700 px-4 py-1.5 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Powered by AI
              </div>
            )}
            <div className="mt-8 space-y-4">
              {loadingSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-500 ${
                    index <= loadingStep
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-400"
                  }`}>
                  <span className="text-xl">{step.icon}</span>
                  <span className={`text-sm font-medium ${index === loadingStep ? "animate-pulse" : ""}`}>
                    {step.text}
                  </span>
                  {index < loadingStep && (
                    <Check className="h-4 w-4 text-green-500 ml-auto" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lilac-50 pt-28 pb-16">
      <Helmet>
        <title>Your Itineraries - Travellah</title>
        <meta name="description" content="View your AI-generated personalized travel itineraries across Economic, Mid-Luxury, and Luxury tiers." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-10 w-10 text-yellow-500 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-kugile text-gray-900 mb-4">
              Your Perfect Travel Plans
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Personalized itineraries crafted just for you. Choose your preferred package below.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {itineraries.map((itinerary, index) => (
            <Reveal
              key={index}
              delay={index * 0.1}>
              <div
                className={`bg-white rounded-[2.5rem] shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  index === getRecommendedIndex() ? "ring-4 ring-lilac-500 ring-opacity-50" : ""
                }`}>
                {index === getRecommendedIndex() && (
                  <div className="bg-gradient-to-r from-lilac-600 to-purple-600 text-white py-2 px-4 text-center text-sm font-semibold">
                    <Star className="inline h-4 w-4 mr-1 animate-pulse" />
                    Recommended For You
                  </div>
                )}

                <div className="relative h-64 overflow-hidden">
                  <img
                    src={itinerary.images[0]}
                    alt={itinerary.destination}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                  <div className="absolute top-4 left-4">
                    <span
                      className={`${getTierBadgeColor(
                        itinerary.type
                      )} text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm`}>
                      {getTierLabel(itinerary.type)}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-2xl font-bold font-kugile mb-2">{itinerary.destination}</h2>
                    <p className="text-sm text-gray-200">{itinerary.duration}</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between bg-lilac-50 p-5 rounded-xl">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Total Cost</p>
                        <p className="text-3xl font-bold text-gray-900">
                          ₹{itinerary.totalPrice.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <IndianRupee className="h-10 w-10 text-lilac-600" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Camera className="h-5 w-5 text-gray-600" />
                      <h3 className="font-semibold font-kugile text-gray-900">Top Highlights</h3>
                    </div>
                    <div className="space-y-2">
                      {itinerary.highlights.slice(0, 3).map((highlight, hIndex) => (
                        <div
                          key={hIndex}
                          className="flex items-start space-x-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setSelectedItinerary(itinerary);
                        setExpandedDay(2);
                      }}
                      className={`w-full bg-gradient-to-r ${getTierColor(
                        itinerary.type
                      )} text-white font-bold py-3 px-4 rounded-xl transition transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2`}>
                      <Info className="h-5 w-5" />
                      <span>More Info</span>
                    </button>

                    <button
                      onClick={() => handleBookItinerary(itinerary)}
                      className="w-full bg-white border-2 border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400 font-semibold py-3 px-4 rounded-xl transition">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {selectedItinerary && (
          <Reveal>
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden mb-12">
              <div className="relative h-80 overflow-hidden">
                <img
                  src={selectedItinerary.images[0]}
                  alt={selectedItinerary.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                <button
                  onClick={() => {
                    setSelectedItinerary(null);
                    setExpandedDay(null);
                  }}
                  className="absolute top-6 right-6 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-full transition">
                  <XCircle className="h-6 w-6" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center space-x-2 mb-3">
                    <span
                      className={`${getTierBadgeColor(
                        selectedItinerary.type
                      )} px-4 py-2 rounded-full text-sm font-semibold`}>
                      {getTierLabel(selectedItinerary.type)}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold font-kugile mb-3">
                    {selectedItinerary.destination}
                  </h2>
                  <p className="text-xl text-gray-200 mb-4">{selectedItinerary.duration}</p>

                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>{selectedItinerary.cities.length} Cities</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Camera className="h-5 w-5" />
                      <span>{selectedItinerary.attractions.length}+ Attractions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Hotel className="h-5 w-5" />
                      <span>{selectedItinerary.hotelName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-lilac-50 p-6 rounded-2xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <IndianRupee className="h-6 w-6 text-lilac-600" />
                      <span className="text-sm text-gray-600 font-medium">Total Cost</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      ₹{selectedItinerary.totalPrice.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="bg-green-50 p-6 rounded-2xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-6 w-6 text-green-600" />
                      <span className="text-sm text-gray-600 font-medium">Duration</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{selectedItinerary.duration}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold font-kugile text-gray-900 mb-4 flex items-center">
                    <Camera className="h-6 w-6 mr-2 text-lilac-600" />
                    Top Attractions
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedItinerary.highlights.map((highlight, hIndex) => (
                      <div
                        key={hIndex}
                        className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-lilac-300 hover:shadow-md transition">
                        <p className="text-sm font-medium text-gray-900">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weather Note */}
                {selectedItinerary.weatherNote && (
                  <div className="mb-6 bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Weather & Packing</p>
                      <p className="text-sm text-blue-900">{selectedItinerary.weatherNote}</p>
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold font-kugile text-gray-900 flex items-center">
                      <Calendar className="h-6 w-6 mr-2 text-lilac-600" />
                      Day-by-Day Itinerary
                    </h3>
                    <button
                      onClick={() => setExpandedDay(expandedDay ? null : 2)}
                      className="text-sm text-lilac-600 hover:text-lilac-700 font-medium">
                      {expandedDay ? "Collapse All" : "Click on any day to view details"}
                    </button>
                  </div>
                  <div className="space-y-4">
                    {selectedItinerary.days.map((day) => (
                      <div
                        key={day.day}
                        className="border border-gray-200 rounded-2xl overflow-hidden hover:border-lilac-300 transition">
                        <button
                          onClick={() => toggleDay(day.day)}
                          className="w-full bg-gray-50 p-6 flex items-center justify-between hover:bg-lilac-50 transition cursor-pointer">
                          <div className="flex items-center space-x-4">
                            <div className="bg-lilac-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                              {day.day}
                            </div>
                            <div className="text-left">
                              <p className="text-sm text-gray-500 font-medium">
                                Day {day.day} • {day.city}
                              </p>
                              <p className="text-lg font-bold text-gray-900">{day.title}</p>
                              {day.shortSummary && (
                                <p className="text-xs text-gray-600 mt-0.5">{day.shortSummary}</p>
                              )}
                              <p className="text-xs text-lilac-600 mt-1">
                                {day.enhancedActivities?.length || day.activities.length} activities
                                • Click to view details
                              </p>
                            </div>
                          </div>
                          <ChevronDown
                            className={`h-6 w-6 text-gray-400 transition-transform ${
                              expandedDay === day.day ? "transform rotate-180" : ""
                            }`}
                          />
                        </button>

                        {expandedDay === day.day && (
                          <div className="p-6 bg-white border-t border-gray-100 space-y-5">
                            {/* Travel Tip */}
                            {day.travelTip && (
                              <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
                                <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Insider Tip</p>
                                  <p className="text-sm text-amber-900">{day.travelTip}</p>
                                </div>
                              </div>
                            )}

                            {/* Meals */}
                            {day.meals && (day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {day.meals.breakfast && (
                                  <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">Breakfast</p>
                                    <p className="text-xs text-gray-800">{day.meals.breakfast}</p>
                                  </div>
                                )}
                                {day.meals.lunch && (
                                  <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1">Lunch</p>
                                    <p className="text-xs text-gray-800">{day.meals.lunch}</p>
                                  </div>
                                )}
                                {day.meals.dinner && (
                                  <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Dinner</p>
                                    <p className="text-xs text-gray-800">{day.meals.dinner}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Activities */}
                            <div className="space-y-3">
                              {day.enhancedActivities && day.enhancedActivities.length > 0
                                ? day.enhancedActivities.map((activity, aIndex) => (
                                    <div
                                      key={aIndex}
                                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
                                      <div className="flex-shrink-0 mt-1">
                                        <div className="w-8 h-8 bg-lilac-100 text-lilac-700 rounded-lg flex items-center justify-center text-xs font-bold">
                                          {aIndex + 1}
                                        </div>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center flex-wrap gap-2 mb-1">
                                          <span className="text-gray-900 font-semibold text-sm">
                                            {activity.name}
                                          </span>
                                          {activity.category && (
                                            <span className="px-2 py-0.5 bg-lilac-100 text-lilac-700 text-[10px] rounded-full font-medium">
                                              {activity.category}
                                            </span>
                                          )}
                                        </div>
                                        {activity.time && (
                                          <p className="text-xs text-lilac-600 font-medium flex items-center gap-1 mb-1">
                                            <Clock className="h-3 w-3" />
                                            {activity.time}
                                            {activity.duration && ` (${activity.duration})`}
                                          </p>
                                        )}
                                        {activity.description && (
                                          <p className="text-sm text-gray-600 leading-relaxed">
                                            {activity.description}
                                          </p>
                                        )}
                                        {activity.estimatedCost && (
                                          <p className="text-xs text-green-700 font-medium mt-1 flex items-center gap-1">
                                            <IndianRupee className="h-3 w-3" />
                                            {activity.estimatedCost}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                : day.activities.map((activity, aIndex) => (
                                    <div
                                      key={aIndex}
                                      className="flex items-start gap-3 p-2">
                                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                      <span className="text-gray-700 text-sm">{activity}</span>
                                    </div>
                                  ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-green-50 p-6 rounded-2xl">
                    <div className="flex items-center space-x-2 mb-4">
                      <Hotel className="h-6 w-6 text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900">Hotel Details</h3>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 mb-4">
                      {selectedItinerary.hotelName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedItinerary.hotelDescription ||
                        (selectedItinerary.type === "luxury"
                          ? "5-Star Luxury Property"
                          : selectedItinerary.type === "middle_luxury"
                          ? "4-Star Premium Hotel"
                          : "Comfortable Budget Hotel")}
                    </p>
                  </div>

                  <div className="bg-lilac-50 p-6 rounded-2xl">
                    <div className="flex items-center space-x-2 mb-4">
                      <Car className="h-6 w-6 text-lilac-600" />
                      <h3 className="text-xl font-bold text-gray-900">Transport</h3>
                    </div>
                    <ul className="space-y-2">
                      {selectedItinerary.transportDetails.map((detail, dIndex) => (
                        <li
                          key={dIndex}
                          className="flex items-start space-x-2 text-sm text-gray-700">
                          <Check className="h-4 w-4 text-lilac-600 flex-shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white border-2 border-green-200 p-6 rounded-2xl">
                    <div className="flex items-center space-x-2 mb-4">
                      <Check className="h-6 w-6 text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900">Inclusions</h3>
                    </div>
                    <ul className="space-y-2">
                      {selectedItinerary.inclusions.map((inclusion, iIndex) => (
                        <li
                          key={iIndex}
                          className="flex items-start space-x-2 text-sm text-gray-700">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{inclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white border-2 border-red-200 p-6 rounded-2xl">
                    <div className="flex items-center space-x-2 mb-4">
                      <X className="h-6 w-6 text-red-600" />
                      <h3 className="text-xl font-bold text-gray-900">Exclusions</h3>
                    </div>
                    <ul className="space-y-2">
                      {selectedItinerary.exclusions.map((exclusion, eIndex) => (
                        <li
                          key={eIndex}
                          className="flex items-start space-x-2 text-sm text-gray-700">
                          <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span>{exclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleBookItinerary(selectedItinerary)}
                    className="flex-1 bg-gradient-to-r from-lilac-600 to-purple-600 hover:from-lilac-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition transform hover:scale-105 shadow-lg">
                    Book This Package
                  </button>
                  <ShareButton
                    title={`${selectedItinerary.destination} - ${selectedItinerary.duration}`}
                    text={`Check out this ${getTierLabel(selectedItinerary.type)} travel itinerary for ${selectedItinerary.destination}!`}
                  />
                </div>
              </div>
            </div>
          </Reveal>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate("/smart-planner")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-xl transition">
            Generate New Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}
