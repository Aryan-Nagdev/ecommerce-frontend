// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const API = "https://ecommerce-backend-k7re.onrender.com/api";

  // ✅ FIXED: Read both possible keys "userData" OR "user"
  const getUser = () => {
    try {
      const stored =
        localStorage.getItem("userData") || localStorage.getItem("user");

      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  // ✅ Load cart from backend
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

  useEffect(() => {
    loadCart();
    const handleStorage = () => loadCart();

    window.addEventListener("storage", handleStorage);

    const interval = setInterval(loadCart, 3000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // ✅ FINAL FIX: Ensure product._id is always a string
  const addToCart = async (product, qty = 1) => {
    const user = getUser();
    if (!user?.id) return; // Not logged in

    const quantity = typeof qty === "number" ? qty : 1;

    try {
      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          product: {
            ...product,
            _id: product._id?.toString(),
          },
          qty: quantity,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data.items || []);
      } else {
        console.error("Add failed:", res.status);
      }
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  // ✅ update quantity
  const updateQty = async (productId, qty) => {
    const user = getUser();
    if (!user?.id || qty < 1) return;

    await fetch(`${API}/cart`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        productId: productId.toString(),
        qty,
      }),
    });

    loadCart();
  };

  // ✅ remove product
  const removeFromCart = async (productId) => {
    const user = getUser();
    if (!user?.id) return;

    await fetch(`${API}/cart`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        productId: productId.toString(),
      }),
    });

    loadCart();
  };

  // OPTIONAL — but used in your Cart page
  const totalPrice = () => {
    return cart.reduce((sum, item) => {
      return sum + Number(item.productId?.price || 0) * (item.qty || 1);
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        loadCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
