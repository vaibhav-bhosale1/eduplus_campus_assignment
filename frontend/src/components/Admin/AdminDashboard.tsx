// frontend/src/components/Admin/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/admin/dashboard-stats');
        setStats(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Dashboard</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading dashboard data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
            <p className="text-5xl font-bold text-blue-600 mt-2">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-700">Total Stores</h3>
            <p className="text-5xl font-bold text-green-600 mt-2">{stats.totalStores}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-700">Total Ratings</h3>
            <p className="text-5xl font-bold text-purple-600 mt-2">{stats.totalRatings}</p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center justify-center text-center"
        >
          <h3 className="text-xl font-semibold text-gray-700">Manage Users</h3>
          <p className="text-gray-500 mt-2">Add, view, and filter users.</p>
        </Link>
        <Link
          to="/admin/stores"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center justify-center text-center"
        >
          <h3 className="text-xl font-semibold text-gray-700">Manage Stores</h3>
          <p className="text-gray-500 mt-2">Add, view, and filter stores.</p>
        </Link>
        {/* Potentially add more links here for other admin actions */}
      </div>
    </div>
  );
};

export default AdminDashboard;