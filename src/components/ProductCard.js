// src/components/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // THIS IS THE ONLY FIX NEEDED — send _id as string!
    addToCart(
      {
        ...product,
        _id: product._id.toString(), // ← FORCE STRING
      },
      1
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group">
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/300?text=No+Image"}
            alt={product.title}
            className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
            onError={(e) => e.target.src = "https://via.placeholder.com/300?text=No+Image"}
          />

          {product.discountPercent > 0 && (
            <span className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-bold text-lg text-gray-800 hover:text-orange-600 transition line-clamp-2">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex text-yellow-500 text-sm">★★★★☆</div>
          <span className="text-gray-600 text-sm">(892)</span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-2xl font-bold text-orange-600">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.mrp > product.price && (
            <span className="text-gray-500 line-through text-lg">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-4 w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition transform hover:scale-105 shadow-md"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;