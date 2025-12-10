import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, updateQty, removeFromCart, loadCart, totalPrice } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="text-center py-32 text-3xl">Your cart is empty</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-6">My Cart</h1>

        {cart.map((item) => (
          <div
            key={item.productId}
            className="border p-4 rounded-lg mb-4 flex gap-6 items-center"
          >
            <img src={item.image} alt={item.title} className="w-24 h-24" />

            <div className="flex-1">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-600">₹{item.price}</p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => updateQty(item.productId, item.qty - 1)}
                  className="px-3 py-1 border rounded"
                >
                  -
                </button>

                <span className="px-4 py-1 border rounded bg-gray-100">
                  {item.qty}
                </span>

                <button
                  onClick={() => updateQty(item.productId, item.qty + 1)}
                  className="px-3 py-1 border rounded"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.productId)}
                className="text-red-500 mt-3"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="text-right text-xl font-bold mt-6">
          Total : ₹{totalPrice()}
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="px-5 py-3 bg-orange-500 text-white mt-6"
        >
          Checkout
        </button>
      </div>

      <Footer />
    </>
  );
};

export default Cart;
