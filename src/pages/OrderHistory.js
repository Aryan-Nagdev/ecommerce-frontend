// src/pages/OrderHistory.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/api/orders/history/${user.id}`)
      .then(r => r.json())
      .then(data => setOrders(data))
      .catch(() => setOrders([]));
  }, [user]);

  if (!user) {
    return <div className="text-center py-20 text-3xl">Please login first</div>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-10 text-center">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No orders yet</p>
            <a href="/" className="mt-6 inline-block bg-orange-600 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-700">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-bold text-lg">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-6 items-center">
                      <img
                        src={item.image || "https://via.placeholder.com/100"}
                        alt={item.title}
                        className="w-24 h-24 rounded-lg object-cover border"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-gray-600">Qty: {item.qty} × ₹{item.price?.toLocaleString('en-IN')}</p>
                      </div>
                      <p className="font-bold text-xl">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      Total: ₹{Math.round(order.total).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-bold">
                    {order.status || "Delivered"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderHistory;