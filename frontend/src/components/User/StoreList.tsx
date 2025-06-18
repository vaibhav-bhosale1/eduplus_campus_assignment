// frontend/src/components/User/StoreList.tsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Store {
  id: string;
  name: string;
  address: string;
  overallRating: number | null;
  userSubmittedRating: number | null;
}

const StoreList: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [ratingToSubmit, setRatingToSubmit] = useState<Record<string, number>>({});
  const { isNormalUser } = useAuth();

  const fetchStores = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (searchName) params.append('name', searchName);
      if (searchAddress) params.append('address', searchAddress);
      params.append('sortField', sortField);
      params.append('sortOrder', sortOrder);

      const res = await api.get(`/users/stores?${params.toString()}`);
      setStores(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch stores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [searchName, searchAddress, sortField, sortOrder]); // Re-fetch on filter/sort change

  const handleRatingChange = (storeId: string, value: number) => {
    setRatingToSubmit(prev => ({ ...prev, [storeId]: value }));
  };

  const handleSubmitRating = async (storeId: string) => {
    const rating = ratingToSubmit[storeId];
    if (!rating || rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5.');
      return;
    }
    try {
      await api.post('/ratings', { storeId, value: rating });
      alert('Rating submitted successfully!');
      fetchStores(); // Refresh list to show updated rating
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit rating.');
    }
  };

  const handleModifyRating = async (storeId: string) => {
    const rating = ratingToSubmit[storeId];
    if (!rating || rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5.');
      return;
    }
    try {
      await api.put('/ratings', { storeId, value: rating });
      alert('Rating modified successfully!');
      fetchStores(); // Refresh list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to modify rating.');
    }
  };

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
      <h2 className="text-2xl font-bold mb-4">All Registered Stores</h2>

      <div className="mb-4 p-4 bg-white rounded-lg shadow-md flex space-x-4">
        <input
          type="text"
          placeholder="Search by Store Name"
          className="p-2 border rounded w-1/3"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Address"
          className="p-2 border rounded w-1/3"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
        />
        <button onClick={fetchStores} className="bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Loading stores...</p>
      ) : stores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                  Store Name {sortField === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('address')}>
                  Address {sortField === 'address' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overall Rating
                </th>
                {isNormalUser && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Your Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stores.map((store) => (
                <tr key={store.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{store.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{store.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {store.overallRating !== null ? store.overallRating : 'N/A'}
                  </td>
                  {isNormalUser && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {store.userSubmittedRating !== null ? store.userSubmittedRating : 'Not rated'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className="p-1 border rounded mr-2"
                          value={ratingToSubmit[store.id] || store.userSubmittedRating || ''}
                          onChange={(e) => handleRatingChange(store.id, parseInt(e.target.value))}
                        >
                          <option value="">Select Rating</option>
                          {[1, 2, 3, 4, 5].map((val) => (
                            <option key={val} value={val}>{val}</option>
                          ))}
                        </select>
                        {store.userSubmittedRating === null ? (
                          <button
                            onClick={() => handleSubmitRating(store.id)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
                          >
                            Submit
                          </button>
                        ) : (
                          <button
                            onClick={() => handleModifyRating(store.id)}
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-sm"
                          >
                            Modify
                          </button>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StoreList;