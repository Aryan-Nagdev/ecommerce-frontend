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
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 gap-12 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">

          {cart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row gap-6 items-center border-b pb-6"
            >
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-32 h-32 object-cover"
              />

              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-500">₹{item.price}</p>

                {/*   ----- Qty Update -----   */}
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() =>
                      updateQty(item._id, item.qty > 1 ? item.qty - 1 : 1)
                    }
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span className="px-3 py-1 border rounded">{item.qty}</span>

                  <button
                    onClick={() => updateQty(item._id, item.qty + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 text-sm underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

        </div>

        {/* ---------- Checkout Box ---------- */}
        <div className="p-6 border rounded space-y-3 sticky top-32">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <p className="text-gray-600">
            Total Items: {cart.length}
          </p>

          <p className="font-semibold">
            Total Price: ₹{totalPrice()}
          </p>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3 bg-black text-white rounded mt-3"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
