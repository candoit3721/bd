-- Check if the party_settings table exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'party_settings') THEN
    -- Create the party_settings table
    CREATE TABLE party_settings (
      id SERIAL PRIMARY KEY,
      venue_name TEXT NOT NULL,
      address_line1 TEXT NOT NULL,
      address_line2 TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      zip_code TEXT NOT NULL,
      google_maps_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Insert default party settings
    INSERT INTO party_settings (
      venue_name, 
      address_line1, 
      city, 
      state, 
      zip_code
    ) VALUES (
      'SkyZone',
      '2839 Rutherford Road',
      'Vaughan',
      'ON',
      'L4K 2N7'
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
DROP TRIGGER IF EXISTS update_party_settings_updated_at ON party_settings;
CREATE TRIGGER update_party_settings_updated_at
BEFORE UPDATE ON party_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
