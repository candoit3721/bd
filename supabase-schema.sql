-- First, check if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'guests') THEN
    -- If the table exists, check if the email column exists and has a NOT NULL constraint
    IF EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'guests' AND column_name = 'email' AND is_nullable = 'NO'
    ) THEN
      -- Alter the email column to allow NULL values
      ALTER TABLE guests ALTER COLUMN email DROP NOT NULL;
    END IF;

    -- Check if the phone column exists
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'guests' AND column_name = 'phone'
    ) THEN
      -- Add phone column if it doesn't exist
      ALTER TABLE guests ADD COLUMN phone TEXT;
    END IF;
  ELSE
    -- Create the guests table if it doesn't exist
    CREATE TABLE guests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT, -- Make email optional
      phone TEXT, -- Make phone optional
      status TEXT NOT NULL DEFAULT 'PENDING',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_guests_updated_at ON guests;
CREATE TRIGGER update_guests_updated_at
BEFORE UPDATE ON guests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add some sample data if the table is empty
INSERT INTO guests (name, status)
SELECT 'Alex', 'PENDING'
WHERE NOT EXISTS (SELECT 1 FROM guests LIMIT 1);

INSERT INTO guests (name, status)
SELECT 'Emma', 'PENDING'
WHERE NOT EXISTS (SELECT 1 FROM guests WHERE name = 'Emma');

INSERT INTO guests (name, status)
SELECT 'Noah', 'PENDING'
WHERE NOT EXISTS (SELECT 1 FROM guests WHERE name = 'Noah');
