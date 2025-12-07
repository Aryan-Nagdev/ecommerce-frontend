import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { ShoppingCart } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(r => r.json())
      .then(setProduct);
  }, [id]);

  if (!product) return (
    <>
      <Navbar />
      <div className="text-center py-32">
        <h1 className="text-4xl font-bold text-red-600">Product Not Found</h1>
        <button 
          onClick={() => navigate('/')} 
          className="mt-8 bg-orange-600 text-white px-8 py-4 rounded-xl text-xl"
        >
          Back to Home
        </button>
      </div>
    </>
  );

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    alert(`Added ${qty} item(s) to cart!`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    navigate('/checkout');
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            <img 
              src={product.images[0] || product.image} 
              alt={product.title}
              className="w-full rounded-2xl shadow-2xl object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">{product.title}</h1>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-4xl font-bold text-green-600">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-2xl text-gray-500 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg">
                  {product.discountPercent}% OFF
                </span>
              </div>
            </div>

            <p className="text-lg text-gray-700">{product.description}</p>

            <p>Brand: {product.brand}</p>
            <p>Stock: {product.stock} available</p>
            <p>SKU: {product.sku}</p>

            {/* QUANTITY */}
            <div className="flex items-center gap-6">
              <span className="text-xl font-semibold">Quantity:</span>
              <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-8 py-4 text-2xl hover:bg-gray-100 transition font-bold"
                >
                  −
                </button>
                <span className="px-10 py-4 text-2xl font-bold border-x-2 border-gray-300 min-w-[80px] text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-8 py-4 text-2xl hover:bg-gray-100 transition font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-6">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-3 bg-orange-600 text-white py-5 px-10 rounded-xl text-xl font-bold hover:bg-orange-700 transition shadow-xl"
              >
                <ShoppingCart size={28} />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-pink-600 text-white py-5 rounded-xl text-xl font-bold hover:bg-pink-700 transition shadow-xl"
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