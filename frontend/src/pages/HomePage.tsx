// frontend/src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to Store Ratings!</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
        Your platform to discover, rate, and manage stores.
      </p>

      {isAuthenticated ? (
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-4">You are logged in as <span className="font-semibold">{user?.role ? user.role.replace('_', ' ') : 'Unknown Role'
}</span>.</p>
          {user?.role === 'SYSTEM_ADMIN' && (
            <Link to="/admin/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg text-lg transition duration-300">
              Go to Admin Dashboard
            </Link>
          )}
          {user?.role === 'NORMAL_USER' && (
            <Link to="/user/stores" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg text-lg transition duration-300">
              Browse Stores
            </Link>
          )}
          {user?.role === 'STORE_OWNER' && (
            <Link to="/owner/dashboard" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg text-lg transition duration-300">
              View Your Store Dashboard
            </Link>
          )}
        </div>
      ) : (
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg text-lg transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg text-lg transition duration-300"
          >
            Register as a Normal User
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;