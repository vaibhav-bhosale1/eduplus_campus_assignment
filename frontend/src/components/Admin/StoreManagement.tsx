// frontend/src/components/Admin/StoreManagement.tsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: string | null; // <--- CHANGED: Now explicitly includes 'null'
  owner?: {
    id: string;
    name: string;
    email: string;
  } | null;
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

  // Add Store Modal States
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreEmail, setNewStoreEmail] = useState('');
  const [newStoreAddress, setNewStoreAddress] = useState('');
  const [newStoreOwnerId, setNewStoreOwnerId] = useState('');
  const [addStoreError, setAddStoreError] = useState('');
  const [addStoreSuccess, setAddStoreSuccess] = useState('');
  // Assuming you have a way to fetch store owners for the dropdown, e.g.,
  // const [storeOwners, setStoreOwners] = useState<{id: string; name: string}[]>([]);

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

  // Function to fetch store owners for the dropdown (if needed)
  /*
  const fetchStoreOwners = async () => {
    try {
      const res = await api.get('/admin/users?role=STORE_OWNER'); // Adjust API endpoint as needed
      setStoreOwners(res.data.map((user: any) => ({ id: user.id, name: user.name })));
    } catch (err) {
      console.error('Failed to fetch store owners:', err);
    }
  };
  */

  useEffect(() => {
    fetchStores();
    // fetchStoreOwners(); // Uncomment if you implement fetching store owners
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
      await api.post('/admin/stores', { // Fixed 'res' unused
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
      // fetchStoreOwners(); // Re-fetch owners in case new owner was created/assigned
    } catch (err: any) {
      setAddStoreError(err.response?.data?.message || 'Failed to add store.');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Store Management
          </h1>
          <p className="text-slate-600 text-lg">Oversee all registered stores and their details</p>
        </div>

        {/* Add Store Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowAddStoreModal(true)}
            className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white transition duration-300 ease-out border-2 border-blue-500 rounded-full shadow-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 hover:shadow-lg"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Store
            </span>
          </button>
        </div>

        {/* Add Store Modal */}
        {showAddStoreModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 transform transition-all duration-300 scale-100">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Add New Store</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              </div>
              
              {addStoreError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {addStoreError}
                </div>
              )}
              {addStoreSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  {addStoreSuccess}
                </div>
              )}
              
              <form onSubmit={handleAddStore} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Store Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-slate-50 hover:bg-white"
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    placeholder="Enter store name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-slate-50 hover:bg-white"
                    value={newStoreEmail}
                    onChange={(e) => setNewStoreEmail(e.target.value)}
                    placeholder="Enter store email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-slate-50 hover:bg-white"
                    value={newStoreAddress}
                    onChange={(e) => setNewStoreAddress(e.target.value)}
                    placeholder="Enter store address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Owner (Optional)</label>
                  <select
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-slate-50 hover:bg-white"
                    value={newStoreOwnerId}
                    onChange={(e) => setNewStoreOwnerId(e.target.value)}
                  >
                    <option value="">No Owner (Unassigned)</option>
                    {/* Render fetched store owners here */}
                    {/* {storeOwners.map(owner => (
                      <option key={owner.id} value={owner.id}>{owner.name}</option>
                    ))} */}
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddStoreModal(false)}
                    className="px-6 py-3 text-slate-600 hover:text-slate-800 font-semibold transition duration-200 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-200"
                  >
                    Add Store
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="mb-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            Filter Stores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by Name"
                className="w-full px-4 py-3 pl-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white/80 hover:bg-white"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
              <svg className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            
            <div className="relative">
              <input
                type="email"
                placeholder="Filter by Email"
                className="w-full px-4 py-3 pl-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white/80 hover:bg-white"
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
              />
              <svg className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by Address"
                className="w-full px-4 py-3 pl-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white/80 hover:bg-white"
                value={filterAddress}
                onChange={(e) => setFilterAddress(e.target.value)}
              />
              <svg className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-r-blue-300 animate-spin animation-delay-150"></div>
            </div>
            <span className="ml-4 text-slate-600 font-medium">Loading stores...</span>
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Stores Found</h3>
            <p className="text-slate-500">No stores match your current filter criteria.</p>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-blue-50 transition duration-200 group"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Store Name
                        <span className="ml-2 text-blue-500">
                          {sortField === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </span>
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-blue-50 transition duration-200 group"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                        <span className="ml-2 text-blue-500">
                          {sortField === 'email' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </span>
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-blue-50 transition duration-200 group"
                      onClick={() => handleSort('address')}
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Address
                        <span className="ml-2 text-blue-500">
                          {sortField === 'address' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Overall Rating
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Owner
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stores.map((store, _index) => ( // Fixed 'index' to '_index'
                    <tr key={store.id} className="hover:bg-blue-50/50 transition duration-200 group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                            {store.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-900">{store.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-slate-700">{store.email}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-slate-700">{store.address}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {store.averageRating !== null && store.averageRating !== 'N/A' ? ( // Check for both null and 'N/A'
                          <div className="flex items-center">
                            <div className="flex text-yellow-400 mr-2">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < Math.floor(parseFloat(store.averageRating || '0')) ? 'text-yellow-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20"> {/* <--- FIX HERE: parseFloat and fallback */}
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm font-medium text-slate-700">{store.averageRating}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">No ratings</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {store.owner ? (
                          <span className="font-medium text-slate-900">
                            {store.owner.name} ({store.owner.email}) {/* Accessing email here */}
                          </span>
                        ) : (
                          <span className="text-slate-500">Unassigned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreManagement;
