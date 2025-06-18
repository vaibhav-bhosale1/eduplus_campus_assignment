// frontend/src/components/Admin/StoreManagement.tsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: string | null;
  ownerId?: string | null;
  owner?: {
    id: string;
    name: string;
  } | null;
}

interface User {
  id: string;
  name: string;
  role: string;
}

const StoreManagement: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterAddress, setFilterAddress] = useState('');

  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // New store form states
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreEmail, setNewStoreEmail] = useState('');
  const [newStoreAddress, setNewStoreAddress] = useState('');
  const [newStoreOwnerId, setNewStoreOwnerId] = useState('');
  const [addStoreError, setAddStoreError] = useState('');
  const [addStoreSuccess, setAddStoreSuccess] = useState('');
  const [storeOwners, setStoreOwners] = useState<User[]>([]); // To populate owner dropdown


  const fetchStores = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filterName) params.append('name', filterName);
      if (filterEmail) params.append('email', filterEmail);
      if (filterAddress) params.append('address', filterAddress);
      params.append('sortField', sortField);
      params.append('sortOrder', sortOrder);

      const res = await api.get(`/admin/stores?${params.toString()}`);
      setStores(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch stores.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreOwners = async () => {
    try {
      // Assuming you have an endpoint to get users with role STORE_OWNER
      const res = await api.get('/admin/users?role=STORE_OWNER');
      setStoreOwners(res.data);
    } catch (err) {
      console.error('Failed to fetch store owners:', err);
      // Optionally set an error for the modal here
    }
  };

  useEffect(() => {
    fetchStores();
    fetchStoreOwners();
  }, [filterName, filterEmail, filterAddress, sortField, sortOrder]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddStoreError('');
    setAddStoreSuccess('');

    try {
        const res = await api.post('/admin/stores', {
            name: newStoreName,
            email: newStoreEmail,
            address: newStoreAddress,
            ownerId: newStoreOwnerId || null, // Send null if no owner selected
        });
        setAddStoreSuccess('Store added successfully!');
        setShowAddStoreModal(false);
        setNewStoreName('');
        setNewStoreEmail('');
        setNewStoreAddress('');
        setNewStoreOwnerId('');
        fetchStores(); // Refresh store list
    } catch (err: any) {
        setAddStoreError(err.response?.data?.message || 'Failed to add store.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Store Management</h2>

      {/* Add Store Button */}
      <div className="mb-4 text-right">
        <button
          onClick={() => setShowAddStoreModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Add New Store
        </button>
      </div>

      {/* Add Store Modal */}
      {showAddStoreModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Store</h3>
            {addStoreError && <p className="text-red-500 mb-4">{addStoreError}</p>}
            {addStoreSuccess && <p className="text-green-500 mb-4">{addStoreSuccess}</p>}
            <form onSubmit={handleAddStore}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Store Name</label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Store Email</label>
                <input
                  type="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={newStoreEmail}
                  onChange={(e) => setNewStoreEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={newStoreAddress}
                  onChange={(e) => setNewStoreAddress(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Assign Owner (Optional)</label>
                <select
                  className="shadow border rounded w-full py-2 px-3 text-gray-700"
                  value={newStoreOwnerId}
                  onChange={(e) => setNewStoreOwnerId(e.target.value)}
                >
                  <option value="">No Owner</option>
                  {storeOwners.map(owner => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddStoreModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                  Add Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Filter by Store Name"
          className="p-2 border rounded"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Filter by Store Email"
          className="p-2 border rounded"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Address"
          className="p-2 border rounded"
          value={filterAddress}
          onChange={(e) => setFilterAddress(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p className="text-center text-gray-600">Loading stores...</p>
      ) : stores.length === 0 ? (
        <p className="text-center text-gray-600">No stores found matching your criteria.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                  Store Name {sortField === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('email')}>
                  Store Email {sortField === 'email' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('address')}>
                  Address {sortField === 'address' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overall Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stores.map((store) => (
                <tr key={store.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{store.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{store.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{store.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {store.averageRating !== null ? store.averageRating : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {store.owner ? store.owner.name : 'Unassigned'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StoreManagement;