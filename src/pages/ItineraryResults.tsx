import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  XCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  calculatePrice,
  getDurationDays,
  generateDifferentiatedActivities,
  getDestinationData,
  getDestinationImages,
  getHotelName,
  getTransportDetails,
  getInclusions,
  getExclusions,
} from '../utils/itineraryGenerator';

interface Itinerary {
  title: string;
  type: 'economic' | 'middle_luxury' | 'luxury';
  totalPrice: number;
  pricePerPerson: number;
  hotelName: string;
  transportDetails: string[];
  inclusions: string[];
  exclusions: string[];
  duration: string;
  days: Array<{
    day: number;
    title: string;
    activities: string[];
  }>;
  highlights: string[];
  images: string[];
  destination: string;
  cities: string[];
  attractions: string[];
}

export default function ItineraryResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const preferences = location.state?.preferences;

  useEffect(() => {
    if (!preferences) {
      navigate('/smart-planner');
      return;
    }
    generateItineraries();
  }, [preferences]);

  const getUserSelectedTierIndex = (): number => {
    const selectedTier = preferences.budget;
    if (selectedTier === 'Economic') return 0;
    if (selectedTier === 'Mid-Luxury') return 1;
    return 2;
  };

  const generateItineraries = () => {
    const tiers: Array<{ type: 'economic' | 'middle_luxury' | 'luxury'; title: string; description: string }> = [
      { type: 'economic', title: 'Economic Package', description: 'Budget-friendly with essential amenities' },
      { type: 'middle_luxury', title: 'Mid-Luxury Package', description: 'Balanced comfort and value' },
      { type: 'luxury', title: 'Luxury Package', description: 'Premium experience with finest services' },
    ];

    const days = getDurationDays(preferences.duration);
    const destData = getDestinationData(preferences.destination, preferences.travelType);

    const generatedItineraries = tiers.map((tier) => {
      const totalPrice = calculatePrice(
        preferences.destination,
        preferences.travelType,
        preferences.duration,
        tier.type,
        preferences.accommodation
      );

      const pricePerPerson = Math.round(totalPrice / (preferences.travelers || 2));

      const dayPlans = Array.from({ length: days }, (_, i) => {
        const dayNumber = i + 1;
        const activities = generateDifferentiatedActivities(
          preferences.destination,
          preferences.travelType,
          tier.type,
          dayNumber,
          days,
          preferences.interests || [],
          preferences.culturalPreferences || []
        );

        let title = '';
        if (dayNumber === 1) {
          title = `Arrival in ${preferences.destination}`;
        } else if (dayNumber === days) {
          title = `Departure from ${preferences.destination}`;
        } else {
          const cityIndex = (dayNumber - 2) % destData.cities.length;
          title = `Explore ${destData.cities[cityIndex]}`;
        }

        return {
          day: dayNumber,
          title,
          activities,
        };
      });

      return {
        title: `${preferences.destination} - ${tier.title}`,
        type: tier.type,
        totalPrice,
        pricePerPerson,
        hotelName: getHotelName(
          preferences.destination,
          preferences.travelType,
          tier.type,
          preferences.accommodation
        ),
        transportDetails: getTransportDetails(preferences.travelType, tier.type),
        inclusions: getInclusions(tier.type, days),
        exclusions: getExclusions(),
        duration: `${days} Days / ${days - 1} Nights`,
        days: dayPlans,
        highlights: destData.attractions.slice(0, 6),
        images: getDestinationImages(preferences.destination, preferences.travelType),
        destination: preferences.destination,
        cities: destData.cities,
        attractions: destData.attractions,
      };
    });

    setItineraries(generatedItineraries);
    setLoading(false);
  };

  const handleBookItinerary = (itinerary: Itinerary) => {
    if (!user) {
      navigate('/login', { state: { from: '/itinerary-results' } });
      return;
    }

    navigate('/book-custom', {
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
    if (type === 'luxury') return 'from-yellow-400 to-orange-500';
    if (type === 'middle_luxury') return 'from-blue-500 to-cyan-500';
    return 'from-green-500 to-emerald-500';
  };

  const getTierBadgeColor = (type: string) => {
    if (type === 'luxury') return 'bg-yellow-500';
    if (type === 'middle_luxury') return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getTierLabel = (type: string) => {
    if (type === 'luxury') return 'LUXURY';
    if (type === 'middle_luxury') return 'MID-LUXURY';
    return 'ECONOMIC';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-xl text-gray-600">Crafting your perfect itinerary...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-10 w-10 text-yellow-500 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Perfect Travel Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Personalized itineraries crafted just for you. Choose your preferred package below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {itineraries.map((itinerary, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                index === getRecommendedIndex() ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              {index === getRecommendedIndex() && (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 text-center text-sm font-semibold">
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
                  <span className={`${getTierBadgeColor(itinerary.type)} text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm`}>
                    {getTierLabel(itinerary.type)}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">{itinerary.destination}</h2>
                  <p className="text-sm text-gray-200">{itinerary.duration}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Cost</p>
                      <p className="text-3xl font-bold text-gray-900">
                        ₹{itinerary.totalPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <IndianRupee className="h-10 w-10 text-blue-600" />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Camera className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Top Highlights</h3>
                  </div>
                  <div className="space-y-2">
                    {itinerary.highlights.slice(0, 3).map((highlight, hIndex) => (
                      <div key={hIndex} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedItinerary(itinerary)}
                    className={`w-full bg-gradient-to-r ${getTierColor(itinerary.type)} text-white font-bold py-3 px-4 rounded-xl transition transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2`}
                  >
                    <Info className="h-5 w-5" />
                    <span>More Info</span>
                  </button>

                  <button
                    onClick={() => handleBookItinerary(itinerary)}
                    className="w-full bg-white border-2 border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400 font-semibold py-3 px-4 rounded-xl transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedItinerary && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 animate-fade-in">
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
                className="absolute top-6 right-6 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-full transition"
              >
                <XCircle className="h-6 w-6" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`${getTierBadgeColor(selectedItinerary.type)} px-4 py-2 rounded-full text-sm font-semibold`}>
                    {getTierLabel(selectedItinerary.type)}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-3">
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
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <IndianRupee className="h-6 w-6 text-blue-600" />
                    <span className="text-sm text-gray-600 font-medium">Total Cost</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    ₹{selectedItinerary.totalPrice.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-6 w-6 text-green-600" />
                    <span className="text-sm text-gray-600 font-medium">Duration</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{selectedItinerary.duration}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Camera className="h-6 w-6 mr-2 text-blue-600" />
                  Top Attractions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedItinerary.highlights.map((highlight, hIndex) => (
                    <div key={hIndex} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition">
                      <p className="text-sm font-medium text-gray-900">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                  Day-by-Day Itinerary
                </h3>
                <div className="space-y-4">
                  {selectedItinerary.days.map((day) => (
                    <div key={day.day} className="border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 transition">
                      <button
                        onClick={() => toggleDay(day.day)}
                        className="w-full bg-gradient-to-r from-gray-50 to-white p-6 flex items-center justify-between hover:from-blue-50 hover:to-blue-50 transition"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                            {day.day}
                          </div>
                          <div className="text-left">
                            <p className="text-sm text-gray-500 font-medium">Day {day.day}</p>
                            <p className="text-lg font-bold text-gray-900">{day.title}</p>
                          </div>
                        </div>
                        <ChevronDown
                          className={`h-6 w-6 text-gray-400 transition-transform ${
                            expandedDay === day.day ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>

                      {expandedDay === day.day && (
                        <div className="p-6 bg-white border-t border-gray-100 animate-fade-in">
                          <ul className="space-y-3">
                            {day.activities.map((activity, aIndex) => (
                              <li key={aIndex} className="flex items-start space-x-3">
                                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <Hotel className="h-6 w-6 text-green-600" />
                    <h3 className="text-xl font-bold text-gray-900">Hotel Details</h3>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-4">{selectedItinerary.hotelName}</p>
                  <p className="text-sm text-gray-600">
                    {selectedItinerary.type === 'luxury' ? '5-Star Luxury Property' :
                     selectedItinerary.type === 'middle_luxury' ? '4-Star Premium Hotel' :
                     'Comfortable Budget Hotel'}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <Car className="h-6 w-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Transport</h3>
                  </div>
                  <ul className="space-y-2">
                    {selectedItinerary.transportDetails.map((detail, dIndex) => (
                      <li key={dIndex} className="flex items-start space-x-2 text-sm text-gray-700">
                        <Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
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
                      <li key={iIndex} className="flex items-start space-x-2 text-sm text-gray-700">
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
                      <li key={eIndex} className="flex items-start space-x-2 text-sm text-gray-700">
                        <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>{exclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleBookItinerary(selectedItinerary)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition transform hover:scale-105 shadow-lg"
                >
                  Book This Package
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate('/smart-planner')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-xl transition"
          >
            Generate New Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}
