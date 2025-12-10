// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Package, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // Navigate to ProductList with search as "category" param — your backend handles flexible search
    navigate(`/category/${encodeURIComponent(query)}`);
    setSearchQuery('');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
            ShopKaro
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl mx-10">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 pl-12 rounded-full border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-gray-700"
              />
              <button type="submit" className="absolute left-4 top-3.5">
                <Search size={22} className="text-gray-500" />
              </button>
            </div>
          </form>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {user ? (
              <>
                <Link to="/orders" className="flex items-center gap-2 hover:text-orange-600 font-medium transition">
                  <Package size={22} /> Orders
                </Link>
                <div className="flex items-center gap-2">
                  <User size={22} />
                  <span className="font-medium">Hi, {user.name.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition shadow-md">
                Login
              </Link>
            )}

            <Link to="/cart" className="relative group">
              <ShoppingCart size={30} className="text-gray-800 group-hover:text-orange-600 transition" />
              {totalItems > 0 && (
                <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden">
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="lg:hidden bg-white border-t border-gray-200 py-4">
            <form onSubmit={handleSearch} className="px-4 mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-full border border-gray-300 focus:border-orange-500"
                />
                <Search className="absolute left-4 top-3.5 text-gray-500" size={22} />
              </div>
            </form>
            <div className="px-4 space-y-4">
              {user ? (
                <>
                  <Link to="/orders" className="block py-3 text-lg font-medium">My Orders</Link>
                  <button onClick={handleLogout} className="block w-full text-left py-3 text-lg font-medium text-red-600">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="block bg-orange-600 text-white text-center py-3 rounded-full font-bold">
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;