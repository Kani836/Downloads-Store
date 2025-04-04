import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, BookmarkPlus, Home } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import type { CartItem, Book } from '../types';

const Cart = () => {
  const { user, cartItems, setCartItems } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select(`
            *,
            book:books(*)
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        setCartItems(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user, setCartItems]);

  const handleRemoveFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(cartItems.filter(item => item.id !== itemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item from cart');
    }
  };

  const handleSaveForLater = async (book: Book) => {
    if (!user) return;

    try {
      const { error: saveError } = await supabase
        .from('saved_for_later')
        .insert([{ user_id: user.id, book_id: book.id }]);

      if (saveError) throw saveError;

      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('book_id', book.id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setCartItems(cartItems.filter(item => item.book_id !== book.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item for later');
    }
  };

  const handlePurchase = async () => {
    try {
      const purchaseItems = cartItems.map(item => ({
        id: item.book_id,
        title: item.book.title,
        author: item.book.author,
        price: item.book.price,
        file_url: item.book.file_url
      }));

      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert([{
          user_id: user?.id,
          items: purchaseItems,
          total_amount: calculateTotal(),
          status: 'completed'
        }]);

      if (purchaseError) throw purchaseError;

      // Clear the cart in the database
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user?.id);

      if (error) throw error;

      setPurchaseSuccess(true);
      setCartItems([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process purchase');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.book?.price || 0), 0);
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

  if (purchaseSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Purchase Successful!</h2>
            <p className="text-gray-600 mb-4">Thank you for your purchase. Your digital books are now available in your purchase history.</p>
            <Link
              to="/purchases"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View Purchase History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
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

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.book?.cover_image}
                    alt={item.book?.title}
                    className="h-24 w-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.book?.title}</h3>
                    <p className="text-gray-600">{item.book?.author}</p>
                    <p className="text-indigo-600 font-semibold">${item.book?.price}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => item.book && handleSaveForLater(item.book)}
                      className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Save for later"
                    >
                      <BookmarkPlus className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove from cart"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-indigo-600">${calculateTotal()}</span>
              </div>
              <button
                onClick={handlePurchase}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Purchase
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;