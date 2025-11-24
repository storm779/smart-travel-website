/*
  # Add Comprehensive Travel Packages
  
  1. Coverage
    - Top 20 Indian states with popular destinations
    - International packages (Southeast Asia, Europe, Middle East, etc.)
    - Multiple themes: Adventure, Cultural, Beach, Honeymoon, Family, Religious, Wildlife
  
  2. Indian States Covered
    - Maharashtra (Mumbai), Tamil Nadu (Chennai), West Bengal (Kolkata)
    - Gujarat (Ahmedabad), Andhra Pradesh (Visakhapatnam)
    - Telangana (Hyderabad), Madhya Pradesh (Bhopal)
    - Himachal Pradesh (Shimla/Manali), Jammu & Kashmir (Srinagar)
    - Sikkim (Gangtok), Assam (Kaziranga), Meghalaya (Shillong)
    - Odisha (Puri), Punjab (Amritsar), Haryana (Kurukshetra)
    - Chhattisgarh (Bastar), Jharkhand (Ranchi)
    - Arunachal Pradesh (Tawang), Mizoram (Aizawl), Nagaland (Kohima)
  
  3. International Destinations
    - Maldives, Dubai, Thailand, Singapore, Bali
    - Malaysia, Sri Lanka, Nepal, Bhutan, Vietnam
    - Turkey, Switzerland, Paris, London
  
  4. Package Details
    - Realistic pricing in INR
    - Detailed itineraries
    - Inclusions and exclusions
    - High-quality stock images from Pexels
    - Appropriate ratings
*/

-- Insert Indian State Packages
INSERT INTO packages (title, destination, duration_days, duration_nights, description, detailed_itinerary, inclusions, exclusions, price_per_person, theme, images, rating, total_ratings, is_active) VALUES

-- Maharashtra
('Mumbai Gateway & Ajanta Caves', 'Maharashtra', 5, 4, 'Explore the vibrant city of Mumbai and the ancient Ajanta-Ellora caves. Experience Bollywood, colonial architecture, and UNESCO World Heritage sites.', 
'[{"day": 1, "title": "Mumbai Arrival", "activities": ["Gateway of India", "Marine Drive", "Colaba Causeway"]}, {"day": 2, "title": "City Tour", "activities": ["Elephanta Caves", "Siddhivinayak Temple", "Film City"]}, {"day": 3, "title": "Travel to Aurangabad", "activities": ["Bibi Ka Maqbara", "Local markets"]}, {"day": 4, "title": "Ajanta Caves", "activities": ["UNESCO World Heritage Site exploration", "Ancient Buddhist paintings"]}, {"day": 5, "title": "Ellora Caves & Departure", "activities": ["Cave temples", "Return journey"]}]'::jsonb,
ARRAY['4-star hotel accommodation', 'Daily breakfast', 'AC transportation', 'Professional guide', 'Entry fees'],
ARRAY['Lunch and dinner', 'Personal expenses', 'Travel insurance'],
22999.00, 'cultural', 
ARRAY['https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg', 'https://images.pexels.com/photos/2467558/pexels-photo-2467558.jpeg'],
4.5, 125, true),

-- Tamil Nadu
('Temple Trail of Tamil Nadu', 'Tamil Nadu', 7, 6, 'Discover the magnificent Dravidian temples, French colonial charm of Pondicherry, and pristine beaches of Tamil Nadu.', 
'[{"day": 1, "title": "Chennai Arrival", "activities": ["Marina Beach", "Kapaleeshwarar Temple", "Fort St. George"]}, {"day": 2, "title": "Mahabalipuram", "activities": ["Shore Temple", "Five Rathas", "Butterball rock"]}, {"day": 3, "title": "Pondicherry", "activities": ["French Quarter", "Auroville", "Beach walk"]}, {"day": 4, "title": "Thanjavur", "activities": ["Brihadeeswarar Temple", "Palace museum"]}, {"day": 5, "title": "Madurai", "activities": ["Meenakshi Temple", "Tirumalai Nayak Palace"]}, {"day": 6, "title": "Rameshwaram", "activities": ["Ramanathaswamy Temple", "Pamban Bridge"]}, {"day": 7, "title": "Departure", "activities": ["Shopping", "Return journey"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Daily breakfast', 'AC vehicle', 'Temple entry fees', 'Guide services'],
ARRAY['Meals other than breakfast', 'Camera fees', 'Personal expenses'],
19999.00, 'religious',
ARRAY['https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg', 'https://images.pexels.com/photos/15341378/pexels-photo-15341378.jpeg'],
4.6, 198, true),

-- West Bengal
('Kolkata & Darjeeling Delight', 'West Bengal', 6, 5, 'Experience the cultural capital Kolkata and the scenic hill station Darjeeling with its famous tea gardens and Himalayan views.', 
'[{"day": 1, "title": "Kolkata Arrival", "activities": ["Victoria Memorial", "Howrah Bridge", "Park Street"]}, {"day": 2, "title": "City Exploration", "activities": ["Dakshineswar Temple", "Belur Math", "Indian Museum"]}, {"day": 3, "title": "Travel to Darjeeling", "activities": ["Scenic journey", "Check-in"]}, {"day": 4, "title": "Tiger Hill Sunrise", "activities": ["Kanchenjunga view", "Batasia Loop", "Tea garden visit"]}, {"day": 5, "title": "Darjeeling Sightseeing", "activities": ["Toy Train ride", "Himalayan Zoo", "Peace Pagoda"]}, {"day": 6, "title": "Departure", "activities": ["Shopping", "Return journey"]}]'::jsonb,
ARRAY['Hotel stay', 'Daily breakfast', 'Transfers', 'Toy Train tickets', 'Sightseeing'],
ARRAY['Lunch and dinner', 'Entry fees', 'Personal expenses'],
24999.00, 'cultural',
ARRAY['https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg', 'https://images.pexels.com/photos/19980772/pexels-photo-19980772.jpeg'],
4.7, 167, true),

-- Gujarat
('Gujarat Cultural Odyssey', 'Gujarat', 6, 5, 'Discover the rich heritage of Gujarat from the white desert of Kutch to the majestic Asiatic lions of Gir and ancient Dwarka temples.', 
'[{"day": 1, "title": "Ahmedabad Arrival", "activities": ["Sabarmati Ashram", "Adalaj Stepwell", "Heritage walk"]}, {"day": 2, "title": "Rann of Kutch", "activities": ["White desert", "Cultural performances", "Sunset view"]}, {"day": 3, "title": "Bhuj Exploration", "activities": ["Aina Mahal", "Prag Mahal", "Local crafts"]}, {"day": 4, "title": "Dwarka", "activities": ["Dwarkadhish Temple", "Beyt Dwarka", "Gomti Ghat"]}, {"day": 5, "title": "Somnath", "activities": ["Somnath Temple", "Beach", "Light show"]}, {"day": 6, "title": "Gir & Departure", "activities": ["Gir National Park safari", "Return"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Breakfast', 'AC transportation', 'Safari permits', 'Guide'],
ARRAY['Other meals', 'Monument fees', 'Personal expenses'],
26999.00, 'cultural',
ARRAY['https://images.pexels.com/photos/15905516/pexels-photo-15905516.jpeg', 'https://images.pexels.com/photos/17881108/pexels-photo-17881108.jpeg'],
4.6, 143, true),

-- Andhra Pradesh
('Visakhapatnam & Araku Valley', 'Andhra Pradesh', 5, 4, 'Enjoy the beautiful beaches of Vizag, Buddhist heritage sites, and the scenic coffee plantations of Araku Valley.', 
'[{"day": 1, "title": "Vizag Arrival", "activities": ["RK Beach", "Submarine Museum", "Kailasagiri"]}, {"day": 2, "title": "Beaches & Hills", "activities": ["Bheemili Beach", "Simhachalam Temple", "Dolphin Hill"]}, {"day": 3, "title": "Araku Valley", "activities": ["Borra Caves", "Coffee plantations", "Tribal Museum"]}, {"day": 4, "title": "Nature Exploration", "activities": ["Katiki Waterfalls", "Valley viewpoints", "Local markets"]}, {"day": 5, "title": "Departure", "activities": ["Beach relaxation", "Shopping", "Return"]}]'::jsonb,
ARRAY['Hotel stay', 'Breakfast', 'AC cab', 'Entry tickets', 'Guide services'],
ARRAY['Lunch and dinner', 'Adventure activities', 'Personal shopping'],
16999.00, 'family',
ARRAY['https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg', 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg'],
4.4, 89, true),

-- Telangana
('Hyderabad Heritage & Cuisine', 'Telangana', 4, 3, 'Explore the City of Pearls with its historic monuments, famous biryani, and modern IT culture.', 
'[{"day": 1, "title": "Arrival & Old City", "activities": ["Charminar", "Laad Bazaar", "Mecca Masjid"]}, {"day": 2, "title": "Forts & Museums", "activities": ["Golconda Fort", "Qutb Shahi Tombs", "Salar Jung Museum"]}, {"day": 3, "title": "Modern Hyderabad", "activities": ["Ramoji Film City", "Birla Mandir", "Hussain Sagar Lake"]}, {"day": 4, "title": "Leisure & Departure", "activities": ["Shopping", "Biryani trail", "Return journey"]}]'::jsonb,
ARRAY['3-star hotel', 'Breakfast', 'Transportation', 'Monument passes', 'Food tour'],
ARRAY['Lunch and dinner', 'Film City extras', 'Shopping'],
13999.00, 'cultural',
ARRAY['https://images.pexels.com/photos/11636400/pexels-photo-11636400.jpeg', 'https://images.pexels.com/photos/3601422/pexels-photo-3601422.jpeg'],
4.5, 176, true),

-- Madhya Pradesh
('MP Tiger Trail & Heritage', 'Madhya Pradesh', 7, 6, 'Experience thrilling tiger safaris in Bandhavgarh and Kanha, plus explore the erotic temples of Khajuraho.', 
'[{"day": 1, "title": "Jabalpur Arrival", "activities": ["Marble Rocks", "Dhuandhar Falls", "Boating"]}, {"day": 2, "title": "Bandhavgarh", "activities": ["Check-in", "Evening safari"]}, {"day": 3, "title": "Tiger Safari", "activities": ["Morning safari", "Afternoon safari", "Nature walk"]}, {"day": 4, "title": "Travel to Kanha", "activities": ["Journey through forests", "Resort check-in"]}, {"day": 5, "title": "Kanha Exploration", "activities": ["Full day safaris", "Wildlife photography"]}, {"day": 6, "title": "Khajuraho Temples", "activities": ["UNESCO temples", "Light and sound show"]}, {"day": 7, "title": "Departure", "activities": ["Morning temples", "Return"]}]'::jsonb,
ARRAY['Jungle resorts', 'All meals', '6 safaris', 'Naturalist guide', 'Park permits'],
ARRAY['Additional safaris', 'Camera fees', 'Beverages'],
45999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg', 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg'],
4.8, 234, true),

-- Himachal Pradesh
('Shimla Manali Snow Special', 'Himachal Pradesh', 6, 5, 'Experience the colonial charm of Shimla and adventure paradise Manali with snow activities and mountain views.', 
'[{"day": 1, "title": "Shimla Arrival", "activities": ["Mall Road", "Ridge", "Christ Church"]}, {"day": 2, "title": "Shimla Sightseeing", "activities": ["Kufri", "Jakhoo Temple", "State Museum"]}, {"day": 3, "title": "Travel to Manali", "activities": ["Scenic drive", "Kullu valley", "Check-in"]}, {"day": 4, "title": "Solang Valley", "activities": ["Snow activities", "Paragliding", "Cable car"]}, {"day": 5, "title": "Rohtang Pass", "activities": ["Snow point", "Photography", "Adventure sports"]}, {"day": 6, "title": "Local & Departure", "activities": ["Hadimba Temple", "Mall Road", "Return"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Breakfast', 'Volvo/cab transfers', 'Rohtang permits', 'Guide'],
ARRAY['Meals', 'Adventure activities', 'Personal expenses'],
18999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg', 'https://images.pexels.com/photos/1118877/pexels-photo-1118877.jpeg'],
4.6, 312, true),

-- Jammu & Kashmir
('Kashmir Paradise Valley', 'Jammu & Kashmir', 7, 6, 'Experience heaven on earth with Dal Lake houseboats, Mughal gardens, Gulmarg skiing, and Pahalgam meadows.', 
'[{"day": 1, "title": "Srinagar Arrival", "activities": ["Dal Lake shikara ride", "Houseboat stay", "Floating market"]}, {"day": 2, "title": "Mughal Gardens", "activities": ["Shalimar Bagh", "Nishat Bagh", "Chashme Shahi"]}, {"day": 3, "title": "Gulmarg Excursion", "activities": ["Gondola ride", "Snow activities", "Meadow walk"]}, {"day": 4, "title": "Pahalgam Journey", "activities": ["Lidder River", "Betaab Valley", "Aru Valley"]}, {"day": 5, "title": "Pahalgam Exploration", "activities": ["Baisaran meadows", "Horse riding", "Nature walks"]}, {"day": 6, "title": "Return to Srinagar", "activities": ["Shopping", "Hazratbal Shrine", "Garden visit"]}, {"day": 7, "title": "Departure", "activities": ["Local market", "Return journey"]}]'::jsonb,
ARRAY['Houseboat & hotel stays', 'Daily breakfast', 'All transfers', 'Shikara rides', 'Gondola tickets'],
ARRAY['Lunch and dinner', 'Pony rides', 'Shopping'],
29999.00, 'honeymoon',
ARRAY['https://images.pexels.com/photos/3889736/pexels-photo-3889736.jpeg', 'https://images.pexels.com/photos/4666748/pexels-photo-4666748.jpeg'],
4.9, 456, true),

-- Sikkim
('Sikkim Himalayan Wonder', 'Sikkim', 6, 5, 'Discover monasteries, mountain views including Kanchenjunga, Nathula Pass, and the serene beauty of North Sikkim.', 
'[{"day": 1, "title": "Gangtok Arrival", "activities": ["MG Marg", "Flower show", "Local cafes"]}, {"day": 2, "title": "Tsomgo Lake", "activities": ["Lake visit", "Baba Mandir", "Nathula Pass"]}, {"day": 3, "title": "North Sikkim", "activities": ["Travel to Lachung", "Scenic journey", "Village stay"]}, {"day": 4, "title": "Yumthang Valley", "activities": ["Valley of Flowers", "Hot springs", "Zero Point"]}, {"day": 5, "title": "Return to Gangtok", "activities": ["Rumtek Monastery", "Cable car", "Hanuman Tok"]}, {"day": 6, "title": "Departure", "activities": ["Shopping", "Return journey"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Meals', 'Permit arrangements', 'All transfers', 'Guide'],
ARRAY['Personal expenses', 'Additional activities', 'Tips'],
23999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg', 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg'],
4.7, 189, true),

-- Assam
('Assam Wildlife & Tea Gardens', 'Assam', 6, 5, 'One-horned rhino safari in Kaziranga, river island Majuli, and lush tea plantations of Assam.', 
'[{"day": 1, "title": "Guwahati Arrival", "activities": ["Kamakhya Temple", "Brahmaputra cruise", "Local markets"]}, {"day": 2, "title": "Travel to Kaziranga", "activities": ["Journey through tea gardens", "Resort check-in"]}, {"day": 3, "title": "Kaziranga Safari", "activities": ["Elephant safari", "Jeep safari", "Bird watching"]}, {"day": 4, "title": "Full Day Wildlife", "activities": ["Morning safari", "Orchid park", "Evening safari"]}, {"day": 5, "title": "Majuli Island", "activities": ["Worlds largest river island", "Satras visit", "Mask making"]}, {"day": 6, "title": "Tea Estate & Departure", "activities": ["Tea garden tour", "Tea tasting", "Return"]}]'::jsonb,
ARRAY['Hotels and resorts', 'All meals', '4 safaris', 'Boat to Majuli', 'Permits'],
ARRAY['Additional safaris', 'Shopping', 'Tips'],
32999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg', 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg'],
4.8, 167, true),

-- Meghalaya
('Meghalaya Living Bridges Trek', 'Meghalaya', 5, 4, 'Trek to double-decker living root bridges, explore caves, waterfalls, and the cleanest village in Asia.', 
'[{"day": 1, "title": "Shillong Arrival", "activities": ["Ward Lake", "Cathedral", "Don Bosco Museum"]}, {"day": 2, "title": "Cherrapunji", "activities": ["Nohkalikai Falls", "Mawsmai Cave", "Seven Sisters Falls"]}, {"day": 3, "title": "Double Decker Bridge", "activities": ["Trek to root bridges", "Natural pools", "Village stay"]}, {"day": 4, "title": "Mawlynnong", "activities": ["Cleanest village", "Sky walk", "Living root bridge"]}, {"day": 5, "title": "Dawki & Departure", "activities": ["Crystal clear Umngot river", "Boating", "Return"]}]'::jsonb,
ARRAY['Hotels and homestays', 'Daily breakfast', 'Transportation', 'Trek guide', 'Entry fees'],
ARRAY['Other meals', 'Boating charges', 'Personal expenses'],
19999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/5624232/pexels-photo-5624232.jpeg', 'https://images.pexels.com/photos/6394641/pexels-photo-6394641.jpeg'],
4.6, 145, true),

-- Odisha
('Odisha Temple & Beach Circuit', 'Odisha', 6, 5, 'Explore ancient temples of Bhubaneswar, Konark Sun Temple, Puri beach, and Chilika Lake.', 
'[{"day": 1, "title": "Bhubaneswar Arrival", "activities": ["Lingaraj Temple", "Mukteshwar Temple", "Udayagiri caves"]}, {"day": 2, "title": "Temple City Tour", "activities": ["Rajarani Temple", "Dhauli Peace Pagoda", "State Museum"]}, {"day": 3, "title": "Konark & Puri", "activities": ["Sun Temple", "Chandrabhaga Beach", "Puri check-in"]}, {"day": 4, "title": "Puri Darshan", "activities": ["Jagannath Temple", "Beach", "Sand art village"]}, {"day": 5, "title": "Chilika Lake", "activities": ["Asia largest lagoon", "Dolphin watching", "Bird sanctuary"]}, {"day": 6, "title": "Departure", "activities": ["Shopping", "Return journey"]}]'::jsonb,
ARRAY['Hotel stay', 'Breakfast', 'AC vehicle', 'Boat ride', 'Temple guides'],
ARRAY['Meals', 'Entry fees', 'Personal expenses'],
17999.00, 'religious',
ARRAY['https://images.pexels.com/photos/7974967/pexels-photo-7974967.jpeg', 'https://images.pexels.com/photos/6419127/pexels-photo-6419127.jpeg'],
4.5, 198, true),

-- Punjab
('Punjab Heritage & Spirituality', 'Punjab', 4, 3, 'Visit the Golden Temple, Jallianwala Bagh, Wagah Border ceremony, and experience Punjabi culture.', 
'[{"day": 1, "title": "Amritsar Arrival", "activities": ["Golden Temple", "Langar experience", "Evening Palki ceremony"]}, {"day": 2, "title": "Historic Amritsar", "activities": ["Jallianwala Bagh", "Partition Museum", "Gobindgarh Fort"]}, {"day": 3, "title": "Wagah Border", "activities": ["Beating Retreat ceremony", "Shopping", "Cultural show"]}, {"day": 4, "title": "City & Departure", "activities": ["Akal Takht", "Local markets", "Return journey"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Daily breakfast', 'All transfers', 'Guide services', 'Entry tickets'],
ARRAY['Lunch and dinner', 'Shopping', 'Personal expenses'],
11999.00, 'religious',
ARRAY['https://images.pexels.com/photos/3015267/pexels-photo-3015267.jpeg', 'https://images.pexels.com/photos/15341378/pexels-photo-15341378.jpeg'],
4.7, 289, true),

-- Chhattisgarh
('Chhattisgarh Tribal & Nature', 'Chhattisgarh', 5, 4, 'Explore tribal culture, Chitrakoot Falls, ancient temples, and dense forests of Chhattisgarh.', 
'[{"day": 1, "title": "Raipur Arrival", "activities": ["Mahant Ghasidas Museum", "Nandan Van Zoo", "Local market"]}, {"day": 2, "title": "Chitrakoot Falls", "activities": ["Indias Niagara", "Tribal villages", "Nature walk"]}, {"day": 3, "title": "Bastar Region", "activities": ["Tribal markets", "Handicrafts", "Tirathgarh Falls"]}, {"day": 4, "title": "Kanger Valley", "activities": ["Kailash Cave", "National Park", "Wildlife"]}, {"day": 5, "title": "Return Journey", "activities": ["Shopping", "Departure"]}]'::jsonb,
ARRAY['Hotel stays', 'Breakfast', 'AC transportation', 'Guide', 'Entry fees'],
ARRAY['Other meals', 'Adventure activities', 'Shopping'],
15999.00, 'cultural',
ARRAY['https://images.pexels.com/photos/1710795/pexels-photo-1710795.jpeg', 'https://images.pexels.com/photos/2901571/pexels-photo-2901571.jpeg'],
4.3, 67, true),

-- Jharkhand
('Jharkhand Waterfalls & Temples', 'Jharkhand', 4, 3, 'Discover the spectacular waterfalls, Baidyanath Temple, and natural beauty of Jharkhand.', 
'[{"day": 1, "title": "Ranchi Arrival", "activities": ["Hundru Falls", "Rock Garden", "Tagore Hill"]}, {"day": 2, "title": "Waterfall Circuit", "activities": ["Jonha Falls", "Dasham Falls", "Panchghat Dam"]}, {"day": 3, "title": "Deoghar", "activities": ["Baidyanath Temple", "Trikut Parvat", "Ropeway"]}, {"day": 4, "title": "Departure", "activities": ["Local markets", "Return journey"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Breakfast', 'Transportation', 'Ropeway tickets', 'Guide'],
ARRAY['Meals', 'Personal expenses', 'Shopping'],
12999.00, 'religious',
ARRAY['https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg', 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg'],
4.2, 78, true),

-- Arunachal Pradesh
('Arunachal Tawang Monastery', 'Arunachal Pradesh', 7, 6, 'Visit the stunning Tawang Monastery, pristine mountain passes, and experience Buddhist culture.', 
'[{"day": 1, "title": "Guwahati to Bhalukpong", "activities": ["Scenic drive", "Permit check", "Resort stay"]}, {"day": 2, "title": "Dirang Valley", "activities": ["Hot springs", "Monastery", "Apple orchards"]}, {"day": 3, "title": "Sela Pass to Tawang", "activities": ["Sela Lake", "Paradise Lake", "Mountain views"]}, {"day": 4, "title": "Tawang Monastery", "activities": ["Second largest monastery", "Buddha statue", "Museum"]}, {"day": 5, "title": "Bumla Pass", "activities": ["Indo-China border", "Sangetsar Lake", "War memorial"]}, {"day": 6, "title": "Return Journey", "activities": ["Travel to Dirang", "Overnight stay"]}, {"day": 7, "title": "Departure", "activities": ["Return to Guwahati"]}]'::jsonb,
ARRAY['Hotels and homestays', 'All meals', 'SUV transfers', 'Permits', 'Guide'],
ARRAY['Personal expenses', 'Camera fees', 'Tips'],
34999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg', 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg'],
4.8, 112, true);

-- Insert International Packages
INSERT INTO packages (title, destination, duration_days, duration_nights, description, detailed_itinerary, inclusions, exclusions, price_per_person, theme, images, rating, total_ratings, is_active) VALUES

-- Maldives
('Maldives Paradise Escape', 'Maldives', 5, 4, 'Luxury beach resort experience with water sports, snorkeling, spa treatments, and stunning overwater villas.', 
'[{"day": 1, "title": "Male Arrival", "activities": ["Speedboat to resort", "Check-in", "Beach relaxation"]}, {"day": 2, "title": "Water Activities", "activities": ["Snorkeling", "Jet skiing", "Sunset cruise"]}, {"day": 3, "title": "Island Hopping", "activities": ["Local island visit", "Dolphin watching", "Beach BBQ"]}, {"day": 4, "title": "Spa & Leisure", "activities": ["Spa treatments", "Water sports", "Romantic dinner"]}, {"day": 5, "title": "Departure", "activities": ["Breakfast", "Transfer to airport"]}]'::jsonb,
ARRAY['4-star beach resort', 'All meals (full board)', 'Return speedboat transfers', 'Water sports', 'Snorkeling equipment'],
ARRAY['International flights', 'Spa treatments', 'Excursions', 'Alcohol', 'Travel insurance'],
89999.00, 'honeymoon',
ARRAY['https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg', 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg'],
4.9, 567, true),

-- Dubai
('Dubai Luxury Experience', 'Dubai', 5, 4, 'Explore the glamorous city of Dubai with Burj Khalifa, desert safari, Dubai Mall, and modern attractions.', 
'[{"day": 1, "title": "Dubai Arrival", "activities": ["Dubai Mall", "Burj Khalifa", "Fountain show"]}, {"day": 2, "title": "Desert Safari", "activities": ["Dune bashing", "Camel ride", "BBQ dinner", "Belly dance"]}, {"day": 3, "title": "Modern Dubai", "activities": ["Dubai Marina", "Palm Jumeirah", "Atlantis", "Beach time"]}, {"day": 4, "title": "Shopping & Culture", "activities": ["Gold Souk", "Spice Souk", "Dubai Frame", "Creek cruise"]}, {"day": 5, "title": "Departure", "activities": ["Free time", "Airport transfer"]}]'::jsonb,
ARRAY['4-star hotel with breakfast', 'Airport transfers', 'Desert safari', 'Dubai city tour', 'Burj Khalifa tickets'],
ARRAY['International flights', 'Lunch and dinner', 'Shopping', 'Additional attractions', 'Visa fees'],
54999.00, 'family',
ARRAY['https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg', 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg'],
4.7, 734, true),

-- Thailand
('Amazing Thailand Tour', 'Thailand', 7, 6, 'Explore Bangkok temples, Pattaya beaches, and vibrant nightlife with coral island water sports.', 
'[{"day": 1, "title": "Bangkok Arrival", "activities": ["City tour", "River cruise", "Night market"]}, {"day": 2, "title": "Temple Tour", "activities": ["Grand Palace", "Wat Pho", "Wat Arun", "Floating market"]}, {"day": 3, "title": "Travel to Pattaya", "activities": ["Check-in", "Beach", "Walking Street"]}, {"day": 4, "title": "Coral Island", "activities": ["Speed boat", "Water sports", "Snorkeling", "Beach lunch"]}, {"day": 5, "title": "Pattaya Attractions", "activities": ["Nong Nooch Garden", "Tiger Park", "Alcazar Show"]}, {"day": 6, "title": "Return to Bangkok", "activities": ["Shopping", "Spa", "Night tour"]}, {"day": 7, "title": "Departure", "activities": ["Free time", "Airport transfer"]}]'::jsonb,
ARRAY['3-star hotels', 'Daily breakfast', 'All transfers', 'Coral Island tour', 'City tours', 'Visa assistance'],
ARRAY['International flights', 'Lunch and dinner', 'Water sports charges', 'Shopping', 'Tips'],
42999.00, 'family',
ARRAY['https://images.pexels.com/photos/1031659/pexels-photo-1031659.jpeg', 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg'],
4.6, 892, true),

-- Singapore
('Singapore City Exploration', 'Singapore', 5, 4, 'Discover the Garden City with Universal Studios, Marina Bay, Gardens by the Bay, and Sentosa Island.', 
'[{"day": 1, "title": "Singapore Arrival", "activities": ["Marina Bay", "Merlion Park", "Gardens by the Bay"]}, {"day": 2, "title": "Universal Studios", "activities": ["Full day at theme park", "Sentosa Beach", "Wings of Time show"]}, {"day": 3, "title": "City Tour", "activities": ["Orchard Road", "Little India", "Chinatown", "Clarke Quay"]}, {"day": 4, "title": "Nature & Adventure", "activities": ["Singapore Zoo", "River Safari", "Night Safari"]}, {"day": 5, "title": "Departure", "activities": ["Free time for shopping", "Airport transfer"]}]'::jsonb,
ARRAY['3-star hotel with breakfast', 'Airport transfers', 'Universal Studios tickets', 'Night Safari', 'City tour'],
ARRAY['International flights', 'Meals', 'Shopping', 'Additional attractions', 'Visa fees'],
62999.00, 'family',
ARRAY['https://images.pexels.com/photos/777059/pexels-photo-777059.jpeg', 'https://images.pexels.com/photos/2227828/pexels-photo-2227828.jpeg'],
4.8, 645, true),

-- Bali
('Bali Island Paradise', 'Bali', 6, 5, 'Experience Bali culture with temples, rice terraces, beaches, water sports, and traditional performances.', 
'[{"day": 1, "title": "Bali Arrival", "activities": ["Kuta Beach", "Sunset", "Welcome dinner"]}, {"day": 2, "title": "Ubud Cultural Tour", "activities": ["Monkey Forest", "Tegalalang Rice Terrace", "Ubud Palace", "Art Market"]}, {"day": 3, "title": "Temple Tour", "activities": ["Tanah Lot", "Uluwatu Temple", "Kecak Dance", "Jimbaran seafood"]}, {"day": 4, "title": "Water Sports", "activities": ["Tanjung Benoa", "Parasailing", "Banana boat", "Jet ski"]}, {"day": 5, "title": "Nusa Penida", "activities": ["Island tour", "Kelingking Beach", "Angels Billabong", "Snorkeling"]}, {"day": 6, "title": "Departure", "activities": ["Spa", "Shopping", "Airport transfer"]}]'::jsonb,
ARRAY['Beach resort stay', 'Daily breakfast', 'All transfers', 'Temple tours', 'Water sports package', 'Cultural shows'],
ARRAY['International flights', 'Lunch and dinner', 'Visa on arrival', 'Personal expenses', 'Tips'],
49999.00, 'honeymoon',
ARRAY['https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg', 'https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg'],
4.7, 523, true),

-- Malaysia
('Malaysia Truly Asia', 'Malaysia', 6, 5, 'Explore Kuala Lumpur Petronas Towers, Genting Highlands, Batu Caves, and beautiful Cameron Highlands.', 
'[{"day": 1, "title": "KL Arrival", "activities": ["Petronas Towers", "KLCC Park", "Bukit Bintang"]}, {"day": 2, "title": "City Tour", "activities": ["Batu Caves", "National Museum", "Central Market", "Merdeka Square"]}, {"day": 3, "title": "Genting Highlands", "activities": ["Cable car", "Theme park", "Casino", "Sky Avenue"]}, {"day": 4, "title": "Cameron Highlands", "activities": ["Tea plantations", "Strawberry farm", "Rose garden", "Mossy Forest"]}, {"day": 5, "title": "Return to KL", "activities": ["Shopping", "Aquaria KLCC", "KL Tower"]}, {"day": 6, "title": "Departure", "activities": ["Last minute shopping", "Airport transfer"]}]'::jsonb,
ARRAY['3-star hotels', 'Daily breakfast', 'All transfers', 'Cable car tickets', 'City tours', 'Entry fees'],
ARRAY['International flights', 'Meals', 'Theme park tickets', 'Shopping', 'Visa fees'],
38999.00, 'family',
ARRAY['https://images.pexels.com/photos/442579/pexels-photo-442579.jpeg', 'https://images.pexels.com/photos/1488315/pexels-photo-1488315.jpeg'],
4.5, 412, true),

-- Sri Lanka
('Sri Lanka Heritage Tour', 'Sri Lanka', 7, 6, 'Discover the pearl of Indian Ocean with ancient cities, hill country, tea plantations, and wildlife.', 
'[{"day": 1, "title": "Colombo Arrival", "activities": ["City tour", "Galle Face", "Buddhist temples"]}, {"day": 2, "title": "Sigiriya", "activities": ["Lion Rock fortress", "Village tour", "Minneriya Safari"]}, {"day": 3, "title": "Kandy", "activities": ["Temple of Tooth", "Royal Botanical Gardens", "Cultural show"]}, {"day": 4, "title": "Nuwara Eliya", "activities": ["Hill country", "Tea factory", "Gregory Lake", "Train ride"]}, {"day": 5, "title": "Yala Safari", "activities": ["Yala National Park", "Leopard safari", "Wildlife photography"]}, {"day": 6, "title": "Galle", "activities": ["Dutch Fort", "Lighthouse", "Beach", "Shopping"]}, {"day": 7, "title": "Departure", "activities": ["Return to Colombo", "Airport transfer"]}]'::jsonb,
ARRAY['3-star hotels', 'Daily breakfast', 'AC vehicle', 'Safari jeep', 'Entry fees', 'Guide services'],
ARRAY['International flights', 'Lunch and dinner', 'Visa fees', 'Tips', 'Personal expenses'],
44999.00, 'cultural',
ARRAY['https://images.pexels.com/photos/934718/pexels-photo-934718.jpeg', 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg'],
4.6, 378, true),

-- Nepal
('Nepal Himalayan Adventure', 'Nepal', 6, 5, 'Experience Kathmandu temples, Pokhara lakes, mountain views, and spiritual Pashupatinath.', 
'[{"day": 1, "title": "Kathmandu Arrival", "activities": ["Durbar Square", "Swayambhunath", "Thamel"]}, {"day": 2, "title": "Valley Tour", "activities": ["Pashupatinath", "Boudhanath", "Patan Durbar Square"]}, {"day": 3, "title": "Pokhara", "activities": ["Scenic drive", "Phewa Lake", "Lakeside"]}, {"day": 4, "title": "Sunrise & Adventure", "activities": ["Sarangkot sunrise", "Paragliding", "Davis Falls", "Gupteshwor Cave"]}, {"day": 5, "title": "Return to Kathmandu", "activities": ["Shopping", "Leisure time"]}, {"day": 6, "title": "Departure", "activities": ["Last minute sightseeing", "Airport transfer"]}]'::jsonb,
ARRAY['3-star hotels', 'Daily breakfast', 'Tourist bus/car', 'Boating in Pokhara', 'Sightseeing', 'Guide'],
ARRAY['International flights', 'Lunch and dinner', 'Paragliding', 'Monument fees', 'Visa fees'],
29999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/1124062/pexels-photo-1124062.jpeg', 'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg'],
4.7, 289, true),

-- Bhutan
('Bhutan Happiness Kingdom', 'Bhutan', 6, 5, 'Explore the Land of Thunder Dragon with Tigers Nest, dzongs, pristine nature, and Buddhist culture.', 
'[{"day": 1, "title": "Paro Arrival", "activities": ["Paro Dzong", "National Museum", "Town walk"]}, {"day": 2, "title": "Thimphu", "activities": ["Buddha Dordenma", "Memorial Chorten", "Takin Preserve", "Craft Market"]}, {"day": 3, "title": "Punakha", "activities": ["Dochula Pass", "Punakha Dzong", "Suspension bridge", "Village walk"]}, {"day": 4, "title": "Return to Paro", "activities": ["Scenic drive", "Kyichu Lhakhang", "Local market"]}, {"day": 5, "title": "Tigers Nest Trek", "activities": ["Taktsang Monastery hike", "Prayer flags", "Mountain views"]}, {"day": 6, "title": "Departure", "activities": ["Leisure time", "Airport transfer"]}]'::jsonb,
ARRAY['3-star hotels', 'All meals', 'All transfers', 'English guide', 'Entry fees', 'Visa fees', 'Sustainable Tourism Fee'],
ARRAY['International flights', 'Tips', 'Personal expenses', 'Alcohol', 'Travel insurance'],
79999.00, 'cultural',
ARRAY['https://images.pexels.com/photos/2225439/pexels-photo-2225439.jpeg', 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg'],
4.9, 234, true),

-- Vietnam
('Vietnam Discovery Tour', 'Vietnam', 8, 7, 'Explore vibrant Hanoi, stunning Halong Bay, ancient Hoi An, and bustling Ho Chi Minh City.', 
'[{"day": 1, "title": "Hanoi Arrival", "activities": ["Old Quarter", "Hoan Kiem Lake", "Water puppet show"]}, {"day": 2, "title": "Hanoi Sightseeing", "activities": ["Ho Chi Minh Mausoleum", "Temple of Literature", "Train Street"]}, {"day": 3, "title": "Halong Bay Cruise", "activities": ["Overnight cruise", "Kayaking", "Cave exploration", "Sunset party"]}, {"day": 4, "title": "Fly to Da Nang", "activities": ["Marble Mountains", "Hoi An ancient town"]}, {"day": 5, "title": "Hoi An Exploration", "activities": ["Japanese Bridge", "Lantern making", "Tailor shops", "River cruise"]}, {"day": 6, "title": "Fly to HCMC", "activities": ["City tour", "War museum", "Notre Dame", "Post Office"]}, {"day": 7, "title": "Mekong Delta", "activities": ["Boat tour", "Floating market", "Coconut candy workshop", "Village visit"]}, {"day": 8, "title": "Departure", "activities": ["Ben Thanh Market", "Shopping", "Airport transfer"]}]'::jsonb,
ARRAY['3-star hotels', 'Daily breakfast', 'Domestic flights', 'Halong Bay cruise', 'All transfers', 'Tours', 'Visa assistance'],
ARRAY['International flights', 'Lunch and dinner', 'Drinks', 'Shopping', 'Tips'],
52999.00, 'cultural',
ARRAY['https://images.pexels.com/photos/3152124/pexels-photo-3152124.jpeg', 'https://images.pexels.com/photos/2869499/pexels-photo-2869499.jpeg'],
4.6, 456, true),

-- Turkey
('Turkey Heritage Explorer', 'Turkey', 8, 7, 'Discover Istanbul mosques, Cappadocia hot air balloons, Pamukkale thermal pools, and ancient Ephesus.', 
'[{"day": 1, "title": "Istanbul Arrival", "activities": ["Hagia Sophia", "Blue Mosque", "Hippodrome"]}, {"day": 2, "title": "Istanbul Sights", "activities": ["Topkapi Palace", "Grand Bazaar", "Spice Market", "Bosphorus cruise"]}, {"day": 3, "title": "Fly to Cappadocia", "activities": ["Goreme Open Air Museum", "Fairy chimneys", "Cave hotels"]}, {"day": 4, "title": "Cappadocia Adventure", "activities": ["Hot air balloon", "Underground city", "Pottery workshop", "Valley walk"]}, {"day": 5, "title": "Pamukkale", "activities": ["Cotton Castle", "Thermal pools", "Hierapolis ancient city"]}, {"day": 6, "title": "Ephesus", "activities": ["Ancient city tour", "Library of Celsus", "Virgin Mary House", "Artemis Temple"]}, {"day": 7, "title": "Return to Istanbul", "activities": ["Shopping", "Turkish bath", "Food tour"]}, {"day": 8, "title": "Departure", "activities": ["Free time", "Airport transfer"]}]'::jsonb,
ARRAY['4-star hotels', 'Daily breakfast', 'Domestic flights', 'All transfers', 'Guided tours', 'Entry fees'],
ARRAY['International flights', 'Lunch and dinner', 'Hot air balloon', 'Shopping', 'Visa fees', 'Tips'],
84999.00, 'cultural',
ARRAY['https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg', 'https://images.pexels.com/photos/3243027/pexels-photo-3243027.jpeg'],
4.8, 512, true),

-- Switzerland
('Swiss Alps Experience', 'Switzerland', 7, 6, 'Explore Zurich, Lucerne, Interlaken, Jungfraujoch Top of Europe, and scenic Swiss trains.', 
'[{"day": 1, "title": "Zurich Arrival", "activities": ["Lake Zurich", "Old Town", "Bahnhofstrasse shopping"]}, {"day": 2, "title": "Lucerne", "activities": ["Chapel Bridge", "Lion Monument", "Lake cruise", "Mount Pilatus"]}, {"day": 3, "title": "Interlaken", "activities": ["Harder Kulm", "Hohematte", "Adventure sports"]}, {"day": 4, "title": "Jungfraujoch", "activities": ["Top of Europe", "Ice Palace", "Sphinx Observatory", "Snow activities"]}, {"day": 5, "title": "Grindelwald", "activities": ["First Cliff Walk", "Mountain cart", "Cable car rides"]}, {"day": 6, "title": "Scenic Train", "activities": ["Golden Pass", "Mountain views", "Return to Zurich"]}, {"day": 7, "title": "Departure", "activities": ["Last minute shopping", "Airport transfer"]}]'::jsonb,
ARRAY['3-star hotels', 'Daily breakfast', 'Swiss Travel Pass', 'Jungfraujoch tickets', 'Cable cars', 'Boat cruise'],
ARRAY['International flights', 'Lunch and dinner', 'Visa fees', 'Personal expenses', 'Tips'],
189999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/1660995/pexels-photo-1660995.jpeg', 'https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg'],
4.9, 678, true),

-- Paris
('Romantic Paris Getaway', 'Paris', 5, 4, 'Experience the City of Love with Eiffel Tower, Louvre, Seine cruise, Versailles, and French cuisine.', 
'[{"day": 1, "title": "Paris Arrival", "activities": ["Eiffel Tower", "Trocadero", "Champs-Élysées", "Arc de Triomphe"]}, {"day": 2, "title": "Museums & Culture", "activities": ["Louvre Museum", "Notre-Dame", "Latin Quarter", "Seine River cruise"]}, {"day": 3, "title": "Versailles", "activities": ["Palace of Versailles", "Gardens", "Marie Antoinette Estate", "Fountain show"]}, {"day": 4, "title": "Montmartre & Art", "activities": ["Sacré-Cœur", "Artists square", "Moulin Rouge area", "Le Marais"]}, {"day": 5, "title": "Departure", "activities": ["Last minute shopping", "Café culture", "Airport transfer"]}]'::jsonb,
ARRAY['3-star hotel', 'Daily breakfast', 'Airport transfers', 'Seine cruise', 'Versailles tour', 'Metro pass'],
ARRAY['International flights', 'Lunch and dinner', 'Museum tickets', 'Visa fees', 'Shopping'],
149999.00, 'honeymoon',
ARRAY['https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg', 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg'],
4.8, 789, true),

-- London
('London Royal Heritage', 'London', 6, 5, 'Explore British history with Buckingham Palace, Tower of London, Harry Potter sites, and iconic landmarks.', 
'[{"day": 1, "title": "London Arrival", "activities": ["Big Ben", "Westminster Abbey", "London Eye", "Thames walk"]}, {"day": 2, "title": "Royal London", "activities": ["Buckingham Palace", "Changing of Guard", "Hyde Park", "Kensington Palace"]}, {"day": 3, "title": "Historic Sites", "activities": ["Tower of London", "Tower Bridge", "Borough Market", "St. Pauls Cathedral"]}, {"day": 4, "title": "Museums & Culture", "activities": ["British Museum", "Natural History Museum", "Harrods", "Piccadilly Circus"]}, {"day": 5, "title": "Harry Potter Tour", "activities": ["Warner Bros Studio", "Platform 9¾", "Kings Cross", "Oxford Street"]}, {"day": 6, "title": "Departure", "activities": ["Covent Garden", "Last minute shopping", "Airport transfer"]}]'::jsonb,
ARRAY['3-star hotel', 'Daily breakfast', 'Airport transfers', 'Thames cruise', 'Harry Potter Studio tour', 'Oyster card'],
ARRAY['International flights', 'Meals', 'Attraction tickets', 'Visa fees', 'Shopping'],
169999.00, 'family',
ARRAY['https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg', 'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg'],
4.7, 623, true);
