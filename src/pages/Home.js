// src/pages/Home.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

// REAL categories from your MongoDB database
const categories = [
  { name: "Electronics", icon: "💻" },
  { name: "Fashion", icon: "👕" },
  { name: "Home & Living", icon: "🏠" },
  { name: "Sports", icon: "🏋️" },
  { name: "Beauty", icon: "✨" },
  { name: "Mobiles", icon: "📱" },
  { name: "Appliances", icon: "📺" },
  { name: "Books", icon: "📚" }
];

const Home = () => {
  const [products, setProducts] = useState([]);

  // Load trending products
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  const scrollToCategories = () => {
    const el = document.getElementById("shop-by-category");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 via-pink-600 to-purple-700 text-white py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">
          BIG BILLION DAYS
        </h1>
        <p className="text-2xl md:text-3xl mb-10 font-medium">
          Up to 80% OFF • Free Shipping • Easy Returns
        </p>

        <button
          onClick={scrollToCategories}
          className="inline-block bg-white text-orange-600 px-12 py-6 rounded-full text-2xl font-bold hover:scale-110 transition shadow-2xl transform hover:shadow-orange-500/50"
        >
          SHOP NOW
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* CATEGORY SECTION */}
        <div id="shop-by-category">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 mb-20">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={`/category/${encodeURIComponent(cat.name)}`}
                className="text-center group transform hover:scale-110 transition duration-300"
              >
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-24 h-24 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-xl group-hover:shadow-2xl">
                  <div className="text-purple-700 text-4xl">{cat.icon}</div>
                </div>

                <p className="font-bold text-gray-800 text-sm">{cat.name}</p>

                {/* Removed wrong fake counts */}
                <p className="text-xs text-gray-500">&nbsp;</p>
              </Link>
            ))}
          </div>
        </div>

        {/* TRENDING PRODUCTS */}
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Trending Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.length === 0 ? (
            <p className="col-span-full text-center text-2xl text-gray-500">
              Loading amazing deals...
            </p>
          ) : (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>

        <div className="text-center mt-16 mb-12">
          <button className="bg-orange-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-orange-700 transition shadow-lg transform hover:scale-105">
            Load More Products
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
