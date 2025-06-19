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
 <div className="min-h-screen bg-gray-50 p-6">
   <div className="max-w-7xl mx-auto">
     <div className="text-center mb-10">
       <h2 className="text-3xl font-bold text-gray-800 mb-3">
         All Registered Stores
       </h2>
       <div className="w-20 h-1 bg-blue-400 mx-auto rounded-full"></div>
     </div>

     <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
       <div className="flex flex-col lg:flex-row gap-4 items-end">
         <div className="flex-1">
           <label className="block text-sm font-medium text-gray-600 mb-2">Store Name</label>
           <div className="relative">
             <input
               type="text"
               placeholder="Search by Store Name"
               className="w-full p-3 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
               value={searchName}
               onChange={(e) => setSearchName(e.target.value)}
             />
             <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
             </svg>
           </div>
         </div>
         
         <div className="flex-1">
           <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
           <div className="relative">
             <input
               type="text"
               placeholder="Search by Address"
               className="w-full p-3 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
               value={searchAddress}
               onChange={(e) => setSearchAddress(e.target.value)}
             />
             <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
             </svg>
           </div>
         </div>
         
         <button 
           onClick={fetchStores} 
           className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
         >
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
           </svg>
           <span>Search</span>
         </button>
       </div>
     </div>

     {error && (
       <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm mb-6">
         <div className="flex items-center">
           <div className="bg-red-100 rounded-full p-2 mr-3">
             <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
             </svg>
           </div>
           <p className="text-red-700 font-medium">{error}</p>
         </div>
       </div>
     )}

     {loading ? (
       <div className="flex items-center justify-center min-h-64">
         <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
           <p className="text-gray-600 font-medium">Loading stores...</p>
         </div>
       </div>
     ) : stores.length === 0 ? (
       <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
         <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
           <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
           </svg>
         </div>
         <h3 className="text-xl font-semibold text-gray-700 mb-2">No Stores Found</h3>
         <p className="text-gray-500">Try adjusting your search criteria</p>
       </div>
     ) : (
       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="bg-blue-50 border-b border-blue-100 p-6">
           <h3 className="text-xl font-semibold text-gray-800 flex items-center">
             <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
             </svg>
             Store Directory
           </h3>
           <p className="text-gray-600 mt-1">{stores.length} stores found</p>
         </div>
         
         <div className="overflow-x-auto">
           <table className="w-full">
             <thead className="bg-gray-50 border-b border-gray-200">
               <tr>
                 <th 
                   className="px-6 py-4 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors duration-200" 
                   onClick={() => handleSort('name')}
                 >
                   <div className="flex items-center space-x-2">
                     <span>Store Name</span>
                     {sortField === 'name' && (
                       <span className="text-blue-500 text-xs">
                         {sortOrder === 'asc' ? '▲' : '▼'}
                       </span>
                     )}
                   </div>
                 </th>
                 <th 
                   className="px-6 py-4 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors duration-200" 
                   onClick={() => handleSort('address')}
                 >
                   <div className="flex items-center space-x-2">
                     <span>Address</span>
                     {sortField === 'address' && (
                       <span className="text-blue-500 text-xs">
                         {sortOrder === 'asc' ? '▲' : '▼'}
                       </span>
                     )}
                   </div>
                 </th>
                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                   Overall Rating
                 </th>
                 {isNormalUser && (
                   <>
                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                       Your Rating
                     </th>
                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                       Action
                     </th>
                   </>
                 )}
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               {stores.map((store, index) => (
                 <tr key={store.id} className="hover:bg-blue-25 hover:bg-opacity-30 transition-all duration-200">
                   <td className="px-6 py-5">
                     <div className="flex items-center">
                       <div className="bg-blue-100 rounded-xl w-10 h-10 flex items-center justify-center mr-4">
                         <span className="text-blue-600 font-semibold text-sm">
                           {store.name.charAt(0).toUpperCase()}
                         </span>
                       </div>
                       <span className="font-medium text-gray-900">{store.name}</span>
                     </div>
                   </td>
                   <td className="px-6 py-5">
                     <div className="flex items-center text-gray-600">
                       <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                       </svg>
                       <span className="text-sm">{store.address}</span>
                     </div>
                   </td>
                   <td className="px-6 py-5">
                     {store.overallRating !== null ? (
                       <div className="flex items-center">
                         <div className="flex mr-2">
                           {[...Array(5)].map((_, i) => (
                             <svg key={i} className={`w-4 h-4 ${i < Math.floor(store.overallRating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                             </svg>
                           ))}
                         </div>
                         <span className="font-medium text-gray-700">{store.overallRating}</span>
                       </div>
                     ) : (
                       <span className="text-gray-400 text-sm">No ratings yet</span>
                     )}
                   </td>
                   {isNormalUser && (
                     <>
                       <td className="px-6 py-5">
                         {store.userSubmittedRating !== null ? (
                           <div className="flex items-center">
                             <div className="flex mr-2">
                               {[...Array(5)].map((_, i) => (
                                 <svg key={i} className={`w-4 h-4 ${i < store.userSubmittedRating ? 'text-blue-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                 </svg>
                               ))}
                             </div>
                             <span className="font-medium text-gray-700">{store.userSubmittedRating}</span>
                           </div>
                         ) : (
                           <span className="text-gray-400 text-sm">Not rated</span>
                         )}
                       </td>
                       <td className="px-6 py-5">
                         <div className="flex items-center space-x-3">
                           <select
                             className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 text-sm"
                             value={ratingToSubmit[store.id] || store.userSubmittedRating || ''}
                             onChange={(e) => handleRatingChange(store.id, parseInt(e.target.value))}
                           >
                             <option value="">Select Rating</option>
                             {[1, 2, 3, 4, 5].map((val) => (
                               <option key={val} value={val}>⭐ {val}</option>
                             ))}
                           </select>
                           {store.userSubmittedRating === null ? (
                             <button
                               onClick={() => handleSubmitRating(store.id)}
                               className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm"
                             >
                               Submit
                             </button>
                           ) : (
                             <button
                               onClick={() => handleModifyRating(store.id)}
                               className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm"
                             >
                               Modify
                             </button>
                           )}
                         </div>
                       </td>
                     </>
                   )}
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

export default StoreList;