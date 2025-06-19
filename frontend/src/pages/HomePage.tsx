// frontend/src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background decoration */}
       <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23f3f4f6%22%20fill-opacity=%220.4%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>


        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-400 to-yellow-500 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 max-w-4xl">
            <div className="mb-6">
              <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 leading-tight">
                Store Ratings
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
              Your premium platform to discover, rate, and manage stores with elegance
            </p>
          </div>

          {isAuthenticated ? (
            <div className="text-center max-w-2xl">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                <p className="text-2xl text-gray-700 mb-2">Welcome back!</p>
                <p className="text-lg text-gray-600 mb-8">
                  You are logged in as{' '}
                  <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {user?.role ? user.role.replace('_', ' ') : 'Unknown role'}
                  </span>
                </p>

                <div className="space-y-4">
                  {user?.role === 'SYSTEM_ADMIN' && (
                    <Link to="/admin/dashboard" className="btn-blue">Go to Admin Dashboard</Link>
                  )}
                  {user?.role === 'NORMAL_USER' && (
                    <Link to="/user/stores" className="btn-green">Browse Stores</Link>
                  )}
                  {user?.role === 'STORE_OWNER' && (
                    <Link to="/owner/dashboard" className="btn-purple">View Your Store Dashboard</Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl w-full">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Get Started</h2>
                <p className="text-gray-600 mb-8">Join our community or sign in to continue</p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/register" className="btn-green">Register</Link>
                  <Link to="/login" className="btn-blue">Login</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
