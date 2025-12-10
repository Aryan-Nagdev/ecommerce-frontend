import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);

  const cleanName = categoryName
    .replace(/-/g, ' ')
    .replace('home  living', 'Home & Living')
    .replace('beauty', 'Beauty')
    .replace('mobiles', 'Mobiles')
    .replace('appliances', 'Appliances')
    .replace('sports', 'Sports')
    .replace('books', 'Books');

  useEffect(() => {
    fetch(`https://ecommerce-backend-k7re.onrender.com/api/products?category=${cleanName}`)

      .then(r => r.json())
      .then(setFilteredProducts);
  }, [categoryName]);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 capitalize">
            {cleanName}
          </h1>
          <p className="text-xl text-gray-600 mt-4">
            {filteredProducts.length} Products Found
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl text-gray-500 mb-8">No products in this category yet</p>
            <Link
              to="/"
              className="bg-orange-600 text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-orange-700 transition"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPage;