// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  async function loadCart() {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      const res = await fetch(`https://ecommerce-backend-k7re.onrender.com/api/cart/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.log("Load cart error:", err);
      setCart([]);
    }
  }

  useEffect(() => {
    loadCart();
  }, [user]);

  async function addToCart(product, qty = 1) {
    if (!user) return alert("Please login to add items to cart");

    try {
      const res = await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, product, qty }),
      });

      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.log("Add to cart failed:", err);
      alert("Failed to add item");
    }
  }

  async function updateQty(productId, qty) {
    if (!user || qty < 1) return;

    try {
      await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId, qty }),
      });
      loadCart();
    } catch (err) {
      console.log("Update qty error:", err);
    }
  }

  async function removeFromCart(productId) {
    if (!user) return;

    try {
      await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId }),
      });
      loadCart();
    } catch (err) {
      console.log("Remove error:", err);
    }
  }

  // ADD THIS: Clear cart after order
  async function clearCart() {
    if (!user) {
      setCart([]);
      return;
    }
    try {
      // If your backend has a clear route
      await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart/clear", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
    } catch (err) {
      console.log("Clear cart API not available, clearing locally");
    } finally {
      setCart([]); // Always clear locally
    }
  }

  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  function totalPrice() {
    return cart.reduce((sum, item) => {
      const price = item.productId?.price || item.price || 0;
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
        clearCart,        // ← NOW EXPORTED
        totalItems,
        totalPrice,       // ← function
        loadCart          // optional: for manual refresh
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);