import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, updateQty, removeFromCart, fetchCart, totalPrice } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="text-center py-32 text-3xl">Your cart is empty</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold text-center mb-16 text-orange-600">
          Cart ({cart.length} items)
        </h1>

        <div className="grid lg:grid-cols-3 gap-12">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-10">
            {cart.map((item) => {
              const p = item.productId;

              return (
                <div
                  key={p._id}
                  className="bg-white rounded-3xl shadow-xl p-8 flex gap-8"
                >
                  <img
                    src={p.images[0]}
                    className="w-40 h-40 object-cover rounded-xl"
                    alt={p.title}
                  />

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{p.title}</h2>

                    <p className="text-3xl text-orange-600 font-bold mt-2">
                      ₹{p.price}
                    </p>

                    <div className="flex items-center gap-4 mt-6">
                      <button
                        className="px-4 py-2 bg-gray-300 rounded-full"
                        onClick={() =>
                          item.qty > 1 && updateQty(p._id, item.qty - 1)
                        }
                      >
                        -
                      </button>

                      <span className="text-2xl font-bold">{item.qty}</span>

                      <button
                        className="px-4 py-2 bg-gray-300 rounded-full"
                        onClick={() => updateQty(p._id, item.qty + 1)}
                      >
                        +
                      </button>

                      <button
                        className="text-red-600 ml-auto"
                        onClick={() => removeFromCart(p._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT SIDE SUMMARY */}
          <div className="bg-white p-10 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-bold mb-6">Order Summary</h2>

            {cart.map((item) => (
              <div key={item.productId._id} className="flex justify-between my-2">
                <span>
                  {item.productId.title} × {item.qty}
                </span>
                <span>₹{item.productId.price * item.qty}</span>
              </div>
            ))}

            <hr className="my-6" />

            <div className="flex justify-between text-2xl font-bold">
              <span>Total:</span>
              <span>₹{totalPrice}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-orange-600 text-white py-4 rounded-xl text-xl font-bold mt-8"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
