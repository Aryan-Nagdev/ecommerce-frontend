// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const API = "https://ecommerce-backend-k7re.onrender.com/api";

  // ALWAYS GET FRESH USER — NEVER CACHE
  const getUser = () => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const loadCart = async () => {
    const user = getUser();
    if (!user?.id) {
      setCart([]);
      return;
    }

    try {
      const res = await fetch(`${API}/cart/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setCart(data.items || []);
      }
    } catch (err) {
      console.error("Load cart failed:", err);
    }
  };

  // Auto load cart on mount + when localStorage changes
  useEffect(() => {
    loadCart();
    window.addEventListener("storage", loadCart);
    const interval = setInterval(loadCart, 3000);
    return () => {
      window.removeEventListener("storage", loadCart);
      clearInterval(interval);
    };
  }, []);

  const addToCart = async (product, qty = 1) => {
    const user = getUser();
    if (!user?.id) {
      // NO ALERT — JUST DO NOTHING (professional)
      return;
    }

    try {
      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          product: {
            ...product,
            _id: product._id.toString()  // fixes ObjectId issue
          },
          qty
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data.items || []);
      }
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const updateQty = async (productId, qty) => {
    const user = getUser();
    if (!user?.id || qty < 1) return;

    await fetch(`${API}/cart`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, productId, qty }),
    });
    loadCart();
  };

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

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);