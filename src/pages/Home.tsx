import React, { useEffect } from 'react';
import { Heart, ShoppingCart, BookmarkPlus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import type { Book } from '../types';

const Home = () => {
  const { books, setBooks, user, cartItems, favorites, savedForLater, setCartItems, setFavorites, setSavedForLater } = useStore();

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching books:', error);
        return;
      }

      setBooks(data || []);
    };

    fetchBooks();
  }, [setBooks]);

  const isInCart = (bookId: string) => {
    return cartItems.some(item => item.book_id === bookId);
  };

  const isInFavorites = (bookId: string) => {
    return favorites.some(item => item.book_id === bookId);
  };

  const isInSavedForLater = (bookId: string) => {
    return savedForLater.some(item => item.book_id === bookId);
  };

  const handleAddToCart = async (book: Book) => {
    if (!user) return;

    try {
      // Check if the book is already in the cart
      if (isInCart(book.id)) {
        return;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .insert([{ user_id: user.id, book_id: book.id }])
        .select('*, book:books(*)');

      if (error) {
        throw error;
      }

      setCartItems([...cartItems, ...(data || [])]);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleAddToFavorites = async (book: Book) => {
    if (!user) return;

    if (isInFavorites(book.id)) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('book_id', book.id);

      if (error) {
        console.error('Error removing from favorites:', error);
        return;
      }

      setFavorites(favorites.filter(item => item.book_id !== book.id));
    } else {
      const { data, error } = await supabase
        .from('favorites')
        .insert([{ user_id: user.id, book_id: book.id }])
        .select();

      if (error) {
        console.error('Error adding to favorites:', error);
        return;
      }

      setFavorites([...favorites, ...(data || [])]);
    }
  };

  const handleSaveForLater = async (book: Book) => {
    if (!user) return;

    try {
      // Toggle saved for later status
      if (isInSavedForLater(book.id)) {
        const { error } = await supabase
          .from('saved_for_later')
          .delete()
          .eq('user_id', user.id)
          .eq('book_id', book.id);

        if (error) throw error;

        setSavedForLater(savedForLater.filter(item => item.book_id !== book.id));
      } else {
        const { data, error } = await supabase
          .from('saved_for_later')
          .insert([{ user_id: user.id, book_id: book.id }])
          .select();

        if (error) throw error;

        setSavedForLater([...savedForLater, ...(data || [])]);
      }
    } catch (err) {
      console.error('Error updating saved for later:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Digital Books Store</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={book.cover_image}
              alt={book.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h2>
              <p className="text-gray-600 mb-2">{book.author}</p>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{book.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-indigo-600">${book.price}</span>
                <div className="flex space-x-2">
                  {user && (
                    <>
                      <button
                        onClick={() => handleAddToFavorites(book)}
                        className="relative group p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title={isInFavorites(book.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart 
                          className={`h-5 w-5 transition-colors ${
                            isInFavorites(book.id) 
                              ? 'fill-pink-500 text-pink-500' 
                              : 'text-gray-500 hover:text-pink-500'
                          }`} 
                        />
                        <span className="tooltip">
                          {isInFavorites(book.id) ? "Remove from favorites" : "Add to favorites"}
                        </span>
                      </button>
                      <button
                        onClick={() => handleSaveForLater(book)}
                        className="relative group p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title={isInSavedForLater(book.id) ? "Remove from saved" : "Save for later"}
                      >
                        <BookmarkPlus 
                          className={`h-5 w-5 ${
                            isInSavedForLater(book.id)
                              ? 'text-indigo-500'
                              : 'text-gray-500 hover:text-indigo-500'
                          }`} 
                        />
                        <span className="tooltip">
                          {isInSavedForLater(book.id) ? "Remove from saved" : "Save for later"}
                        </span>
                      </button>
                      <button
                        onClick={() => handleAddToCart(book)}
                        disabled={isInCart(book.id)}
                        className="relative group p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title={isInCart(book.id) ? "In cart" : "Add to cart"}
                      >
                        <ShoppingCart 
                          className={`h-5 w-5 ${
                            isInCart(book.id)
                              ? 'text-green-500'
                              : 'text-gray-500 hover:text-green-500'
                          }`} 
                        />
                        <span className="tooltip">
                          {isInCart(book.id) ? "In cart" : "Add to cart"}
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;