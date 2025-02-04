/*
  # Valentine Requests Schema

  1. New Tables
    - `valentine_requests`
      - `id` (uuid, primary key)
      - `sender_name` (text)
      - `recipient_name` (text)
      - `message` (text)
      - `custom_message` (text, nullable)
      - `gift` (text)
      - `theme` (text)
      - `accepted` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `valentine_requests` table
    - Add policies for:
      - Anyone can create a request
      - Anyone can read a request
      - Updates are limited to the accepted field only
*/

-- Create the table
CREATE TABLE IF NOT EXISTS valentine_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text NOT NULL,
  recipient_name text NOT NULL,
  message text NOT NULL,
  custom_message text,
  gift text NOT NULL,
  theme text NOT NULL,
  music text,
  accepted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

alter table valentine_requests add column music text;

-- Enable RLS
ALTER TABLE valentine_requests ENABLE ROW LEVEL SECURITY;

-- Create a function to validate update operations
CREATE OR REPLACE FUNCTION check_valentine_update()
RETURNS trigger AS $$
BEGIN
  -- Only allow updating the accepted field
  IF (NEW.sender_name != OLD.sender_name) OR
     (NEW.recipient_name != OLD.recipient_name) OR
     (NEW.message != OLD.message) OR
     (NEW.custom_message IS DISTINCT FROM OLD.custom_message) OR
     (NEW.gift != OLD.gift) OR
     (NEW.theme != OLD.theme) OR
    (NEW.music IS DISTINCT FROM OLD.music) THEN
    RETURN NULL;
  END IF;
  
  -- Update the updated_at timestamp
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER valentine_update_trigger
  BEFORE UPDATE ON valentine_requests
  FOR EACH ROW
  EXECUTE FUNCTION check_valentine_update();

-- Create policies
CREATE POLICY "Anyone can create a valentine request"
  ON valentine_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read a valentine request"
  ON valentine_requests
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update accepted status"
  ON valentine_requests
  FOR UPDATE
  TO public
  USING (true);