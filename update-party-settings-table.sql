-- Add date and time columns to the party_settings table
DO $$
BEGIN
  -- Check if the party_date column exists
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'party_settings' AND column_name = 'party_date'
  ) THEN
    -- Add party_date column if it doesn't exist
    ALTER TABLE party_settings ADD COLUMN party_date TEXT DEFAULT 'Saturday, June 7, 2025';
  END IF;

  -- Check if the party_time column exists
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'party_settings' AND column_name = 'party_time'
  ) THEN
    -- Add party_time column if it doesn't exist
    ALTER TABLE party_settings ADD COLUMN party_time TEXT DEFAULT '10:00 AM';
  END IF;

  -- Check if the party_end_time column exists
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'party_settings' AND column_name = 'party_end_time'
  ) THEN
    -- Add party_end_time column if it doesn't exist
    ALTER TABLE party_settings ADD COLUMN party_end_time TEXT DEFAULT '12:00 PM';
  END IF;

  -- Note: We no longer need a separate party_year column as it's included in the party_date
END $$;
