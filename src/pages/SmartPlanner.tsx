import { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Home, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Preferences {
  travelType: 'domestic' | 'international' | '';
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
    travelType: '',
    destination: '',
    travelMonth: '',
    duration: '',
    travelers: '',
    budget: '',
    interests: [],
    accommodation: '',
    specialNeeds: [],
    culturalPreferences: [],
  });

  const totalSteps = 10;

  const domesticDestinations = [
    'Maharashtra',
    'Tamil Nadu',
    'West Bengal',
    'Gujarat',
    'Rajasthan',
    'Kerala',
    'Uttarakhand',
    'Varanasi',
    'Goa',
    'Ladakh',
    'Himachal Pradesh',
    'Karnataka',
    'Jammu & Kashmir',
    'Sikkim',
    'Assam',
    'Meghalaya',
    'North East India',
  ];

  const internationalDestinations = [
    'Maldives',
    'Dubai',
    'Thailand',
    'Singapore',
    'Bali',
    'Malaysia',
    'Sri Lanka',
    'Nepal',
    'Bhutan',
    'Vietnam',
    'Turkey',
    'Switzerland',
    'Paris',
    'London',
  ];

  const destinations = preferences.travelType === 'domestic' ? domesticDestinations : internationalDestinations;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const durations = ['3-5 days', '6-8 days', '9-12 days', '13-15 days', '15+ days'];
  const travelerCounts = ['Solo', '2 people', '3-4 people', '5-8 people', '9+ people'];
  const budgetTiers = ['Economic', 'Mid-Luxury', 'Luxury'];

  const interestOptions = [
    'Adventure sports',
    'Wildlife & nature',
    'Photography',
    'Food & cuisine',
    'Shopping',
    'Trekking & hiking',
    'Beach activities',
    'Historical sites',
  ];

  const accommodationTypes = ['Budget hotels', '3-4 star hotels', '5-star hotels & resorts'];

  const specialNeedsOptions = [
    'Honeymoon package',
    'Kids-friendly',
    'Elderly-friendly',
    'Vegetarian meals',
    'Wheelchair accessible',
  ];

  const culturalOptions = [
    'Pilgrimage sites (temples, churches, mosques)',
    'Festival tourism (Durga Puja, Kumbh Mela, etc.)',
    'Heritage walks & UNESCO sites',
    'Spiritual retreats (yoga, meditation)',
    'Buddhist circuit',
    'Regional yatras',
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate('/itinerary-results', { state: { preferences } });
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
        return preferences.travelType !== '';
      case 2:
        return preferences.destination !== '';
      case 3:
        return preferences.travelMonth !== '';
      case 4:
        return preferences.duration !== '';
      case 5:
        return preferences.travelers !== '';
      case 6:
        return preferences.budget !== '';
      case 7:
        return preferences.interests.length > 0;
      case 8:
        return preferences.accommodation !== '';
      case 9:
        return true;
      case 10:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-20 pb-16 transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Smart Trip Planner</h1>
          </div>
          <p className="text-gray-600">
            Answer a few questions and get 3 personalized itineraries
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 transition-colors duration-200">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What type of travel package are you looking for?
              </h2>
              <p className="text-gray-600 mb-6">Choose between domestic or international travel</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                  onClick={() => setPreferences({ ...preferences, travelType: 'domestic' })}
                  className={`p-8 rounded-lg border-2 text-center transition ${
                    preferences.travelType === 'domestic'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Home className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <span className="text-xl font-bold block mb-2">Domestic Tour Packages</span>
                  <span className="text-gray-600 text-sm">Explore destinations within India</span>
                </button>
                <button
                  onClick={() => setPreferences({ ...preferences, travelType: 'international' })}
                  className={`p-8 rounded-lg border-2 text-center transition ${
                    preferences.travelType === 'international'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Globe className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <span className="text-xl font-bold block mb-2">International Tour Packages</span>
                  <span className="text-gray-600 text-sm">Discover destinations around the world</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Where would you like to go?
              </h2>
              <p className="text-gray-600 mb-6">
                Choose your preferred {preferences.travelType} destination
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {destinations.map((dest) => (
                  <button
                    key={dest}
                    onClick={() => setPreferences({ ...preferences, destination: dest })}
                    className={`p-4 rounded-lg border-2 text-left transition ${
                      preferences.destination === dest
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="font-medium text-gray-900">{dest}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                When are you planning to travel?
              </h2>
              <p className="text-gray-600 mb-6">Select your preferred month</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => setPreferences({ ...preferences, travelMonth: month })}
                    className={`p-4 rounded-lg border-2 text-center transition ${
                      preferences.travelMonth === month
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="font-medium text-gray-900">{month}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                How long is your trip?
              </h2>
              <p className="text-gray-600 mb-6">Select the duration</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {durations.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setPreferences({ ...preferences, duration })}
                    className={`p-4 rounded-lg border-2 text-center transition ${
                      preferences.duration === duration
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="font-medium">{duration}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                How many travelers?
              </h2>
              <p className="text-gray-600 mb-6">Including yourself</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {travelerCounts.map((count) => (
                  <button
                    key={count}
                    onClick={() => setPreferences({ ...preferences, travelers: count })}
                    className={`p-4 rounded-lg border-2 text-center transition ${
                      preferences.travelers === count
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="font-medium">{count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose your package tier
              </h2>
              <p className="text-gray-600 mb-6">Select the experience level that suits you best</p>
              <div className="grid grid-cols-1 gap-4">
                {budgetTiers.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setPreferences({ ...preferences, budget: tier })}
                    className={`p-6 rounded-lg border-2 text-left transition ${
                      preferences.budget === tier
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="font-bold text-xl block mb-2">{tier}</span>
                    <span className="text-sm text-gray-600">
                      {tier === 'Economic' && 'Budget-friendly travel with essential amenities'}
                      {tier === 'Mid-Luxury' && 'Comfortable experience with quality services'}
                      {tier === 'Luxury' && 'Premium experience with exclusive benefits'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What are your interests?
              </h2>
              <p className="text-gray-600 mb-6">Select all that apply</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        interests: toggleArrayItem(preferences.interests, interest),
                      })
                    }
                    className={`p-4 rounded-lg border-2 text-left transition ${
                      preferences.interests.includes(interest)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="font-medium">{interest}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 8 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Accommodation preference?
              </h2>
              <p className="text-gray-600 mb-6">Choose your comfort level</p>
              <div className="grid grid-cols-1 gap-4">
                {accommodationTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setPreferences({ ...preferences, accommodation: type })}
                    className={`p-4 rounded-lg border-2 text-left transition ${
                      preferences.accommodation === type
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="font-medium text-lg">{type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 9 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Any special needs?
              </h2>
              <p className="text-gray-600 mb-6">Select all that apply (optional)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specialNeedsOptions.map((need) => (
                  <button
                    key={need}
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        specialNeeds: toggleArrayItem(preferences.specialNeeds, need),
                      })
                    }
                    className={`p-4 rounded-lg border-2 text-left transition ${
                      preferences.specialNeeds.includes(need)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="font-medium">{need}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 10 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Cultural & Religious Preferences
              </h2>
              <p className="text-gray-600 mb-6">
                Select experiences you would like to include (optional)
              </p>
              <div className="grid grid-cols-1 gap-4">
                {culturalOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        culturalPreferences: toggleArrayItem(
                          preferences.culturalPreferences,
                          option
                        ),
                      })
                    }
                    className={`p-4 rounded-lg border-2 text-left transition ${
                      preferences.culturalPreferences.includes(option)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition ${
                step === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition ${
                canProceed()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{step === totalSteps ? 'Generate Itineraries' : 'Next'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
