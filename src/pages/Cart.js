// src/pages/Cart.js
import React from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, updateQty, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (!cart) {
    return (
      <>
        <Navbar />
        <div className="text-center py-32 text-3xl">Loading cart...</div>
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="text-center py-32">
          <h2 className="text-4xl font-bold mb-8 text-gray-700">Your cart is empty</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-orange-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </>
    );
  }

  const subtotal = totalPrice();
  const discount = subtotal * 0.1;
  const total = Math.round(subtotal - discount);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold text-center mb-16 text-orange-600">
          Shopping Cart ({cart.length} items)
        </h1>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            {cart.map((item, idx) => {
              // normalized shape: item.productId exists
              const product = item.productId || {
                _id: item._id,
                title: item.title,
                price: item.price,
                images: item.images,
              };

              const imageUrl = product.images?.[0] || "https://via.placeholder.com/200?text=No+Image";

              return (
                <div
                  key={product._id || idx}
                  className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col sm:flex-row gap-8 hover:shadow-3xl transition-all"
                >
                  <img
                    src={imageUrl}
                    alt={product.title}
                    className="w-44 h-44 rounded-2xl object-cover border-4 border-gray-100"
                    onError={(e) => e.target.src = "https://via.placeholder.com/200?text=No+Image"}
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{product.title}</h3>
                      <p className="text-4xl font-bold text-orange-600 mt-4">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 mt-6">
                      <button
                        onClick={() => item.qty > 1 && updateQty(product._id, item.qty - 1)}
                        className="w-14 h-14 rounded-full bg-gray-200 text-3xl font-bold hover:bg-gray-300 transition"
                      >−</button>

                      <span className="text-3xl font-bold w-20 text-center">{item.qty}</span>

                      <button
                        onClick={() => updateQty(product._id, item.qty + 1)}
                        className="w-14 h-14 rounded-full bg-gray-200 text-3xl font-bold hover:bg-gray-300 transition"
                      >+</button>

                      <button
                        onClick={() => removeFromCart(product._id)}
                        className="ml-auto text-red-600 font-bold text-lg hover:text-red-800 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl shadow-2xl p-10 sticky top-8 h-fit">
            <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">Order Summary</h2>

            <div className="space-y-6 text-xl">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Special Discount (10%)</span>
                <span>-₹{discount.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Shipping</span>
                <span className="font-medium">FREE</span>
              </div>
              <div className="border-t-4 border-dashed border-orange-300 pt-8 mt-8">
                <div className="flex justify-between text-3xl font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-orange-600 text-white py-6 mt-10 rounded-3xl text-2xl font-bold hover:bg-orange-700 transform hover:scale-105 transition shadow-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
