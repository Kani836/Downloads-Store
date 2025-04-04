import { create } from 'zustand';
import { Book, CartItem, Favorite, SavedForLater } from '../types';

interface Store {
  books: Book[];
  cartItems: CartItem[];
  favorites: Favorite[];
  savedForLater: SavedForLater[];
  user: any | null;
  setBooks: (books: Book[]) => void;
  setCartItems: (items: CartItem[]) => void;
  setFavorites: (items: Favorite[]) => void;
  setSavedForLater: (items: SavedForLater[]) => void;
  setUser: (user: any) => void;
}

export const useStore = create<Store>((set) => ({
  books: [],
  cartItems: [],
  favorites: [],
  savedForLater: [],
  user: null,
  setBooks: (books) => set({ books }),
  setCartItems: (cartItems) => set({ cartItems }),
  setFavorites: (favorites) => set({ favorites }),
  setSavedForLater: (savedForLater) => set({ savedForLater }),
  setUser: (user) => set({ user }),
}));