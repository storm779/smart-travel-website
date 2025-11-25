const API_KEY = import.meta.env.VITE_OPENTRIPMAP_API_KEY;
const BASE_URL = 'https://api.opentripmap.com/0.1/en/places';

export interface Place {
  id: string;
  name: string;
  description?: string;
  category: string;
  kinds: string;
  lat: number;
  lon: number;
  rating?: number;
  image?: string;
  wikipedia?: string;
  openingHours?: string;
  priceLevel?: 'free' | 'budget' | 'moderate' | 'expensive';
}

export interface PlaceDetails extends Place {
  address?: string;
  url?: string;
  phone?: string;
}

const categoryMapping: { [key: string]: string[] } = {
  'cultural': ['cultural', 'museums', 'theatres_and_entertainments', 'urban_environment', 'architecture', 'historical_places'],
  'heritage': ['architecture', 'historical_places', 'monuments_and_memorials', 'archaelogical_sites'],
  'religious': ['religion', 'churches', 'mosques', 'temples', 'monasteries'],
  'nature': ['natural', 'geological_formations', 'nature_reserves', 'water', 'forests'],
  'adventure': ['sport', 'climbing', 'water_sports', 'winter_sports', 'other_sport'],
  'beach': ['beaches', 'water', 'coastal'],
  'shopping': ['shops', 'malls', 'markets', 'other_shops'],
  'food': ['foods', 'restaurants', 'cafes', 'bars'],
  'nightlife': ['nightclubs', 'bars', 'entertainment'],
  'wildlife': ['nature_reserves', 'zoos', 'safaris', 'aquariums'],
  'spiritual': ['religion', 'churches', 'temples', 'monasteries', 'meditation'],
  'wellness': ['health', 'spas', 'hot_springs', 'yoga'],
};

const getCoordinates = async (cityName: string): Promise<{ lat: number; lon: number } | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/geoname?name=${encodeURIComponent(cityName)}&apikey=${API_KEY}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data.lat && data.lon) {
      return { lat: data.lat, lon: data.lon };
    }
    return null;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

const fetchPlacesInRadius = async (
  lat: number,
  lon: number,
  radius: number = 5000,
  kinds?: string
): Promise<Place[]> => {
  try {
    let url = `${BASE_URL}/radius?radius=${radius}&lat=${lat}&lon=${lon}&apikey=${API_KEY}&limit=50&format=json`;

    if (kinds) {
      url += `&kinds=${kinds}`;
    }

    const response = await fetch(url);

    if (!response.ok) return [];

    const data = await response.json();

    if (!data.features || !Array.isArray(data.features)) return [];

    return data.features.map((feature: any) => ({
      id: feature.properties.xid,
      name: feature.properties.name || 'Unnamed Place',
      category: extractCategory(feature.properties.kinds),
      kinds: feature.properties.kinds,
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
      rating: feature.properties.rate || 0,
    }));
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
};

const getPlaceDetails = async (xid: string): Promise<PlaceDetails | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/xid/${xid}?apikey=${API_KEY}`
    );

    if (!response.ok) return null;

    const data = await response.json();

    return {
      id: data.xid,
      name: data.name || 'Unnamed Place',
      description: data.wikipedia_extracts?.text || data.info?.descr || '',
      category: extractCategory(data.kinds),
      kinds: data.kinds,
      lat: data.point?.lat || 0,
      lon: data.point?.lon || 0,
      rating: data.rate || 0,
      image: data.preview?.source || data.wikipedia_extracts?.image || '',
      wikipedia: data.wikipedia,
      address: data.address?.road || data.address?.city || '',
      url: data.url,
      priceLevel: determinePriceLevel(data.kinds),
    };
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

const extractCategory = (kinds: string): string => {
  if (!kinds) return 'attraction';

  if (kinds.includes('museums')) return 'museum';
  if (kinds.includes('churches') || kinds.includes('religion')) return 'religious site';
  if (kinds.includes('natural')) return 'natural attraction';
  if (kinds.includes('architecture') || kinds.includes('historical')) return 'heritage site';
  if (kinds.includes('beach')) return 'beach';
  if (kinds.includes('shops') || kinds.includes('market')) return 'shopping';
  if (kinds.includes('restaurants') || kinds.includes('foods')) return 'restaurant';
  if (kinds.includes('sport')) return 'sports & adventure';
  if (kinds.includes('entertainment')) return 'entertainment';

  return 'attraction';
};

const determinePriceLevel = (kinds: string): 'free' | 'budget' | 'moderate' | 'expensive' => {
  if (!kinds) return 'moderate';

  if (kinds.includes('parks') || kinds.includes('natural') || kinds.includes('view_points')) {
    return 'free';
  }
  if (kinds.includes('museums') || kinds.includes('monuments')) {
    return 'budget';
  }
  if (kinds.includes('restaurants') || kinds.includes('entertainment')) {
    return 'moderate';
  }
  if (kinds.includes('luxury') || kinds.includes('casino')) {
    return 'expensive';
  }

  return 'budget';
};

export const fetchTouristPlaces = async (
  cityName: string,
  interests?: string[],
  culturalPreferences?: string[]
): Promise<Place[]> => {
  const coords = await getCoordinates(cityName);

  if (!coords) {
    console.warn(`Could not find coordinates for ${cityName}`);
    return [];
  }

  const allKinds: string[] = [];

  if (interests && interests.length > 0) {
    interests.forEach(interest => {
      const interestLower = interest.toLowerCase().replace(/\s+/g, '_');
      Object.keys(categoryMapping).forEach(key => {
        if (interestLower.includes(key) || key.includes(interestLower.split('_')[0])) {
          allKinds.push(...categoryMapping[key]);
        }
      });
    });
  }

  if (culturalPreferences && culturalPreferences.length > 0) {
    culturalPreferences.forEach(pref => {
      const prefLower = pref.toLowerCase();
      if (prefLower.includes('temple') || prefLower.includes('pilgrimage') || prefLower.includes('religious')) {
        allKinds.push(...categoryMapping.religious);
      }
      if (prefLower.includes('heritage') || prefLower.includes('historical')) {
        allKinds.push(...categoryMapping.heritage);
      }
      if (prefLower.includes('spiritual') || prefLower.includes('meditation') || prefLower.includes('yoga')) {
        allKinds.push(...categoryMapping.spiritual);
      }
    });
  }

  if (allKinds.length === 0) {
    allKinds.push('interesting_places', 'tourist_facilities', 'cultural', 'architecture', 'natural');
  }

  const uniqueKinds = [...new Set(allKinds)];
  const kindsParam = uniqueKinds.slice(0, 10).join(',');

  const places = await fetchPlacesInRadius(coords.lat, coords.lon, 10000, kindsParam);

  const sortedPlaces = places
    .filter(place => place.name && place.name !== 'Unnamed Place')
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return sortedPlaces.slice(0, 30);
};

export const enrichPlacesWithDetails = async (places: Place[]): Promise<PlaceDetails[]> => {
  const enrichedPlaces: PlaceDetails[] = [];

  for (const place of places.slice(0, 15)) {
    try {
      const details = await getPlaceDetails(place.id);
      if (details) {
        enrichedPlaces.push(details);
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error enriching place ${place.name}:`, error);
    }
  }

  return enrichedPlaces;
};

export const filterPlacesByBudget = (
  places: Place[],
  tier: 'economic' | 'middle_luxury' | 'luxury'
): Place[] => {
  if (tier === 'economic') {
    return places.filter(place => {
      const priceLevel = determinePriceLevel(place.kinds);
      return priceLevel === 'free' || priceLevel === 'budget';
    });
  }

  if (tier === 'middle_luxury') {
    return places.filter(place => {
      const priceLevel = determinePriceLevel(place.kinds);
      return priceLevel !== 'expensive';
    });
  }

  return places;
};

export const groupPlacesByDay = (places: Place[], numDays: number): Place[][] => {
  const placesPerDay = Math.ceil(places.length / (numDays - 2));
  const grouped: Place[][] = [];

  for (let i = 0; i < numDays - 2; i++) {
    const start = i * placesPerDay;
    const end = start + placesPerDay;
    grouped.push(places.slice(start, end));
  }

  return grouped;
};
