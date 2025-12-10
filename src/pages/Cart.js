import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
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
      <div className="max-w-5xl mx-auto p-5 grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded-lg flex justify-between"
            >
              <div>
                <h3 className="font-bold">{item.product?.title}</h3>
                <p className="text-sm text-gray-600">
                  ₹ {item.product?.price}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() =>
                      updateQty(item._id, item.quantity - 1)
                    }
                    className="px-2 bg-gray-200"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQty(item._id, item.quantity + 1)
                    }
                    className="px-2 bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="border p-4 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <p className="text-lg"> Total: ₹ {totalPrice}</p>

          <button
            onClick={() => navigate("/checkout")}
            className="bg-orange-600 text-white px-6 py-2 rounded w-full mt-6"
          >
            Continue to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
