/*
  # Add More Books to Digital Store

  1. Changes
    - Add 10 more books to the existing books table
    - Books cover diverse topics with realistic pricing
    - All books include cover images from Unsplash
*/

-- Insert additional books
INSERT INTO books (title, author, description, price, cover_image, file_url) VALUES
('Data Science Fundamentals', 'Alice Chen', 'Master the basics of data science and analytics', 34.99, 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400', 'https://example.com/books/datascience.pdf'),
('The Psychology of Success', 'David Thompson', 'Understanding the mindset of successful people', 27.99, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400', 'https://example.com/books/psychology.pdf'),
('Modern Architecture', 'Laura Martinez', 'Exploring contemporary architectural designs', 39.99, 'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=400', 'https://example.com/books/architecture.pdf'),
('Organic Gardening', 'Thomas Green', 'Guide to growing your own organic garden', 18.99, 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400', 'https://example.com/books/gardening.pdf'),
('Digital Photography', 'Sophie White', 'Master the art of digital photography', 29.99, 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=400', 'https://example.com/books/photography.pdf'),
('Artificial Intelligence Basics', 'James Lee', 'Introduction to AI and machine learning', 44.99, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400', 'https://example.com/books/ai.pdf'),
('World Cuisine', 'Maria Garcia', 'Explore recipes from around the world', 25.99, 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400', 'https://example.com/books/cuisine.pdf'),
('Mindful Meditation', 'Ryan Parker', 'Guide to mindfulness and meditation', 16.99, 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', 'https://example.com/books/meditation.pdf'),
('Sustainable Living', 'Emily Turner', 'Practical tips for an eco-friendly lifestyle', 21.99, 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400', 'https://example.com/books/sustainable.pdf'),
('Modern Business Strategy', 'William Clark', 'Strategic thinking for modern businesses', 32.99, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400', 'https://example.com/books/business.pdf');