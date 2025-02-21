import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.timeout = parseInt(process.env.REACT_APP_API_TIMEOUT) || 5000;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
};

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Making request to:', config.url, {
        method: config.method,
        params: config.params,
        data: config.data
      });
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Received response from:', response.config.url, {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out');
      error.message = 'The request timed out. Please check if the backend server is running.';
    } else if (!error.response) {
      console.error('Network error:', error);
      error.message = 'Cannot connect to the server. Please check if the backend server is running.';
    } else {
      console.error('Response error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data
      });
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    USER: '/api/auth/user'
  },
  ANIMALS: {
    LIST: '/api/all-animals',
    DETAIL: (id) => `/api/animals/${id}`
  },
  REGIONS: {
    LIST: '/api/regions',
    DETAIL: (id) => `/api/regions/${id}`
  }
}; 