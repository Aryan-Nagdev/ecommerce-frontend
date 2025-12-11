// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const API = "https://ecommerce-backend-k7re.onrender.com/api";

  // Robust: try several possible storage keys and normalize returned user object
  const getUser = () => {
    try {
      const stored =
        localStorage.getItem("shopkaro_user") ||
        localStorage.getItem("userData") ||
        localStorage.getItem("user") ||
        localStorage.getItem("userData_v2");

      if (!stored) return null;
      const u = JSON.parse(stored);

      // ensure we always have `.id` available (backend sometimes returns id or _id)
      return { ...u, id: u.id || u._id || u.userId || null };
    } catch (e) {
      return null;
    }
  };

  // Normalize items to shape: { productId: { _id, title, price, images }, qty }
  const normalizeItems = (items = []) => {
    return items.map((item) => {
      // If backend already returned productId shape, keep it
      if (item.productId) {
        // ensure productId._id is string
        return {
          productId: { ...item.productId, _id: item.productId._id?.toString() || item.productId._id },
          qty: item.qty || 1,
          _raw: item // keep raw if needed
        };
      }

      // Backend returned flat object: {_id, title, price, images, qty}
      if (item._id || item.title) {
        return {
          productId: {
            _id: item._id?.toString() || item._id,
            title: item.title,
            price: item.price,
            images: item.images || []
          },
          qty: item.qty || 1,
          _raw: item
        };
      }

      // Fallback: keep as-is
      return item;
    });
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
        // backend returns { items: [...] } where each item may be flat or have productId
        const items = data.items || [];
        setCart(normalizeItems(items));
        return;
      }
      setCart([]);
    } catch (err) {
      console.error("Load cart failed:", err);
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();

    // keep cart in sync (storage and interval)
    const handleStorage = () => loadCart();
    window.addEventListener("storage", handleStorage);

    const interval = setInterval(loadCart, 3000);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add to cart: accepts (product, qty) OR (productIdObject)
  const addToCart = async (product, qty = 1) => {
    const user = getUser();
    if (!user?.id) return;

    // product may be product object or productId wrapper. We need product._id
    const prodId = product._id || (product.productId && product.productId._id) || product.id;
    if (!prodId) {
      console.error("Product id missing when adding to cart", product);
      return;
    }

    try {
      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          product: {
            _id: prodId.toString()
          },
          qty: Number(qty) || 1
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCart(normalizeItems(data.items || []));
      } else {
        const txt = await res.text().catch(() => "");
        console.error("Add to cart failed:", res.status, txt);
      }
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const updateQty = async (productId, qty) => {
    const user = getUser();
    if (!user?.id) return;
    if (!productId) return;

    try {
      await fetch(`${API}/cart`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId: productId.toString(), qty }),
      });
    } catch (err) {
      console.error("Update qty error:", err);
    }
    // refresh local cart
    loadCart();
  };

  const removeFromCart = async (productId) => {
    const user = getUser();
    if (!user?.id) return;
    if (!productId) return;

    try {
      await fetch(`${API}/cart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId: productId.toString() }),
      });
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
    loadCart();
  };

  // total price: support both shapes
  const totalPrice = () => {
    return cart.reduce((sum, item) => {
      const price =
        item.productId?.price ??
        item._raw?.price ??
        item.price ??
        0;
      const q = item.qty ?? 1;
      return sum + Number(price || 0) * Number(q || 1);
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
