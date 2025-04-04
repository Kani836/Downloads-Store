import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkPlus, Home, ShoppingCart, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import type { Book } from '../types';

const SavedForLater = () => {
  const { user, savedForLater, setSavedForLater, cartItems, setCartItems, favorites, setFavorites } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedItems = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('saved_for_later')
          .select(`
            *,
            book:books(*)
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        setSavedForLater(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch saved items');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedItems();
  }, [user, setSavedForLater]);

  const handleRemoveFromSaved = async (bookId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_for_later')
        .delete()
        .eq('user_id', user.id)
        .eq('book_id', bookId);

      if (error) throw error;

      setSavedForLater(savedForLater.filter(item => item.book_id !== bookId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from saved items');
    }
  };

  const handleAddToCart = async (book: Book) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{ user_id: user.id, book_id: book.id }])
        .select('*, book:books(*)');

      if (error) throw error;

      setCartItems([...cartItems, ...(data || [])]);
      handleRemoveFromSaved(book.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
    }
  };

  const handleAddToFavorites = async (book: Book) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert([{ user_id: user.id, book_id: book.id }])
        .select();

      if (error) throw error;

      setFavorites([...favorites, ...(data || [])]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to favorites');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved For Later</h1>
          <Link to="/" className="text-gray-600 hover:text-indigo-600 flex items-center gap-2">
            <Home className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {savedForLater.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <BookmarkPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No items saved for later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedForLater.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={item.book.cover_image}
                  alt={item.book.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.book.title}</h2>
                  <p className="text-gray-600 mb-2">{item.book.author}</p>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.book.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-indigo-600">${item.book.price}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToFavorites(item.book)}
                        className="p-2 text-gray-500 hover:text-pink-600 hover:bg-gray-50 rounded-full transition-colors"
                        title="Add to favorites"
                      >
                        <Heart className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleRemoveFromSaved(item.book_id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-50 rounded-full transition-colors"
                        title="Remove from saved"
                      >
                        <BookmarkPlus className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleAddToCart(item.book)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-gray-50 rounded-full transition-colors"
                        title="Move to cart"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedForLater;