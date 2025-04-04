/*
  # Add Purchases Table for Digital Books Store

  1. New Tables
    - `purchases`
      - `id` (uuid, primary key): Unique identifier for each purchase
      - `user_id` (uuid): Reference to auth.users table
      - `items` (jsonb): Array of purchased items with their details
      - `total_amount` (numeric): Total purchase amount
      - `status` (text): Purchase status (e.g., 'completed', 'pending')
      - `created_at` (timestamptz): Purchase timestamp

  2. Security
    - Enable Row Level Security (RLS)
    - Add policies for authenticated users to:
      - View their own purchases
      - Create new purchases
*/

-- Check if the table exists and drop it if it does
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'purchases') THEN
    DROP TABLE public.purchases;
  END IF;
END $$;

-- Create the purchases table
CREATE TABLE public.purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  items jsonb NOT NULL,
  total_amount numeric NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT purchases_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE,
  CONSTRAINT purchases_total_amount_check CHECK (total_amount >= 0),
  CONSTRAINT purchases_status_check CHECK (status IN ('pending', 'completed', 'failed'))
);

-- Enable Row Level Security
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Create index for faster user_id lookups
CREATE INDEX purchases_user_id_idx ON public.purchases(user_id);

-- Create index for status lookups
CREATE INDEX purchases_status_idx ON public.purchases(status);

-- Create policy for users to view their own purchases
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'purchases' 
    AND policyname = 'Users can view their own purchases'
  ) THEN
    CREATE POLICY "Users can view their own purchases"
      ON public.purchases
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create policy for users to create their own purchases
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'purchases' 
    AND policyname = 'Users can create their own purchases'
  ) THEN
    CREATE POLICY "Users can create their own purchases"
      ON public.purchases
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;