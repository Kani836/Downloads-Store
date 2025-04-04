export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  cover_image: string;
  file_url: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  book_id: string;
  created_at: string;
  book: Book;
}

export interface Favorite {
  id: string;
  user_id: string;
  book_id: string;
  created_at: string;
  book: Book;
}

export interface SavedForLater {
  id: string;
  user_id: string;
  book_id: string;
  created_at: string;
  book: Book;
}