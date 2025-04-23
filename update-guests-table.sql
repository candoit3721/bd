-- Check if the email column exists in the guests table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'guests' AND column_name = 'email'
  ) THEN
    -- Add email column if it doesn't exist
    ALTER TABLE guests ADD COLUMN email TEXT;
  END IF;
  
  -- Check if the phone column exists
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'guests' AND column_name = 'phone'
  ) THEN
    -- Add phone column if it doesn't exist
    ALTER TABLE guests ADD COLUMN phone TEXT;
  END IF;
END $$;
