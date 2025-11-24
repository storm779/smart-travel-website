/*
  # Add Package Category Field
  
  1. Changes
    - Add category column to packages table (domestic/international)
    - Set default value as 'domestic'
    - Update existing packages with correct categories
  
  2. Data Updates
    - Indian packages marked as 'domestic'
    - International packages marked as 'international'
*/

-- Add category column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'category'
  ) THEN
    ALTER TABLE packages ADD COLUMN category text DEFAULT 'domestic' CHECK (category IN ('domestic', 'international'));
  END IF;
END $$;

-- Update international packages
UPDATE packages SET category = 'international' 
WHERE destination IN (
  'Maldives', 'Dubai', 'Thailand', 'Singapore', 'Bali', 
  'Malaysia', 'Sri Lanka', 'Nepal', 'Bhutan', 'Vietnam', 
  'Turkey', 'Switzerland', 'Paris', 'London'
);

-- Update domestic packages (already default, but being explicit)
UPDATE packages SET category = 'domestic' 
WHERE destination NOT IN (
  'Maldives', 'Dubai', 'Thailand', 'Singapore', 'Bali', 
  'Malaysia', 'Sri Lanka', 'Nepal', 'Bhutan', 'Vietnam', 
  'Turkey', 'Switzerland', 'Paris', 'London'
);
