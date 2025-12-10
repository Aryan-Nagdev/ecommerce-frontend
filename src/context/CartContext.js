import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) return setCart([]);

    const res = await fetch(`https://ecommerce-backend-k7re.onrender.com/api/cart/${user.id}`);
    const data = await res.json();
    setCart(data.items || []);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // ADD TO CART — FIXED BULK QTY
  const addToCart = async (product, qty = 1) => {
    if (!user) return toast.error("Please login first");

    const res = await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        product: { _id: product._id },
        qty,
      }),
    });

    const data = await res.json();
    setCart(data.items || []);
    toast.success("Added to cart");
  };

  const updateQty = async (productId, qty) => {
    await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, productId, qty }),
    });

    fetchCart();
  };

  const removeFromCart = async (productId) => {
    await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, productId }),
    });

    fetchCart();
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.productId.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        totalPrice,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
