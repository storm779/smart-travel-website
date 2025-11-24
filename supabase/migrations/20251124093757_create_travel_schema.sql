-- Smart Travel Website Database Schema
-- Creates tables for packages, bookings, itineraries, and user profiles
-- All prices in INR (Indian Rupees)

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

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

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
  created_at timestamptz DEFAULT now()
);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Packages are viewable by everyone"
  ON packages FOR SELECT
  TO public
  USING (is_active = true);

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

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

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

CREATE POLICY "Users can view own itineraries"
  ON saved_itineraries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anonymous users can view session itineraries"
  ON saved_itineraries FOR SELECT
  TO anon
  USING (session_id IS NOT NULL);

CREATE POLICY "Users can create itineraries"
  ON saved_itineraries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can create session itineraries"
  ON saved_itineraries FOR INSERT
  TO anon
  WITH CHECK (session_id IS NOT NULL);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_packages_destination ON packages(destination);
CREATE INDEX IF NOT EXISTS idx_packages_theme ON packages(theme);
CREATE INDEX IF NOT EXISTS idx_packages_price ON packages(price_per_person);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_saved_itineraries_user_id ON saved_itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_itineraries_session_id ON saved_itineraries(session_id);