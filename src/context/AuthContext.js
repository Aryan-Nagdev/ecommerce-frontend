import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('shopkaro_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (email, password) => {
    const res = await fetch('https://ecommerce-backend-k7re.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      localStorage.setItem('shopkaro_user', JSON.stringify(data.user));
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  const signup = async (name, email, phone, password) => {
    const res = await fetch('https://ecommerce-backend-k7re.onrender.com/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    });
    const data = await res.json();
    if (res.ok) {
      await login(email, password); // Auto login after signup
    } else {
      throw new Error(data.message || "Signup failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopkaro_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};