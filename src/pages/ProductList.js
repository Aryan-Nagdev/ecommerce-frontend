// src/pages/ProductList.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

const ProductList = () => {
  const { category } = useParams();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    setLoading(true);

    const formattedCategory = decodeURIComponent(category)
      .replace(/-/g, " ")
      .trim();

    fetch(
      `http://localhost:5000/api/products/category/${encodeURIComponent(
        formattedCategory
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        // FIX: Always use API result, never fallback to all products
        if (Array.isArray(data)) {
          setFilteredProducts(data);
        } else {
          setFilteredProducts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching category:", err);
        setFilteredProducts([]);
        setLoading(false);
      });
  }, [category]);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {category?.replace(/-/g, " ")}
        </h1>

        {loading ? (
          <p className="text-gray-500 text-xl">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-500 text-xl">
            No products found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
