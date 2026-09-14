import { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Home, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Preferences {
  travelType: "domestic" | "international" | "";
  destination: string;
  travelMonth: string;
  duration: string;
  travelers: string;
  budget: string;
  interests: string[];
  accommodation: string;
  specialNeeds: string[];
  culturalPreferences: string[];
}

export default function SmartPlanner() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<Preferences>({
    travelType: "",
    destination: "",
    travelMonth: "",
    duration: "",
    travelers: "",
    budget: "",
    interests: [],
    accommodation: "",
    specialNeeds: [],
    culturalPreferences: [],
  });

  const totalSteps = 10;

  const domesticDestinations = [
    "Maharashtra",
    "Tamil Nadu",
    "West Bengal",
    "Gujarat",
    "Rajasthan",
    "Kerala",
    "Uttarakhand",
    "Varanasi",
    "Goa",
    "Ladakh",
    "Himachal Pradesh",
    "Karnataka",
    "Jammu & Kashmir",
    "Sikkim",
    "Assam",
    "Meghalaya",
    "North East India",
  ];

  const internationalDestinations = [
    "Maldives",
    "Dubai",
    "Thailand",
    "Singapore",
    "Bali",
    "Malaysia",
    "Sri Lanka",
    "Nepal",
    "Bhutan",
    "Vietnam",
    "Turkey",
    "Switzerland",
    "Paris",
    "London",
  ];

  const destinations =
    preferences.travelType === "domestic" ? domesticDestinations : internationalDestinations;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const durations = ["3-5 days", "6-8 days", "9-12 days", "13-15 days", "15+ days"];
  const travelerCounts = ["Solo", "2 people", "3-4 people", "5-8 people", "9+ people"];
  const budgetTiers = ["Economic", "Mid-Luxury", "Luxury"];

  const interestOptions = [
    "Adventure sports",
    "Wildlife & nature",
    "Photography",
    "Food & cuisine",
    "Shopping",
    "Trekking & hiking",
    "Beach activities",
    "Historical sites",
  ];

  const accommodationTypes = ["Budget hotels", "3-4 star hotels", "5-star hotels & resorts"];

  const specialNeedsOptions = [
    "Honeymoon package",
    "Kids-friendly",
    "Elderly-friendly",
    "Vegetarian meals",
    "Wheelchair accessible",
  ];

  const culturalOptions = [
    "Pilgrimage sites (temples, churches, mosques)",
    "Festival tourism (Durga Puja, Kumbh Mela, etc.)",
    "Heritage walks & UNESCO sites",
    "Spiritual retreats (yoga, meditation)",
    "Buddhist circuit",
    "Regional yatras",
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate("/itinerary-results", { state: { preferences } });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter((i) => i !== item);
    }
    return [...array, item];
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return preferences.travelType !== "";
      case 2:
        return preferences.destination !== "";
      case 3:
        return preferences.travelMonth !== "";
      case 4:
        return preferences.duration !== "";
      case 5:
        return preferences.travelers !== "";
      case 6:
        return preferences.budget !== "";
      case 7:
        return preferences.interests.length > 0;
      case 8:
        return preferences.accommodation !== "";
      case 9:
        return true;
      case 10:
        return true;
      default:
        return false;
    }
  };

  const OptionButton = ({
    selected,
    onClick,
    children,
    className = "",
  }: {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 text-left transition ${
        selected
          ? "border-lilac-600 bg-lilac-50 dark:bg-lilac-950/30"
          : "border-border hover:border-lilac-300"
      } ${className}`}>
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-background pt-28 pb-16 transition-colors duration-200">
      <Helmet>
        <title>AI Smart Planner - Travellah</title>
        <meta name="description" content="Create personalized AI-powered travel itineraries. Tell us your preferences and get 3 custom itinerary options." />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-lilac-600" />
              <h1 className="text-3xl font-bold font-kugile text-foreground">Smart Trip Planner</h1>
            </div>
            <p className="text-muted-foreground">
              Answer a few questions and get 3 personalized itineraries
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Step {step} of {totalSteps}
              </span>
              <Badge variant="secondary">
                {Math.round((step / totalSteps) * 100)}%
              </Badge>
            </div>
            <Progress value={(step / totalSteps) * 100} className="h-2" />
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <Card className="rounded-[2.5rem] shadow-lg">
            <CardContent className="p-8">
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold font-kugile text-foreground mb-2">
                    What type of travel package are you looking for?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Choose between domestic or international travel
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <OptionButton
                      selected={preferences.travelType === "domestic"}
                      onClick={() => setPreferences({ ...preferences, travelType: "domestic" })}
                      className="p-8 rounded-3xl text-center">
                      <Home className="h-12 w-12 mx-auto mb-4 text-lilac-600" />
                      <span className="text-xl font-bold block mb-2 text-foreground">Domestic Tour Packages</span>
                      <span className="text-muted-foreground text-sm">Explore destinations within India</span>
                    </OptionButton>
                    <OptionButton
                      selected={preferences.travelType === "international"}
                      onClick={() => setPreferences({ ...preferences, travelType: "international" })}
                      className="p-8 rounded-3xl text-center">
                      <Globe className="h-12 w-12 mx-auto mb-4 text-lilac-600" />
                      <span className="text-xl font-bold block mb-2 text-foreground">
                        International Tour Packages
                      </span>
                      <span className="text-muted-foreground text-sm">
                        Discover destinations around the world
                      </span>
                    </OptionButton>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold font-kugile text-foreground mb-2">
                    Where would you like to go?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Choose your preferred {preferences.travelType} destination
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {destinations.map((dest) => (
                      <OptionButton
                        key={dest}
                        selected={preferences.destination === dest}
                        onClick={() => setPreferences({ ...preferences, destination: dest })}>
                        <span className="font-medium text-foreground">{dest}</span>
                      </OptionButton>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold font-kugile text-foreground mb-2">
                    When are you planning to travel?
                  </h2>
                  <p className="text-muted-foreground mb-6">Select your preferred month</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {months.map((month) => (
                      <OptionButton
                        key={month}
                        selected={preferences.travelMonth === month}
                        onClick={() => setPreferences({ ...preferences, travelMonth: month })}
                        className="p-4 rounded-xl text-center border-2 transition">
                        <span className="font-medium text-foreground">{month}</span>
                      </OptionButton>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-2xl font-bold font-kugile text-foreground mb-2">
                    How long is your trip?
                  </h2>
                  <p className="text-muted-foreground mb-6">Select the duration</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {durations.map((duration) => (
                      <OptionButton
                        key={duration}
                        selected={preferences.duration === duration}
                        onClick={() => setPreferences({ ...preferences, duration })}
                        className="p-4 rounded-xl text-center border-2 transition">
                        <span className="font-medium text-foreground">{duration}</span>
                      </OptionButton>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <h2 className="text-2xl font-bold font-kugile text-foreground mb-2">
                    How many travelers?
                  </h2>
                  <p className="text-muted-foreground mb-6">Including yourself</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {travelerCounts.map((count) => (
                      <OptionButton
                        key={count}
                        selected={preferences.travelers === count}
                        onClick={() => setPreferences({ ...preferences, travelers: count })}
                        className="p-4 rounded-xl text-center border-2 transition">
                        <span className="font-medium text-foreground">{count}</span>
                      </OptionButton>
                    ))}
                  </div>
                </div>
              )}

              {step === 6 && (
                <div>
                  <h2 className="text-2xl font-bold font-kugile text-foreground mb-2">
                    Choose your package tier
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Select the experience level that suits you best
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    {budgetTiers.map((tier) => (
                      <OptionButton
                        key={tier}
                        selected={preferences.budget === tier}
                        onClick={() => setPreferences({ ...preferences, budget: tier })}
                        className="p-6 rounded-xl border-2 transition">
                        <span className="font-bold text-xl block mb-2 text-foreground">{tier}</span>
                        <span className="text-sm text-muted-foreground">
                          {tier === "Economic" && "Budget-friendly travel with essential amenities"}
                          {tier === "Mid-Luxury" && "Comfortable experience with quality services"}
                          {tier === "Luxury" && "Premium experience with exclusive benefits"}
                        </span>
                      </OptionButton>
                    ))}
                  </div>
                </div>
              )}

              {step === 7 && (
                <div>
                  <h2 className="text-2xl font-bold font-kugile text-foreground mb-2">
                    What are your interests?
                  </h2>
                  <p className="text-muted-foreground mb-6">Select all that apply</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {interestOptions.map((interest) => (
                      <OptionButton
                        key={interest}
                        selected={preferences.interests.includes(interest)}
                        onClick={() =>
                          setPreferences({
                            ...preferences,
                            interests: toggleArrayItem(preferences.interests, interest),
                          })
                        }>
                        <span className="font-medium text-foreground">{interest}</span>
                      </OptionButton>
                    ))}
                  </div>
                </div>
              )}

              {step === 8 && (
                <div>
                  <h2 className="text-2xl font-bold font-kugile text-foreground mb-2">
                    Accommodation preference?
                  </h2>
                  <p className="text-muted-foreground mb-6">Choose your comfort level</p>
                  <div className="grid grid-cols-1 gap-4">
                    {accommodationTypes.map((type) => (
                      <OptionButton
                        key={type}
                        selected={preferences.accommodation === type}
                        onClick={() => setPreferences({ ...preferences, accommodation: type })}>
                        <span className="font-medium text-lg text-foreground">{type}</span>
                      </OptionButton>
                    ))}
                  </div>
                </div>
              )}

              {step === 9 && (
                <div>
                  <h2 className="text-2xl font-bold font-kugile text-foreground mb-2">
                    Any special needs?
                  </h2>
                  <p className="text-muted-foreground mb-6">Select all that apply (optional)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {specialNeedsOptions.map((need) => (
                      <OptionButton
                        key={need}
                        selected={preferences.specialNeeds.includes(need)}
                        onClick={() =>
                          setPreferences({
                            ...preferences,
                            specialNeeds: toggleArrayItem(preferences.specialNeeds, need),
                          })
                        }>
                        <span className="font-medium text-foreground">{need}</span>
                      </OptionButton>
                    ))}
                  </div>
                </div>
              )}

              {step === 10 && (
                <div>
                  <h2 className="text-2xl font-bold font-kugile text-foreground mb-2">
                    Cultural & Religious Preferences
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Select experiences you would like to include (optional)
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    {culturalOptions.map((option) => (
                      <OptionButton
                        key={option}
                        selected={preferences.culturalPreferences.includes(option)}
                        onClick={() =>
                          setPreferences({
                            ...preferences,
                            culturalPreferences: toggleArrayItem(
                              preferences.culturalPreferences,
                              option
                            ),
                          })
                        }>
                        <span className="font-medium text-foreground">{option}</span>
                      </OptionButton>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-8" />

              <div className="flex justify-between">
                <Button
                  onClick={handleBack}
                  disabled={step === 1}
                  variant="secondary"
                  size="lg"
                  className="rounded-xl gap-2">
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back</span>
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  size="lg"
                  className="rounded-xl gap-2 bg-lilac-600 text-white hover:bg-lilac-700 disabled:bg-muted disabled:text-muted-foreground">
                  <span>{step === totalSteps ? "Generate Itineraries" : "Next"}</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
