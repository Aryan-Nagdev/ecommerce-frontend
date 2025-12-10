// src/pages/Home.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { 
  Laptop, 
  Shirt, 
  Home, 
  Dumbbell, 
  Sparkles, 
  Smartphone, 
  Tv, 
  BookOpen,
  TrendingUp
} from "lucide-react";

const categories = [
  { name: "Electronics", icon: Laptop },
  { name: "Fashion", icon: Shirt },
  { name: "Home & Living", icon: Home },
  { name: "Sports", icon: Dumbbell },
  { name: "Beauty", icon: Sparkles },
  { name: "Mobiles", icon: Smartphone },
  { name: "Appliances", icon: Tv },
  { name: "Books", icon: BookOpen }
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    fetch("https://ecommerce-backend-k7re.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  const scrollToCategories = () => {
    document.getElementById("shop-by-category")?.scrollIntoView({ behavior: "smooth" });
  };

  const getSortedProducts = () => {
    const sorted = [...products];
    switch (sortBy) {
      case "priceLow":
        return sorted.sort((a, b) => a.price - b.price);
      case "priceHigh":
        return sorted.sort((a, b) => b.price - a.price);
      case "discount":
        return sorted.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
      default:
        return sorted;
    }
  };

  const sortedProducts = getSortedProducts();

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white py-28 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl">
            BIG BILLION DAYS
          </h1>
          <p className="text-2xl md:text-4xl mb-10 font-light opacity-90">
            Up to 80% OFF • Free Shipping • Easy Returns
          </p>
          <button
            onClick={scrollToCategories}
            className="bg-white text-orange-600 px-16 py-6 rounded-full text-2xl font-bold hover:scale-105 transition-all shadow-2xl"
          >
            SHOP NOW
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Shop by Category */}
        <section id="shop-by-category" className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Shop by Category
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  className="group text-center"
                >
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-20 h-20 md:w-24 md:h-24 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                    <Icon size={40} className="text-purple-700" />
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition">
                    {cat.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Trending Products */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <TrendingUp size={40} className="text-orange-600" />
            Trending Products
          </h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-6 py-3 border border-gray-300 rounded-xl font-medium focus:outline-none focus:border-orange-500 shadow-sm"
          >
            <option value="relevance">Most Relevant</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-6" />
            <p className="text-2xl text-gray-500">Loading amazing deals...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <button className="bg-orange-600 text-white px-14 py-5 rounded-full text-xl font-bold hover:bg-orange-700 transition shadow-lg hover:scale-105">
            Load More Products
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;