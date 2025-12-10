// src/context/CartContext.js
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await fetch(
        "https://ecommerce-backend-k7re.onrender.com/api/cart"
      );

      const data = await res.json();
      setCart(data || []);
    } catch (err) {
      console.log("cart fetch failed", err);
      setCart([]); // prevent undefined crash
    }
  };

  const totalPrice = () => {
    return cart.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 1;
      return acc + price * qty;
    }, 0);
  };

  const updateQty = async (id, qty) => {
    await fetch(
      `https://ecommerce-backend-k7re.onrender.com/api/cart/${id}?qty=${qty}`,
      { method: "PUT" }
    );
    fetchCart();
  };

  const removeFromCart = async (id) => {
    await fetch(
      `https://ecommerce-backend-k7re.onrender.com/api/cart/${id}`,
      { method: "DELETE" }
    );
    fetchCart();
  };

  return (
    <CartContext.Provider
      value={{ cart, fetchCart, updateQty, removeFromCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};
