// frontend/src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-8">
   
      <div className="max-w-4xl w-full text-center py-16 px-6 rounded-lg shadow-xl bg-white/90 backdrop-blur-sm border border-gray-100">
        
       
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
          Store Ratings <span className="text-blue-600">Platform</span>
        </h1>
       

        {isAuthenticated ? (
        
          <div className="mt-8">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              Welcome, <span className="text-blue-600">{user?.name}</span> ({user?.role ? user.role.replace('_', ' ') : 'Unknown role'})
            </h2>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              {user?.role === 'SYSTEM_ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-1"
                >
                  Go to Admin Dashboard
                </Link>
              )}
              {user?.role === 'NORMAL_USER' && (
                <Link
                  to="/user/stores"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-1"
                >
                  Browse Stores
                </Link>
              )}
              {user?.role === 'STORE_OWNER' && (
                <Link
                  to="/owner/dashboard"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-1"
                >
                  View Your Store Dashboard
                </Link>
              )}
            </div>
          </div>
        ) : (
          
<div className="mt-10 text-center">
  <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
    Join the experience today.
  </h2>
  <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
    Rate your favorite stores, discover hidden gems, or manage your own storefront – all in one place.
  </p>

  <div className="flex flex-col sm:flex-row justify-center gap-4">
    <Link
      to="/register"
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-1"
    >
      Register Now
    </Link>
    <Link
      to="/login"
      className="bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-1"
    >
      Sign In
    </Link>
  </div>
</div>

        
        )}
      </div>
    </div>
  );
};

export default HomePage;
