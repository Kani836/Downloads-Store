import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Purchases from './pages/Purchases';
import Favorites from './pages/Favorites';
import SavedForLater from './pages/SavedForLater';
import { useStore } from './store/useStore';

function App() {
  const user = useStore((state) => state.user);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/cart"
            element={user ? <Cart /> : <Navigate to="/login" />}
          />
          <Route
            path="/purchases"
            element={user ? <Purchases /> : <Navigate to="/login" />}
          />
          <Route
            path="/favorites"
            element={user ? <Favorites /> : <Navigate to="/login" />}
          />
          <Route
            path="/saved-for-later"
            element={user ? <SavedForLater /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;