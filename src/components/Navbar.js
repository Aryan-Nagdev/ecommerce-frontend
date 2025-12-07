// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cart, fetchCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleLogout = () => {
    logout();
    fetchCart(); // Clear cart on logout
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-4xl font-bold text-orange-600">
            ShopKaro
          </Link>

          <div className="flex items-center gap-8">
            <Link to="/" className="hidden md:block text-lg font-medium hover:text-orange-600">
              Home
            </Link>

            <Link to="/cart" className="relative">
              <ShoppingCart size={32} className="text-gray-800 hover:text-orange-600 transition" />
              {totalItems > 0 && (
                <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {user && (
              <Link to="/orders" className="hidden md:block text-lg font-medium hover:text-orange-600">
                My Orders
              </Link>
            )}

            {user ? (
              <button onClick={handleLogout} className="bg-orange-600 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-700 transition">
                Logout
              </button>
            ) : (
              <Link to="/login" className="bg-orange-600 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-700 transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;