// frontend/src/components/Auth/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Added useLocation
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
   const { dispatch } = useAuth(); // Renamed to avoid conflict with local 'login'
  const location = useLocation(); // Get the current location object

  // Extract the 'role' query parameter from the URL for the title hint
  const queryParams = new URLSearchParams(location.search);
  const requestedRole = queryParams.get('role');

  const getLoginTitle = () => {
    switch (requestedRole) {
      case 'normal_user':
        return 'Login as Normal User';
      case 'store_owner':
        return 'Login as Store Owner';
      case 'system_admin':
        return 'Login as System Administrator';
      default:
        return 'Login'; // Default title if no specific role is requested
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Call the single backend login endpoint
      const res = await api.post('/auth/login', { email, password });
      
      // Use the login function from AuthContext to set user state and local storage
      dispatch({ type: 'LOGIN', payload: res.data });
      // Redirect based on the role returned by the backend
      if (res.data.role === 'SYSTEM_ADMIN') {
        navigate('/admin/dashboard');
      } else if (res.data.role === 'NORMAL_USER') {
        navigate('/user/stores');
      } else if (res.data.role === 'STORE_OWNER') {
        navigate('/owner/dashboard');
      } else {
        // Fallback or error if an unrecognized role is returned
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{getLoginTitle()}</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>
            <Link to="/register" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              Don't have an account? Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
