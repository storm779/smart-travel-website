import { Place } from '../services/placesApi';
import { getCityActivities, getGenericActivities, CityActivity } from '../data/cityActivities';

export interface DayPlan {
  day: number;
  city: string;
  title: string;
  shortSummary: string;
  activities: {
    title: string;
    subtitle?: string;
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
    category?: string;
  }[];
}

interface UsedActivityTracker {
  titles: Set<string>;
  categories: Map<string, number>;
}

const normalizeActivityTitle = (title: string): string => {
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
};

const isActivityTooSimilar = (newActivity: string, usedTitles: Set<string>): boolean => {
  const normalized = normalizeActivityTitle(newActivity);
  const words = normalized.split(' ').filter(w => w.length > 3);

  for (const usedTitle of usedTitles) {
    const usedNormalized = normalizeActivityTitle(usedTitle);
    const usedWords = usedNormalized.split(' ').filter(w => w.length > 3);

    const commonWords = words.filter(w => usedWords.includes(w));
    if (commonWords.length >= Math.min(words.length, usedWords.length) * 0.6) {
      return true;
    }
  }

  return false;
};

const selectUniqueActivities = (
  availableActivities: CityActivity[],
  count: number,
  tier: 'economic' | 'middle_luxury' | 'luxury',
  usedTracker: UsedActivityTracker,
  timePreference?: 'morning' | 'afternoon' | 'evening'
): CityActivity[] => {
  const selected: CityActivity[] = [];
  const candidates = availableActivities.filter(act => {
    const tierMatch = !act.tier || act.tier === 'all' || act.tier === tier;
    const timeMatch = !timePreference || act.timeOfDay === 'any' || act.timeOfDay === timePreference;
    const notUsed = !usedTracker.titles.has(normalizeActivityTitle(act.title));
    const notSimilar = !isActivityTooSimilar(act.title, usedTracker.titles);

    return tierMatch && timeMatch && notUsed && notSimilar;
  });

  const categoryBalanced: CityActivity[] = [];
  const categoryCounts = new Map<string, number>();

  for (const activity of candidates) {
    const categoryCount = usedTracker.categories.get(activity.category) || 0;
    const currentCount = categoryCounts.get(activity.category) || 0;

    if (categoryCount + currentCount < 3) {
      categoryBalanced.push(activity);
      categoryCounts.set(activity.category, currentCount + 1);
    }
  }

  const finalCandidates = categoryBalanced.length >= count ? categoryBalanced : candidates;

  const timeSlots = ['morning', 'afternoon', 'evening'];
  for (const timeSlot of timeSlots) {
    const timeSpecific = finalCandidates.filter(
      act => act.timeOfDay === timeSlot || act.timeOfDay === 'any'
    );

    for (const activity of timeSpecific) {
      if (selected.length >= count) break;
      if (!selected.find(s => normalizeActivityTitle(s.title) === normalizeActivityTitle(activity.title))) {
        selected.push(activity);
        usedTracker.titles.add(normalizeActivityTitle(activity.title));
        usedTracker.categories.set(
          activity.category,
          (usedTracker.categories.get(activity.category) || 0) + 1
        );
      }
    }

    if (selected.length >= count) break;
  }

  while (selected.length < count && finalCandidates.length > selected.length) {
    for (const activity of finalCandidates) {
      if (selected.length >= count) break;
      if (!selected.find(s => normalizeActivityTitle(s.title) === normalizeActivityTitle(activity.title))) {
        selected.push(activity);
        usedTracker.titles.add(normalizeActivityTitle(activity.title));
        usedTracker.categories.set(
          activity.category,
          (usedTracker.categories.get(activity.category) || 0) + 1
        );
      }
    }
  }

  return selected;
};

const getActivitiesCountForTier = (tier: 'economic' | 'middle_luxury' | 'luxury'): number => {
  if (tier === 'luxury') return 4;
  if (tier === 'middle_luxury') return 5;
  return 6;
};

const generateArrivalDay = (
  dayNumber: number,
  destination: string,
  tier: 'economic' | 'middle_luxury' | 'luxury'
): DayPlan => {
  const activities: DayPlan['activities'] = [];

  if (tier === 'luxury') {
    activities.push(
      { title: 'Private airport transfer with meet & greet', timeOfDay: 'afternoon', category: 'service' },
      { title: 'Check-in to 5-star luxury hotel with welcome drinks', timeOfDay: 'afternoon', category: 'service' },
      { title: 'Spa session or relaxation', timeOfDay: 'evening', category: 'wellness' },
      { title: 'Fine dining at hotel signature restaurant', timeOfDay: 'evening', category: 'food' }
    );
  } else if (tier === 'middle_luxury') {
    activities.push(
      { title: 'Airport transfer with assistance', timeOfDay: 'afternoon', category: 'service' },
      { title: 'Check-in to 4-star hotel', timeOfDay: 'afternoon', category: 'service' },
      { title: 'Welcome refreshments and briefing', timeOfDay: 'afternoon', category: 'service' },
      { title: 'Dinner at popular local restaurant', timeOfDay: 'evening', category: 'food' }
    );
  } else {
    activities.push(
      { title: 'Airport/station pick-up', timeOfDay: 'afternoon', category: 'service' },
      { title: 'Check-in to comfortable hotel', timeOfDay: 'afternoon', category: 'service' },
      { title: 'Rest and freshen up', timeOfDay: 'afternoon', category: 'service' },
      { title: 'Local dinner near hotel', timeOfDay: 'evening', category: 'food' }
    );
  }

  return {
    day: dayNumber,
    city: destination,
    title: `Arrival in ${destination}`,
    shortSummary: 'Welcome and settle in',
    activities,
  };
};

const generateDepartureDay = (
  dayNumber: number,
  destination: string,
  tier: 'economic' | 'middle_luxury' | 'luxury'
): DayPlan => {
  const activities: DayPlan['activities'] = [];

  if (tier === 'luxury') {
    activities.push(
      { title: 'Relaxing morning spa session', timeOfDay: 'morning', category: 'wellness' },
      { title: 'Gourmet breakfast', timeOfDay: 'morning', category: 'food' },
      { title: 'Last-minute premium shopping', timeOfDay: 'morning', category: 'shopping' },
      { title: 'Luxury vehicle drop to airport', timeOfDay: 'afternoon', category: 'service' }
    );
  } else if (tier === 'middle_luxury') {
    activities.push(
      { title: 'Morning leisure time', timeOfDay: 'morning', category: 'service' },
      { title: 'Breakfast and check-out', timeOfDay: 'morning', category: 'service' },
      { title: 'Shopping at local outlets', timeOfDay: 'morning', category: 'shopping' },
      { title: 'Comfortable airport transfer', timeOfDay: 'afternoon', category: 'service' }
    );
  } else {
    activities.push(
      { title: 'Morning free time', timeOfDay: 'morning', category: 'service' },
      { title: 'Breakfast and check-out', timeOfDay: 'morning', category: 'service' },
      { title: 'Last-minute local shopping', timeOfDay: 'morning', category: 'shopping' },
      { title: 'Airport/station drop', timeOfDay: 'afternoon', category: 'service' }
    );
  }

  return {
    day: dayNumber,
    city: destination,
    title: `Departure from ${destination}`,
    shortSummary: 'Final shopping and departure',
    activities,
  };
};

const generateCitySpecificDay = (
  dayNumber: number,
  cityName: string,
  tier: 'economic' | 'middle_luxury' | 'luxury',
  interests: string[],
  usedTracker: UsedActivityTracker,
  apiPlaces?: Place[]
): DayPlan => {
  const activities: DayPlan['activities'] = [];
  const activitiesCount = getActivitiesCountForTier(tier);

  let cityActivities = getCityActivities(cityName);

  if (apiPlaces && apiPlaces.length > 0) {
    const apiBasedActivities: CityActivity[] = apiPlaces.slice(0, 10).map(place => ({
      title: `Visit ${place.name}`,
      subtitle: place.description || `Explore this ${place.category}`,
      category: place.category,
      timeOfDay: 'any' as const,
      tier: 'all' as const,
    }));

    cityActivities = [...apiBasedActivities, ...cityActivities];
  }

  if (cityActivities.length === 0) {
    cityActivities = getGenericActivities(interests);
  }

  const selectedActivities = selectUniqueActivities(
    cityActivities,
    activitiesCount,
    tier,
    usedTracker
  );

  selectedActivities.forEach(activity => {
    let activityTitle = activity.title;

    if (tier === 'luxury' && !activity.title.toLowerCase().includes('private') && !activity.title.toLowerCase().includes('vip')) {
      activityTitle = `Private guided ${activity.title.toLowerCase()}`;
    } else if (tier === 'middle_luxury' && !activity.title.toLowerCase().includes('guided')) {
      activityTitle = `Guided ${activity.title.toLowerCase()}`;
    }

    activities.push({
      title: activityTitle,
      subtitle: activity.subtitle,
      timeOfDay: activity.timeOfDay !== 'any' ? activity.timeOfDay : undefined,
      category: activity.category,
    });
  });

  const titleSuffix = generateCityTitleSuffix(cityName, activities);

  return {
    day: dayNumber,
    city: cityName,
    title: `Explore ${cityName}${titleSuffix}`,
    shortSummary: generateCitySummary(cityName, activities),
    activities,
  };
};

const generateCityTitleSuffix = (cityName: string, activities: DayPlan['activities']): string => {
  const categories = activities.map(a => a.category).filter(Boolean);
  const uniqueCategories = [...new Set(categories)];

  const categoryDescriptions: { [key: string]: string } = {
    'heritage': 'Heritage Sites',
    'nature': 'Nature & Landscapes',
    'cultural': 'Cultural Experiences',
    'religious': 'Spiritual Sites',
    'food': 'Culinary Journey',
    'shopping': 'Shopping & Markets',
    'adventure': 'Adventure Activities',
    'beach': 'Beaches & Coast',
    'wildlife': 'Wildlife & Nature',
    'leisure': 'City Highlights',
  };

  if (uniqueCategories.length > 0) {
    const mainCategory = uniqueCategories[0];
    const description = categoryDescriptions[mainCategory] || 'Highlights';
    return `'s ${description}`;
  }

  return ' Highlights';
};

const generateCitySummary = (cityName: string, activities: DayPlan['activities']): string => {
  if (activities.length === 0) return `Explore ${cityName}`;

  const categories = activities.map(a => a.category).filter(Boolean);
  const uniqueCategories = [...new Set(categories)];

  if (uniqueCategories.length >= 3) {
    return `Diverse experiences across ${cityName}`;
  } else if (uniqueCategories.includes('heritage')) {
    return `Discover ${cityName}'s rich history`;
  } else if (uniqueCategories.includes('nature')) {
    return `Nature and scenic beauty of ${cityName}`;
  } else if (uniqueCategories.includes('cultural')) {
    return `Cultural immersion in ${cityName}`;
  }

  return `Full day exploring ${cityName}`;
};

export const generateCityAwareItinerary = (
  destination: string,
  cities: string[],
  totalDays: number,
  tier: 'economic' | 'middle_luxury' | 'luxury',
  interests: string[],
  apiPlacesMap?: Map<string, Place[]>
): DayPlan[] => {
  const dayPlans: DayPlan[] = [];
  const usedTracker: UsedActivityTracker = {
    titles: new Set<string>(),
    categories: new Map<string, number>(),
  };

  dayPlans.push(generateArrivalDay(1, destination, tier));

  const sightseeingDays = totalDays - 2;
  const citiesForDays = cities.length > 0 ? cities : [destination];

  for (let i = 0; i < sightseeingDays; i++) {
    const dayNumber = i + 2;
    const cityIndex = i % citiesForDays.length;
    const cityName = citiesForDays[cityIndex];

    const apiPlaces = apiPlacesMap?.get(cityName) || [];

    dayPlans.push(
      generateCitySpecificDay(
        dayNumber,
        cityName,
        tier,
        interests,
        usedTracker,
        apiPlaces
      )
    );
  }

  dayPlans.push(generateDepartureDay(totalDays, destination, tier));

  return dayPlans;
};
