import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderConfirm = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl text-center p-12 max-w-lg">

          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={60} className="text-green-600" />
          </div>

          <h1 className="text-4xl font-bold text-green-600 mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-700 mb-8">Thank you for shopping with ShopKaro!</p>

          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-2xl font-bold">11MC68ZRG</p>
          </div>

          <p>Estimated Delivery: <strong>Friday, December 5</strong></p>

          <div className="mt-10 space-x-4">
            <Link to="/" className="bg-primary text-white px-10 py-4 rounded-lg font-bold">
              Continue Shopping
            </Link>
            <button className="border px-8 py-4 rounded-lg">
              Track Order
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default OrderConfirm;
