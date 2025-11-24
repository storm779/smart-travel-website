import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Sparkles, Calendar, MapPin, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  calculatePrice,
  getDurationDays,
  generateDifferentiatedActivities,
  getDestinationData,
  getDestinationImages,
  getHotelName,
} from '../utils/itineraryGenerator';

interface Itinerary {
  title: string;
  type: 'economic' | 'middle_luxury' | 'luxury';
  totalPrice: number;
  pricePerPerson: number;
  hotelName: string;
  days: Array<{
    day: number;
    title: string;
    activities: string[];
  }>;
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  images: string[];
}

export default function ItineraryResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
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
    if (selectedTier === 'Luxury') return 2;
    return 1; // Default to middle tier
  };

  const generateItineraries = () => {
    setTimeout(() => {
      const numTravelers = getTravelerCount(preferences.travelers);
      const days = getDurationDays(preferences.duration);
      const images = getDestinationImages(preferences.destination, preferences.travelType);
      const destData = getDestinationData(preferences.destination, preferences.travelType);

      const economicPrice = calculatePrice(
        preferences.destination,
        preferences.travelType,
        preferences.duration,
        'economic',
        preferences.accommodation
      );

      const middleLuxuryPrice = calculatePrice(
        preferences.destination,
        preferences.travelType,
        preferences.duration,
        'middle_luxury',
        preferences.accommodation
      );

      const luxuryPrice = calculatePrice(
        preferences.destination,
        preferences.travelType,
        preferences.duration,
        'luxury',
        preferences.accommodation
      );

      const economicHotel = getHotelName(
        preferences.destination,
        preferences.travelType,
        'economic',
        preferences.accommodation
      );

      const middleLuxuryHotel = getHotelName(
        preferences.destination,
        preferences.travelType,
        'middle_luxury',
        preferences.accommodation
      );

      const luxuryHotel = getHotelName(
        preferences.destination,
        preferences.travelType,
        'luxury',
        preferences.accommodation
      );

      const generated: Itinerary[] = [
        {
          title: 'Economic Package',
          type: 'economic',
          pricePerPerson: economicPrice,
          totalPrice: economicPrice * numTravelers,
          hotelName: economicHotel,
          days: generateDayPlan(days, 'economic'),
          inclusions: getInclusions('economic', preferences.travelType, economicHotel),
          exclusions: getExclusions('economic', preferences.travelType),
          highlights: getHighlights('economic', destData),
          images: images,
        },
        {
          title: 'Mid-Luxury Package',
          type: 'middle_luxury',
          pricePerPerson: middleLuxuryPrice,
          totalPrice: middleLuxuryPrice * numTravelers,
          hotelName: middleLuxuryHotel,
          days: generateDayPlan(days, 'middle_luxury'),
          inclusions: getInclusions('middle_luxury', preferences.travelType, middleLuxuryHotel),
          exclusions: getExclusions('middle_luxury', preferences.travelType),
          highlights: getHighlights('middle_luxury', destData),
          images: images,
        },
        {
          title: 'Luxury Package',
          type: 'luxury',
          pricePerPerson: luxuryPrice,
          totalPrice: luxuryPrice * numTravelers,
          hotelName: luxuryHotel,
          days: generateDayPlan(days, 'luxury'),
          inclusions: getInclusions('luxury', preferences.travelType, luxuryHotel),
          exclusions: getExclusions('luxury', preferences.travelType),
          highlights: getHighlights('luxury', destData),
          images: images,
        },
      ];

      setItineraries(generated);
      setLoading(false);
    }, 1500);
  };

  const getTravelerCount = (travelers: string): number => {
    if (travelers === 'Solo') return 1;
    if (travelers === '2 people') return 2;
    if (travelers === '3-4 people') return 4;
    if (travelers === '5-8 people') return 6;
    return 10;
  };

  const getInclusions = (type: string, travelType: string, hotelName: string): string[] => {
    const isDomestic = travelType === 'domestic';

    if (type === 'economic') {
      return [
        `Accommodation at ${hotelName}`,
        'Daily breakfast',
        'Shared transportation',
        'Basic sightseeing',
        isDomestic ? 'Train/bus tickets' : 'Airport transfers',
      ];
    } else if (type === 'middle_luxury') {
      return [
        `Accommodation at ${hotelName}`,
        'Daily breakfast and dinner',
        'AC private vehicle',
        'Professional guide',
        'All monument entry fees',
        'Cultural experience tickets',
        isDomestic ? 'Domestic transfers' : 'Airport transfers and local transport',
      ];
    } else {
      return [
        `Accommodation at ${hotelName}`,
        'All meals included (breakfast, lunch, dinner)',
        'Private luxury vehicle with chauffeur',
        'Expert guide with cultural insights',
        'VIP entry and skip-the-line access',
        'Spa and wellness sessions',
        'Premium cultural experiences',
        'Complimentary beverages',
        isDomestic ? 'Premium transport' : 'Airport fast-track service',
      ];
    }
  };

  const getExclusions = (type: string, travelType: string): string[] => {
    const isDomestic = travelType === 'domestic';

    if (type === 'economic') {
      return [
        'Lunch and dinner',
        'Entry fees to monuments',
        'Personal expenses',
        'Travel insurance',
        isDomestic ? 'Any airfare' : 'International flights',
        'Tips and gratuities',
      ];
    } else if (type === 'middle_luxury') {
      return [
        'Lunch',
        'Personal expenses',
        'Tips and gratuities',
        'Travel insurance',
        isDomestic ? 'Domestic flights (if not included)' : 'International flights',
        'Additional activities',
      ];
    } else {
      return [
        isDomestic ? 'Domestic flights (can be arranged)' : 'International flights',
        'Personal shopping',
        'Alcoholic beverages',
        'Tips (recommended but optional)',
        'Travel insurance',
      ];
    }
  };

  const getHighlights = (
    type: string,
    destData: { cities: string[]; attractions: string[]; categories: string[] }
  ): string[] => {
    const culturalPrefs = preferences.culturalPreferences || [];
    const interests = preferences.interests || [];
    const highlights = [];

    // Add destination-specific highlights
    highlights.push(`Explore ${destData.cities.slice(0, 3).join(', ')}`);
    highlights.push(`Visit ${destData.attractions.slice(0, 2).join(' & ')}`);

    if (type === 'economic') {
      highlights.push('Budget-friendly travel experience');
      highlights.push('Shared group transportation');
      highlights.push('Essential sightseeing covered');
      if (interests.includes('Food & cuisine')) {
        highlights.push('Local street food recommendations');
      }
    } else if (type === 'middle_luxury') {
      highlights.push('Comfortable private transport');
      highlights.push('4-star quality accommodations');
      highlights.push('Professional guided tours');
      if (culturalPrefs.includes('Heritage walks & UNESCO sites')) {
        highlights.push('Expert-guided heritage tours');
      }
      if (interests.includes('Photography')) {
        highlights.push('Photography-focused stops');
      }
    } else {
      highlights.push('5-star luxury accommodations');
      highlights.push('VIP and exclusive experiences');
      highlights.push('Private luxury transportation');
      highlights.push('Personalized service throughout');
      if (culturalPrefs.includes('Spiritual retreats (yoga, meditation)')) {
        highlights.push('Private wellness and spiritual sessions');
      }
      if (interests.includes('Adventure sports')) {
        highlights.push('Premium adventure activities');
      }
    }

    return highlights;
  };

  const generateDayPlan = (
    numDays: number,
    type: 'economic' | 'middle_luxury' | 'luxury'
  ): Array<{ day: number; title: string; activities: string[] }> => {
    const plans = [];
    const destination = preferences.destination;
    const interests = preferences.interests || [];
    const culturalPrefs = preferences.culturalPreferences || [];
    const destData = getDestinationData(destination, preferences.travelType);

    for (let i = 1; i <= numDays; i++) {
      const activities = generateDifferentiatedActivities(
        destination,
        preferences.travelType,
        type,
        i,
        numDays,
        interests,
        culturalPrefs
      );

      let dayTitle = '';
      if (i === 1) {
        dayTitle = `Arrival at ${destination}`;
      } else if (i === numDays) {
        dayTitle = 'Departure Day';
      } else {
        const subCity = destData.cities[i % destData.cities.length];
        dayTitle = `${subCity} Exploration`;
      }

      plans.push({
        day: i,
        title: dayTitle,
        activities: activities,
      });
    }

    return plans;
  };

  const handleSelectItinerary = (itinerary: Itinerary) => {
    if (!user) {
      navigate('/login', { state: { returnTo: '/itinerary-results' } });
    } else {
      navigate('/book-custom', { state: { itinerary, preferences } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-20 pb-16 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <Sparkles className="h-16 w-16 text-blue-600 animate-pulse mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Creating Your Perfect Itineraries...
          </h2>
          <p className="text-gray-600">Analyzing {preferences.travelType} destinations</p>
          <p className="text-gray-500 text-sm mt-2">Customizing for your preferences</p>
        </div>
      </div>
    );
  }

  const numTravelers = getTravelerCount(preferences.travelers);
  const destData = getDestinationData(preferences.destination, preferences.travelType);
  const recommendedIndex = getUserSelectedTierIndex();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-20 pb-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Personalized {preferences.travelType === 'domestic' ? 'Domestic' : 'International'} Itineraries
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            We have created 3 custom packages based on your preferences
          </p>
          <p className="text-sm text-gray-500">
            Including {destData.cities.slice(0, 4).join(', ')}
            {destData.cities.length > 4 && ' and more'}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>{preferences.destination}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>{preferences.duration}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow">
              <Users className="h-4 w-4 text-blue-600" />
              <span>{preferences.travelers}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {itineraries.map((itinerary, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-xl overflow-hidden ${
                index === recommendedIndex ? 'lg:scale-105 lg:z-10' : ''
              }`}
            >
              {index === recommendedIndex && (
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2 font-semibold">
                  RECOMMENDED
                </div>
              )}

              <div className="relative h-48 overflow-hidden">
                <img
                  src={itinerary.images[0]}
                  alt={preferences.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{itinerary.title}</h3>
                  <p className="text-sm mt-1">
                    {itinerary.type === 'economic'
                      ? 'Best Value'
                      : itinerary.type === 'middle_luxury'
                      ? 'Comfort & Quality'
                      : 'Premium Experience'}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-1">
                    ₹{itinerary.pricePerPerson.toLocaleString('en-IN')}
                  </div>
                  <p className="text-gray-600">per person</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Total: ₹{itinerary.totalPrice.toLocaleString('en-IN')} for {numTravelers}{' '}
                    {numTravelers === 1 ? 'traveler' : 'travelers'}
                  </p>
                </div>

                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Accommodation
                  </h4>
                  <p className="text-sm text-gray-700 font-medium ml-7">
                    {itinerary.hotelName}
                  </p>
                  <p className="text-xs text-gray-500 ml-7 mt-1">
                    {itinerary.type === 'economic' && 'Budget category hotel with essential amenities'}
                    {itinerary.type === 'middle_luxury' && '4-star hotel with premium facilities'}
                    {itinerary.type === 'luxury' && '5-star luxury property with world-class amenities'}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Package Highlights</h4>
                  <ul className="space-y-2">
                    {itinerary.highlights.slice(0, 5).map((highlight, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Day-wise Itinerary</h4>
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                    {itinerary.days.map((day) => (
                      <div key={day.day} className="border-l-2 border-blue-600 pl-3">
                        <p className="font-medium text-gray-900 text-sm">
                          Day {day.day}: {day.title}
                        </p>
                        <ul className="mt-1 space-y-1">
                          {day.activities.slice(0, 4).map((activity, i) => (
                            <li key={i} className="text-xs text-gray-600">
                              • {activity}
                            </li>
                          ))}
                          {day.activities.length > 4 && (
                            <li className="text-xs text-blue-600 font-medium">
                              + {day.activities.length - 4} more activities
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Inclusions</h4>
                  <ul className="space-y-1">
                    {itinerary.inclusions.slice(0, 5).map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                    {itinerary.inclusions.length > 5 && (
                      <li className="text-xs text-blue-600 font-medium pl-6">
                        + {itinerary.inclusions.length - 5} more inclusions
                      </li>
                    )}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectItinerary(itinerary)}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    index === recommendedIndex
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Select & Book This Package
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/smart-planner')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Modify Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
