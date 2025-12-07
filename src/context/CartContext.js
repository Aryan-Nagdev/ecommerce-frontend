// src/context/CartContext.js - FINAL
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${user.id}`);
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.log("Cart fetch failed");
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (product) => {
    if (!user) {
      toast.error("Please login first!");
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, product })
      });
      const data = await res.json();
      setCart(data.items || []);
      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Failed to add");
    }
  };

  const updateQty = async (productId, qty) => {
    if (!user || qty < 1) return;
    try {
      await fetch('http://localhost:5000/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId, qty })
      });
      fetchCart(); // This ensures correct qty
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      await fetch('http://localhost:5000/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId })
      });
      toast.success("Removed");
      fetchCart();
    } catch (err) {
      toast.error("Remove failed");
    }
  };

  const clearCart = async () => {
    if (!user) return;
    await fetch(`http://localhost:5000/api/cart/${user.id}`, { method: 'DELETE' });
    setCart([]);
  };

  const totalPrice = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * item.qty, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart, totalPrice, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};