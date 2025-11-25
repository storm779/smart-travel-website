import { Place, fetchTouristPlaces, filterPlacesByBudget, groupPlacesByDay } from '../services/placesApi';

export interface EnhancedActivity {
  type: 'place' | 'service' | 'experience';
  name: string;
  description?: string;
  category?: string;
  rating?: number;
  placeData?: Place;
}

const getArrivalActivities = (tier: 'economic' | 'middle_luxury' | 'luxury'): EnhancedActivity[] => {
  if (tier === 'luxury') {
    return [
      { type: 'service', name: 'Private airport transfer with meet & greet service' },
      { type: 'service', name: 'Check-in to 5-star luxury hotel with welcome drinks' },
      { type: 'experience', name: 'Spa session or massage' },
      { type: 'experience', name: 'Fine dining at hotel signature restaurant' },
    ];
  } else if (tier === 'middle_luxury') {
    return [
      { type: 'service', name: 'Airport transfer with assistance' },
      { type: 'service', name: 'Check-in to 4-star hotel' },
      { type: 'service', name: 'Welcome refreshments' },
      { type: 'experience', name: 'Dinner at popular local restaurant' },
    ];
  } else {
    return [
      { type: 'service', name: 'Airport/station pick-up' },
      { type: 'service', name: 'Check-in to budget hotel' },
      { type: 'service', name: 'Rest and freshen up' },
      { type: 'experience', name: 'Local dinner' },
    ];
  }
};

const getDepartureActivities = (tier: 'economic' | 'middle_luxury' | 'luxury'): EnhancedActivity[] => {
  if (tier === 'luxury') {
    return [
      { type: 'experience', name: 'Relaxing spa and wellness session' },
      { type: 'service', name: 'Gourmet breakfast' },
      { type: 'experience', name: 'Private shopping assistance' },
      { type: 'service', name: 'Luxury vehicle drop to airport' },
    ];
  } else if (tier === 'middle_luxury') {
    return [
      { type: 'service', name: 'Morning leisure time' },
      { type: 'service', name: 'Breakfast' },
      { type: 'experience', name: 'Shopping at premium outlets' },
      { type: 'service', name: 'Comfortable airport transfer' },
    ];
  } else {
    return [
      { type: 'service', name: 'Morning free time' },
      { type: 'service', name: 'Breakfast' },
      { type: 'experience', name: 'Last minute local shopping' },
      { type: 'service', name: 'Airport/station drop' },
    ];
  }
};

const formatPlaceActivity = (
  place: Place,
  tier: 'economic' | 'middle_luxury' | 'luxury'
): EnhancedActivity => {
  let prefix = 'Visit';

  if (tier === 'luxury') {
    prefix = 'Private guided tour of';
  } else if (tier === 'middle_luxury') {
    prefix = 'Guided visit to';
  }

  const description = place.description || `Explore this ${place.category}`;

  return {
    type: 'place',
    name: `${prefix} ${place.name}`,
    description: `${description}${place.rating ? ` - Rating: ${place.rating}/7` : ''}`,
    category: place.category,
    rating: place.rating,
    placeData: place,
  };
};

const addExperienceBasedActivities = (
  activities: EnhancedActivity[],
  interests: string[],
  culturalPrefs: string[],
  tier: 'economic' | 'middle_luxury' | 'luxury'
): void => {
  if (interests.includes('Food & cuisine')) {
    if (tier === 'luxury') {
      activities.push({
        type: 'experience',
        name: 'Private cooking class with celebrity chef',
        description: 'Learn authentic local cuisine',
      });
    } else if (tier === 'middle_luxury') {
      activities.push({
        type: 'experience',
        name: 'Food walking tour with local guide',
        description: 'Taste the best local flavors',
      });
    } else {
      activities.push({
        type: 'experience',
        name: 'Local street food tasting',
        description: 'Experience authentic local cuisine',
      });
    }
  }

  if (interests.includes('Adventure sports')) {
    if (tier === 'luxury') {
      activities.push({
        type: 'experience',
        name: 'Premium adventure activities with personal instructor',
      });
    } else if (tier === 'middle_luxury') {
      activities.push({
        type: 'experience',
        name: 'Guided adventure activities',
      });
    } else {
      activities.push({
        type: 'experience',
        name: 'Basic adventure activities',
      });
    }
  }

  if (interests.includes('Shopping')) {
    if (tier === 'luxury') {
      activities.push({
        type: 'experience',
        name: 'Personal shopping tour at high-end boutiques',
      });
    } else if (tier === 'middle_luxury') {
      activities.push({
        type: 'experience',
        name: 'Shopping at popular malls and markets',
      });
    } else {
      activities.push({
        type: 'experience',
        name: 'Local bazaar and street market shopping',
      });
    }
  }

  if (culturalPrefs.includes('Pilgrimage sites (temples, churches, mosques)')) {
    if (tier === 'luxury') {
      activities.push({
        type: 'experience',
        name: 'VIP darshan with special access and priest blessings',
      });
    } else if (tier === 'middle_luxury') {
      activities.push({
        type: 'experience',
        name: 'Temple visit with guide explaining significance',
      });
    }
  }

  if (culturalPrefs.includes('Spiritual retreats (yoga, meditation)')) {
    if (tier === 'luxury') {
      activities.push({
        type: 'experience',
        name: 'Private yoga and meditation with renowned master',
      });
    } else if (tier === 'middle_luxury') {
      activities.push({
        type: 'experience',
        name: 'Group yoga and meditation session',
      });
    } else {
      activities.push({
        type: 'experience',
        name: 'Morning yoga class',
      });
    }
  }

  if (tier === 'luxury') {
    activities.push({
      type: 'experience',
      name: 'Gourmet dinner at award-winning restaurant',
    });
  } else if (tier === 'middle_luxury') {
    activities.push({
      type: 'experience',
      name: 'Dinner at recommended restaurant',
    });
  } else {
    activities.push({
      type: 'experience',
      name: 'Local dinner',
    });
  }
};

export const generateEnhancedActivities = async (
  destination: string,
  travelType: 'domestic' | 'international',
  tier: 'economic' | 'middle_luxury' | 'luxury',
  dayNumber: number,
  totalDays: number,
  interests: string[],
  culturalPrefs: string[],
  cachedPlaces?: Place[]
): Promise<EnhancedActivity[]> => {
  if (dayNumber === 1) {
    return getArrivalActivities(tier);
  }

  if (dayNumber === totalDays) {
    return getDepartureActivities(tier);
  }

  const activities: EnhancedActivity[] = [];

  if (cachedPlaces && cachedPlaces.length > 0) {
    const dayIndex = dayNumber - 2;
    const placesPerDay = tier === 'luxury' ? 3 : tier === 'middle_luxury' ? 4 : 5;
    const startIndex = dayIndex * placesPerDay;
    const dayPlaces = cachedPlaces.slice(startIndex, startIndex + placesPerDay);

    dayPlaces.forEach(place => {
      activities.push(formatPlaceActivity(place, tier));
    });

    if (dayPlaces.length > 0 && dayNumber === 2) {
      addExperienceBasedActivities(activities, interests, culturalPrefs, tier);
    }
  }

  if (activities.length === 0) {
    activities.push({
      type: 'experience',
      name: 'City exploration and sightseeing',
      description: 'Discover local attractions and culture',
    });
    activities.push({
      type: 'experience',
      name: 'Visit local markets and shopping areas',
    });
    addExperienceBasedActivities(activities, interests, culturalPrefs, tier);
  }

  return activities;
};

export const fetchAndCachePlaces = async (
  destination: string,
  interests: string[],
  culturalPrefs: string[],
  tier: 'economic' | 'middle_luxury' | 'luxury'
): Promise<Place[]> => {
  try {
    let places = await fetchTouristPlaces(destination, interests, culturalPrefs);

    if (places.length === 0) {
      console.warn(`No places found for ${destination}, using fallback`);
      return [];
    }

    places = filterPlacesByBudget(places, tier);

    return places;
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
};
