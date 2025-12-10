// src/context/CartContext.js

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Always get fresh user from localStorage (fixes stale user bug)
  const getUser = () => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  async function loadCart() {
    const user = getUser();
    if (!user?.id) {
      setCart([]);
      return;
    }

    try {
      const res = await fetch(`https://ecommerce-backend-k7re.onrender.com/api/cart/${user.id}`);
      if (!res.ok) return setCart([]);
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      setCart([]);
    }
  }

  // Runs when user logs in/out or page loads
  useEffect(() => {
    loadCart();

    // Optional: reload cart when localStorage changes (e.g. login in another tab)
    const handleStorage = () => loadCart();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ADD TO CART — NO ALERT, NO ERROR, SILENT
  async function addToCart(product, qty = 1) {
    const user = getUser();
    if (!user?.id) return; // ← Silent if not logged in

    try {
      const res = await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, product, qty }),
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data.items || []);
      }
      // If failed → do nothing (silent)
    } catch (err) {
      // Silent fail
    }
  }

  async function updateQty(productId, qty) {
    const user = getUser();
    if (!user?.id || qty < 1) return;

    try {
      await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId, qty }),
      });
      loadCart();
    } catch (err) {
      // Silent
    }
  }

  async function removeFromCart(productId) {
    const user = getUser();
    if (!user?.id) return;

    try {
      await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId }),
      });
      loadCart();
    } catch (err) {
      // Silent
    }
  }

  async function clearCart() {
    const user = getUser();
    if (!user?.id) {
      setCart([]);
      return;
    }
    try {
      await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart/clear", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
    } catch {}
    setCart([]);
  }

  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  function totalPrice() {
    return cart.reduce((sum, item) => {
      const price = item.productId?.price || 0;
      const qty = item.qty || 1;
      return sum + price * qty;
    }, 0);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
        loadCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);