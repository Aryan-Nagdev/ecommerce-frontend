import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // GET CART
  async function loadCart() {
    if (!user) return;

    try {
      const res = await fetch(
        `https://ecommerce-backend-k7re.onrender.com/api/cart/${user.id}`
      );
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadCart();
  }, [user]);


  // ADD TO CART
  async function addToCart(product, qty = 1) {
    if (!user) return alert("Please login");

    try {
      const res = await fetch(
        "https://ecommerce-backend-k7re.onrender.com/api/cart",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, product, qty }),
        }
      );

      const data = await res.json();
      setCart(data.items || []);
    } catch {}
  }


  // UPDATE QTY
  async function updateQty(productId, qty) {
    try {
      await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId, qty }),
      });

      loadCart();
    } catch {}
  }


  // REMOVE
  async function removeFromCart(productId) {
    try {
      await fetch("https://ecommerce-backend-k7re.onrender.com/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId }),
      });

      loadCart();
    } catch {}
  }


  // SAFE total
  const totalItems = cart?.reduce((sum, item) => sum + (item.qty || 1), 0);


  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
