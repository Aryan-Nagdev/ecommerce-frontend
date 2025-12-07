import React from 'react';
import { products } from '../data/products';

const Comparison = () => {
    // Mock selected products for comparison
    const product1 = products[0]; 
    const product2 = products[1]; 
    const product3 = products[2]; 

    // Combine specs keys from all products for comprehensive comparison
    const allSpecsKeys = [
        ...new Set([
            ...Object.keys(product1.specs),
            ...Object.keys(product2.specs),
            ...Object.keys(product3.specs),
        ])
    ];

    const comparisonList = [product1, product2, product3];

    const formatPrice = (price) => `$${price.toFixed(2)}`;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-heading font-extrabold text-gray-900 mb-10">
                Product Comparison Center ⚖️
            </h1>

            <div className="overflow-x-auto bg-white rounded-2xl shadow-3xl border border-gray-100">
                <table className="min-w-full divide-y divide-gray-300">
                    {/* Table Header: Product Names/Images */}
                    <thead>
                        <tr className="bg-primary-indigo text-white shadow-lg">
                            <th className="w-48 px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Feature</th>
                            {comparisonList.map((p, index) => (
                                <th key={index} className="w-1/4 px-6 py-4 text-center text-lg font-heading font-extrabold uppercase tracking-wider border-l border-indigo-dark/50">
                                    <img src={p.image} alt={p.name} className="h-20 w-auto object-contain mx-auto mb-2 rounded-lg" />
                                    {p.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {/* Row: Price */}
                        <tr className="bg-indigo-50/50">
                            <td className="px-6 py-4 font-bold text-gray-900">Price</td>
                            {comparisonList.map((p, index) => (
                                <td key={`price-${index}`} className="px-6 py-4 text-center text-3xl font-extrabold text-primary-indigo border-l border-gray-200">
                                    {formatPrice(p.price)}
                                </td>
                            ))}
                        </tr>

                        {/* Row: Rating */}
                        <tr>
                            <td className="px-6 py-4 font-medium text-gray-700">Customer Rating</td>
                            {comparisonList.map((p, index) => (
                                <td key={`rating-${index}`} className="px-6 py-4 text-center font-bold text-lg border-l border-gray-200">
                                    <span className="text-yellow-500">{'⭐'.repeat(Math.round(p.rating))}</span> ({p.rating.toFixed(1)})
                                </td>
                            ))}
                        </tr>

                        {/* Row: Category */}
                         <tr>
                            <td className="px-6 py-4 font-medium text-gray-700">Category</td>
                            {comparisonList.map((p, index) => (
                                <td key={`category-${index}`} className="px-6 py-4 text-center text-sm font-semibold text-primary-indigo border-l border-gray-200">
                                    {p.category}
                                </td>
                            ))}
                        </tr>

                        {/* --- Dynamic Specs Rows --- */}
                        <tr className="bg-gray-100">
                            <td colSpan={comparisonList.length + 1} className="px-6 py-3 text-lg font-heading font-bold text-gray-900 border-t border-b border-gray-300">Technical Specifications</td>
                        </tr>

                        {allSpecsKeys.map((key, index) => (
                            <tr key={key} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                                <td className="px-6 py-3 font-semibold text-gray-700 capitalize">{key.replace('_', ' ')}</td>
                                {comparisonList.map((p, pIndex) => (
                                    <td key={`${key}-${pIndex}`} className="px-6 py-3 text-center text-gray-900 border-l border-gray-200">
                                        {p.specs[key] || <span className="text-red-400 font-medium">N/A</span>}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Action Row */}
            <div className="mt-10 pt-6 border-t border-gray-200 flex justify-center space-x-6">
                {comparisonList.map((p, index) => (
                    <button
                        key={`action-${index}`}
                        className="py-3 px-6 bg-accent-green text-white font-bold rounded-lg hover:bg-green-600 transition duration-300 shadow-lg text-lg transform hover:scale-[1.02] max-w-xs"
                        onClick={() => console.log(`Buy Now: ${p.name}`)}
                    >
                        Buy {p.name.split(' ')[0]}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Comparison;