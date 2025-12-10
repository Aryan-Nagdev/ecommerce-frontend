// src/pages/ProductList.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

const ProductList = () => {
  const { category } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    if (!category) return;

    setLoading(true);

    const formattedCategory = decodeURIComponent(category)
      .replace(/-/g, " ")
      .trim();

   fetch(`https://ecommerce-backend-k7re.onrender.com/api/products/category/${encodeURIComponent(formattedCategory)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFilteredProducts(data);
        } else {
          setFilteredProducts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching category:", err);
        toast.error("Failed to load products. Try again.");
        setFilteredProducts([]);
        setLoading(false);
      });
  }, [category]);

  // Sorting Logic
  const sortProducts = (products) => {
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

  const sortedProducts = sortProducts(filteredProducts);

  const pageTitle = category ? decodeURIComponent(category).replace(/-/g, " ") : "Products";

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header with Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold capitalize text-gray-800">
            {pageTitle}
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-5 py-3 border border-gray-300 rounded-lg font-medium focus:outline-none focus:border-orange-500"
            >
              <option value="relevance">Relevance</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-20 text-xl text-gray-600">Loading products...</p>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500 mb-6">No products found in this category.</p>
            <Link
              to="/"
              className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;