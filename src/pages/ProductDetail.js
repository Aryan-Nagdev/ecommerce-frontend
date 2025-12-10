// src/pages/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch(`https://ecommerce-backend-k7re.onrender.com/api/products/${id}`)
      .then(r => r.json())
      .then(setProduct)
      .catch(() => toast.error("Failed to load product"));
  }, [id]);

  if (!product) return (
    <>
      <Navbar />
      <div className="text-center py-32">
        <h1 className="text-4xl font-bold text-red-600 mb-8">Product Not Found</h1>
        <button onClick={() => navigate('/')} className="bg-orange-600 text-white px-10 py-4 rounded-xl text-xl font-bold hover:bg-orange-700">
          Back to Home
        </button>
      </div>
    </>
  );

  // FIXED — only ONE call to addToCart with qty
  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`Added ${qty} item(s) to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    toast.success("Redirecting to checkout...");
    navigate('/checkout');
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Product Image */}
          <div className="flex justify-center">
            <img
              src={product.images?.[0] || product.image || "https://via.placeholder.com/500"}
              alt={product.title}
              className="w-full max-w-lg h-auto object-contain rounded-2xl shadow-2xl bg-gray-50"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">{product.title}</h1>

              <div className="flex items-center gap-4 mt-4">
                <span className="text-4xl font-bold text-green-600">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg">
                      {product.discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">{product.description}</p>

            <div className="space-y-3 text-gray-600">
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>In Stock:</strong> {product.stock} units</p>
              <p><strong>SKU:</strong> {product.sku}</p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-6">
              <span className="text-xl font-semibold">Quantity:</span>
              <div className="flex items-center border-2 border-orange-500 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-6 py-3 text-2xl hover:bg-orange-50 transition font-bold"
                >
                  −
                </button>
                <span className="px-8 py-3 text-2xl font-bold bg-orange-50 min-w-[80px] text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-6 py-3 text-2xl hover:bg-orange-50 transition font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-6">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-3 bg-orange-600 text-white py-5 px-10 rounded-xl text-xl font-bold hover:bg-orange-700 transition shadow-xl flex-1"
              >
                <ShoppingCart size={28} />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="bg-pink-600 text-white py-5 px-10 rounded-xl text-xl font-bold hover:bg-pink-700 transition shadow-xl flex-1"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
