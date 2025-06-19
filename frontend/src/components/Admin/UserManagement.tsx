// frontend/src/components/Admin/UserManagement.tsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: 'SYSTEM_ADMIN' | 'NORMAL_USER' | 'STORE_OWNER';
  storeAverageRating?: number | null;
  stores?: Array<{ id: string; name: string }>;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // New user form states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserAddress, setNewUserAddress] = useState('');
  const [newUserRole, setNewUserRole] = useState('NORMAL_USER');
  const [addUserError, setAddUserError] = useState('');
  const [addUserSuccess, setAddUserSuccess] = useState('');


  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filterName) params.append('name', filterName);
      if (filterEmail) params.append('email', filterEmail);
      if (filterAddress) params.append('address', filterAddress);
      if (filterRole) params.append('role', filterRole);
      params.append('sortField', sortField);
      params.append('sortOrder', sortOrder);

      const res = await api.get(`/admin/users?${params.toString()}`);
      setUsers(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterName, filterEmail, filterAddress, filterRole, sortField, sortOrder]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserError('');
    setAddUserSuccess('');

    try {
        const res = await api.post('/admin/users', {
            name: newUserName,
            email: newUserEmail,
            password: newUserPassword,
            address: newUserAddress,
            role: newUserRole,
        });
        setAddUserSuccess('User added successfully!');
        setShowAddUserModal(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserAddress('');
        setNewUserRole('NORMAL_USER');
        fetchUsers(); // Refresh user list
    } catch (err: any) {
        setAddUserError(err.response?.data?.message || 'Failed to add user.');
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          User Management
        </h1>
        <p className="text-slate-600 text-lg">Manage your users with ease and style</p>
      </div>

      {/* Add User Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowAddUserModal(true)}
          className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white transition duration-300 ease-out border-2 border-blue-500 rounded-full shadow-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 hover:shadow-lg"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New User
          </span>
        </button>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 transform transition-all duration-300 scale-100">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Add New User</h3>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            </div>
            
            {addUserError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {addUserError}
              </div>
            )}
            {addUserSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                {addUserSuccess}
              </div>
            )}
            
            <div onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-slate-50 hover:bg-white"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-slate-50 hover:bg-white"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-slate-50 hover:bg-white"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="Enter secure password"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-slate-50 hover:bg-white"
                    value={newUserAddress}
                    onChange={(e) => setNewUserAddress(e.target.value)}
                    placeholder="Enter address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                  <select
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-slate-50 hover:bg-white"
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    required
                  >
                    <option value="NORMAL_USER">Normal User</option>
                    <option value="SYSTEM_ADMIN">System Administrator</option>
                    <option value="STORE_OWNER">Store Owner</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-6 py-3 text-slate-600 hover:text-slate-800 font-semibold transition duration-200 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleAddUser}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-200"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="mb-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
          </svg>
          Filter Users
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by Name"
              className="w-full px-4 py-3 pl-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white/80 hover:bg-white"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
            <svg className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
          
          <div className="relative">
            <select
              className="w-full px-4 py-3 pl-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white/80 hover:bg-white appearance-none"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="NORMAL_USER">Normal User</option>
              <option value="SYSTEM_ADMIN">System Administrator</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
            <svg className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <svg className="absolute right-3 top-4 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
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
          <span className="ml-4 text-slate-600 font-medium">Loading users...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No Users Found</h3>
          <p className="text-slate-500">No users match your current filter criteria.</p>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Name
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
                      </svg>
                      Address
                      <span className="ml-2 text-blue-500">
                        {sortField === 'address' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-blue-50 transition duration-200 group"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Role
                      <span className="ml-2 text-blue-500">
                        {sortField === 'role' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Store Rating
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-blue-50/50 transition duration-200 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-slate-700">{user.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-slate-700">{user.address}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'SYSTEM_ADMIN' 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : user.role === 'STORE_OWNER'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'STORE_OWNER' ? (
                        user.storeAverageRating !== undefined && user.storeAverageRating !== null ? (
                          <div className="flex items-center">
                            <div className="flex text-yellow-400 mr-2">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < Math.floor(user.storeAverageRating || 0) ? 'text-yellow-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm font-medium text-slate-700">{(user.storeAverageRating || 0).toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">No ratings</span>
                        )
                      ) : (
                        <span className="text-slate-400 text-sm">N/A</span>
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

export default UserManagement;