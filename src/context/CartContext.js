// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const API = "https://ecommerce-backend-k7re.onrender.com/api";

  // Get logged in user (Auth stores shopkaro_user)
  const getUser = () => {
    try {
      const stored =
        localStorage.getItem("shopkaro_user") ||
        localStorage.getItem("userData") ||
        localStorage.getItem("user");

      if (!stored) return null;

      const u = JSON.parse(stored);
      return { ...u, id: u.id || u._id || u.userId };
    } catch {
      return null;
    }
  };

  // Normalize backend response into frontend structure
  const normalizeItems = (items = []) =>
    items.map((item) => ({
      productId: {
        _id: item.productId?._id?.toString() || item._id?.toString(),
        title: item.productId?.title || item.title,
        price: item.productId?.price || item.price,
        images: item.productId?.images || item.images || [],
      },
      qty: item.qty || 1,
    }));

  // Load cart
  const loadCart = async () => {
    const user = getUser();
    if (!user?.id) return setCart([]);

    try {
      const res = await fetch(`${API}/cart/${user.id}`);
      const data = await res.json();
      setCart(normalizeItems(data.items || []));
    } catch {
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Add item to cart
  const addToCart = async (product, qty = 1) => {
    const user = getUser();
    if (!user?.id) return;

    const prodId =
      product._id || product.productId?._id || product.id;

    try {
      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          product: { _id: prodId.toString() },
          qty,
        }),
      });

      const data = await res.json();

      setCart(normalizeItems(data.items || []));
      toast.success("Item added to cart"); // 🎉 NEW
    } catch (err) {
      console.error(err);
    }
  };

  // Update quantity
  const updateQty = async (productId, qty) => {
    const user = getUser();
    if (!user?.id) return;

    await fetch(`${API}/cart`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, productId, qty }),
    });

    loadCart();
  };

  // Remove
  const removeFromCart = async (productId) => {
    const user = getUser();
    if (!user?.id) return;

    await fetch(`${API}/cart`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, productId }),
    });

    loadCart();
  };

  // ❗️ Add missing clearCart (Checkout needs it)
  const clearCart = async () => {
    const user = getUser();
    if (!user?.id) return;

    await fetch(`${API}/cart/${user.id}`, {
      method: "DELETE",
    });

    setCart([]);
  };

  const totalPrice = () =>
    cart.reduce(
      (sum, item) => sum + item.productId.price * item.qty,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart, // ⭐ Important
        totalPrice,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
