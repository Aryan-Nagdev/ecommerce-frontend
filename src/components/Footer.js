import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">About Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Our Story</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Customer Care</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Contact Us</li>
              <li>Returns</li>
              <li>Track Order</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Shipping Info</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          © 2025 EliteShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;