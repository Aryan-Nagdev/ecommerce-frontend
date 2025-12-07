import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handlePayment = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/order/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          items: cart,
          total: totalPrice,
          address
        })
      });

      const data = await res.json();

      // ✅ Backend returns: { message: "Success" }
      if (data.message === "Success") {
        clearCart();
        toast.success("Order placed successfully!");
        navigate("/order-confirm");
      } else {
        toast.error("Failed to place order.");
      }

    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  const handleChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-10">

        {/* Address Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>

          <form className="space-y-4">
            <input name="street" placeholder="Street Address" className="w-full p-4 border rounded-lg" onChange={handleChange} />
            <input name="city" placeholder="City" className="w-full p-4 border rounded-lg" onChange={handleChange} />
            <input name="state" placeholder="State" className="w-full p-4 border rounded-lg" onChange={handleChange} />
            <input name="pincode" placeholder="Pincode" className="w-full p-4 border rounded-lg" onChange={handleChange} />
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          {cart.map(item => (
            <div key={item._id} className="flex justify-between mb-3">
              <span>{item.title} × {item.qty}</span>
              <span>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
            </div>
          ))}

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-green-600">
              <span>Discount (10%)</span>
              <span>-₹{(totalPrice * 0.1).toFixed(0)}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Shipping</span>
              <span>FREE</span>
            </div>

            <div className="flex justify-between text-xl font-bold border-t pt-4">
              <span>Total</span>
              <span>₹{(totalPrice * 0.9).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-primary text-white py-5 mt-8 rounded-lg font-bold text-xl"
          >
            Complete Order
          </button>
        </div>

      </div>
    </>
  );
};

export default Checkout;
