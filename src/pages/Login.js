// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back to ShopKaro!');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      toast.error('Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-orange-600">ShopKaro</h1>
          <p className="text-gray-600 mt-3 text-xl">Welcome Back!</p>
        </div>

        {error && <p className="text-red-600 text-center bg-red-50 p-4 rounded-xl mb-6 font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition text-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition text-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white font-bold text-xl py-6 rounded-2xl hover:bg-orange-700 transition disabled:opacity-70 shadow-lg"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600 text-lg">
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="text-orange-600 font-bold hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;