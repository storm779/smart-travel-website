interface DestinationData {
  basePrice: number;
  multiplier: number;
  cities: string[];
  attractions: string[];
  categories: string[];
}

const domesticDestinations: { [key: string]: DestinationData } = {
  'Maharashtra': {
    basePrice: 15000,
    multiplier: 1.0,
    cities: ['Mumbai', 'Pune', 'Aurangabad', 'Nashik', 'Lonavala'],
    attractions: [
      'Gateway of India',
      'Elephanta Caves',
      'Ajanta Caves',
      'Ellora Caves',
      'Shaniwar Wada',
      'Aga Khan Palace',
      'Marine Drive',
      'Siddhivinayak Temple',
    ],
    categories: ['cultural', 'heritage', 'beach', 'adventure'],
  },
  'Tamil Nadu': {
    basePrice: 14000,
    multiplier: 0.95,
    cities: ['Chennai', 'Madurai', 'Kanyakumari', 'Thanjavur', 'Mahabalipuram', 'Pondicherry'],
    attractions: [
      'Meenakshi Temple',
      'Shore Temple',
      'Brihadeeswarar Temple',
      'Vivekananda Rock Memorial',
      'Marina Beach',
      'Kapaleeshwarar Temple',
      'Auroville',
    ],
    categories: ['religious', 'cultural', 'beach', 'heritage'],
  },
  'West Bengal': {
    basePrice: 16000,
    multiplier: 1.05,
    cities: ['Kolkata', 'Darjeeling', 'Kalimpong', 'Siliguri', 'Durgapur'],
    attractions: [
      'Victoria Memorial',
      'Howrah Bridge',
      'Tiger Hill',
      'Batasia Loop',
      'Toy Train',
      'Tea Gardens',
      'Dakshineswar Temple',
      'Belur Math',
    ],
    categories: ['cultural', 'adventure', 'nature', 'heritage'],
  },
  'Gujarat': {
    basePrice: 17000,
    multiplier: 1.1,
    cities: ['Ahmedabad', 'Dwarka', 'Somnath', 'Rann of Kutch', 'Gir', 'Vadodara'],
    attractions: [
      'Sabarmati Ashram',
      'Rann of Kutch White Desert',
      'Dwarkadhish Temple',
      'Somnath Temple',
      'Gir National Park',
      'Statue of Unity',
      'Adalaj Stepwell',
    ],
    categories: ['cultural', 'wildlife', 'religious', 'heritage'],
  },
  'Rajasthan': {
    basePrice: 18000,
    multiplier: 1.15,
    cities: ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer', 'Pushkar', 'Mount Abu'],
    attractions: [
      'Amber Fort',
      'Hawa Mahal',
      'City Palace Udaipur',
      'Lake Pichola',
      'Mehrangarh Fort',
      'Jaisalmer Fort',
      'Karni Mata Temple',
      'Dilwara Temples',
    ],
    categories: ['heritage', 'cultural', 'desert', 'luxury'],
  },
  'Kerala': {
    basePrice: 19000,
    multiplier: 1.2,
    cities: ['Kochi', 'Munnar', 'Alleppey', 'Thekkady', 'Kovalam', 'Wayanad'],
    attractions: [
      'Backwater Houseboat Cruise',
      'Tea Plantations',
      'Periyar Wildlife Sanctuary',
      'Chinese Fishing Nets',
      'Athirappilly Waterfalls',
      'Varkala Beach',
      'Mattancherry Palace',
    ],
    categories: ['nature', 'backwaters', 'honeymoon', 'wellness'],
  },
  'Uttarakhand': {
    basePrice: 16000,
    multiplier: 1.05,
    cities: ['Haridwar', 'Rishikesh', 'Nainital', 'Mussoorie', 'Auli', 'Dehradun'],
    attractions: [
      'Kedarnath Temple',
      'Badrinath Temple',
      'Har Ki Pauri',
      'Laxman Jhula',
      'Naini Lake',
      'Kempty Falls',
      'Valley of Flowers',
      'Beatles Ashram',
    ],
    categories: ['religious', 'adventure', 'nature', 'pilgrimage'],
  },
  'Varanasi': {
    basePrice: 10000,
    multiplier: 0.8,
    cities: ['Varanasi', 'Sarnath', 'Ayodhya', 'Allahabad'],
    attractions: [
      'Kashi Vishwanath Temple',
      'Dashashwamedh Ghat',
      'Sarnath Buddhist Temple',
      'Manikarnika Ghat',
      'Assi Ghat',
      'Ramnagar Fort',
      'BHU Campus',
    ],
    categories: ['religious', 'spiritual', 'cultural', 'pilgrimage'],
  },
  'Goa': {
    basePrice: 17000,
    multiplier: 1.1,
    cities: ['North Goa', 'South Goa', 'Panjim', 'Old Goa', 'Mapusa'],
    attractions: [
      'Baga Beach',
      'Calangute Beach',
      'Basilica of Bom Jesus',
      'Fort Aguada',
      'Dudhsagar Waterfalls',
      'Spice Plantation',
      'Anjuna Flea Market',
      'Aguada Fort',
    ],
    categories: ['beach', 'party', 'adventure', 'honeymoon'],
  },
  'Ladakh': {
    basePrice: 25000,
    multiplier: 1.6,
    cities: ['Leh', 'Nubra Valley', 'Pangong', 'Turtuk', 'Kargil'],
    attractions: [
      'Pangong Lake',
      'Nubra Valley',
      'Khardung La Pass',
      'Thiksey Monastery',
      'Leh Palace',
      'Magnetic Hill',
      'Shanti Stupa',
      'Hemis Monastery',
    ],
    categories: ['adventure', 'nature', 'cultural', 'biking'],
  },
  'Himachal Pradesh': {
    basePrice: 15000,
    multiplier: 1.0,
    cities: ['Shimla', 'Manali', 'Dharamshala', 'Kasol', 'Dalhousie', 'Spiti Valley'],
    attractions: [
      'Mall Road Shimla',
      'Rohtang Pass',
      'Solang Valley',
      'Hadimba Temple',
      'McLeod Ganj',
      'Triund Trek',
      'Kufri',
      'Great Himalayan National Park',
    ],
    categories: ['adventure', 'honeymoon', 'nature', 'snow'],
  },
  'Karnataka': {
    basePrice: 14000,
    multiplier: 0.95,
    cities: ['Bangalore', 'Mysore', 'Coorg', 'Hampi', 'Gokarna', 'Chikmagalur'],
    attractions: [
      'Mysore Palace',
      'Hampi Ruins',
      'Dubare Elephant Camp',
      'Abbey Falls',
      'Virupaksha Temple',
      'Lalbagh Garden',
      'Jog Falls',
      'Gokarna Beach',
    ],
    categories: ['heritage', 'nature', 'cultural', 'beach'],
  },
  'Jammu & Kashmir': {
    basePrice: 22000,
    multiplier: 1.45,
    cities: ['Srinagar', 'Gulmarg', 'Pahalgam', 'Sonamarg', 'Jammu'],
    attractions: [
      'Dal Lake Shikara Ride',
      'Mughal Gardens',
      'Gulmarg Gondola',
      'Betaab Valley',
      'Thajiwas Glacier',
      'Vaishno Devi Temple',
      'Shankaracharya Temple',
      'Nishat Bagh',
    ],
    categories: ['honeymoon', 'nature', 'snow', 'adventure'],
  },
  'Sikkim': {
    basePrice: 18000,
    multiplier: 1.15,
    cities: ['Gangtok', 'Lachung', 'Pelling', 'Namchi', 'Ravangla'],
    attractions: [
      'Tsomgo Lake',
      'Nathula Pass',
      'Yumthang Valley',
      'Rumtek Monastery',
      'Pemayangtse Monastery',
      'Gurudongmar Lake',
      'Zero Point',
      'Buddha Park',
    ],
    categories: ['adventure', 'nature', 'cultural', 'trekking'],
  },
  'Assam': {
    basePrice: 20000,
    multiplier: 1.3,
    cities: ['Guwahati', 'Kaziranga', 'Majuli', 'Tezpur', 'Jorhat'],
    attractions: [
      'Kaziranga National Park',
      'Kamakhya Temple',
      'Majuli Island',
      'Brahmaputra River Cruise',
      'Tea Gardens',
      'Manas National Park',
      'Umananda Island',
    ],
    categories: ['wildlife', 'cultural', 'nature', 'adventure'],
  },
  'Meghalaya': {
    basePrice: 16000,
    multiplier: 1.05,
    cities: ['Shillong', 'Cherrapunji', 'Mawlynnong', 'Dawki', 'Mawsynram'],
    attractions: [
      'Double Decker Living Root Bridge',
      'Nohkalikai Falls',
      'Seven Sisters Falls',
      'Mawsmai Cave',
      'Umngot River',
      'Cleanest Village Mawlynnong',
      'Elephant Falls',
    ],
    categories: ['adventure', 'nature', 'trekking', 'offbeat'],
  },
  'North East India': {
    basePrice: 21000,
    multiplier: 1.35,
    cities: ['Shillong', 'Tawang', 'Imphal', 'Kohima', 'Aizawl'],
    attractions: [
      'Tawang Monastery',
      'Bumla Pass',
      'Living Root Bridges',
      'Loktak Lake',
      'Dzukou Valley',
      'Ziro Valley',
      'Namdapha National Park',
    ],
    categories: ['adventure', 'cultural', 'nature', 'offbeat'],
  },
};

const internationalDestinations: { [key: string]: DestinationData } = {
  'Maldives': {
    basePrice: 65000,
    multiplier: 2.8,
    cities: ['Male', 'Hulhumale', 'Maafushi', 'Addu City'],
    attractions: [
      'Underwater Restaurant',
      'Snorkeling & Diving',
      'Water Sports',
      'Island Hopping',
      'Banana Reef',
      'HP Reef',
      'Manta Point',
      'Sunset Dolphin Cruise',
    ],
    categories: ['beach', 'honeymoon', 'luxury', 'water-sports'],
  },
  'Dubai': {
    basePrice: 48000,
    multiplier: 2.1,
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Fujairah'],
    attractions: [
      'Burj Khalifa',
      'Dubai Mall',
      'Palm Jumeirah',
      'Dubai Marina',
      'Desert Safari',
      'Gold Souk',
      'Dubai Frame',
      'Global Village',
      'Sheikh Zayed Mosque',
    ],
    categories: ['luxury', 'shopping', 'adventure', 'family'],
  },
  'Thailand': {
    basePrice: 35000,
    multiplier: 1.5,
    cities: ['Bangkok', 'Pattaya', 'Phuket', 'Krabi', 'Chiang Mai'],
    attractions: [
      'Grand Palace',
      'Wat Pho',
      'Floating Market',
      'Phi Phi Islands',
      'James Bond Island',
      'Coral Island',
      'Walking Street',
      'Tiger Kingdom',
      'Alcazar Show',
    ],
    categories: ['beach', 'culture', 'family', 'nightlife'],
  },
  'Singapore': {
    basePrice: 52000,
    multiplier: 2.3,
    cities: ['Singapore City', 'Sentosa', 'Jurong'],
    attractions: [
      'Marina Bay Sands',
      'Gardens by the Bay',
      'Universal Studios',
      'Sentosa Island',
      'Merlion Park',
      'Singapore Zoo',
      'Night Safari',
      'Chinatown',
      'Little India',
    ],
    categories: ['family', 'luxury', 'shopping', 'theme-parks'],
  },
  'Bali': {
    basePrice: 42000,
    multiplier: 1.8,
    cities: ['Kuta', 'Ubud', 'Seminyak', 'Nusa Dua', 'Uluwatu'],
    attractions: [
      'Tanah Lot Temple',
      'Uluwatu Temple',
      'Tegalalang Rice Terrace',
      'Monkey Forest',
      'Water Sports Tanjung Benoa',
      'Kecak Dance',
      'Mount Batur',
      'Tegenungan Waterfall',
    ],
    categories: ['beach', 'culture', 'honeymoon', 'adventure'],
  },
  'Malaysia': {
    basePrice: 32000,
    multiplier: 1.4,
    cities: ['Kuala Lumpur', 'Genting Highlands', 'Malacca', 'Penang', 'Cameron Highlands'],
    attractions: [
      'Petronas Twin Towers',
      'Batu Caves',
      'Genting Theme Park',
      'Tea Plantations',
      'Sunway Lagoon',
      'KL Tower',
      'Central Market',
      'Aquaria KLCC',
    ],
    categories: ['family', 'shopping', 'nature', 'adventure'],
  },
  'Sri Lanka': {
    basePrice: 38000,
    multiplier: 1.65,
    cities: ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Sigiriya', 'Yala'],
    attractions: [
      'Sigiriya Rock Fortress',
      'Temple of Tooth',
      'Yala National Park Safari',
      'Galle Fort',
      'Tea Plantations',
      'Train Journey',
      'Mirissa Beach',
      'Dambulla Cave Temple',
    ],
    categories: ['heritage', 'wildlife', 'beach', 'culture'],
  },
  'Nepal': {
    basePrice: 25000,
    multiplier: 1.1,
    cities: ['Kathmandu', 'Pokhara', 'Chitwan', 'Lumbini', 'Nagarkot'],
    attractions: [
      'Pashupatinath Temple',
      'Boudhanath Stupa',
      'Swayambhunath',
      'Phewa Lake',
      'Sarangkot Sunrise',
      'Chitwan Jungle Safari',
      'Paragliding',
      'Annapurna Range View',
    ],
    categories: ['adventure', 'religious', 'trekking', 'nature'],
  },
  'Bhutan': {
    basePrice: 68000,
    multiplier: 3.0,
    cities: ['Paro', 'Thimphu', 'Punakha', 'Bumthang'],
    attractions: [
      'Tigers Nest Monastery',
      'Punakha Dzong',
      'Buddha Dordenma',
      'Dochula Pass',
      'Memorial Chorten',
      'Phobjikha Valley',
      'Suspension Bridge',
      'Takin Preserve',
    ],
    categories: ['culture', 'trekking', 'spiritual', 'luxury'],
  },
  'Vietnam': {
    basePrice: 44000,
    multiplier: 1.9,
    cities: ['Hanoi', 'Halong Bay', 'Hoi An', 'Ho Chi Minh City', 'Hue', 'Da Nang'],
    attractions: [
      'Halong Bay Cruise',
      'Hoi An Ancient Town',
      'Cu Chi Tunnels',
      'Water Puppet Show',
      'Marble Mountains',
      'Mekong Delta',
      'Imperial City Hue',
      'Golden Bridge',
    ],
    categories: ['culture', 'cruise', 'heritage', 'beach'],
  },
  'Turkey': {
    basePrice: 72000,
    multiplier: 3.2,
    cities: ['Istanbul', 'Cappadocia', 'Pamukkale', 'Ephesus', 'Antalya'],
    attractions: [
      'Hagia Sophia',
      'Blue Mosque',
      'Cappadocia Hot Air Balloon',
      'Pamukkale Thermal Pools',
      'Ephesus Ancient City',
      'Bosphorus Cruise',
      'Grand Bazaar',
      'Topkapi Palace',
    ],
    categories: ['heritage', 'culture', 'adventure', 'luxury'],
  },
  'Switzerland': {
    basePrice: 160000,
    multiplier: 7.0,
    cities: ['Zurich', 'Lucerne', 'Interlaken', 'Jungfraujoch', 'Geneva', 'Zermatt'],
    attractions: [
      'Jungfraujoch Top of Europe',
      'Lake Lucerne',
      'Mount Titlis',
      'Rhine Falls',
      'Matterhorn',
      'Chapel Bridge',
      'Glacier 3000',
      'Swiss Alps',
    ],
    categories: ['nature', 'adventure', 'luxury', 'snow'],
  },
  'Paris': {
    basePrice: 130000,
    multiplier: 5.7,
    cities: ['Paris', 'Versailles', 'Disneyland'],
    attractions: [
      'Eiffel Tower',
      'Louvre Museum',
      'Notre Dame Cathedral',
      'Arc de Triomphe',
      'Palace of Versailles',
      'Seine River Cruise',
      'Montmartre',
      'Champs-Élysées',
    ],
    categories: ['heritage', 'culture', 'luxury', 'romance'],
  },
  'London': {
    basePrice: 145000,
    multiplier: 6.3,
    cities: ['London', 'Windsor', 'Oxford', 'Cambridge'],
    attractions: [
      'Buckingham Palace',
      'Tower of London',
      'London Eye',
      'Big Ben',
      'British Museum',
      'Westminster Abbey',
      'Tower Bridge',
      'Harry Potter Studio',
    ],
    categories: ['heritage', 'culture', 'family', 'luxury'],
  },
};

export const getDestinationData = (destination: string, travelType: 'domestic' | 'international') => {
  const destinations = travelType === 'domestic' ? domesticDestinations : internationalDestinations;
  return destinations[destination] || {
    basePrice: 15000,
    multiplier: 1.0,
    cities: [destination],
    attractions: ['Local attractions', 'Cultural sites', 'Market visits'],
    categories: ['cultural'],
  };
};

export const calculatePrice = (
  destination: string,
  travelType: 'domestic' | 'international',
  duration: string,
  tier: 'economic' | 'middle_luxury' | 'luxury',
  accommodation?: string
): number => {
  const destData = getDestinationData(destination, travelType);
  const days = getDurationDays(duration);

  let basePrice = destData.basePrice;

  // Adjust based on duration
  const durationMultiplier = 1 + ((days - 4) * 0.15);
  basePrice = basePrice * durationMultiplier;

  // Adjust based on tier
  let tierMultiplier = 1.0;
  if (tier === 'economic') {
    tierMultiplier = 0.65;
  } else if (tier === 'middle_luxury') {
    tierMultiplier = 1.0;
  } else if (tier === 'luxury') {
    tierMultiplier = 1.75;
  }

  // Adjust based on accommodation selection
  let accommodationMultiplier = 1.0;
  if (accommodation) {
    if (accommodation === 'Budget hotels') {
      accommodationMultiplier = 0.85; // 15% discount
    } else if (accommodation === '3-4 star hotels') {
      accommodationMultiplier = 1.0; // Base price
    } else if (accommodation === '5-star hotels & resorts') {
      accommodationMultiplier = 1.25; // 25% premium
    }
  }

  return Math.round(basePrice * tierMultiplier * accommodationMultiplier);
};

export const getDurationDays = (duration: string): number => {
  if (duration === '3-5 days') return 4;
  if (duration === '6-8 days') return 7;
  if (duration === '9-12 days') return 10;
  if (duration === '13-15 days') return 14;
  return 18;
};

export const generateDifferentiatedActivities = (
  destination: string,
  travelType: 'domestic' | 'international',
  tier: 'economic' | 'middle_luxury' | 'luxury',
  dayNumber: number,
  totalDays: number,
  interests: string[],
  culturalPrefs: string[]
): string[] => {
  const destData = getDestinationData(destination, travelType);
  const activities: string[] = [];

  if (dayNumber === 1) {
    // Arrival Day
    if (tier === 'luxury') {
      activities.push('Private airport transfer with meet & greet service');
      activities.push('Check-in to 5-star luxury hotel with welcome drinks');
      activities.push('Spa session or massage');
      activities.push('Fine dining at hotel signature restaurant');
    } else if (tier === 'middle_luxury') {
      activities.push('Airport transfer with assistance');
      activities.push('Check-in to 4-star hotel');
      activities.push('Welcome refreshments');
      activities.push('Dinner at popular local restaurant');
    } else {
      activities.push('Airport/station pick-up');
      activities.push('Check-in to budget hotel');
      activities.push('Rest and freshen up');
      activities.push('Local dinner');
    }
  } else if (dayNumber === totalDays) {
    // Departure Day
    if (tier === 'luxury') {
      activities.push('Relaxing spa and wellness session');
      activities.push('Gourmet breakfast');
      activities.push('Private shopping assistance');
      activities.push('Luxury vehicle drop to airport');
    } else if (tier === 'middle_luxury') {
      activities.push('Morning leisure time');
      activities.push('Breakfast');
      activities.push('Shopping at premium outlets');
      activities.push('Comfortable airport transfer');
    } else {
      activities.push('Morning free time');
      activities.push('Breakfast');
      activities.push('Last minute local shopping');
      activities.push('Airport/station drop');
    }
  } else {
    // Regular sightseeing days
    const attractionIndex = (dayNumber - 2) % destData.attractions.length;
    const mainAttraction = destData.attractions[attractionIndex];
    const secondAttraction = destData.attractions[(attractionIndex + 1) % destData.attractions.length];
    const subCity = destData.cities[dayNumber % destData.cities.length];

    // Morning activities
    if (tier === 'luxury') {
      activities.push(`Private guided tour of ${mainAttraction} with expert historian`);
      activities.push(`Exclusive VIP access and skip-the-line entry`);
    } else if (tier === 'middle_luxury') {
      activities.push(`Guided visit to ${mainAttraction}`);
      activities.push(`Professional photography at key spots`);
    } else {
      activities.push(`Visit ${mainAttraction}`);
      activities.push(`Self-guided exploration`);
    }

    // Add sub-city exploration
    activities.push(`Explore ${subCity} and its local culture`);

    // Afternoon activities based on interests
    if (interests.includes('Food & cuisine')) {
      if (tier === 'luxury') {
        activities.push('Private cooking class with celebrity chef');
        activities.push('Fine dining at Michelin-recommended restaurant');
      } else if (tier === 'middle_luxury') {
        activities.push('Food walking tour with local guide');
        activities.push('Dinner at highly-rated restaurant');
      } else {
        activities.push('Local street food tasting');
        activities.push('Budget-friendly local eatery');
      }
    }

    if (interests.includes('Adventure sports') && dayNumber === Math.floor(totalDays / 2)) {
      if (tier === 'luxury') {
        activities.push('Premium adventure activities with personal instructor');
      } else if (tier === 'middle_luxury') {
        activities.push('Guided adventure activities');
      } else {
        activities.push('Basic adventure activities');
      }
    }

    if (interests.includes('Shopping')) {
      if (tier === 'luxury') {
        activities.push('Personal shopping tour at high-end boutiques');
      } else if (tier === 'middle_luxury') {
        activities.push('Shopping at popular malls and markets');
      } else {
        activities.push('Local bazaar and street market shopping');
      }
    }

    // Second attraction
    activities.push(`Visit ${secondAttraction}`);

    // Cultural preferences
    if (culturalPrefs.includes('Pilgrimage sites (temples, churches, mosques)')) {
      if (tier === 'luxury') {
        activities.push('VIP darshan with special access and priest blessings');
      } else if (tier === 'middle_luxury') {
        activities.push('Temple visit with guide explaining significance');
      } else {
        activities.push('Temple and religious site visits');
      }
    }

    if (culturalPrefs.includes('Spiritual retreats (yoga, meditation)')) {
      if (tier === 'luxury') {
        activities.push('Private yoga and meditation with renowned master');
      } else if (tier === 'middle_luxury') {
        activities.push('Group yoga and meditation session');
      } else {
        activities.push('Morning yoga class');
      }
    }

    // Evening activities
    if (tier === 'luxury') {
      activities.push('Gourmet dinner at award-winning restaurant');
      activities.push('Private cultural performance or exclusive experience');
    } else if (tier === 'middle_luxury') {
      activities.push('Dinner at recommended restaurant');
      activities.push('Optional cultural show (own expense)');
    } else {
      activities.push('Local dinner');
      activities.push('Return to hotel');
    }
  }

  return activities;
};

export const getDestinationImages = (destination: string, travelType: 'domestic' | 'international'): string[] => {
  const imageMap: { [key: string]: string[] } = {
    'Maharashtra': [
      'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg',
      'https://images.pexels.com/photos/2467558/pexels-photo-2467558.jpeg',
    ],
    'Rajasthan': [
      'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg',
      'https://images.pexels.com/photos/3186654/pexels-photo-3186654.jpeg',
    ],
    'Kerala': [
      'https://images.pexels.com/photos/1583582/pexels-photo-1583582.jpeg',
      'https://images.pexels.com/photos/5214413/pexels-photo-5214413.jpeg',
    ],
    'Maldives': [
      'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg',
      'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg',
    ],
    'Dubai': [
      'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg',
      'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg',
    ],
    'Thailand': [
      'https://images.pexels.com/photos/1031659/pexels-photo-1031659.jpeg',
      'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg',
    ],
  };

  return imageMap[destination] || [
    'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg',
    'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg',
  ];
};

export const getHotelName = (
  destination: string,
  travelType: 'domestic' | 'international',
  tier: 'economic' | 'middle_luxury' | 'luxury',
  accommodation?: string
): string => {
  const hotelsByDestination: { [key: string]: { economic: string[]; middle_luxury: string[]; luxury: string[] } } = {
    'Maharashtra': {
      economic: ['Hotel Sai Palace', 'Rajdhani Hotel', 'City Inn'],
      middle_luxury: ['The Orchid Hotel Mumbai', 'Hotel Sunstar Grand', 'Pride Hotel Pune'],
      luxury: ['The Taj Mahal Palace Mumbai', 'JW Marriott Mumbai', 'The Oberoi Mumbai'],
    },
    'Rajasthan': {
      economic: ['Hotel Pearl Palace', 'Hotel Arya Niwas', 'Krishna Palace'],
      middle_luxury: ['Hotel Clarks Amer Jaipur', 'Ramada Udaipur', 'Park Plaza Jodhpur'],
      luxury: ['The Oberoi Udaivilas', 'Taj Lake Palace Udaipur', 'Rambagh Palace Jaipur'],
    },
    'Kerala': {
      economic: ['Green View Hotel', 'Sarovaram Backwater', 'Tea Valley Resort'],
      middle_luxury: ['Spice Village Thekkady', 'Grand Hyatt Kochi', 'Fragrant Nature Backwater Resort'],
      luxury: ['Taj Malabar Kochi', 'Kumarakom Lake Resort', 'The Leela Kovalam'],
    },
    'Goa': {
      economic: ['Baga Beach Resort', 'Treebo Trend Sea Pearl', 'OYO Rooms Calangute'],
      middle_luxury: ['Novotel Goa Resort', 'The Park Calangute', 'Holiday Inn Goa'],
      luxury: ['Taj Exotica Goa', 'The Leela Goa', 'Grand Hyatt Goa'],
    },
    'Ladakh': {
      economic: ['Hotel Lha-Ri-Sa', 'Hotel Dragon', 'Himalaya House'],
      middle_luxury: ['The Grand Dragon Ladakh', 'Hotel Lasermo', 'The Zen Ladakh'],
      luxury: ['The Grand Dragon Ladakh', 'Stok Palace Heritage Hotel', 'The Chamba Camp Thiksey'],
    },
    'Uttarakhand': {
      economic: ['Hotel Ganga Kinare', 'Yog Niketan', 'Hotel Devlok'],
      middle_luxury: ['Ramada by Wyndham Haridwar', 'Ananda in the Himalayas', 'JW Marriott Mussoorie'],
      luxury: ['Ananda in the Himalayas', 'The Claridges Nabha', 'Taj Rishikesh Resort & Spa'],
    },
    'Himachal Pradesh': {
      economic: ['Hotel Snow Valley', 'Apple Country Resort', 'Hotel White Meadows'],
      middle_luxury: ['Radisson Shimla', 'Span Resort & Spa Manali', 'Fortune Park Dalhousie'],
      luxury: ['Wildflower Hall Shimla', 'The Oberoi Wildflower Hall', 'Hyatt Regency Dharamshala'],
    },
    'Varanasi': {
      economic: ['Hotel Ganges View', 'Moustache Hostel', 'Hotel Alka'],
      middle_luxury: ['Radisson Hotel Varanasi', 'Ramada Plaza JHV', 'Rivatas by Ideal'],
      luxury: ['Taj Ganges Varanasi', 'BrijRama Palace', 'Suryauday Haveli'],
    },
    'Tamil Nadu': {
      economic: ['Hotel Savera', 'Hotel Breeze Residency', 'GRT Regency'],
      middle_luxury: ['ITC Grand Chola Chennai', 'The Gateway Hotel Madurai', 'Hyatt Regency Chennai'],
      luxury: ['Taj Coromandel Chennai', 'The Leela Palace Chennai', 'Heritage Madurai'],
    },
    'West Bengal': {
      economic: ['Hotel Aafreen', 'Hotel Lindsay', 'Hotel Galaxy'],
      middle_luxury: ['ITC Royal Bengal', 'The Oberoi Grand', 'Hyatt Regency Kolkata'],
      luxury: ['Taj Bengal Kolkata', 'The Lalit Great Eastern', 'JW Marriott Kolkata'],
    },
    'Gujarat': {
      economic: ['Hotel Volga', 'Comfort Inn', 'Hotel Royal Palace'],
      middle_luxury: ['Hyatt Regency Ahmedabad', 'Radisson Blu Ahmedabad', 'Fortune Landmark Ahmedabad'],
      luxury: ['Taj Gateway Dwarka', 'The Fern Residency', 'Hyatt Ahmedabad'],
    },
    'Karnataka': {
      economic: ['Hotel Pai Viceroy', 'Hotel Mayura', 'Royal Orchid Central'],
      middle_luxury: ['ITC Gardenia Bangalore', 'The Windflower Resort Mysore', 'Taj Mysore'],
      luxury: ['The Leela Palace Bangalore', 'Taj West End Bangalore', 'Evolve Back Coorg'],
    },
    'Jammu & Kashmir': {
      economic: ['Hotel Akbar', 'Hotel Grand Mumtaz', 'Hotel Pine Spring'],
      middle_luxury: ['Vivanta Dal View Srinagar', 'The Khyber Himalayan Resort', 'Radisson Srinagar'],
      luxury: ['The LaLiT Grand Palace Srinagar', 'Taj Vivanta Srinagar', 'The Khyber Himalayan Resort & Spa'],
    },
    'Sikkim': {
      economic: ['Hotel Sonam Delek', 'Hotel Tibet', 'Summit Newa'],
      middle_luxury: ['Mayfair Spa Resort Gangtok', 'The Elgin Nor-Khill', 'WelcomHeritage Denzong Regency'],
      luxury: ['Taj Guras Kutir Resort', 'Elgin Mount Pandim', 'Chumbi Residency'],
    },
    'Assam': {
      economic: ['Hotel Brahmaputra', 'Hotel Dynasty', 'Hotel Nandan'],
      middle_luxury: ['Radisson Blu Guwahati', 'Vivanta Guwahati', 'Kiranshree Portico'],
      luxury: ['Kaziranga Golf Resort', 'Diphlu River Lodge', 'Iora - The Retreat'],
    },
    'Meghalaya': {
      economic: ['Hotel Centre Point', 'Hotel Pegasus Crown', 'Hotel Pine Borough Inn'],
      middle_luxury: ['Polo Orchid Resort Cherrapunji', 'Ri Kynjai Resort', 'Royal Heritage Tripura Castle'],
      luxury: ['Jiva Resort Cherrapunji', 'Ri Kynjai Serenity by the Lake', 'Polo Towers Shillong'],
    },
    'North East India': {
      economic: ['Hotel Tashi Delek', 'Hotel Druk', 'Hotel Migmar'],
      middle_luxury: ['Vivanta Tawang', 'Hotel Nefa', 'Classic Hotel Tawang'],
      luxury: ['Tawang Inn', 'Pemaling Guest House', 'Zax Star Hotel Tawang'],
    },
    'Maldives': {
      economic: ['Arena Beach Hotel', 'Kaani Beach Hotel', 'Sala Boutique Hotel'],
      middle_luxury: ['Adaaran Prestige Vadoo', 'Meeru Island Resort', 'Paradise Island Resort'],
      luxury: ['Conrad Maldives Rangali Island', 'One&Only Reethi Rah', 'Soneva Jani'],
    },
    'Dubai': {
      economic: ['Rove Downtown', 'ibis Styles Dragon Mart', 'Premier Inn Dubai'],
      middle_luxury: ['Rove City Centre', 'Hilton Dubai Al Habtoor City', 'Crowne Plaza Dubai Marina'],
      luxury: ['Burj Al Arab Jumeirah', 'Atlantis The Palm', 'Armani Hotel Dubai'],
    },
    'Thailand': {
      economic: ['Lub d Bangkok', 'Aspira Grand Regency', 'Sawasdee Hotel'],
      middle_luxury: ['Novotel Bangkok', 'Centara Grand Beach Resort Phuket', 'Holiday Inn Pattaya'],
      luxury: ['Mandarin Oriental Bangkok', 'Banyan Tree Phuket', 'Four Seasons Bangkok'],
    },
    'Singapore': {
      economic: ['Hotel 81', 'Fragrance Hotel', 'ibis Budget'],
      middle_luxury: ['Park Hotel Clarke Quay', 'Village Hotel Sentosa', 'Novotel Singapore'],
      luxury: ['Marina Bay Sands', 'Raffles Singapore', 'The Fullerton Hotel'],
    },
    'Bali': {
      economic: ['Kuta Beach Club', 'Puri Saron Hotel', 'Grand Ixora Kuta Resort'],
      middle_luxury: ['Hard Rock Hotel Bali', 'The Stones Legian', 'Melia Bali'],
      luxury: ['The St. Regis Bali Resort', 'Four Seasons Resort Bali', 'AYANA Resort Bali'],
    },
    'Nepal': {
      economic: ['Hotel Manaslu', 'Kathmandu Guest House', 'Hotel Encounter Nepal'],
      middle_luxury: ['Hotel Yak & Yeti', 'Hyatt Regency Kathmandu', 'Soaltee Kathmandu'],
      luxury: ['Dwarika\'s Hotel', 'The Pavilions Himalayas', 'Tiger Mountain Pokhara Lodge'],
    },
    'Bhutan': {
      economic: ['Hotel Norling', 'Hotel Druk', 'Bhutan Suites'],
      middle_luxury: ['Le Meridien Paro', 'Zhiwa Ling Hotel', 'Taj Tashi Thimphu'],
      luxury: ['Amankora', 'Six Senses Bhutan', 'COMO Uma Paro'],
    },
    'Switzerland': {
      economic: ['ibis Zurich City West', 'Hotel Bristol Zurich', 'Easyhotel Zurich'],
      middle_luxury: ['Swissotel Zurich', 'Hotel Schweizerhof Lucerne', 'Metropole Interlaken'],
      luxury: ['Badrutt\'s Palace St. Moritz', 'The Dolder Grand Zurich', 'Victoria-Jungfrau Grand Hotel'],
    },
    'Paris': {
      economic: ['Hotel Europe Liege', 'ibis Paris Opera', 'Le Grand Hotel'],
      middle_luxury: ['Novotel Paris Centre', 'Hyatt Regency Paris Etoile', 'Pullman Paris Montparnasse'],
      luxury: ['The Ritz Paris', 'Le Meurice', 'Four Seasons Hotel George V'],
    },
    'London': {
      economic: ['Premier Inn London', 'Travelodge London', 'ibis Styles London'],
      middle_luxury: ['Park Plaza Westminster', 'Hilton London Paddington', 'Strand Palace Hotel'],
      luxury: ['The Savoy', 'Claridge\'s', 'The Langham London'],
    },
    'Malaysia': {
      economic: ['Tune Hotel', 'Hotel Sentral KL', 'Swiss Inn Kuala Lumpur'],
      middle_luxury: ['Berjaya Times Square Hotel', 'Sunway Pyramid Hotel', 'Hilton Kuala Lumpur'],
      luxury: ['Mandarin Oriental KL', 'The Ritz-Carlton KL', 'Four Seasons Kuala Lumpur'],
    },
    'Sri Lanka': {
      economic: ['Clock Inn Colombo', 'Havelock City Hotel', 'Hotel Octagon'],
      middle_luxury: ['Cinnamon Lakeside Colombo', 'Jetwing Yala', 'Heritance Kandalama'],
      luxury: ['Shangri-La Colombo', 'Cinnamon Lodge Habarana', 'Taj Bentota Resort'],
    },
    'Vietnam': {
      economic: ['Hanoi La Siesta Hotel', 'Liberty Central Saigon', 'Halong Pearl Hotel'],
      middle_luxury: ['Hotel Nikko Hanoi', 'Liberty Central Saigon Riverside', 'Novotel Halong Bay'],
      luxury: ['Sofitel Legend Metropole Hanoi', 'Park Hyatt Saigon', 'InterContinental Hanoi Westlake'],
    },
    'Turkey': {
      economic: ['Grand Washington Hotel', 'Hotel Niles Istanbul', 'Seven Hills Hotel'],
      middle_luxury: ['Swissotel The Bosphorus', 'Hilton Istanbul Bomonti', 'Radisson Blu Istanbul'],
      luxury: ['Four Seasons Sultanahmet', 'Ciragan Palace Kempinski', 'The Ritz-Carlton Istanbul'],
    },
  };

  const hotels = hotelsByDestination[destination];
  if (!hotels) {
    if (tier === 'economic') return 'Budget Hotel';
    if (tier === 'middle_luxury') return '4-Star Hotel';
    return '5-Star Luxury Hotel';
  }

  // Each tier should get its own hotel regardless of accommodation preference
  // The accommodation preference only affects pricing, not the hotel shown
  const hotelList = hotels[tier];
  return hotelList[0]; // Return first hotel from the list
};
