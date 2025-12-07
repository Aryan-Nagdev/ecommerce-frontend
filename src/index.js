// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';  // ← Added

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <App />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 2000,
            style: {
              background: '#333',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '500',
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);