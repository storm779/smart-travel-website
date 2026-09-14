-- Add Razorpay payment tracking columns to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS razorpay_order_id text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS razorpay_payment_id text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS razorpay_signature text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_amount_paise integer;

-- Index for order lookups (used by verify-razorpay-payment Edge Function)
CREATE INDEX IF NOT EXISTS idx_bookings_razorpay_order ON bookings(razorpay_order_id);
