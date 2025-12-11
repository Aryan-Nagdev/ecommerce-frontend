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
    pincode: "",
  });

  const orderItems = cart.map((item) => ({
    productId: item.productId._id,
    title: item.productId.title,
    price: item.productId.price,
    image: item.productId.images?.[0] || "",
    qty: item.qty,
  }));

  const subtotal = totalPrice();
  const discount = subtotal * 0.1;
  const finalTotal = Math.max(0, Math.round(subtotal - discount));

  const handlePayment = async () => {
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error("Please fill in all address fields");
      return;
    }

    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        "https://ecommerce-backend-k7re.onrender.com/api/order/place",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            items: orderItems,
            total: finalTotal,
            address,
          }),
        }
      );

      const data = await res.json();
      console.log("Order response:", data);

      // Backend responds with message: "Success"
      if (data.message === "Success") {
        await clearCart();
        toast.success("Order placed successfully!");
        navigate("/order-confirm");
      } else {
        toast.error(data.message || "Order failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    }
  };

  const handleChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>

          <div className="space-y-5">
            <input
              name="street"
              value={address.street}
              onChange={handleChange}
              placeholder="Street address"
              className="w-full p-4 border rounded-lg"
            />

            <input
              name="city"
              value={address.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full p-4 border rounded-lg"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                name="state"
                value={address.state}
                onChange={handleChange}
                placeholder="State"
                className="p-4 border rounded-lg"
              />

              <input
                name="pincode"
                value={address.pincode}
                maxLength={6}
                onChange={handleChange}
                placeholder="Pincode"
                className="p-4 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          <div className="max-h-96 overflow-y-auto space-y-4">
            {cart.map((item, i) => (
              <div
                key={i}
                className="flex justify-between border-b pb-3 text-lg"
              >
                <span>{item.productId.title}</span>
                <span>
                  ₹{(item.productId.price * item.qty).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 space-y-3 text-lg">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Special Discount (10%)</span>
              <span>-₹{discount.toFixed(0)}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Shipping</span>
              <span>FREE</span>
            </div>

            <div className="flex justify-between font-bold text-2xl border-t pt-3">
              <span>Total</span>
              <span className="text-orange-600">
                ₹{finalTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full mt-8 bg-orange-600 text-white py-5 rounded-lg font-bold text-xl hover:bg-orange-700"
          >
            Complete Order & Pay ₹{finalTotal.toLocaleString("en-IN")}
          </button>
        </div>
      </div>
    </>
  );
};

export default Checkout;
