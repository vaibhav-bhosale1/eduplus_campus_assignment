// frontend/src/components/StoreOwner/StoreOwnerDashboard.tsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface RatingUser {
  userId: string;
  userName: string;
  userEmail: string;
  ratingValue: number;
}

interface StoreOwnerDashboardData {
  storeId: string;
  storeName: string;
  averageRating: number;
  usersWhoRated: RatingUser[];
}

const StoreOwnerDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<StoreOwnerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/owner/dashboard');
        setDashboardData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Store Owner Dashboard</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading your store data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : dashboardData ? (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-center">
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Store: {dashboardData.storeName}</h3>
            <p className="text-xl text-gray-600">ID: {dashboardData.storeId}</p>
            <p className="text-5xl font-bold text-blue-600 mt-4">Average Rating: {dashboardData.averageRating}</p>
          </div>

          <h3 className="text-2xl font-bold mb-4 text-gray-800">Users Who Rated Your Store</h3>
          {dashboardData.usersWhoRated.length === 0 ? (
            <p className="text-center text-gray-600">No users have rated your store yet.</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.usersWhoRated.map((rating) => (
                    <tr key={rating.userId}>
                      <td className="px-6 py-4 whitespace-nowrap">{rating.userName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{rating.userEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{rating.ratingValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default StoreOwnerDashboard;