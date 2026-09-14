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
import ItineraryMapView from "../components/ItineraryMapView";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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

  const getTierTabValue = (type: string) => {
    if (type === "luxury") return "luxury";
    if (type === "middle_luxury") return "mid-luxury";
    return "economic";
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-28 pb-16">
        <div className="max-w-xl mx-auto px-4 text-center py-20">
          <Card className="rounded-3xl shadow-xl">
            <CardContent className="p-10">
              <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="h-8 w-8 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-bold font-kugile mb-3">Generation Failed</CardTitle>
              <CardDescription className="mb-6 text-sm">{error}</CardDescription>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => {
                    setLoading(true);
                    setError(null);
                    setLoadingStep(0);
                    generateItineraries();
                  }}
                  className="bg-lilac-600 hover:bg-lilac-700 text-white rounded-xl">
                  Try Again
                </Button>
                <Button
                  onClick={() => navigate("/smart-planner")}
                  variant="secondary"
                  className="rounded-xl">
                  Back to Planner
                </Button>
              </div>
            </CardContent>
          </Card>
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
      <div className="min-h-screen bg-background pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-lilac-600 mx-auto"></div>
            {usingAI && (
              <div className="mt-2 inline-flex items-center gap-1.5 bg-gradient-to-r from-lilac-100 to-purple-100 dark:from-lilac-900/30 dark:to-purple-900/30 text-lilac-700 dark:text-lilac-300 px-4 py-1.5 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Powered by AI
              </div>
            )}
            <div className="mt-8 flex flex-col gap-4">
              {loadingSteps.map((step, index) => (
                <Card
                  key={index}
                  className={`transition-all duration-500 ${
                    index <= loadingStep
                      ? "shadow-sm"
                      : "bg-transparent border-transparent text-muted-foreground shadow-none"
                  }`}>
                  <CardContent className="flex items-center gap-3 px-6 py-3">
                    <span className="text-xl">{step.icon}</span>
                    <span className={`text-sm font-medium ${index === loadingStep ? "animate-pulse" : ""}`}>
                      {step.text}
                    </span>
                    {index < loadingStep && (
                      <Check className="h-4 w-4 text-green-500 ml-auto" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const defaultTab = itineraries.length > 0
    ? getTierTabValue(itineraries[getRecommendedIndex()]?.type || "economic")
    : "economic";

  return (
    <div className="min-h-screen bg-background pt-28 pb-16">
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
            <h1 className="text-4xl md:text-5xl font-bold font-kugile text-foreground mb-4">
              Your Perfect Travel Plans
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Personalized itineraries crafted just for you. Choose your preferred package below.
            </p>
          </div>
        </Reveal>

        {/* Tier Tabs for switching between itinerary tiers */}
        {itineraries.length > 0 && (
          <Reveal delay={0.1}>
            <Tabs defaultValue={defaultTab} className="mb-12">
              <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8">
                {itineraries.map((itinerary, index) => (
                  <TabsTrigger key={index} value={getTierTabValue(itinerary.type)}>
                    {index === getRecommendedIndex() && <Star className="h-3 w-3 mr-1" />}
                    {getTierLabel(itinerary.type)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {itineraries.map((itinerary, index) => (
                <TabsContent key={index} value={getTierTabValue(itinerary.type)}>
                  <Reveal delay={0.1}>
                    <Card
                      className={`rounded-[2.5rem] shadow-xl overflow-hidden ${
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
                          <Badge
                            className={`${getTierBadgeColor(
                              itinerary.type
                            )} text-white border-0 backdrop-blur-sm`}>
                            {getTierLabel(itinerary.type)}
                          </Badge>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h2 className="text-2xl font-bold font-kugile mb-2">{itinerary.destination}</h2>
                          <p className="text-sm text-gray-200">{itinerary.duration}</p>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="mb-6">
                          <Card className="bg-muted border-0">
                            <CardContent className="flex items-center justify-between p-5">
                              <div>
                                <p className="text-sm text-muted-foreground font-medium">Total Cost</p>
                                <p className="text-3xl font-bold text-foreground">
                                  ₹{itinerary.totalPrice.toLocaleString("en-IN")}
                                </p>
                              </div>
                              <IndianRupee className="h-10 w-10 text-lilac-600" />
                            </CardContent>
                          </Card>
                        </div>

                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Camera className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold font-kugile text-foreground">Top Highlights</h3>
                          </div>
                          <div className="flex flex-col gap-2">
                            {itinerary.highlights.slice(0, 3).map((highlight, hIndex) => (
                              <div
                                key={hIndex}
                                className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-muted-foreground">{highlight}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <Button
                            onClick={() => {
                              setSelectedItinerary(itinerary);
                              setExpandedDay(2);
                            }}
                            className={`w-full bg-gradient-to-r ${getTierColor(
                              itinerary.type
                            )} text-white font-bold rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 gap-2`}>
                            <Info className="h-5 w-5" />
                            <span>More Info</span>
                          </Button>

                          <Button
                            onClick={() => handleBookItinerary(itinerary)}
                            variant="outline"
                            className="w-full rounded-xl font-semibold">
                            Book Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                </TabsContent>
              ))}
            </Tabs>
          </Reveal>
        )}

        {selectedItinerary && (
          <Reveal>
            <Card className="rounded-[2.5rem] shadow-2xl overflow-hidden mb-12">
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
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      className={`${getTierBadgeColor(
                        selectedItinerary.type
                      )} text-white border-0 px-4 py-2`}>
                      {getTierLabel(selectedItinerary.type)}
                    </Badge>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold font-kugile mb-3">
                    {selectedItinerary.destination}
                  </h2>
                  <p className="text-xl text-gray-200 mb-4">{selectedItinerary.duration}</p>

                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      <span>{selectedItinerary.cities.length} Cities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      <span>{selectedItinerary.attractions.length}+ Attractions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hotel className="h-5 w-5" />
                      <span>{selectedItinerary.hotelName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card className="bg-muted border-0 rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <IndianRupee className="h-6 w-6 text-lilac-600" />
                        <span className="text-sm text-muted-foreground font-medium">Total Cost</span>
                      </div>
                      <p className="text-3xl font-bold text-foreground">
                        ₹{selectedItinerary.totalPrice.toLocaleString("en-IN")}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 dark:bg-green-950/30 border-0 rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-6 w-6 text-green-600" />
                        <span className="text-sm text-muted-foreground font-medium">Duration</span>
                      </div>
                      <p className="text-3xl font-bold text-foreground">{selectedItinerary.duration}</p>
                    </CardContent>
                  </Card>
                </div>

                <Separator className="my-8" />

                <div className="mb-8">
                  <h3 className="text-2xl font-bold font-kugile text-foreground mb-4 flex items-center">
                    <Camera className="h-6 w-6 mr-2 text-lilac-600" />
                    Top Attractions
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedItinerary.highlights.map((highlight, hIndex) => (
                      <Card
                        key={hIndex}
                        className="bg-muted border hover:border-lilac-300 hover:shadow-md transition rounded-xl">
                        <CardContent className="p-4">
                          <p className="text-sm font-medium text-foreground">{highlight}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Weather Note */}
                {selectedItinerary.weatherNote && (
                  <Card className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900 rounded-2xl">
                    <CardContent className="flex items-start gap-3 p-5">
                      <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1">Weather & Packing</p>
                        <p className="text-sm text-blue-900 dark:text-blue-200">{selectedItinerary.weatherNote}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Route Map */}
                {selectedItinerary.days.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold font-kugile text-foreground mb-4 flex items-center">
                      <MapPin className="h-6 w-6 mr-2 text-lilac-600" />
                      Route Map
                    </h3>
                    <ItineraryMapView
                      days={selectedItinerary.days.map((d) => ({
                        day: d.day,
                        city: d.city,
                        title: d.title,
                        activities: d.activities,
                      }))}
                    />
                  </div>
                )}

                <Separator className="my-8" />

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold font-kugile text-foreground flex items-center">
                      <Calendar className="h-6 w-6 mr-2 text-lilac-600" />
                      Day-by-Day Itinerary
                    </h3>
                  </div>

                  <Accordion
                    type="single"
                    collapsible
                    defaultValue={`day-2`}
                    className="flex flex-col gap-4">
                    {selectedItinerary.days.map((day) => (
                      <AccordionItem
                        key={day.day}
                        value={`day-${day.day}`}
                        className="border rounded-2xl overflow-hidden hover:border-lilac-300 transition">
                        <AccordionTrigger className="bg-muted p-6 hover:bg-lilac-50 dark:hover:bg-lilac-950/20 transition cursor-pointer [&[data-state=open]>svg]:rotate-180 hover:no-underline">
                          <div className="flex items-center gap-4">
                            <div className="bg-lilac-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                              {day.day}
                            </div>
                            <div className="text-left">
                              <p className="text-sm text-muted-foreground font-medium">
                                Day {day.day} &bull; {day.city}
                              </p>
                              <p className="text-lg font-bold text-foreground">{day.title}</p>
                              {day.shortSummary && (
                                <p className="text-xs text-muted-foreground mt-0.5">{day.shortSummary}</p>
                              )}
                              <p className="text-xs text-lilac-600 mt-1">
                                {day.enhancedActivities?.length || day.activities.length} activities
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="p-6 bg-card border-t flex flex-col gap-5">
                          {/* Travel Tip */}
                          {day.travelTip && (
                            <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900 rounded-xl">
                              <CardContent className="flex items-start gap-3 p-4">
                                <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-1">Insider Tip</p>
                                  <p className="text-sm text-amber-900 dark:text-amber-200">{day.travelTip}</p>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Meals */}
                          {day.meals && (day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {day.meals.breakfast && (
                                <Card className="bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900 rounded-xl">
                                  <CardContent className="p-3">
                                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">Breakfast</p>
                                    <p className="text-xs text-foreground">{day.meals.breakfast}</p>
                                  </CardContent>
                                </Card>
                              )}
                              {day.meals.lunch && (
                                <Card className="bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900 rounded-xl">
                                  <CardContent className="p-3">
                                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1">Lunch</p>
                                    <p className="text-xs text-foreground">{day.meals.lunch}</p>
                                  </CardContent>
                                </Card>
                              )}
                              {day.meals.dinner && (
                                <Card className="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900 rounded-xl">
                                  <CardContent className="p-3">
                                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Dinner</p>
                                    <p className="text-xs text-foreground">{day.meals.dinner}</p>
                                  </CardContent>
                                </Card>
                              )}
                            </div>
                          )}

                          {/* Activities */}
                          <div className="flex flex-col gap-3">
                            {day.enhancedActivities && day.enhancedActivities.length > 0
                              ? day.enhancedActivities.map((activity, aIndex) => (
                                  <div
                                    key={aIndex}
                                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition">
                                    <div className="flex-shrink-0 mt-1">
                                      <div className="w-8 h-8 bg-lilac-100 dark:bg-lilac-900/30 text-lilac-700 dark:text-lilac-300 rounded-lg flex items-center justify-center text-xs font-bold">
                                        {aIndex + 1}
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center flex-wrap gap-2 mb-1">
                                        <span className="text-foreground font-semibold text-sm">
                                          {activity.name}
                                        </span>
                                        {activity.category && (
                                          <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                                            {activity.category}
                                          </Badge>
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
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                          {activity.description}
                                        </p>
                                      )}
                                      {activity.estimatedCost && (
                                        <p className="text-xs text-green-700 dark:text-green-400 font-medium mt-1 flex items-center gap-1">
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
                                    <span className="text-muted-foreground text-sm">{activity}</span>
                                  </div>
                                ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                <Separator className="my-8" />

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <Card className="bg-green-50 dark:bg-green-950/30 border-0 rounded-2xl">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Hotel className="h-6 w-6 text-green-600" />
                        <CardTitle className="text-xl">Hotel Details</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-foreground mb-4">
                        {selectedItinerary.hotelName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedItinerary.hotelDescription ||
                          (selectedItinerary.type === "luxury"
                            ? "5-Star Luxury Property"
                            : selectedItinerary.type === "middle_luxury"
                            ? "4-Star Premium Hotel"
                            : "Comfortable Budget Hotel")}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted border-0 rounded-2xl">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Car className="h-6 w-6 text-lilac-600" />
                        <CardTitle className="text-xl">Transport</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="flex flex-col gap-2">
                        {selectedItinerary.transportDetails.map((detail, dIndex) => (
                          <li
                            key={dIndex}
                            className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-lilac-600 flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <Card className="border-2 border-green-200 dark:border-green-800 rounded-2xl">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Check className="h-6 w-6 text-green-600" />
                        <CardTitle className="text-xl">Inclusions</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="flex flex-col gap-2">
                        {selectedItinerary.inclusions.map((inclusion, iIndex) => (
                          <li
                            key={iIndex}
                            className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{inclusion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-red-200 dark:border-red-800 rounded-2xl">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <X className="h-6 w-6 text-red-600" />
                        <CardTitle className="text-xl">Exclusions</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="flex flex-col gap-2">
                        {selectedItinerary.exclusions.map((exclusion, eIndex) => (
                          <li
                            key={eIndex}
                            className="flex items-start gap-2 text-sm text-muted-foreground">
                            <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <span>{exclusion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <CardFooter className="flex gap-3 p-0">
                  <Button
                    onClick={() => handleBookItinerary(selectedItinerary)}
                    size="lg"
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105">
                    Book This Package
                  </Button>
                  <ShareButton
                    title={`${selectedItinerary.destination} - ${selectedItinerary.duration}`}
                    text={`Check out this ${getTierLabel(selectedItinerary.type)} travel itinerary for ${selectedItinerary.destination}!`}
                  />
                </CardFooter>
              </CardContent>
            </Card>
          </Reveal>
        )}

        <div className="text-center">
          <Button
            onClick={() => navigate("/smart-planner")}
            variant="secondary"
            size="lg"
            className="rounded-xl font-semibold">
            Generate New Itinerary
          </Button>
        </div>
      </div>
    </div>
  );
}
