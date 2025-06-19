import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin, isNormalUser, isStoreOwner } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            RateNest
          </Link>

          {/* Right Menu */}
          <div className="flex items-center space-x-4 text-sm font-medium">
            
            {isAuthenticated ? (
  <>
    {/* Greeting and Dropdown */}
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition focus:outline-none"
      >
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A3 3 0 017.88 16h8.24a3 3 0 012.758 1.804M12 12a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
        <span className="hidden sm:inline font-medium">{user?.name}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <Link
            to="/update-password"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Update Password
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>

    {/* Role-specific Dashboards */}
    {isAdmin && (
      <Link to="/admin/dashboard" className="text-gray-700 hover:text-indigo-600 transition">Dashboard</Link>
    )}
    {isNormalUser && (
      <Link to="/user/stores" className="text-gray-700 hover:text-green-600 transition">Browse</Link>
    )}
    {isStoreOwner && (
      <Link to="/owner/dashboard" className="text-gray-700 hover:text-purple-600 transition">Dashboard</Link>
    )}
  </>
) : (
  <>
    <Link to="/login" className="text-indigo-600 hover:text-indigo-800 transition">
      Login
    </Link>
    <Link to="/register" className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition">
      Register
    </Link>
  </>
)}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
