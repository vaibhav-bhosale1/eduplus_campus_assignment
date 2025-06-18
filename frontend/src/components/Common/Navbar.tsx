// frontend/src/components/Common/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin, isNormalUser, isStoreOwner } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Store Ratings</Link>
        <div>
          {isAuthenticated ? (
            <>
              <span className="mr-4">Welcome, {user?.name} ({user?.role.replace('_', ' ')})</span>
              {isAdmin && <Link to="/admin/dashboard" className="mr-4 hover:text-gray-300">Admin Dashboard</Link>}
              {isNormalUser && <Link to="/user/stores" className="mr-4 hover:text-gray-300">Browse Stores</Link>}
              {isStoreOwner && <Link to="/owner/dashboard" className="mr-4 hover:text-gray-300">Store Owner Dashboard</Link>}
              <Link to="/update-password" className="mr-4 hover:text-gray-300">Update Password</Link>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4 hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;