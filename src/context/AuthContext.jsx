import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const MOCK_USER = { username: 'admin', password: 'password123' };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username, password) => {
    if (username === MOCK_USER.username && password === MOCK_USER.password) {
      const user = { username, role: 'admin' };
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};