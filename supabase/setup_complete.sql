-- ============================================================
-- TRAVELLAH - COMPLETE DATABASE SETUP
-- Run this entire file in Supabase SQL Editor (one go)
-- Creates all tables, policies, indexes, and seeds packages
-- ============================================================


-- ============================================================
-- 1. SCHEMA: Tables
-- ============================================================

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  phone text,
  city text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  destination text NOT NULL,
  duration_days integer NOT NULL,
  duration_nights integer NOT NULL,
  description text NOT NULL,
  detailed_itinerary jsonb DEFAULT '[]'::jsonb,
  inclusions text[] DEFAULT ARRAY[]::text[],
  exclusions text[] DEFAULT ARRAY[]::text[],
  price_per_person decimal(10,2) NOT NULL,
  theme text NOT NULL,
  images text[] DEFAULT ARRAY[]::text[],
  rating decimal(2,1) DEFAULT 0,
  total_ratings integer DEFAULT 0,
  is_active boolean DEFAULT true,
  category text DEFAULT 'domestic' CHECK (category IN ('domestic', 'international')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  package_id uuid REFERENCES packages ON DELETE SET NULL,
  itinerary_data jsonb,
  booking_type text NOT NULL CHECK (booking_type IN ('package', 'custom')),
  travel_dates_start date NOT NULL,
  travel_dates_end date NOT NULL,
  num_travelers integer NOT NULL CHECK (num_travelers > 0),
  pickup_city text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  total_price decimal(10,2) NOT NULL,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_method text,
  booking_status text DEFAULT 'pending' CHECK (booking_status IN ('confirmed', 'pending', 'cancelled')),
  booking_reference text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Saved itineraries table
CREATE TABLE IF NOT EXISTS saved_itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  session_id text,
  preferences jsonb NOT NULL,
  economic_itinerary jsonb NOT NULL,
  middle_luxury_itinerary jsonb NOT NULL,
  luxury_itinerary jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_itineraries ENABLE ROW LEVEL SECURITY;

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 2. RLS POLICIES (drop if exist, then recreate)
-- ============================================================

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- Packages (public read)
DROP POLICY IF EXISTS "Packages are viewable by everyone" ON packages;

CREATE POLICY "Packages are viewable by everyone"
  ON packages FOR SELECT TO public
  USING (is_active = true);

-- Bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Saved itineraries
DROP POLICY IF EXISTS "Users can view own itineraries" ON saved_itineraries;
DROP POLICY IF EXISTS "Anonymous users can view session itineraries" ON saved_itineraries;
DROP POLICY IF EXISTS "Users can create itineraries" ON saved_itineraries;
DROP POLICY IF EXISTS "Anonymous users can create session itineraries" ON saved_itineraries;

CREATE POLICY "Users can view own itineraries"
  ON saved_itineraries FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Anonymous users can view session itineraries"
  ON saved_itineraries FOR SELECT TO anon
  USING (session_id IS NOT NULL);

CREATE POLICY "Users can create itineraries"
  ON saved_itineraries FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Anonymous users can create session itineraries"
  ON saved_itineraries FOR INSERT TO anon
  WITH CHECK (session_id IS NOT NULL);

-- Contact messages (anyone can submit)
DROP POLICY IF EXISTS "Allow public inserts" ON contact_messages;

CREATE POLICY "Allow public inserts"
  ON contact_messages FOR INSERT WITH CHECK (true);


-- ============================================================
-- 3. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_packages_destination ON packages(destination);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_package_id ON bookings(package_id);


-- ============================================================
-- 4. SEED DATA: Domestic Packages
-- ============================================================

INSERT INTO packages (title, destination, duration_days, duration_nights, description, detailed_itinerary, inclusions, exclusions, price_per_person, theme, images, rating, total_ratings, is_active, category) VALUES

-- Maharashtra
('Mumbai Gateway & Ajanta Caves', 'Maharashtra', 5, 4, 'Explore the vibrant city of Mumbai and the ancient Ajanta-Ellora caves. Experience Bollywood, colonial architecture, and UNESCO World Heritage sites.',
'[{"day": 1, "title": "Mumbai Arrival", "activities": ["Gateway of India", "Marine Drive", "Colaba Causeway"]}, {"day": 2, "title": "City Tour", "activities": ["Elephanta Caves", "Siddhivinayak Temple", "Film City"]}, {"day": 3, "title": "Travel to Aurangabad", "activities": ["Bibi Ka Maqbara", "Local markets"]}, {"day": 4, "title": "Ajanta Caves", "activities": ["UNESCO World Heritage Site exploration", "Ancient Buddhist paintings"]}, {"day": 5, "title": "Ellora Caves & Departure", "activities": ["Cave temples", "Return journey"]}]'::jsonb,
ARRAY['4-star hotel accommodation', 'Daily breakfast', 'AC transportation', 'Professional guide', 'Entry fees'],
ARRAY['Lunch and dinner', 'Personal expenses', 'Travel insurance'],
22999.00, 'cultural',
ARRAY['https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg', 'https://images.pexels.com/photos/2467558/pexels-photo-2467558.jpeg'],
4.5, 125, true, 'domestic'),

-- Tamil Nadu
('Temple Trail of Tamil Nadu', 'Tamil Nadu', 7, 6, 'Discover the magnificent Dravidian temples, French colonial charm of Pondicherry, and pristine beaches of Tamil Nadu.',
'[{"day": 1, "title": "Chennai Arrival", "activities": ["Marina Beach", "Kapaleeshwarar Temple", "Fort St. George"]}, {"day": 2, "title": "Mahabalipuram", "activities": ["Shore Temple", "Five Rathas", "Butterball rock"]}, {"day": 3, "title": "Pondicherry", "activities": ["French Quarter", "Auroville", "Beach walk"]}, {"day": 4, "title": "Thanjavur", "activities": ["Brihadeeswarar Temple", "Palace museum"]}, {"day": 5, "title": "Madurai", "activities": ["Meenakshi Temple", "Tirumalai Nayak Palace"]}, {"day": 6, "title": "Rameshwaram", "activities": ["Ramanathaswamy Temple", "Pamban Bridge"]}, {"day": 7, "title": "Departure", "activities": ["Shopping", "Return journey"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Daily breakfast', 'AC vehicle', 'Temple entry fees', 'Guide services'],
ARRAY['Meals other than breakfast', 'Camera fees', 'Personal expenses'],
19999.00, 'religious',
ARRAY['https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg', 'https://images.pexels.com/photos/15341378/pexels-photo-15341378.jpeg'],
4.6, 198, true, 'domestic'),

-- West Bengal
('Kolkata & Darjeeling Delight', 'West Bengal', 6, 5, 'Experience the cultural capital Kolkata and the scenic hill station Darjeeling with its famous tea gardens and Himalayan views.',
'[{"day": 1, "title": "Kolkata Arrival", "activities": ["Victoria Memorial", "Howrah Bridge", "Park Street"]}, {"day": 2, "title": "City Exploration", "activities": ["Dakshineswar Temple", "Belur Math", "Indian Museum"]}, {"day": 3, "title": "Travel to Darjeeling", "activities": ["Scenic journey", "Check-in"]}, {"day": 4, "title": "Tiger Hill Sunrise", "activities": ["Kanchenjunga view", "Batasia Loop", "Tea garden visit"]}, {"day": 5, "title": "Darjeeling Sightseeing", "activities": ["Toy Train ride", "Himalayan Zoo", "Peace Pagoda"]}, {"day": 6, "title": "Departure", "activities": ["Shopping", "Return journey"]}]'::jsonb,
ARRAY['Hotel stay', 'Daily breakfast', 'Transfers', 'Toy Train tickets', 'Sightseeing'],
ARRAY['Lunch and dinner', 'Entry fees', 'Personal expenses'],
24999.00, 'cultural',
ARRAY['https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg', 'https://images.pexels.com/photos/19980772/pexels-photo-19980772.jpeg'],
4.7, 167, true, 'domestic'),

-- Gujarat
('Gujarat Cultural Odyssey', 'Gujarat', 6, 5, 'Discover the rich heritage of Gujarat from the white desert of Kutch to the majestic Asiatic lions of Gir and ancient Dwarka temples.',
'[{"day": 1, "title": "Ahmedabad Arrival", "activities": ["Sabarmati Ashram", "Adalaj Stepwell", "Heritage walk"]}, {"day": 2, "title": "Rann of Kutch", "activities": ["White desert", "Cultural performances", "Sunset view"]}, {"day": 3, "title": "Bhuj Exploration", "activities": ["Aina Mahal", "Prag Mahal", "Local crafts"]}, {"day": 4, "title": "Dwarka", "activities": ["Dwarkadhish Temple", "Beyt Dwarka", "Gomti Ghat"]}, {"day": 5, "title": "Somnath", "activities": ["Somnath Temple", "Beach", "Light show"]}, {"day": 6, "title": "Gir & Departure", "activities": ["Gir National Park safari", "Return"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Breakfast', 'AC transportation', 'Safari permits', 'Guide'],
ARRAY['Other meals', 'Monument fees', 'Personal expenses'],
26999.00, 'cultural',
ARRAY['https://images.pexels.com/photos/15905516/pexels-photo-15905516.jpeg', 'https://images.pexels.com/photos/17881108/pexels-photo-17881108.jpeg'],
4.6, 143, true, 'domestic'),

-- Himachal Pradesh
('Shimla Manali Snow Special', 'Himachal Pradesh', 6, 5, 'Experience the colonial charm of Shimla and adventure paradise Manali with snow activities and mountain views.',
'[{"day": 1, "title": "Shimla Arrival", "activities": ["Mall Road", "Ridge", "Christ Church"]}, {"day": 2, "title": "Shimla Sightseeing", "activities": ["Kufri", "Jakhoo Temple", "State Museum"]}, {"day": 3, "title": "Travel to Manali", "activities": ["Scenic drive", "Kullu valley", "Check-in"]}, {"day": 4, "title": "Solang Valley", "activities": ["Snow activities", "Paragliding", "Cable car"]}, {"day": 5, "title": "Rohtang Pass", "activities": ["Snow point", "Photography", "Adventure sports"]}, {"day": 6, "title": "Local & Departure", "activities": ["Hadimba Temple", "Mall Road", "Return"]}]'::jsonb,
ARRAY['Hotel accommodation', 'Breakfast', 'Volvo/cab transfers', 'Rohtang permits', 'Guide'],
ARRAY['Meals', 'Adventure activities', 'Personal expenses'],
18999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg', 'https://images.pexels.com/photos/1118877/pexels-photo-1118877.jpeg'],
4.6, 312, true, 'domestic'),

-- Jammu & Kashmir
('Kashmir Paradise Valley', 'Jammu & Kashmir', 7, 6, 'Experience heaven on earth with Dal Lake houseboats, Mughal gardens, Gulmarg skiing, and Pahalgam meadows.',
'[{"day": 1, "title": "Srinagar Arrival", "activities": ["Dal Lake shikara ride", "Houseboat stay", "Floating market"]}, {"day": 2, "title": "Mughal Gardens", "activities": ["Shalimar Bagh", "Nishat Bagh", "Chashme Shahi"]}, {"day": 3, "title": "Gulmarg Excursion", "activities": ["Gondola ride", "Snow activities", "Meadow walk"]}, {"day": 4, "title": "Pahalgam Journey", "activities": ["Lidder River", "Betaab Valley", "Aru Valley"]}, {"day": 5, "title": "Pahalgam Exploration", "activities": ["Baisaran meadows", "Horse riding", "Nature walks"]}, {"day": 6, "title": "Return to Srinagar", "activities": ["Shopping", "Hazratbal Shrine", "Garden visit"]}, {"day": 7, "title": "Departure", "activities": ["Local market", "Return journey"]}]'::jsonb,
ARRAY['Houseboat & hotel stays', 'Daily breakfast', 'All transfers', 'Shikara rides', 'Gondola tickets'],
ARRAY['Lunch and dinner', 'Pony rides', 'Shopping'],
29999.00, 'honeymoon',
ARRAY['https://images.pexels.com/photos/3889736/pexels-photo-3889736.jpeg', 'https://images.pexels.com/photos/4666748/pexels-photo-4666748.jpeg'],
4.9, 456, true, 'domestic'),

-- Rajasthan
('Royal Rajasthan Heritage', 'Rajasthan', 8, 7, 'Explore the land of kings with majestic forts, vibrant culture, desert safaris, and royal palaces across Jaipur, Udaipur, Jodhpur, and Jaisalmer.',
'[{"day": 1, "title": "Jaipur Arrival", "activities": ["Hawa Mahal", "City Palace", "Local bazaar"]}, {"day": 2, "title": "Amber Fort", "activities": ["Elephant ride", "Nahargarh Fort", "Jal Mahal"]}, {"day": 3, "title": "Jodhpur", "activities": ["Mehrangarh Fort", "Jaswant Thada", "Clock Tower market"]}, {"day": 4, "title": "Jaisalmer", "activities": ["Golden Fort", "Havelis", "Gadisar Lake"]}, {"day": 5, "title": "Desert Safari", "activities": ["Camel safari", "Sand dunes", "Cultural show", "Desert camping"]}, {"day": 6, "title": "Udaipur", "activities": ["City Palace", "Lake Pichola", "Boat ride"]}, {"day": 7, "title": "Udaipur Sightseeing", "activities": ["Saheliyon ki Bari", "Jagdish Temple", "Shopping"]}, {"day": 8, "title": "Departure", "activities": ["Morning leisure", "Return journey"]}]'::jsonb,
ARRAY['Heritage hotel stays', 'Daily breakfast', 'AC vehicle', 'Desert camping', 'Guide', 'Entry fees'],
ARRAY['Lunch and dinner', 'Camel ride charges', 'Personal expenses', 'Tips'],
32999.00, 'heritage',
ARRAY['https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg', 'https://images.pexels.com/photos/3186654/pexels-photo-3186654.jpeg'],
4.8, 534, true, 'domestic'),

-- Kerala
('Kerala Backwaters & Hills', 'Kerala', 7, 6, 'Experience Gods Own Country with houseboat cruises, tea plantations, wildlife safaris, and pristine beaches.',
'[{"day": 1, "title": "Kochi Arrival", "activities": ["Chinese Fishing Nets", "Fort Kochi", "Spice market"]}, {"day": 2, "title": "Munnar", "activities": ["Tea plantations", "Eravikulam Park", "Mattupetty Dam"]}, {"day": 3, "title": "Munnar Leisure", "activities": ["Tea museum", "Echo Point", "Top Station"]}, {"day": 4, "title": "Thekkady", "activities": ["Periyar Wildlife", "Spice plantation", "Bamboo rafting"]}, {"day": 5, "title": "Alleppey", "activities": ["Houseboat check-in", "Backwater cruise", "Village tour"]}, {"day": 6, "title": "Kovalam Beach", "activities": ["Beach relaxation", "Lighthouse", "Ayurvedic spa"]}, {"day": 7, "title": "Departure", "activities": ["Morning beach", "Return journey"]}]'::jsonb,
ARRAY['Hotels & houseboat', 'Daily breakfast', 'Houseboat meals', 'AC vehicle', 'Boat rides', 'Safari'],
ARRAY['Other meals', 'Spa treatments', 'Personal expenses'],
27999.00, 'honeymoon',
ARRAY['https://images.pexels.com/photos/1583582/pexels-photo-1583582.jpeg', 'https://images.pexels.com/photos/5214413/pexels-photo-5214413.jpeg'],
4.8, 489, true, 'domestic'),

-- Goa
('Goa Beach & Culture Fiesta', 'Goa', 5, 4, 'Sun, sand, and Portuguese heritage. Explore beaches, forts, churches, spice plantations, and vibrant nightlife.',
'[{"day": 1, "title": "Arrival", "activities": ["Calangute Beach", "Baga Beach", "Beach shacks"]}, {"day": 2, "title": "North Goa", "activities": ["Fort Aguada", "Anjuna Flea Market", "Vagator Beach", "Club night"]}, {"day": 3, "title": "Old Goa", "activities": ["Basilica of Bom Jesus", "Se Cathedral", "Spice Plantation", "River cruise"]}, {"day": 4, "title": "South Goa", "activities": ["Dudhsagar Falls", "Palolem Beach", "Sunset boat ride"]}, {"day": 5, "title": "Departure", "activities": ["Beach morning", "Shopping", "Return"]}]'::jsonb,
ARRAY['Beach resort', 'Daily breakfast', 'Sightseeing', 'Transfers', 'River cruise'],
ARRAY['Meals', 'Water sports', 'Nightlife', 'Personal expenses'],
16999.00, 'beach',
ARRAY['https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg', 'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg'],
4.5, 678, true, 'domestic'),

-- Ladakh
('Ladakh Adventure Expedition', 'Ladakh', 7, 6, 'Conquer the highest passes, camp by Pangong Lake, explore ancient monasteries, and ride through the Himalayas.',
'[{"day": 1, "title": "Leh Arrival", "activities": ["Acclimatization", "Leh Palace", "Shanti Stupa"]}, {"day": 2, "title": "Monastery Circuit", "activities": ["Thiksey Monastery", "Hemis Monastery", "Magnetic Hill"]}, {"day": 3, "title": "Nubra Valley", "activities": ["Khardung La Pass", "Sand dunes", "Double-hump camel ride"]}, {"day": 4, "title": "Nubra to Pangong", "activities": ["Scenic drive", "Pangong Lake", "Lakeside camping"]}, {"day": 5, "title": "Pangong to Leh", "activities": ["Sunrise at lake", "Chang La Pass", "Return to Leh"]}, {"day": 6, "title": "Leh Exploration", "activities": ["Local market", "Zanskar River rafting", "Cultural show"]}, {"day": 7, "title": "Departure", "activities": ["Shopping", "Return journey"]}]'::jsonb,
ARRAY['Hotels & camps', 'All meals', 'SUV transfers', 'Permits', 'Guide', 'Oxygen cylinder'],
ARRAY['Flights', 'Adventure activities', 'Personal expenses'],
35999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg', 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg'],
4.9, 345, true, 'domestic'),

-- Uttarakhand
('Uttarakhand Spiritual & Adventure', 'Uttarakhand', 6, 5, 'From the holy ghats of Haridwar to the adventure capital Rishikesh and serene hill stations of Mussoorie.',
'[{"day": 1, "title": "Haridwar Arrival", "activities": ["Har Ki Pauri", "Ganga Aarti", "Temple visits"]}, {"day": 2, "title": "Rishikesh", "activities": ["Laxman Jhula", "Ram Jhula", "Beatles Ashram", "Yoga session"]}, {"day": 3, "title": "Adventure Day", "activities": ["River rafting", "Bungee jumping", "Cliff jumping"]}, {"day": 4, "title": "Mussoorie", "activities": ["Kempty Falls", "Gun Hill", "Camel Back Road"]}, {"day": 5, "title": "Mussoorie Sightseeing", "activities": ["Mall Road", "Company Garden", "Cloud End"]}, {"day": 6, "title": "Departure", "activities": ["Morning views", "Return journey"]}]'::jsonb,
ARRAY['Hotel stays', 'Daily breakfast', 'Transfers', 'Rafting', 'Guide'],
ARRAY['Other meals', 'Bungee jumping', 'Personal expenses'],
19999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg', 'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg'],
4.6, 267, true, 'domestic'),

-- Varanasi
('Varanasi Spiritual Journey', 'Varanasi', 4, 3, 'Experience the spiritual capital of India with ancient ghats, temples, evening aarti, and Sarnath Buddhist heritage.',
'[{"day": 1, "title": "Arrival", "activities": ["Dashashwamedh Ghat", "Evening Ganga Aarti", "Boat ride"]}, {"day": 2, "title": "Temple Circuit", "activities": ["Kashi Vishwanath", "Sankat Mochan", "BHU campus", "Ramnagar Fort"]}, {"day": 3, "title": "Sarnath", "activities": ["Buddhist temple", "Dhamek Stupa", "Museum", "Silk weaving"]}, {"day": 4, "title": "Departure", "activities": ["Sunrise boat ride", "Shopping", "Return"]}]'::jsonb,
ARRAY['Hotel stay', 'Breakfast', 'Boat rides', 'Transfers', 'Guide'],
ARRAY['Other meals', 'Temple donations', 'Personal expenses'],
11999.00, 'religious',
ARRAY['https://images.pexels.com/photos/5458388/pexels-photo-5458388.jpeg', 'https://images.pexels.com/photos/10070972/pexels-photo-10070972.jpeg'],
4.7, 423, true, 'domestic');


-- ============================================================
-- 5. SEED DATA: International Packages
-- ============================================================

INSERT INTO packages (title, destination, duration_days, duration_nights, description, detailed_itinerary, inclusions, exclusions, price_per_person, theme, images, rating, total_ratings, is_active, category) VALUES

-- Maldives
('Maldives Paradise Escape', 'Maldives', 5, 4, 'Luxury beach resort experience with water sports, snorkeling, spa treatments, and stunning overwater villas.',
'[{"day": 1, "title": "Male Arrival", "activities": ["Speedboat to resort", "Check-in", "Beach relaxation"]}, {"day": 2, "title": "Water Activities", "activities": ["Snorkeling", "Jet skiing", "Sunset cruise"]}, {"day": 3, "title": "Island Hopping", "activities": ["Local island visit", "Dolphin watching", "Beach BBQ"]}, {"day": 4, "title": "Spa & Leisure", "activities": ["Spa treatments", "Water sports", "Romantic dinner"]}, {"day": 5, "title": "Departure", "activities": ["Breakfast", "Transfer to airport"]}]'::jsonb,
ARRAY['4-star beach resort', 'All meals (full board)', 'Return speedboat transfers', 'Water sports', 'Snorkeling equipment'],
ARRAY['International flights', 'Spa treatments', 'Excursions', 'Alcohol', 'Travel insurance'],
89999.00, 'honeymoon',
ARRAY['https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg', 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg'],
4.9, 567, true, 'international'),

-- Dubai
('Dubai Luxury Experience', 'Dubai', 5, 4, 'Explore the glamorous city of Dubai with Burj Khalifa, desert safari, Dubai Mall, and modern attractions.',
'[{"day": 1, "title": "Dubai Arrival", "activities": ["Dubai Mall", "Burj Khalifa", "Fountain show"]}, {"day": 2, "title": "Desert Safari", "activities": ["Dune bashing", "Camel ride", "BBQ dinner", "Belly dance"]}, {"day": 3, "title": "Modern Dubai", "activities": ["Dubai Marina", "Palm Jumeirah", "Atlantis", "Beach time"]}, {"day": 4, "title": "Shopping & Culture", "activities": ["Gold Souk", "Spice Souk", "Dubai Frame", "Creek cruise"]}, {"day": 5, "title": "Departure", "activities": ["Free time", "Airport transfer"]}]'::jsonb,
ARRAY['4-star hotel with breakfast', 'Airport transfers', 'Desert safari', 'Dubai city tour', 'Burj Khalifa tickets'],
ARRAY['International flights', 'Lunch and dinner', 'Shopping', 'Additional attractions', 'Visa fees'],
54999.00, 'family',
ARRAY['https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg', 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg'],
4.7, 734, true, 'international'),

-- Thailand
('Amazing Thailand Tour', 'Thailand', 7, 6, 'Explore Bangkok temples, Pattaya beaches, and vibrant nightlife with coral island water sports.',
'[{"day": 1, "title": "Bangkok Arrival", "activities": ["City tour", "River cruise", "Night market"]}, {"day": 2, "title": "Temple Tour", "activities": ["Grand Palace", "Wat Pho", "Wat Arun", "Floating market"]}, {"day": 3, "title": "Travel to Pattaya", "activities": ["Check-in", "Beach", "Walking Street"]}, {"day": 4, "title": "Coral Island", "activities": ["Speed boat", "Water sports", "Snorkeling", "Beach lunch"]}, {"day": 5, "title": "Pattaya Attractions", "activities": ["Nong Nooch Garden", "Tiger Park", "Alcazar Show"]}, {"day": 6, "title": "Return to Bangkok", "activities": ["Shopping", "Spa", "Night tour"]}, {"day": 7, "title": "Departure", "activities": ["Free time", "Airport transfer"]}]'::jsonb,
ARRAY['3-star hotels', 'Daily breakfast', 'All transfers', 'Coral Island tour', 'City tours', 'Visa assistance'],
ARRAY['International flights', 'Lunch and dinner', 'Water sports charges', 'Shopping', 'Tips'],
42999.00, 'family',
ARRAY['https://images.pexels.com/photos/1031659/pexels-photo-1031659.jpeg', 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg'],
4.6, 892, true, 'international'),

-- Singapore
('Singapore City Exploration', 'Singapore', 5, 4, 'Discover the Garden City with Universal Studios, Marina Bay, Gardens by the Bay, and Sentosa Island.',
'[{"day": 1, "title": "Singapore Arrival", "activities": ["Marina Bay", "Merlion Park", "Gardens by the Bay"]}, {"day": 2, "title": "Universal Studios", "activities": ["Full day at theme park", "Sentosa Beach", "Wings of Time show"]}, {"day": 3, "title": "City Tour", "activities": ["Orchard Road", "Little India", "Chinatown", "Clarke Quay"]}, {"day": 4, "title": "Nature & Adventure", "activities": ["Singapore Zoo", "River Safari", "Night Safari"]}, {"day": 5, "title": "Departure", "activities": ["Free time for shopping", "Airport transfer"]}]'::jsonb,
ARRAY['3-star hotel with breakfast', 'Airport transfers', 'Universal Studios tickets', 'Night Safari', 'City tour'],
ARRAY['International flights', 'Meals', 'Shopping', 'Additional attractions', 'Visa fees'],
62999.00, 'family',
ARRAY['https://images.pexels.com/photos/777059/pexels-photo-777059.jpeg', 'https://images.pexels.com/photos/2227828/pexels-photo-2227828.jpeg'],
4.8, 645, true, 'international'),

-- Bali
('Bali Island Paradise', 'Bali', 6, 5, 'Experience Bali culture with temples, rice terraces, beaches, water sports, and traditional performances.',
'[{"day": 1, "title": "Bali Arrival", "activities": ["Kuta Beach", "Sunset", "Welcome dinner"]}, {"day": 2, "title": "Ubud Cultural Tour", "activities": ["Monkey Forest", "Tegalalang Rice Terrace", "Ubud Palace", "Art Market"]}, {"day": 3, "title": "Temple Tour", "activities": ["Tanah Lot", "Uluwatu Temple", "Kecak Dance", "Jimbaran seafood"]}, {"day": 4, "title": "Water Sports", "activities": ["Tanjung Benoa", "Parasailing", "Banana boat", "Jet ski"]}, {"day": 5, "title": "Nusa Penida", "activities": ["Island tour", "Kelingking Beach", "Angels Billabong", "Snorkeling"]}, {"day": 6, "title": "Departure", "activities": ["Spa", "Shopping", "Airport transfer"]}]'::jsonb,
ARRAY['Beach resort stay', 'Daily breakfast', 'All transfers', 'Temple tours', 'Water sports package', 'Cultural shows'],
ARRAY['International flights', 'Lunch and dinner', 'Visa on arrival', 'Personal expenses', 'Tips'],
49999.00, 'honeymoon',
ARRAY['https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg', 'https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg'],
4.7, 523, true, 'international'),

-- Switzerland
('Swiss Alps Experience', 'Switzerland', 7, 6, 'Explore Zurich, Lucerne, Interlaken, Jungfraujoch Top of Europe, and scenic Swiss trains.',
'[{"day": 1, "title": "Zurich Arrival", "activities": ["Lake Zurich", "Old Town", "Bahnhofstrasse shopping"]}, {"day": 2, "title": "Lucerne", "activities": ["Chapel Bridge", "Lion Monument", "Lake cruise", "Mount Pilatus"]}, {"day": 3, "title": "Interlaken", "activities": ["Harder Kulm", "Hohematte", "Adventure sports"]}, {"day": 4, "title": "Jungfraujoch", "activities": ["Top of Europe", "Ice Palace", "Sphinx Observatory", "Snow activities"]}, {"day": 5, "title": "Grindelwald", "activities": ["First Cliff Walk", "Mountain cart", "Cable car rides"]}, {"day": 6, "title": "Scenic Train", "activities": ["Golden Pass", "Mountain views", "Return to Zurich"]}, {"day": 7, "title": "Departure", "activities": ["Last minute shopping", "Airport transfer"]}]'::jsonb,
ARRAY['3-star hotels', 'Daily breakfast', 'Swiss Travel Pass', 'Jungfraujoch tickets', 'Cable cars', 'Boat cruise'],
ARRAY['International flights', 'Lunch and dinner', 'Visa fees', 'Personal expenses', 'Tips'],
189999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/1660995/pexels-photo-1660995.jpeg', 'https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg'],
4.9, 678, true, 'international'),

-- Paris
('Romantic Paris Getaway', 'Paris', 5, 4, 'Experience the City of Love with Eiffel Tower, Louvre, Seine cruise, Versailles, and French cuisine.',
'[{"day": 1, "title": "Paris Arrival", "activities": ["Eiffel Tower", "Trocadero", "Champs-Elysees", "Arc de Triomphe"]}, {"day": 2, "title": "Museums & Culture", "activities": ["Louvre Museum", "Notre-Dame", "Latin Quarter", "Seine River cruise"]}, {"day": 3, "title": "Versailles", "activities": ["Palace of Versailles", "Gardens", "Marie Antoinette Estate", "Fountain show"]}, {"day": 4, "title": "Montmartre & Art", "activities": ["Sacre-Coeur", "Artists square", "Moulin Rouge area", "Le Marais"]}, {"day": 5, "title": "Departure", "activities": ["Last minute shopping", "Cafe culture", "Airport transfer"]}]'::jsonb,
ARRAY['3-star hotel', 'Daily breakfast', 'Airport transfers', 'Seine cruise', 'Versailles tour', 'Metro pass'],
ARRAY['International flights', 'Lunch and dinner', 'Museum tickets', 'Visa fees', 'Shopping'],
149999.00, 'honeymoon',
ARRAY['https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg', 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg'],
4.8, 789, true, 'international'),

-- London
('London Royal Heritage', 'London', 6, 5, 'Explore British history with Buckingham Palace, Tower of London, Harry Potter sites, and iconic landmarks.',
'[{"day": 1, "title": "London Arrival", "activities": ["Big Ben", "Westminster Abbey", "London Eye", "Thames walk"]}, {"day": 2, "title": "Royal London", "activities": ["Buckingham Palace", "Changing of Guard", "Hyde Park", "Kensington Palace"]}, {"day": 3, "title": "Historic Sites", "activities": ["Tower of London", "Tower Bridge", "Borough Market", "St Pauls Cathedral"]}, {"day": 4, "title": "Museums & Culture", "activities": ["British Museum", "Natural History Museum", "Harrods", "Piccadilly Circus"]}, {"day": 5, "title": "Harry Potter Tour", "activities": ["Warner Bros Studio", "Platform 9 3/4", "Kings Cross", "Oxford Street"]}, {"day": 6, "title": "Departure", "activities": ["Covent Garden", "Last minute shopping", "Airport transfer"]}]'::jsonb,
ARRAY['3-star hotel', 'Daily breakfast', 'Airport transfers', 'Thames cruise', 'Harry Potter Studio tour', 'Oyster card'],
ARRAY['International flights', 'Meals', 'Attraction tickets', 'Visa fees', 'Shopping'],
169999.00, 'family',
ARRAY['https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg', 'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg'],
4.7, 623, true, 'international'),

-- Nepal
('Nepal Himalayan Adventure', 'Nepal', 6, 5, 'Experience Kathmandu temples, Pokhara lakes, mountain views, and spiritual Pashupatinath.',
'[{"day": 1, "title": "Kathmandu Arrival", "activities": ["Durbar Square", "Swayambhunath", "Thamel"]}, {"day": 2, "title": "Valley Tour", "activities": ["Pashupatinath", "Boudhanath", "Patan Durbar Square"]}, {"day": 3, "title": "Pokhara", "activities": ["Scenic drive", "Phewa Lake", "Lakeside"]}, {"day": 4, "title": "Sunrise & Adventure", "activities": ["Sarangkot sunrise", "Paragliding", "Davis Falls", "Gupteshwor Cave"]}, {"day": 5, "title": "Return to Kathmandu", "activities": ["Shopping", "Leisure time"]}, {"day": 6, "title": "Departure", "activities": ["Last minute sightseeing", "Airport transfer"]}]'::jsonb,
ARRAY['3-star hotels', 'Daily breakfast', 'Tourist bus/car', 'Boating in Pokhara', 'Sightseeing', 'Guide'],
ARRAY['International flights', 'Lunch and dinner', 'Paragliding', 'Monument fees', 'Visa fees'],
29999.00, 'adventure',
ARRAY['https://images.pexels.com/photos/1124062/pexels-photo-1124062.jpeg', 'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg'],
4.7, 289, true, 'international'),

-- Sri Lanka
('Sri Lanka Heritage Tour', 'Sri Lanka', 7, 6, 'Discover the pearl of Indian Ocean with ancient cities, hill country, tea plantations, and wildlife.',
'[{"day": 1, "title": "Colombo Arrival", "activities": ["City tour", "Galle Face", "Buddhist temples"]}, {"day": 2, "title": "Sigiriya", "activities": ["Lion Rock fortress", "Village tour", "Minneriya Safari"]}, {"day": 3, "title": "Kandy", "activities": ["Temple of Tooth", "Royal Botanical Gardens", "Cultural show"]}, {"day": 4, "title": "Nuwara Eliya", "activities": ["Hill country", "Tea factory", "Gregory Lake"]}, {"day": 5, "title": "Yala Safari", "activities": ["Yala National Park", "Leopard safari", "Wildlife photography"]}, {"day": 6, "title": "Galle", "activities": ["Dutch Fort", "Lighthouse", "Beach", "Shopping"]}, {"day": 7, "title": "Departure", "activities": ["Return to Colombo", "Airport transfer"]}]'::jsonb,
ARRAY['3-star hotels', 'Daily breakfast', 'AC vehicle', 'Safari jeep', 'Entry fees', 'Guide services'],
ARRAY['International flights', 'Lunch and dinner', 'Visa fees', 'Tips', 'Personal expenses'],
44999.00, 'cultural',
ARRAY['https://images.pexels.com/photos/934718/pexels-photo-934718.jpeg', 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg'],
4.6, 378, true, 'international');


-- ============================================================
-- DONE! Your database is ready.
-- ============================================================
