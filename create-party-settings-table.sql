-- Create the party_settings table
CREATE TABLE IF NOT EXISTS party_settings (
  id SERIAL PRIMARY KEY,
  venue_name TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  google_maps_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Set up Row Level Security (RLS) policies
ALTER TABLE party_settings ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all authenticated users to select
CREATE POLICY party_settings_select_policy ON party_settings
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create a policy that allows all authenticated users to insert
CREATE POLICY party_settings_insert_policy ON party_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create a policy that allows all authenticated users to update
CREATE POLICY party_settings_update_policy ON party_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert default data if the table is empty
INSERT INTO party_settings (venue_name, address_line1, city, state, zip_code)
SELECT 'SkyZone Trampoline Park', '1234 Jump Street', 'Springfield', 'IL', '62701'
WHERE NOT EXISTS (SELECT 1 FROM party_settings LIMIT 1);
