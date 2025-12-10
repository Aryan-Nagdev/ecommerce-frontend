// src/context/CartContext.js
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const API = "https://ecommerce-backend-k7re.onrender.com/api";

  const [cart, setCart] = useState([]);

  // ALWAYS READ FRESH USER — NEVER CACHE IT!
  const getUser = () => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  };

  const fetchCart = async () => {
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
      console.error("Fetch cart error:", err);
    }
  };

  const addToCart = async (product, qty = 1) => {
    const user = getUser();
    if (!user?.id) {
      // NO ALERT — SILENT FAIL (professional)
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
            _id: product._id.toString()  // fixes backend ObjectId issue
          },
          qty
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data.items || []);
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
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
    fetchCart();
  };

  const removeFromCart = async (productId) => {
    const user = getUser();
    if (!user?.id) return;

    await fetch(`${API}/cart`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, productId }),
    });
    fetchCart();
  };

  // Auto-refresh cart when user changes
  useEffect(() => {
    fetchCart();
  }, []);

  // Refresh cart every 5 seconds (safety)
  useEffect(() => {
    const interval = setInterval(fetchCart, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);