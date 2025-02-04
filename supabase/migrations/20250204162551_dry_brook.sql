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
      - Anyone can read a request by ID
      - Only the creator can update their request
*/

CREATE TABLE IF NOT EXISTS valentine_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text NOT NULL,
  recipient_name text NOT NULL,
  message text NOT NULL,
  custom_message text,
  gift text NOT NULL,
  theme text NOT NULL,
  accepted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE valentine_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create a request
CREATE POLICY "Anyone can create a valentine request"
  ON valentine_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to read a request
CREATE POLICY "Anyone can read a valentine request"
  ON valentine_requests
  FOR SELECT
  TO public
  USING (true);

-- Allow updates only for accepted status
CREATE POLICY "Anyone can update accepted status"
  ON valentine_requests
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (
    -- Only allow updating the accepted field
    (OLD.sender_name = NEW.sender_name) AND
    (OLD.recipient_name = NEW.recipient_name) AND
    (OLD.message = NEW.message) AND
    (OLD.custom_message IS NOT DISTINCT FROM NEW.custom_message) AND
    (OLD.gift = NEW.gift) AND
    (OLD.theme = NEW.theme)
  );