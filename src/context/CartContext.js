import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const API = "https://ecommerce-backend-k7.onrender.com/api";

  const [cart, setCart] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  // ---------------------------
  // FETCH CART
  // ---------------------------
  const fetchCart = async () => {
    try {
      if (!user?.id) return;

      const res = await fetch(`${API}/cart/${user.id}`);
      const data = await res.json();

      setCart(data.items || []);
    } catch (err) {
      console.error("Fetch Cart Error:", err);
    }
  };

  // ---------------------------
  // ADD TO CART
  // ---------------------------
  const addToCart = async (product) => {
    try {
      if (!user?.id) {
        alert("Please login first");
        return;
      }

      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          product,
          qty: 1
        }),
      });

      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.error("Add to Cart Error:", err);
    }
  };

  // ---------------------------
  // UPDATE QUANTITY
  // ---------------------------
  const updateQty = async (productId, qty) => {
    try {
      if (!user?.id) return;

      await fetch(`${API}/cart`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId, qty }),
      });

      fetchCart();
    } catch (err) {
      console.error("Update Qty Error:", err);
    }
  };

  // ---------------------------
  // REMOVE ITEM
  // ---------------------------
  const removeFromCart = async (productId) => {
    try {
      await fetch(`${API}/cart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId }),
      });

      fetchCart();
    } catch (err) {
      console.error("Remove Error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user?.id]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        fetchCart,
        updateQty,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
