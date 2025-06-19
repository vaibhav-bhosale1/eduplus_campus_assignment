// frontend/src/components/Admin/RatingManagement.tsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface Rating {
  id: string;
  value: number;
  comment?: string; // Assuming you might have comments on ratings
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  store: {
    id: string;
    name: string;
    address: string;
  };
}

const RatingManagement: React.FC = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // No filters or sorting yet, but can be added similarly to User/Store Management
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');


  const fetchRatings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/admin/ratings?sortField=${sortField}&sortOrder=${sortOrder}`);
      setRatings(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch ratings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [sortField, sortOrder]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Rating Management</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p className="text-center text-gray-600">Loading ratings...</p>
      ) : ratings.length === 0 ? (
        <p className="text-center text-gray-600">No ratings found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('value')}
                >
                  Rating Value {sortField === 'value' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('store.name')} // Sorting by nested fields requires backend support or client-side sort
                >
                  Store Name {sortField === 'store.name' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('user.name')} // Sorting by nested fields requires backend support or client-side sort
                >
                  User Name {sortField === 'user.name' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  Date {sortField === 'createdAt' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ratings.map((rating) => (
                <tr key={rating.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{rating.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{rating.store.name} ({rating.store.address})</td>
                  <td className="px-6 py-4 whitespace-nowrap">{rating.user.name} ({rating.user.email})</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(rating.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RatingManagement;
