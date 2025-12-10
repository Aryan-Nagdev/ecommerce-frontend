import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const API = "https://ecommerce-backend-k7re.onrender.com/api";

  // ✅ FIX 1: Read correct login key ("shopkaro_user")
  const getUser = () => {
    try {
      const stored = localStorage.getItem("shopkaro_user");
      if (!stored) return null;

      const user = JSON.parse(stored);

      // ✅ FIX 2: Backend returns "_id", but CartContext needs "id"
      return {
        ...user,
        id: user.id || user._id, // ensure id always exists
      };

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

  useEffect(() => {
    loadCart();

    const interval = setInterval(loadCart, 3000);
    return () => clearInterval(interval);
  }, []);

  // ADD ITEM
  const addToCart = async (product, qty = 1) => {
    const user = getUser();
    if (!user?.id) return;

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
          qty,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data.items || []);
      } else {
        console.error("Add failed:", res.status);
      }
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // UPDATE QTY
  const updateQty = async (productId, qty) => {
    const user = getUser();
    if (!user?.id) return;

    await fetch(`${API}/cart`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        productId,
        qty,
      }),
    });

    loadCart();
  };

  // REMOVE ITEM
  const removeFromCart = async (productId) => {
    const user = getUser();
    if (!user?.id) return;

    await fetch(`${API}/cart`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        productId,
      }),
    });

    loadCart();
  };

  // CALCULATE TOTAL
  const totalPrice = () => {
    return cart.reduce((sum, item) => {
      return sum + Number(item.productId?.price || 0) * (item.qty || 1);
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, removeFromCart, loadCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CCartContext);
