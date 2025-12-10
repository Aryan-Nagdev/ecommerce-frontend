// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Always read fresh user — never cache it
  const getUser = () => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
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
      const res = await fetch(`https://ecommerce-backend-k7re.onrender.com/api/cart/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setCart(data.items || []);
      } else {
        setCart([]);
      }
    } catch {
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();
    // Re-load cart when login status changes
    window.addEventListener("storage", loadCart);
    const interval = setInterval(loadCart, 5000); // safety net
    return () => {
      window.removeEventListener("storage", loadCart);
      clearInterval(interval);
    };
  }, []);

  const addToCart = async (product, qty = 1) => {
    const user = getUser();
    if (!user?.id) return; // silent if not logged in

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
    } catch (err) {
      // silent fail
    }
  };

  const updateQty = async (productId, qty) => {
    const user = getUser();
    if (!user?.id || qty < 1) return;

    await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, productId, qty }),
    });
    loadCart();
  };

  const removeFromCart = async (productId) => {
    const user = getUser();
    if (!user?.id) return;

    await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, productId }),
    });
    loadCart();
  };

  const clearCart = async () => {
    setCart([]);
    const user = getUser();
    if (!user?.id) return;
    try {
      await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart/clear", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
    } catch {}
  };

  const totalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.productId?.price || 0) * (item.qty || 1), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        totalPrice,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);