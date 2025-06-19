// frontend/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString); 
        const token = user.token; 

        if (token) {
          config.headers.Authorization = `Bearer ${token}`; 
          console.log('DEBUG (Frontend API Interceptor): Token found and attached.');
        } else {
          console.log('DEBUG (Frontend API Interceptor): User object found, but no token property.');
        }
      } catch (e) {
        console.error('ERROR (Frontend API Interceptor): Failed to parse user from localStorage:', e);
      }
    } else {
      console.log('DEBUG (Frontend API Interceptor): No "user" found in localStorage.');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
