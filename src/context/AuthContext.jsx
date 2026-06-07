import { createContext, useState, useContext, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage on mount
    const storedUser = localStorage.getItem('userSession');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored session");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axiosClient.post('/auth/login', { username, password });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('userSession', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userSession');
  };

  const getCurrentUser = () => user;

  if (loading) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-900"></div>; // Prevents flashing
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
