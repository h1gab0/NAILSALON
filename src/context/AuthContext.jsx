import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      if (window.location.pathname === '/admin') {
        navigate('/login');
      }
    }
  };

  // Session monitoring
  useEffect(() => {
    let heartbeatInterval;
    let inactivityTimeout;

    const checkSession = async () => {
      try {
        const response = await fetch('/api/admin/heartbeat', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          setUser(null);
          if (window.location.pathname === '/admin') {
            navigate('/login');
          }
          if (inactivityTimeout) {
            clearTimeout(inactivityTimeout);
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setUser(null);
      }
    };

    const resetInactivityTimer = () => {
      if (inactivityTimeout) {
        clearTimeout(inactivityTimeout);
      }
      inactivityTimeout = setTimeout(() => {
        logout();
      }, 2 * 60 * 1000); // 2 minutes
    };

    if (user) {
      window.addEventListener('mousemove', resetInactivityTimer);
      window.addEventListener('keypress', resetInactivityTimer);
      resetInactivityTimer();
      heartbeatInterval = setInterval(checkSession, 30000);
    }

    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
      if (inactivityTimeout) {
        clearTimeout(inactivityTimeout);
      }
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keypress', resetInactivityTimer);
    };
  }, [user, navigate]);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch('/api/admin/verify', {
          credentials: 'include',
        });
        
        if (response.status === 401) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setIsAuthenticated(true);
        setUser(data.user);
      } catch (error) {
        console.error('Session verification error:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    verifySession();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const userData = await response.json();
      setUser(userData);
      navigate('/admin');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};