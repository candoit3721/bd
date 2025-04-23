-- Add secondary contact fields to party_settings table
DO $$
BEGIN
  -- Add secondary_email column
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'party_settings' AND column_name = 'secondary_email'
  ) THEN
    ALTER TABLE party_settings ADD COLUMN secondary_email TEXT;
  END IF;

  -- Add secondary_phone column
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'party_settings' AND column_name = 'secondary_phone'
  ) THEN
    ALTER TABLE party_settings ADD COLUMN secondary_phone TEXT;
  END IF;

  -- Add contact_name column
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'party_settings' AND column_name = 'contact_name'
  ) THEN
    ALTER TABLE party_settings ADD COLUMN contact_name TEXT;
  END IF;

  -- Add secondary_contact_name column
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'party_settings' AND column_name = 'secondary_contact_name'
  ) THEN
    ALTER TABLE party_settings ADD COLUMN secondary_contact_name TEXT;
  END IF;
END $$;