import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, isAuthenticated, getCurrentUser, setCurrentUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    if (isAuthenticated()) {
      const savedUser = getCurrentUser();
      if (savedUser) {
        setUser(savedUser);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.auth.login(credentials);
      setUser(response.user);
      setCurrentUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.auth.register(userData);
      setUser(response.user);
      setCurrentUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
    setCurrentUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};