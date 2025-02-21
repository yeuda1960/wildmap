import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL, ENDPOINTS } from '../config/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.baseURL = API_BASE_URL;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          checkAuthStatus();
        } else {
          localStorage.removeItem('token');
          setLoading(false);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(ENDPOINTS.AUTH.USER);
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(ENDPOINTS.AUTH.LOGIN, { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error.response || error);
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to the server. Please try again later.');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('Attempting to register with:', { username, email });
      const response = await axios.post(ENDPOINTS.AUTH.REGISTER, {
        username,
        email,
        password
      });
      console.log('Registration response:', response.data);
      return true;
    } catch (error) {
      console.error('Registration error details:', {
        code: error.code,
        message: error.message,
        response: error.response,
        stack: error.stack
      });
      
      // Network or server connection errors
      if (error.code === 'ECONNREFUSED' || !error.response) {
        throw new Error('Cannot connect to the server (http://localhost:5000). Please make sure the backend server is running.');
      }
      
      if (error.response) {
        const { status, data } = error.response;
        console.log('Server error response:', { status, data });
        
        switch (status) {
          case 400:
            if (data.error?.includes('Email')) {
              throw new Error('This email is already registered. Please use a different email or try logging in.');
            } else if (data.error?.includes('Username')) {
              throw new Error('This username is already taken. Please choose a different username.');
            } else if (data.error?.includes('Password')) {
              throw new Error('Password must be at least 6 characters long and contain at least one number.');
            } else {
              throw new Error(data.error || 'Invalid registration data. Please check your input.');
            }
          case 422:
            throw new Error('Invalid email format or password too weak. Please check your input.');
          case 500:
            throw new Error('Server error. Please try again later or contact support if the problem persists.');
          default:
            throw new Error(data.error || `Registration failed (Status: ${status}). Please try again.`);
        }
      }
      
      // If we get here, it's likely a network error
      throw new Error(`Connection failed: ${error.message}. Please check your internet connection and make sure the backend server is running at http://localhost:5000`);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 