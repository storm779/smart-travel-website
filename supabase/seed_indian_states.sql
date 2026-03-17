-- ============================================================
-- ADDITIONAL INDIAN STATE PACKAGES
-- Run in Supabase SQL Editor
-- Covers states not in original seed data
-- ============================================================

INSERT INTO packages (title, destination, duration_days, duration_nights, description, detailed_itinerary, inclusions, exclusions, price_per_person, theme, images, rating, total_ratings, is_active, category) VALUES

-- Karnataka
('Karnataka Heritage & Coast', 'Karnataka', 7, 6, 'From the royal city of Mysore to the ruins of Hampi and the beaches of Gokarna. Explore ancient temples, lush coffee plantations of Coorg, and stunning waterfalls.',
'[{"day": 1, "title": "Bangalore Arrival", "activities": ["Lalbagh Botanical Garden", "Bangalore Palace", "MG Road"]}, {"day": 2, "title": "Mysore", "activities": ["Mysore Palace", "Chamundi Hills", "Brindavan Gardens musical fountain"]}, {"day": 3, "title": "Coorg", "activities": ["Abbey Falls", "Coffee plantation tour", "Raja Seat sunset"]}, {"day": 4, "title": "Hampi", "activities": ["Virupaksha Temple", "Vittala Temple complex", "Stone chariot", "Sunset at Hemakuta Hill"]}, {"day": 5, "title": "Hampi Exploration", "activities": ["Royal Enclosure", "Elephant Stables", "Coracle ride on Tungabhadra"]}, {"day": 6, "title": "Gokarna", "activities": ["Om Beach", "Kudle Beach", "Mahabaleshwar Temple"]}, {"day": 7, "title": "Departure", "activities": ["Beach sunrise", "Return journey"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Daily breakfast', 'AC vehicle', 'Guide services', 'Entry fees'],
ARRAY['Lunch and dinner', 'Water sports', 'Personal expenses'],
23999.00, 'heritage',
ARRAY['https://images.pexels.com/photos/3522880/pexels-photo-3522880.jpeg', 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg', 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg'],
4.7, 234, true, 'domestic'),

-- Punjab
('Golden Temple & Punjab Heritage', 'Punjab', 5, 4, 'Experience the spiritual heart of Sikhism at the Golden Temple, witness the Wagah Border ceremony, and savor authentic Punjabi cuisine and warm hospitality.',
'[{"day": 1, "title": "Amritsar Arrival", "activities": ["Golden Temple darshan", "Langar experience", "Jallianwala Bagh"]}, {"day": 2, "title": "Wagah Border", "activities": ["Heritage walk", "Partition Museum", "Wagah Border ceremony"]}, {"day": 3, "title": "Amritsar Culture", "activities": ["Gobindgarh Fort", "Pul Kanjri", "Food trail — Kulcha, Lassi, Amritsari fish"]}, {"day": 4, "title": "Chandigarh", "activities": ["Rock Garden", "Sukhna Lake", "Rose Garden", "Sector 17 market"]}, {"day": 5, "title": "Departure", "activities": ["Morning temple visit", "Shopping", "Return journey"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Daily breakfast', 'AC vehicle', 'Wagah Border transfer', 'Guide'],
ARRAY['Other meals', 'Temple donations', 'Personal expenses'],
15999.00, 'religious',
ARRAY['https://images.pexels.com/photos/3520547/pexels-photo-3520547.jpeg', 'https://images.pexels.com/photos/5765827/pexels-photo-5765827.jpeg', 'https://images.pexels.com/photos/3821648/pexels-photo-3821648.jpeg'],
4.8, 312, true, 'domestic'),

-- Madhya Pradesh
('Madhya Pradesh Wildlife & Heritage', 'Madhya Pradesh', 7, 6, 'Discover the heart of India with tiger safaris in Bandhavgarh, ancient temples of Khajuraho, and the grandeur of Sanchi and Orchha.',
'[{"day": 1, "title": "Bhopal Arrival", "activities": ["Upper Lake", "Bharat Bhavan", "Tribal Museum"]}, {"day": 2, "title": "Sanchi & Bhimbetka", "activities": ["Sanchi Stupa (UNESCO)", "Bhimbetka rock shelters (UNESCO)", "Ancient paintings"]}, {"day": 3, "title": "Khajuraho", "activities": ["Western group temples", "Eastern group temples", "Light & Sound show"]}, {"day": 4, "title": "Orchha", "activities": ["Orchha Fort complex", "Chaturbhuj Temple", "Raja Mahal", "Cenotaphs"]}, {"day": 5, "title": "Bandhavgarh", "activities": ["Morning safari", "Evening safari", "Tiger tracking"]}, {"day": 6, "title": "Bandhavgarh Safari", "activities": ["Full day safari", "Bird watching", "Nature walk"]}, {"day": 7, "title": "Departure", "activities": ["Morning leisure", "Return journey"]}]'::jsonb,
ARRAY['Hotel & jungle lodge', 'Daily breakfast', 'AC vehicle', 'Safari jeep & permits', 'Naturalist guide', 'Entry fees'],
ARRAY['Other meals', 'Camera fees in park', 'Personal expenses'],
28999.00, 'wildlife',
ARRAY['https://images.pexels.com/photos/3551498/pexels-photo-3551498.jpeg', 'https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg', 'https://images.pexels.com/photos/4577791/pexels-photo-4577791.jpeg'],
4.6, 178, true, 'domestic'),

-- Odisha
('Odisha Temple & Tribal Trail', 'Odisha', 6, 5, 'Explore the Sun Temple of Konark, the sacred Jagannath Temple in Puri, pristine Chilika Lake, and the tribal heritage of eastern India.',
'[{"day": 1, "title": "Bhubaneswar Arrival", "activities": ["Lingaraj Temple", "Rajarani Temple", "Udayagiri-Khandagiri caves"]}, {"day": 2, "title": "Puri", "activities": ["Jagannath Temple", "Golden Beach", "Raghurajpur art village"]}, {"day": 3, "title": "Konark", "activities": ["Sun Temple (UNESCO)", "Marine Drive", "Chandrabhaga Beach"]}, {"day": 4, "title": "Chilika Lake", "activities": ["Boat ride", "Irrawaddy dolphins", "Bird watching", "Kalijai Temple"]}, {"day": 5, "title": "Tribal Heritage", "activities": ["Tribal Museum", "Dhauli Peace Pagoda", "Handicraft shopping"]}, {"day": 6, "title": "Departure", "activities": ["Morning temple visit", "Return journey"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Daily breakfast', 'AC vehicle', 'Chilika boat ride', 'Guide services'],
ARRAY['Other meals', 'Temple donations', 'Personal expenses'],
17999.00, 'cultural',
ARRAY['https://images.pexels.com/photos/6064258/pexels-photo-6064258.jpeg', 'https://images.pexels.com/photos/2847648/pexels-photo-2847648.jpeg', 'https://images.pexels.com/photos/3522880/pexels-photo-3522880.jpeg'],
4.5, 145, true, 'domestic'),

-- Sikkim
('Sikkim Himalayan Bliss', 'Sikkim', 6, 5, 'Witness the majestic Kanchenjunga, explore Buddhist monasteries, drive through flower valleys, and experience the serene beauty of Tsomgo Lake and Nathula Pass.',
'[{"day": 1, "title": "Gangtok Arrival", "activities": ["MG Marg", "Enchey Monastery", "Flower show"]}, {"day": 2, "title": "Tsomgo & Nathula", "activities": ["Tsomgo Lake", "Nathula Pass (Indo-China border)", "Yak ride"]}, {"day": 3, "title": "Gangtok Sightseeing", "activities": ["Rumtek Monastery", "Tashi Viewpoint", "Do Drul Chorten", "Namgyal Institute"]}, {"day": 4, "title": "Pelling", "activities": ["Pemayangtse Monastery", "Rabdentse Ruins", "Kanchenjunga Falls"]}, {"day": 5, "title": "Pelling Views", "activities": ["Skywalk", "Kanchenjunga sunrise", "Khecheopalri Lake"]}, {"day": 6, "title": "Departure", "activities": ["Shopping", "Return via Bagdogra"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Daily breakfast', 'SUV transfers', 'Nathula permits', 'Guide'],
ARRAY['Other meals', 'Yak ride charges', 'Personal expenses'],
22999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg', 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg', 'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg'],
4.7, 198, true, 'domestic'),

-- Meghalaya
('Meghalaya Cloud Kingdom', 'Meghalaya', 6, 5, 'Explore the abode of clouds — living root bridges, crystal-clear rivers, the wettest place on earth, and stunning caves in the Scotland of the East.',
'[{"day": 1, "title": "Shillong Arrival", "activities": ["Ward Lake", "Don Bosco Museum", "Police Bazaar"]}, {"day": 2, "title": "Cherrapunji", "activities": ["Nohkalikai Falls", "Seven Sisters Falls", "Mawsmai Cave", "Eco Park"]}, {"day": 3, "title": "Living Root Bridges", "activities": ["Trek to Double Decker Root Bridge", "Natural pools", "Nongriat village"]}, {"day": 4, "title": "Dawki & Mawlynnong", "activities": ["Dawki River (crystal clear)", "Glass-bottom boat", "Mawlynnong (cleanest village)"]}, {"day": 5, "title": "Laitlum & Culture", "activities": ["Laitlum Canyon", "Shillong Peak", "Local Khasi cuisine"]}, {"day": 6, "title": "Departure", "activities": ["Shopping", "Return journey"]}]'::jsonb,
ARRAY['Hotel & homestay', 'Daily breakfast', 'SUV vehicle', 'Guide', 'Trekking permits'],
ARRAY['Other meals', 'Trekking gear', 'Personal expenses'],
20999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg', 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg', 'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg'],
4.8, 167, true, 'domestic'),

-- Assam
('Assam Tea & Wilderness', 'Assam', 6, 5, 'Cruise the mighty Brahmaputra, spot one-horned rhinos in Kaziranga, explore tea gardens of Jorhat, and discover the vibrant Assamese culture.',
'[{"day": 1, "title": "Guwahati Arrival", "activities": ["Kamakhya Temple", "Brahmaputra sunset cruise", "Fancy Bazaar"]}, {"day": 2, "title": "Kaziranga", "activities": ["Elephant safari (sunrise)", "Jeep safari", "One-horned rhino spotting"]}, {"day": 3, "title": "Kaziranga Exploration", "activities": ["Western range safari", "Bird watching", "Orchid park"]}, {"day": 4, "title": "Jorhat & Tea", "activities": ["Tea garden tour", "Tea tasting", "Majuli Island"]}, {"day": 5, "title": "Majuli Island", "activities": ["Satras (monasteries)", "Mask-making village", "Tribal culture"]}, {"day": 6, "title": "Departure", "activities": ["Return to Guwahati", "Departure"]}]'::jsonb,
ARRAY['Hotel & eco lodge', 'Daily breakfast', 'All safaris & permits', 'Elephant safari', 'AC vehicle', 'Guide'],
ARRAY['Other meals', 'Camera fees', 'Personal expenses'],
25999.00, 'wildlife',
ARRAY['https://images.pexels.com/photos/3551498/pexels-photo-3551498.jpeg', 'https://images.pexels.com/photos/4577791/pexels-photo-4577791.jpeg', 'https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg'],
4.7, 156, true, 'domestic'),

-- Andaman & Nicobar
('Andaman Island Escape', 'Andaman', 6, 5, 'Turquoise waters, pristine beaches, vibrant coral reefs, and WWII history. Snorkel at Havelock Island and witness the cellular jail light show.',
'[{"day": 1, "title": "Port Blair Arrival", "activities": ["Cellular Jail", "Light & Sound show", "Corbyn Cove Beach"]}, {"day": 2, "title": "Havelock Island", "activities": ["Ferry to Havelock", "Radhanagar Beach (Asia Best)", "Sunset"]}, {"day": 3, "title": "Water Adventures", "activities": ["Scuba diving", "Snorkeling at Elephant Beach", "Glass-bottom boat"]}, {"day": 4, "title": "Neil Island", "activities": ["Natural Bridge", "Bharatpur Beach", "Lakshmanpur Beach", "Coral watching"]}, {"day": 5, "title": "North Bay & Ross", "activities": ["North Bay coral reef", "Ross Island heritage walk", "Underwater sea walk"]}, {"day": 6, "title": "Departure", "activities": ["Sagarika Emporium", "Return flight"]}]'::jsonb,
ARRAY['Beach resort stays', 'Daily breakfast', 'Ferry tickets', 'Snorkeling gear', 'All island transfers', 'Guide'],
ARRAY['Flights to Port Blair', 'Scuba diving', 'Other meals', 'Water sports charges'],
34999.00, 'beach',
ARRAY['https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg', 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg', 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg'],
4.8, 289, true, 'domestic'),

-- Telangana
('Hyderabad Heritage & Cuisine', 'Telangana', 4, 3, 'The City of Nizams — explore Charminar, Golconda Fort, Ramoji Film City, and indulge in the world-famous Hyderabadi Biryani trail.',
'[{"day": 1, "title": "Hyderabad Arrival", "activities": ["Charminar", "Laad Bazaar", "Mecca Masjid", "Biryani at Paradise"]}, {"day": 2, "title": "Heritage Tour", "activities": ["Golconda Fort", "Qutb Shahi Tombs", "Salar Jung Museum", "Hussain Sagar Lake"]}, {"day": 3, "title": "Modern Hyderabad", "activities": ["Ramoji Film City full day", "Evening at Necklace Road"]}, {"day": 4, "title": "Departure", "activities": ["Chowmahalla Palace", "Shopping", "Return journey"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Daily breakfast', 'AC vehicle', 'Ramoji Film City tickets', 'Guide'],
ARRAY['Other meals', 'Monument entry fees', 'Personal expenses'],
13999.00, 'cultural',
ARRAY['https://images.pexels.com/photos/3522880/pexels-photo-3522880.jpeg', 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg', 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg'],
4.5, 189, true, 'domestic'),

-- Andhra Pradesh
('Andhra Pradesh Pilgrimage & Nature', 'Andhra Pradesh', 5, 4, 'Visit the sacred Tirupati temple, explore Araku Valley, the Buddhist sites of Amaravati, and the beaches of Visakhapatnam.',
'[{"day": 1, "title": "Tirupati Arrival", "activities": ["Tirumala Temple darshan", "Padmavathi Temple", "Sri Kalahasti"]}, {"day": 2, "title": "Visakhapatnam", "activities": ["RK Beach", "Submarine Museum", "Kailasagiri Hill"]}, {"day": 3, "title": "Araku Valley", "activities": ["Train ride through tunnels", "Borra Caves", "Coffee plantation", "Tribal museum"]}, {"day": 4, "title": "Amaravati", "activities": ["Buddhist Stupa", "Dhyana Buddha statue", "Undavalli Caves"]}, {"day": 5, "title": "Departure", "activities": ["Beach morning", "Return journey"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Daily breakfast', 'AC vehicle', 'Temple VIP darshan', 'Araku train tickets'],
ARRAY['Other meals', 'Temple donations', 'Personal expenses'],
16999.00, 'religious',
ARRAY['https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg', 'https://images.pexels.com/photos/2847648/pexels-photo-2847648.jpeg', 'https://images.pexels.com/photos/6064258/pexels-photo-6064258.jpeg'],
4.6, 267, true, 'domestic'),

-- Chhattisgarh
('Chhattisgarh Tribal & Waterfalls', 'Chhattisgarh', 5, 4, 'Explore the unexplored — Chitrakote Falls (Niagara of India), Bastar tribal culture, ancient temples, and dense Sal forests.',
'[{"day": 1, "title": "Raipur Arrival", "activities": ["Mahant Ghasidas Museum", "Purkhouti Muktangan", "MM Fun City"]}, {"day": 2, "title": "Barnawapara Sanctuary", "activities": ["Wildlife safari", "Bird watching", "Nature walk"]}, {"day": 3, "title": "Jagdalpur", "activities": ["Chitrakote Falls", "Tirathgarh Falls", "Kanger Valley caves"]}, {"day": 4, "title": "Bastar Tribal Culture", "activities": ["Tribal haat (market)", "Danteshwari Temple", "Handicraft village", "Tribal dance"]}, {"day": 5, "title": "Departure", "activities": ["Sirpur ruins", "Return journey"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Daily breakfast', 'AC vehicle', 'Safari permits', 'Guide', 'Entry fees'],
ARRAY['Other meals', 'Personal expenses', 'Camera fees'],
14999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg', 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg', 'https://images.pexels.com/photos/4577791/pexels-photo-4577791.jpeg'],
4.4, 98, true, 'domestic'),

-- Jharkhand
('Jharkhand Waterfalls & Tribes', 'Jharkhand', 4, 3, 'Discover the land of forests with stunning waterfalls, Betla tiger reserve, ancient temples, and the rich tribal heritage of the Santhal people.',
'[{"day": 1, "title": "Ranchi Arrival", "activities": ["Hundru Falls", "Rock Garden", "Tagore Hill"]}, {"day": 2, "title": "Netarhat & Betla", "activities": ["Netarhat sunrise point", "Magnolia Point", "Betla National Park safari"]}, {"day": 3, "title": "Jamshedpur & Nature", "activities": ["Jubilee Park", "Dimna Lake", "Dalma Wildlife Sanctuary"]}, {"day": 4, "title": "Departure", "activities": ["Dassam Falls", "Return journey"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Daily breakfast', 'AC vehicle', 'Safari permits', 'Guide'],
ARRAY['Other meals', 'Camera fees', 'Personal expenses'],
12999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg', 'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg'],
4.3, 76, true, 'domestic'),

-- Bihar
('Bihar Buddhist Circuit', 'Bihar', 5, 4, 'Walk the path of Buddha — Bodh Gaya, Nalanda, Rajgir, and Vaishali. Explore the ancient seat of learning and spiritual enlightenment.',
'[{"day": 1, "title": "Patna Arrival", "activities": ["Patna Museum", "Golghar", "Gandhi Maidan", "Patna Sahib Gurudwara"]}, {"day": 2, "title": "Bodh Gaya", "activities": ["Mahabodhi Temple (UNESCO)", "Bodhi Tree", "Great Buddha statue", "Monasteries"]}, {"day": 3, "title": "Rajgir", "activities": ["Griddhakuta Peak", "Vishwa Shanti Stupa", "Hot springs", "Nalanda University ruins (UNESCO)"]}, {"day": 4, "title": "Vaishali", "activities": ["Ashoka Pillar", "World Peace Pagoda", "Kolhua archaeological site"]}, {"day": 5, "title": "Departure", "activities": ["Shopping", "Return journey"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Daily breakfast', 'AC vehicle', 'Guide', 'Entry fees'],
ARRAY['Other meals', 'Temple donations', 'Personal expenses'],
13999.00, 'religious',
ARRAY['https://images.pexels.com/photos/5458388/pexels-photo-5458388.jpeg', 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg', 'https://images.pexels.com/photos/2847648/pexels-photo-2847648.jpeg'],
4.5, 134, true, 'domestic'),

-- Arunachal Pradesh
('Arunachal Pradesh Frontier Explorer', 'Arunachal Pradesh', 7, 6, 'Explore India''s rising sun state — Tawang monastery, Sela Pass, pristine valleys, and vibrant tribal festivals of the Northeast.',
'[{"day": 1, "title": "Guwahati to Bhalukpong", "activities": ["Scenic drive", "Tipi Orchidarium", "River camp"]}, {"day": 2, "title": "Dirang", "activities": ["Dirang Dzong", "Sangti Valley", "Hot water springs", "Kiwi orchards"]}, {"day": 3, "title": "Tawang via Sela Pass", "activities": ["Sela Pass (13,700 ft)", "Jaswant Garh war memorial", "Tawang arrival"]}, {"day": 4, "title": "Tawang", "activities": ["Tawang Monastery (largest in India)", "Urgelling Monastery", "War Memorial", "Local market"]}, {"day": 5, "title": "Tawang Exploration", "activities": ["Madhuri Lake", "PTSO Lake", "Bumla Pass (Indo-China border)"]}, {"day": 6, "title": "Return Journey", "activities": ["Scenic return", "Bomdila", "Craft center"]}, {"day": 7, "title": "Departure", "activities": ["Return to Guwahati", "Departure"]}]'::jsonb,
ARRAY['Hotel & homestay', 'Daily breakfast', 'SUV vehicle', 'Inner Line Permits', 'Guide', 'All permits'],
ARRAY['Other meals', 'Personal expenses', 'Winter gear'],
29999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg', 'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg', 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg'],
4.8, 112, true, 'domestic'),

-- Nagaland
('Nagaland Hornbill Trail', 'Nagaland', 5, 4, 'Experience the fierce warrior culture of the Naga tribes, exotic cuisine, Dzukou Valley trek, and the famous Hornbill Festival spirit.',
'[{"day": 1, "title": "Dimapur to Kohima", "activities": ["War Cemetery", "Kohima State Museum", "Local market"]}, {"day": 2, "title": "Kohima Heritage", "activities": ["Kisama Heritage Village", "Naga tribal houses", "Morung architecture"]}, {"day": 3, "title": "Dzukou Valley", "activities": ["Trek to Dzukou Valley", "Lily-covered valley", "Camping"]}, {"day": 4, "title": "Mon District", "activities": ["Konyak tribe village", "Headhunter stories", "Tribal tattoos", "Handicrafts"]}, {"day": 5, "title": "Departure", "activities": ["Local market shopping", "Return journey"]}]'::jsonb,
ARRAY['Hotel & homestay', 'All meals', 'SUV vehicle', 'Inner Line Permits', 'Local guide', 'Trekking gear'],
ARRAY['Flights', 'Personal expenses', 'Extra adventure activities'],
23999.00, 'cultural',
ARRAY['https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg', 'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg', 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg'],
4.6, 89, true, 'domestic'),

-- Mizoram
('Mizoram Blue Mountains', 'Mizoram', 5, 4, 'Explore the land of blue mountains — misty peaks, serene lakes, vibrant Mizo culture, bamboo forests, and the stunning Phawngpui Peak.',
'[{"day": 1, "title": "Aizawl Arrival", "activities": ["Durtlang Hills viewpoint", "Mizoram State Museum", "Bara Bazaar"]}, {"day": 2, "title": "Reiek Heritage", "activities": ["Reiek Tlang peak", "Traditional Mizo village", "Heritage complex"]}, {"day": 3, "title": "Champhai", "activities": ["Indo-Myanmar border", "Rih Dil Lake", "Kung Nawl archaeological site"]}, {"day": 4, "title": "Tam Dil & Nature", "activities": ["Tam Dil Lake boating", "Hmuifang hills", "Mizo dance performance"]}, {"day": 5, "title": "Departure", "activities": ["Handicraft shopping", "Return journey"]}]'::jsonb,
ARRAY['Hotel accommodation', 'All meals', 'SUV vehicle', 'Inner Line Permits', 'Guide'],
ARRAY['Flights', 'Personal expenses', 'Adventure sports'],
19999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg', 'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg', 'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg'],
4.5, 67, true, 'domestic'),

-- Tripura
('Tripura Royal Heritage', 'Tripura', 4, 3, 'Discover the hidden gem of Northeast — Ujjayanta Palace, Neermahal water palace, ancient rock carvings, and the unique blend of Bengali and tribal cultures.',
'[{"day": 1, "title": "Agartala Arrival", "activities": ["Ujjayanta Palace", "Jagannath Temple", "Heritage Park"]}, {"day": 2, "title": "Neermahal & Nature", "activities": ["Neermahal Water Palace", "Rudrasagar Lake", "Sepahijala Wildlife Sanctuary"]}, {"day": 3, "title": "Unakoti", "activities": ["Rock carvings (7th century)", "Jampui Hills", "Orange garden visit"]}, {"day": 4, "title": "Departure", "activities": ["Tribal craft market", "Return journey"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Daily breakfast', 'AC vehicle', 'Boat ride', 'Guide'],
ARRAY['Other meals', 'Entry fees', 'Personal expenses'],
12999.00, 'heritage',
ARRAY['https://images.pexels.com/photos/3522880/pexels-photo-3522880.jpeg', 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg'],
4.4, 56, true, 'domestic'),

-- Manipur
('Manipur Jewel of the East', 'Manipur', 5, 4, 'The jeweled land — floating Loktak Lake, Kangla Fort, INA Museum, lush valleys, and the graceful Manipuri dance and martial art traditions.',
'[{"day": 1, "title": "Imphal Arrival", "activities": ["Kangla Fort", "Ima Market (all-women market)", "War Cemetery"]}, {"day": 2, "title": "Loktak Lake", "activities": ["Loktak Lake cruise", "Floating phumdis", "Keibul Lamjao (floating national park)", "Sangai deer"]}, {"day": 3, "title": "Heritage Trail", "activities": ["INA Museum", "Moirang", "Khongjom War Memorial"]}, {"day": 4, "title": "Ukhrul", "activities": ["Shirui Hills", "Shirui Lily (rare flower)", "Tangkhul Naga village"]}, {"day": 5, "title": "Departure", "activities": ["Manipuri dance show", "Handicrafts", "Return journey"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Daily breakfast', 'AC vehicle', 'Loktak boat ride', 'Inner Line Permits', 'Guide'],
ARRAY['Other meals', 'Personal expenses', 'Dance show tickets'],
18999.00, 'cultural',
ARRAY['https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg', 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg', 'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg'],
4.5, 78, true, 'domestic');


-- ============================================================
-- DONE! Indian state packages added.
-- ============================================================
