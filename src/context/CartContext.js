// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const getUser = () => {
    try {
      const u = localStorage.getItem("user");
      const user = u ? JSON.parse(u) : null;
      console.log("🔑 Current user:", user ? { id: user.id, hasToken: !!user.token } : "No user");
      return user;
    } catch (e) {
      console.error("User parse error:", e);
      return null;
    }
  };

  const getAuthHeaders = () => {
    const user = getUser();
    const token = user?.token || "";
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "x-auth-token": token,
      // FIX CORS: Add explicit origin
      "Origin": window.location.origin
    };
  };

  const loadCart = async () => {
    const user = getUser();
    if (!user?.id) {
      console.log("🛒 No user, empty cart");
      setCart([]);
      return;
    }

    try {
      console.log("📥 Loading cart for user:", user.id);
      const res = await fetch(
        `https://ecommerce-backend-k7re.onrender.com/api/cart/${user.id}`,
        { headers: getAuthHeaders() }
      );

      console.log("📥 Cart response status:", res.status, res.statusText);
      if (res.ok) {
        const data = await res.json();
        console.log("📥 Cart loaded:", data.items?.length || 0, "items");
        setCart(data.items || []);
      } else {
        console.error("📥 Cart load failed:", res.status);
        setCart([]);
      }
    } catch (err) {
      console.error("📥 Cart load error:", err);
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();
    const handleStorage = () => loadCart();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addToCart = async (product, qty = 1) => {
    const user = getUser();
    if (!user?.id) {
      console.log("🚫 No user, skipping add to cart");
      return;
    }

    console.log("🛒 Adding to cart:", { productId: product._id, title: product.title, qty });

    try {
      const res = await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId: user.id, product, qty }),
      });

      console.log("🛒 Add to cart response:", res.status, res.statusText);

      if (res.ok) {
        const data = await res.json();
        console.log("🛒 Added successfully! New cart:", data.items?.length || 0, "items");
        setCart(data.items || []);
      } else {
        console.error("🛒 Add failed:", res.status, "Body:", await res.text());
      }
    } catch (err) {
      console.error("🛒 Add to cart network error:", err);
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
    } catch (err) {
      console.error("Update qty error:", err);
    }
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
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  const clearCart = async () => {
    setCart([]);
    const user = getUser();
    if (!user?.id) return;
    try {
      await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart/clear", {
        method: "DELETE",
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId: user.id }),
      });
    } catch (err) {
      console.error("Clear error:", err);
    }
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