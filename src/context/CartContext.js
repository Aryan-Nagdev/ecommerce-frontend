// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // fetch cart
  const fetchCart = async () => {
    try {
      const res = await fetch(
        "https://ecommerce-backend-k7re.onrender.com/api/cart"
      );
      const data = await res.json();
      setCart(Array.isArray(data) ? data : []);
    } catch {
      setCart([]);
    }
  };

  // add to cart  (qty optional)
  const addToCart = async (product, qty = 1) => {
    try {
      const res = await fetch(
        "https://ecommerce-backend-k7re.onrender.com/api/cart",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product._id,
            title: product.title,
            price: product.price,
            images: product.images,
            qty
          }),
        }
      );

      await fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  // update
  const updateQty = async (id, qty) => {
    await fetch(
      `https://ecommerce-backend-k7re.onrender.com/api/cart/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty }),
      }
    );
    fetchCart();
  };

  // delete
  const removeFromCart = async (id) => {
    await fetch(
      `https://ecommerce-backend-k7re.onrender.com/api/cart/${id}`,
      {
        method: "DELETE",
      }
    );
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, removeFromCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
