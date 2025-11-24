/*
  # Fix Security and Performance Issues

  1. Indexes
    - Add missing foreign key index on `bookings.package_id`
    - Drop unused indexes that are not being utilized

  2. RLS Policy Optimization
    - Update all RLS policies to use `(select auth.uid())` instead of `auth.uid()`
    - This prevents re-evaluation of auth function for each row, improving performance at scale
    
  3. Tables Affected
    - profiles: 3 policies optimized
    - bookings: 3 policies optimized, 1 index added
    - saved_itineraries: 2 policies optimized
    - packages: 2 unused indexes removed
    - saved_itineraries: 2 unused indexes removed

  ## Performance Improvements
  - Foreign key lookups will be significantly faster with proper indexing
  - RLS policies will execute auth functions once per query instead of per row
  - Removed indexes reduce write overhead and storage
*/

-- Add missing foreign key index on bookings.package_id
CREATE INDEX IF NOT EXISTS idx_bookings_package_id ON public.bookings(package_id);

-- Drop unused indexes to reduce write overhead
DROP INDEX IF EXISTS idx_packages_theme;
DROP INDEX IF EXISTS idx_packages_price;
DROP INDEX IF EXISTS idx_saved_itineraries_user_id;
DROP INDEX IF EXISTS idx_saved_itineraries_session_id;

-- Optimize profiles RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- Optimize bookings RLS policies
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own bookings" ON public.bookings;
CREATE POLICY "Users can create own bookings"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
CREATE POLICY "Users can update own bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Optimize saved_itineraries RLS policies
DROP POLICY IF EXISTS "Users can view own itineraries" ON public.saved_itineraries;
CREATE POLICY "Users can view own itineraries"
  ON public.saved_itineraries FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create itineraries" ON public.saved_itineraries;
CREATE POLICY "Users can create itineraries"
  ON public.saved_itineraries FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);
