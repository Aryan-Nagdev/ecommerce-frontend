// src/pages/Checkout.js

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  // Clean order items for backend
  const orderItems = cart.map((item) => ({
    productId: item.productId._id,
    title: item.productId.title,
    price: item.productId.price,
    image: item.productId.images?.[0] || "",
    qty: item.qty || 1
  }));

  const subtotal = totalPrice();           // Call function
  const discount = subtotal * 0.1;
  const finalTotal = Math.round(subtotal - discount);

  const handlePayment = async () => {
    // Validate address
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error("Please fill in all address fields");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to place an order");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("https://ecommerce-backend-k7re.onrender.com/api/order/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          items: orderItems,
          total: finalTotal,           // Send final amount after discount
          address
        })
      });

      const data = await res.json();
      console.log("Order Response:", data);

      if (data.message === "Order placed" || data.success) {
        await clearCart(); // This now works!
        toast.success("Order placed successfully!");
        navigate("/order-confirm", { replace: true });
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-12">

        {/* Address Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>

          <div className="space-y-5">
            <input
              type="text"
              name="street"
              value={address.street}
              placeholder="Street Address (House no., Building, Area)"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="city"
              value={address.city}
              placeholder="City"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="state"
                value={address.state}
                placeholder="State"
                className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="pincode"
                value={address.pincode}
                placeholder="Pincode"
                className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                onChange={handleChange}
                maxLength="6"
                required
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          <div className="max-h-96 overflow-y-auto mb-6 space-y-4 pr-2">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center text-lg border-b pb-3"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.productId.title}</p>
                  <p className="text-sm text-gray-500">× {item.qty}</p>
                </div>
                <span className="font-semibold">
                  ₹{(item.productId.price * item.qty).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between text-green-600 font-medium">
              <span>Special Discount (10%)</span>
              <span>-₹{discount.toFixed(0)}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Shipping</span>
              <span>FREE</span>
            </div>

            <div className="flex justify-between text-2xl font-bold border-t-2 border-orange-200 pt-4 mt-4">
              <span>Total</span>
              <span className="text-orange-600">₹{finalTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={!address.street || !address.city || !address.state || !address.pincode}
            className="w-full mt-8 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-5 rounded-lg font-bold text-xl transition transform hover:scale-105"
          >
            Complete Order & Pay ₹{finalTotal.toLocaleString("en-IN")}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            By placing order, you agree to our Terms & Conditions
          </p>
        </div>
      </div>
    </>
  );
};

export default Checkout;