export interface CityActivity {
  title: string;
  subtitle?: string;
  category: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'any';
  tier?: 'economic' | 'middle_luxury' | 'luxury' | 'all';
}

export interface CityData {
  name: string;
  region?: string;
  activities: CityActivity[];
}

export const cityActivitiesDatabase: { [key: string]: CityData } = {
  'Pokhara': {
    name: 'Pokhara',
    region: 'Nepal',
    activities: [
      { title: 'Sunrise view at Sarangkot', subtitle: 'Watch Himalayan peaks glow at dawn', category: 'nature', timeOfDay: 'morning', tier: 'all' },
      { title: 'Boat ride on Phewa Lake', subtitle: 'Peaceful rowing with mountain reflections', category: 'nature', timeOfDay: 'morning', tier: 'all' },
      { title: 'Visit Tal Barahi Temple', subtitle: 'Island temple in the middle of Phewa Lake', category: 'religious', timeOfDay: 'morning', tier: 'all' },
      { title: 'Explore Lakeside area', subtitle: 'Cafés, shops, and local restaurants', category: 'shopping', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Paragliding over Pokhara Valley', subtitle: 'Thrilling aerial views of mountains and lakes', category: 'adventure', timeOfDay: 'afternoon', tier: 'middle_luxury' },
      { title: 'Visit World Peace Pagoda', subtitle: 'Buddhist stupa with panoramic valley views', category: 'heritage', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Davis Falls exploration', subtitle: 'Unique underground waterfall', category: 'nature', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Gupteshwor Cave visit', subtitle: 'Sacred cave with religious significance', category: 'religious', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'International Mountain Museum tour', subtitle: 'Learn about Himalayan climbing history', category: 'cultural', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Sunset at Begnas Lake', subtitle: 'Quieter alternative to Phewa Lake', category: 'nature', timeOfDay: 'evening', tier: 'all' },
      { title: 'Traditional Nepali dinner with cultural show', subtitle: 'Local cuisine and folk performances', category: 'food', timeOfDay: 'evening', tier: 'all' },
      { title: 'Evening stroll along Lakeside promenade', subtitle: 'Enjoy mountain views and local vibe', category: 'leisure', timeOfDay: 'evening', tier: 'all' },
    ]
  },
  'Chitwan': {
    name: 'Chitwan',
    region: 'Nepal',
    activities: [
      { title: 'Jungle safari in Chitwan National Park', subtitle: 'Spot rhinos, tigers, and exotic birds', category: 'wildlife', timeOfDay: 'morning', tier: 'all' },
      { title: 'Elephant bathing experience', subtitle: 'Help bathe gentle giants at the river', category: 'wildlife', timeOfDay: 'morning', tier: 'all' },
      { title: 'Canoe ride along Rapti River', subtitle: 'Silent approach to crocodiles and birds', category: 'nature', timeOfDay: 'morning', tier: 'all' },
      { title: 'Village walk through Tharu community', subtitle: 'Experience indigenous culture and lifestyle', category: 'cultural', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Visit Elephant Breeding Center', subtitle: 'Learn about elephant conservation', category: 'wildlife', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Jungle walk with naturalist guide', subtitle: 'Discover flora and fauna on foot', category: 'nature', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Tharu cultural dance performance', subtitle: 'Traditional stick dance and folk music', category: 'cultural', timeOfDay: 'evening', tier: 'all' },
      { title: 'Sunset view from Rapti River bank', subtitle: 'Watch wildlife come to drink at dusk', category: 'nature', timeOfDay: 'evening', tier: 'all' },
      { title: 'Jeep safari through dense jungle', subtitle: 'Off-road adventure searching for wildlife', category: 'adventure', timeOfDay: 'any', tier: 'middle_luxury' },
      { title: 'Bird watching excursion', subtitle: 'Over 500 species recorded in the park', category: 'nature', timeOfDay: 'morning', tier: 'all' },
    ]
  },
  'Kathmandu': {
    name: 'Kathmandu',
    region: 'Nepal',
    activities: [
      { title: 'Visit Swayambhunath (Monkey Temple)', subtitle: 'Ancient Buddhist stupa with city views', category: 'heritage', timeOfDay: 'morning', tier: 'all' },
      { title: 'Explore Durbar Square', subtitle: 'UNESCO heritage site with royal palaces', category: 'heritage', timeOfDay: 'morning', tier: 'all' },
      { title: 'Tour Pashupatinath Temple', subtitle: 'Sacred Hindu temple on Bagmati River', category: 'religious', timeOfDay: 'morning', tier: 'all' },
      { title: 'Visit Boudhanath Stupa', subtitle: 'Largest stupa in Nepal, center of Tibetan Buddhism', category: 'religious', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Shopping in Thamel district', subtitle: 'Vibrant market for handicrafts and souvenirs', category: 'shopping', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Explore Patan Durbar Square', subtitle: 'Ancient Newari architecture and art', category: 'heritage', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Visit Garden of Dreams', subtitle: 'Peaceful neo-classical garden oasis', category: 'leisure', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Asan Tole market experience', subtitle: 'Traditional spice and produce market', category: 'cultural', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Traditional Newari cuisine dinner', subtitle: 'Multi-course authentic local feast', category: 'food', timeOfDay: 'evening', tier: 'all' },
      { title: 'Evening Aarti ceremony at Pashupatinath', subtitle: 'Hindu prayer ritual by the river', category: 'religious', timeOfDay: 'evening', tier: 'all' },
      { title: 'Rooftop dining in Thamel', subtitle: 'Panoramic city views with dinner', category: 'food', timeOfDay: 'evening', tier: 'middle_luxury' },
    ]
  },
  'Mumbai': {
    name: 'Mumbai',
    region: 'India',
    activities: [
      { title: 'Visit Gateway of India', subtitle: 'Iconic monument overlooking the Arabian Sea', category: 'heritage', timeOfDay: 'morning', tier: 'all' },
      { title: 'Tour Elephanta Caves', subtitle: 'UNESCO World Heritage rock-cut temples', category: 'heritage', timeOfDay: 'morning', tier: 'all' },
      { title: 'Explore Chhatrapati Shivaji Terminus', subtitle: 'Victorian Gothic railway station', category: 'architecture', timeOfDay: 'morning', tier: 'all' },
      { title: 'Visit Marine Drive promenade', subtitle: 'The Queen\'s Necklace waterfront', category: 'leisure', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Shopping at Colaba Causeway', subtitle: 'Street market for handicrafts and fashion', category: 'shopping', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Tour Dharavi community', subtitle: 'Asia\'s largest urban settlement', category: 'cultural', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Visit Haji Ali Dargah', subtitle: 'Mosque on an islet in the sea', category: 'religious', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Explore Crawford Market', subtitle: 'Historic market with colonial architecture', category: 'shopping', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Sunset at Bandra-Worli Sea Link', subtitle: 'Modern engineering marvel', category: 'leisure', timeOfDay: 'evening', tier: 'all' },
      { title: 'Street food tour in Mohammed Ali Road', subtitle: 'Famous for kebabs and biryani', category: 'food', timeOfDay: 'evening', tier: 'all' },
      { title: 'Bollywood studio tour', subtitle: 'Behind the scenes of Indian cinema', category: 'entertainment', timeOfDay: 'afternoon', tier: 'middle_luxury' },
      { title: 'Fine dining at Lower Parel', subtitle: 'Premium restaurants in upscale district', category: 'food', timeOfDay: 'evening', tier: 'luxury' },
    ]
  },
  'Goa': {
    name: 'Goa',
    region: 'India',
    activities: [
      { title: 'Beach hopping along North Goa coast', subtitle: 'Visit Anjuna, Vagator, and Calangute', category: 'beach', timeOfDay: 'morning', tier: 'all' },
      { title: 'Water sports at Baga Beach', subtitle: 'Parasailing, jet skiing, and banana boat', category: 'adventure', timeOfDay: 'morning', tier: 'all' },
      { title: 'Visit Basilica of Bom Jesus', subtitle: 'UNESCO World Heritage church', category: 'heritage', timeOfDay: 'morning', tier: 'all' },
      { title: 'Explore Old Goa churches', subtitle: 'Portuguese colonial architecture', category: 'heritage', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Spice plantation tour', subtitle: 'Learn about Goan spices and herbs', category: 'nature', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Shopping at Anjuna Flea Market', subtitle: 'Hippie market with crafts and jewelry', category: 'shopping', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Cruise on Mandovi River', subtitle: 'Sunset cruise with live entertainment', category: 'leisure', timeOfDay: 'evening', tier: 'all' },
      { title: 'Seafood dinner at beach shack', subtitle: 'Fresh catch with toes in the sand', category: 'food', timeOfDay: 'evening', tier: 'all' },
      { title: 'Night market at Arpora', subtitle: 'Saturday night bazaar with food and music', category: 'nightlife', timeOfDay: 'evening', tier: 'all' },
      { title: 'Trance party at Hilltop', subtitle: 'Famous electronic music venue', category: 'nightlife', timeOfDay: 'evening', tier: 'middle_luxury' },
      { title: 'Yoga retreat in Arambol', subtitle: 'Wellness session by the beach', category: 'wellness', timeOfDay: 'morning', tier: 'middle_luxury' },
    ]
  },
  'Delhi': {
    name: 'Delhi',
    region: 'India',
    activities: [
      { title: 'Visit Red Fort', subtitle: 'Mughal fortress and UNESCO World Heritage site', category: 'heritage', timeOfDay: 'morning', tier: 'all' },
      { title: 'Tour Qutub Minar complex', subtitle: 'Tallest brick minaret in the world', category: 'heritage', timeOfDay: 'morning', tier: 'all' },
      { title: 'Explore Humayun\'s Tomb', subtitle: 'Precursor to the Taj Mahal architecture', category: 'heritage', timeOfDay: 'morning', tier: 'all' },
      { title: 'Visit India Gate', subtitle: 'War memorial and iconic landmark', category: 'heritage', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Shopping at Chandni Chowk', subtitle: 'Old Delhi\'s bustling market', category: 'shopping', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Tour Lotus Temple', subtitle: 'Baháʼí House of Worship', category: 'religious', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Visit Akshardham Temple', subtitle: 'Grand modern Hindu temple complex', category: 'religious', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Explore Hauz Khas Village', subtitle: 'Bohemian quarter with cafes and boutiques', category: 'leisure', timeOfDay: 'afternoon', tier: 'middle_luxury' },
      { title: 'Street food tour in Paranthe Wali Gali', subtitle: 'Famous lane for stuffed parathas', category: 'food', timeOfDay: 'evening', tier: 'all' },
      { title: 'Sound and light show at Red Fort', subtitle: 'Historical narrative with illuminations', category: 'entertainment', timeOfDay: 'evening', tier: 'all' },
      { title: 'Fine dining at Connaught Place', subtitle: 'Upscale restaurants in central Delhi', category: 'food', timeOfDay: 'evening', tier: 'luxury' },
    ]
  },
  'Jaipur': {
    name: 'Jaipur',
    region: 'India',
    activities: [
      { title: 'Visit Amber Fort', subtitle: 'Majestic hilltop fort with mirror palace', category: 'heritage', timeOfDay: 'morning', tier: 'all' },
      { title: 'Elephant ride to Amber Fort', subtitle: 'Traditional royal entrance', category: 'adventure', timeOfDay: 'morning', tier: 'middle_luxury' },
      { title: 'Explore City Palace', subtitle: 'Royal residence with museums', category: 'heritage', timeOfDay: 'morning', tier: 'all' },
      { title: 'Visit Hawa Mahal', subtitle: 'Palace of Winds with intricate facade', category: 'heritage', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Tour Jantar Mantar', subtitle: 'UNESCO-listed astronomical observatory', category: 'heritage', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Shopping at Johari Bazaar', subtitle: 'Famous for jewelry and textiles', category: 'shopping', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Visit Jal Mahal', subtitle: 'Water palace in Man Sagar Lake', category: 'heritage', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Explore Nahargarh Fort', subtitle: 'Sunset views over Pink City', category: 'heritage', timeOfDay: 'evening', tier: 'all' },
      { title: 'Traditional Rajasthani dinner with folk show', subtitle: 'Puppet shows and dance performances', category: 'food', timeOfDay: 'evening', tier: 'all' },
      { title: 'Rooftop dining with fort views', subtitle: 'Romantic dinner overlooking monuments', category: 'food', timeOfDay: 'evening', tier: 'luxury' },
    ]
  },
  'Agra': {
    name: 'Agra',
    region: 'India',
    activities: [
      { title: 'Sunrise visit to Taj Mahal', subtitle: 'Witness the marble monument at golden hour', category: 'heritage', timeOfDay: 'morning', tier: 'all' },
      { title: 'Explore Agra Fort', subtitle: 'Red sandstone fort with Taj views', category: 'heritage', timeOfDay: 'morning', tier: 'all' },
      { title: 'Visit Mehtab Bagh', subtitle: 'Garden with rear view of Taj Mahal', category: 'leisure', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Tour Itmad-ud-Daulah (Baby Taj)', subtitle: 'Intricate marble tomb', category: 'heritage', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Shopping at Sadar Bazaar', subtitle: 'Leather goods and marble crafts', category: 'shopping', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Marble workshop visit', subtitle: 'See artisans create inlay work', category: 'cultural', timeOfDay: 'afternoon', tier: 'all' },
      { title: 'Sunset at Taj Mahal', subtitle: 'Watch the monument change colors', category: 'heritage', timeOfDay: 'evening', tier: 'all' },
      { title: 'Mughlai cuisine dinner', subtitle: 'Authentic royal recipes', category: 'food', timeOfDay: 'evening', tier: 'all' },
      { title: 'Rooftop view of Taj at night', subtitle: 'Moonlit views from restaurant', category: 'leisure', timeOfDay: 'evening', tier: 'luxury' },
    ]
  },
};

export const genericActivitiesByCategory: { [key: string]: CityActivity[] } = {
  'heritage': [
    { title: 'Visit historical monuments', subtitle: 'Explore architectural heritage', category: 'heritage', timeOfDay: 'any', tier: 'all' },
    { title: 'Heritage walking tour', subtitle: 'Guided tour of old city', category: 'heritage', timeOfDay: 'any', tier: 'all' },
    { title: 'Museum visit', subtitle: 'Learn local history and culture', category: 'cultural', timeOfDay: 'any', tier: 'all' },
  ],
  'nature': [
    { title: 'Nature walk or hiking', subtitle: 'Explore natural landscapes', category: 'nature', timeOfDay: 'morning', tier: 'all' },
    { title: 'Visit botanical gardens', subtitle: 'Peaceful garden stroll', category: 'nature', timeOfDay: 'any', tier: 'all' },
    { title: 'Scenic viewpoint visit', subtitle: 'Panoramic city or nature views', category: 'nature', timeOfDay: 'any', tier: 'all' },
  ],
  'cultural': [
    { title: 'Local market exploration', subtitle: 'Experience daily life and trade', category: 'cultural', timeOfDay: 'any', tier: 'all' },
    { title: 'Traditional craft workshop', subtitle: 'Learn local handicrafts', category: 'cultural', timeOfDay: 'afternoon', tier: 'all' },
    { title: 'Cultural performance', subtitle: 'Traditional music and dance', category: 'cultural', timeOfDay: 'evening', tier: 'all' },
  ],
  'food': [
    { title: 'Local cuisine tasting', subtitle: 'Try regional specialties', category: 'food', timeOfDay: 'any', tier: 'all' },
    { title: 'Street food tour', subtitle: 'Explore local food scene', category: 'food', timeOfDay: 'evening', tier: 'all' },
    { title: 'Cooking class', subtitle: 'Learn to prepare local dishes', category: 'food', timeOfDay: 'afternoon', tier: 'middle_luxury' },
  ],
  'religious': [
    { title: 'Temple or shrine visit', subtitle: 'Experience spiritual sites', category: 'religious', timeOfDay: 'any', tier: 'all' },
    { title: 'Prayer ceremony observation', subtitle: 'Witness local religious practices', category: 'religious', timeOfDay: 'evening', tier: 'all' },
  ],
  'shopping': [
    { title: 'Local bazaar shopping', subtitle: 'Browse handicrafts and souvenirs', category: 'shopping', timeOfDay: 'afternoon', tier: 'all' },
    { title: 'Artisan market visit', subtitle: 'Shop for authentic local crafts', category: 'shopping', timeOfDay: 'afternoon', tier: 'all' },
  ],
  'leisure': [
    { title: 'City sightseeing tour', subtitle: 'Discover main attractions', category: 'leisure', timeOfDay: 'any', tier: 'all' },
    { title: 'Café hopping', subtitle: 'Relax at local coffee shops', category: 'leisure', timeOfDay: 'afternoon', tier: 'all' },
    { title: 'Evening promenade', subtitle: 'Stroll through popular areas', category: 'leisure', timeOfDay: 'evening', tier: 'all' },
  ],
};

export function getCityActivities(cityName: string): CityActivity[] {
  const normalizedCity = Object.keys(cityActivitiesDatabase).find(
    key => key.toLowerCase() === cityName.toLowerCase()
  );

  if (normalizedCity) {
    return cityActivitiesDatabase[normalizedCity].activities;
  }

  return [];
}

export function getGenericActivities(interests: string[]): CityActivity[] {
  const activities: CityActivity[] = [];

  const interestCategoryMap: { [key: string]: string } = {
    'Heritage sites & historical places': 'heritage',
    'Nature & wildlife': 'nature',
    'Food & cuisine': 'food',
    'Adventure sports': 'nature',
    'Shopping': 'shopping',
    'Beaches': 'nature',
    'Cultural experiences': 'cultural',
    'Pilgrimage sites': 'religious',
    'Spiritual retreats': 'religious',
  };

  interests.forEach(interest => {
    const category = interestCategoryMap[interest];
    if (category && genericActivitiesByCategory[category]) {
      activities.push(...genericActivitiesByCategory[category]);
    }
  });

  if (activities.length === 0) {
    Object.values(genericActivitiesByCategory).forEach(catActivities => {
      activities.push(...catActivities.slice(0, 2));
    });
  }

  return activities;
}
