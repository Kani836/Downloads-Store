/*
  # Initial Schema for Digital Downloads Store

  1. New Tables
    - `books`
      - `id` (uuid, primary key)
      - `title` (text)
      - `author` (text)
      - `description` (text)
      - `price` (numeric)
      - `cover_image` (text, URL to book cover)
      - `file_url` (text, URL to downloadable file)
      - `created_at` (timestamp)
    
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `book_id` (uuid, references books)
      - `created_at` (timestamp)
    
    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `book_id` (uuid, references books)
      - `created_at` (timestamp)
    
    - `saved_for_later`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `book_id` (uuid, references books)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create books table
CREATE TABLE books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  cover_image text NOT NULL,
  file_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  book_id uuid REFERENCES books NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- Create favorites table
CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  book_id uuid REFERENCES books NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- Create saved_for_later table
CREATE TABLE saved_for_later (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  book_id uuid REFERENCES books NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_for_later ENABLE ROW LEVEL SECURITY;

-- Policies for books
CREATE POLICY "Books are viewable by everyone"
  ON books FOR SELECT
  TO public
  USING (true);

-- Policies for cart_items
CREATE POLICY "Users can manage their own cart items"
  ON cart_items
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for favorites
CREATE POLICY "Users can manage their own favorites"
  ON favorites
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for saved_for_later
CREATE POLICY "Users can manage their own saved items"
  ON saved_for_later
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample books
INSERT INTO books (title, author, description, price, cover_image, file_url) VALUES
('The Art of Programming', 'John Smith', 'A comprehensive guide to modern programming practices', 29.99, 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400', 'https://example.com/books/programming.pdf'),
('Digital Marketing Essentials', 'Emma Johnson', 'Learn the fundamentals of digital marketing', 24.99, 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=400', 'https://example.com/books/marketing.pdf'),
('Financial Freedom', 'Robert Wilson', 'Your guide to personal finance and investment', 19.99, 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', 'https://example.com/books/finance.pdf'),
('Healthy Living', 'Sarah Brown', 'Tips and tricks for a healthier lifestyle', 15.99, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', 'https://example.com/books/health.pdf'),
('Creative Writing', 'Michael Davis', 'Unleash your creative writing potential', 22.99, 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400', 'https://example.com/books/writing.pdf')
-- Add more books as needed to reach 20-30 total
;