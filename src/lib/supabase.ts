import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Package {
  id: string;
  title: string;
  destination: string;
  duration_days: number;
  duration_nights: number;
  description: string;
  detailed_itinerary: Array<{
    day: number;
    title: string;
    activities: string[];
  }>;
  inclusions: string[];
  exclusions: string[];
  price_per_person: number;
  theme: string;
  images: string[];
  rating: number;
  total_ratings: number;
  is_active: boolean;
  category: 'domestic' | 'international';
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  package_id?: string;
  itinerary_data?: any;
  booking_type: 'package' | 'custom';
  travel_dates_start: string;
  travel_dates_end: string;
  num_travelers: number;
  pickup_city: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  total_price: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method?: string;
  booking_status: 'confirmed' | 'pending' | 'cancelled';
  booking_reference: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  payment_amount_paise?: number;
  created_at: string;
}

export interface SavedItinerary {
  id: string;
  user_id?: string;
  session_id?: string;
  preferences: any;
  economic_itinerary: any;
  middle_luxury_itinerary: any;
  luxury_itinerary: any;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  phone?: string;
  city?: string;
  role?: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  package_id: string;
  booking_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase: boolean;
  created_at: string;
  updated_at: string;
  profiles?: { full_name: string };
}
