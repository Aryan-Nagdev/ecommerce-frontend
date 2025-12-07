import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group">

      {/* PRODUCT PAGE LINK */}
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden">

          {/* FIXED IMAGE → always loads images[0] */}
          <img
            src={product.images?.[0]}
            alt={product.title}
            className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
          />

          {/* Discount badge */}
          {product.discountPercent && (
            <span className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>
      </Link>

      <div className="p-5">
        {/* PRODUCT TITLE */}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-bold text-lg text-gray-800 hover:text-primary transition">
            {product.title}
          </h3>
        </Link>

        {/* Rating (Static for now) */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex text-yellow-500 text-sm">★★★★☆</div>
          <span className="text-gray-600 text-sm">(892)</span>
        </div>

        {/* PRICE SECTION */}
        <div className="mt-3">
          <span className="text-2xl font-bold text-primary">
            ₹{product.price.toLocaleString('en-IN')}
          </span>

          <span className="text-gray-500 line-through ml-3 text-lg">
            ₹{product.mrp.toLocaleString('en-IN')}
          </span>
        </div>

        {/* ADD TO CART */}
        <button
          onClick={() => addToCart(product)}
          className="mt-4 w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition transform hover:scale-105"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
