import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const user = JSON.parse(localStorage.getItem("shopkaro_user") || "{}");

  // fetch cart
  const getCart = async () => {
    if (!user?.id) return;

    const res = await fetch(
      `https://ecommerce-backend-k7re.onrender.com/api/cart/${user.id}`
    );
    const data = await res.json();
    setCart(data.items || []);
  };

  useEffect(() => {
    getCart();
  }, [user]);

  // add to cart
  const addToCart = async (product, qty = 1) => {
    await fetch(`https://ecommerce-backend-k7re.onrender.com/api/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, product, qty }),
    });

    getCart();
  };

  // update qty
  const updateQty = async (productId, qty) => {
    await fetch(`https://ecommerce-backend-k7re.onrender.com/api/cart`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, productId, qty }),
    });

    getCart();
  };

  // remove
  const removeFromCart = async (productId) => {
    await fetch(`https://ecommerce-backend-k7re.onrender.com/api/cart`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, productId }),
    });

    getCart();
  };

  // clear
  const clearCart = async () => {
    await fetch(
      `https://ecommerce-backend-k7re.onrender.com/api/cart/${user.id}`,
      {
        method: "DELETE",
      }
    );
    getCart();
  };

  // ⭐⭐ only this line was changed ⭐⭐
  const totalPrice = cart.reduce(
    (sum, item) =>
      sum + ((item?.productId?.price || 0) * (item?.qty || 1)),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
