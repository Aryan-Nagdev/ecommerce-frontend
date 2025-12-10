// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Always get fresh user + token
  const getUser = () => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  };

  const getAuthHeaders = () => {
    const user = getUser();
    const token = user?.token || "";
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "x-auth-token": token
    };
  };

  const loadCart = async () => {
    const user = getUser();
    if (!user?.id) {
      setCart([]);
      return;
    }

    try {
      const res = await fetch(
        `https://ecommerce-backend-k7re.onrender.com/api/cart/${user.id}`,
        { headers: getAuthHeaders() }
      );

      if (res.ok) {
        const data = await res.json();
        setCart(data.items || []);
      } else {
        setCart([]);
      }
    } catch (err) {
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();

    const handleStorage = () => loadCart();
    window.addEventListener("storage", handleStorage);
    const interval = setInterval(loadCart, 8000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  const addToCart = async (product, qty = 1) => {
    const user = getUser();
    if (!user?.id) return;

    try {
      const res = await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId: user.id, product, qty }),
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data.items || []);
      }
    } catch (err) {
      // silent
    }
  };

  const updateQty = async (productId, qty) => {
    const user = getUser();
    if (!user?.id || qty < 1) return;

    try {
      await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId: user.id, productId, qty }),
      });
      loadCart();
    } catch (err) {}
  };

  const removeFromCart = async (productId) => {
    const user = getUser();
    if (!user?.id) return;

    try {
      await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart", {
        method: "DELETE",
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId: user.id, productId }),
      });
      loadCart();
    } catch (err) {}
  };

  const clearCart = async () => {
    const user = getUser();
    setCart([]); // always clear locally

    if (!user?.id) return;

    try {
      await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart/clear", {
        method: "DELETE",
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId: user.id }),
      });
    } catch (err) {}
  };

  const totalPrice = () => {
    return cart.reduce((sum, item) => {
      const price = item.productId?.price || item.price || 0;
      const qty = item.qty || 1;
      return sum + price * qty;
    }, 0);
  };

  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        totalPrice,
        totalItems,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);