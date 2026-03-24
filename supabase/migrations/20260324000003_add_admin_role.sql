-- Add role column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Admin helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER;

-- Admin RLS policies for bookings
CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can update all bookings" ON bookings FOR UPDATE TO authenticated USING (is_admin());

-- Admin RLS policies for packages
CREATE POLICY "Admins can manage packages" ON packages FOR ALL TO authenticated USING (is_admin());

-- Admin RLS policies for reviews
CREATE POLICY "Admins can manage reviews" ON reviews FOR ALL TO authenticated USING (is_admin());

-- Admin RLS for contact messages
CREATE POLICY "Admins can view contact messages" ON contact_messages FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can delete contact messages" ON contact_messages FOR DELETE TO authenticated USING (is_admin());
