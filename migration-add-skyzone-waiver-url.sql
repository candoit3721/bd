-- Add skyzone_waiver_url field to party_settings table
DO $$
BEGIN
  -- Add skyzone_waiver_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'party_settings' AND column_name = 'skyzone_waiver_url'
  ) THEN
    ALTER TABLE party_settings ADD COLUMN skyzone_waiver_url TEXT;
  END IF;
END $$;
