import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, BookMarked, LogIn, LogOut, Package, BookmarkPlus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const { user, setUser, cartItems, favorites, savedForLater, setCartItems, setFavorites, setSavedForLater } = useStore();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      // Fetch cart items
      const { data: cartData } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);
      setCartItems(cartData || []);

      // Fetch favorites
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);
      setFavorites(favoritesData || []);

      // Fetch saved for later
      const { data: savedData } = await supabase
        .from('saved_for_later')
        .select('*')
        .eq('user_id', user.id);
      setSavedForLater(savedData || []);
    };

    fetchUserData();
  }, [user, setCartItems, setFavorites, setSavedForLater]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookMarked className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">Digital Books</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/favorites"
                  className="text-gray-600 hover:text-indigo-600 flex items-center relative group"
                  title="Favorites"
                >
                  <Heart className={`h-6 w-6 ${favorites.length > 0 ? 'fill-pink-500 text-pink-500' : ''}`} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                  <span className="tooltip">Favorites</span>
                </Link>
                <Link
                  to="/saved-for-later"
                  className="text-gray-600 hover:text-indigo-600 flex items-center relative group"
                  title="Saved for Later"
                >
                  <BookmarkPlus className={`h-6 w-6 ${savedForLater.length > 0 ? 'text-indigo-500' : ''}`} />
                  {savedForLater.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {savedForLater.length}
                    </span>
                  )}
                  <span className="tooltip">Saved for Later</span>
                </Link>
                <Link
                  to="/cart"
                  className="text-gray-600 hover:text-indigo-600 flex items-center relative group"
                  title="Shopping Cart"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                  <span className="tooltip">Shopping Cart</span>
                </Link>
                <Link
                  to="/purchases"
                  className="text-gray-600 hover:text-indigo-600 flex items-center relative group"
                  title="Purchase History"
                >
                  <Package className="h-6 w-6" />
                  <span className="tooltip">Purchase History</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-indigo-600 flex items-center relative group"
                  title="Logout"
                >
                  <LogOut className="h-6 w-6" />
                  <span className="tooltip">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-gray-600 hover:text-indigo-600 flex items-center relative group"
                title="Login"
              >
                <LogIn className="h-6 w-6" />
                <span className="ml-1">Login</span>
                <span className="tooltip">Login to your account</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;