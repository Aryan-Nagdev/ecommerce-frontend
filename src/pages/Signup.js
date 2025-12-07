// src/pages/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await signup(form.name, form.email, form.phone, form.password);
      alert('Account created & logged in successfully!');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed. Try different email.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-600">ShopKaro</h1>
          <p className="text-gray-600 mt-2 text-lg">India Ka Apna Store</p>
        </div>

        <h2 className="text-3xl font-bold text-center mb-8">Create Your Account</h2>

        {error && <p className="text-red-600 text-center bg-red-50 p-3 rounded-lg mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input name="name" placeholder="Full Name" className="w-full px-5 py-4 border rounded-xl" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email Address" className="w-full px-5 py-4 border rounded-xl" value={form.email} onChange={handleChange} required />
          <input name="phone" type="tel" placeholder="Phone Number" className="w-full px-5 py-4 border rounded-xl" value={form.phone} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Create Password" className="w-full px-5 py-4 border rounded-xl" value={form.password} onChange={handleChange} required />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" className="w-full px-5 py-4 border rounded-xl" value={form.confirmPassword} onChange={handleChange} required />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white font-bold text-xl py-5 rounded-xl hover:bg-orange-700 transition disabled:opacity-70"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-orange-600 font-bold hover:underline">
            Login Here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;