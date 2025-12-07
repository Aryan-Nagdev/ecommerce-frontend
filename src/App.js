import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirm from './pages/OrderConfirm';
import ProductDetail from './pages/ProductDetail';
import ProductList from './pages/ProductList';  // FIXED HERE
import OrderHistory from './pages/OrderHistory';

function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirm" element={<OrderConfirm />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* FIXED ROUTE — Now ProductList loads on category click */}
        <Route path="/category/:category" element={<ProductList />} />

        <Route path="/orders" element={<OrderHistory />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
