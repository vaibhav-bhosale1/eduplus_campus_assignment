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
 <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
   <div className="max-w-7xl mx-auto">
     <div className="text-center mb-12">
       <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
         Store Owner Dashboard
       </h2>
       <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
     </div>

     {loading ? (
       <div className="flex items-center justify-center min-h-64">
         <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
           <p className="text-gray-600 font-medium">Loading your store data...</p>
         </div>
       </div>
     ) : error ? (
       <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-lg">
         <div className="flex items-center">
           <div className="bg-red-100 rounded-full p-2 mr-4">
             <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
             </svg>
           </div>
           <p className="text-red-700 font-medium">{error}</p>
         </div>
       </div>
     ) : dashboardData ? (
       <div className="space-y-8">
         <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
           <div className="text-center">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-6 shadow-lg">
               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
               </svg>
             </div>
             <h3 className="text-3xl font-bold text-gray-800 mb-2">{dashboardData.storeName}</h3>
             <p className="text-lg text-gray-500 mb-6">Store ID: {dashboardData.storeId}</p>
             
             <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 inline-block shadow-lg">
               <div className="flex items-center justify-center mb-2">
                 {[...Array(5)].map((_, i) => (
                   <svg key={i} className={`w-6 h-6 ${i < Math.floor(dashboardData.averageRating) ? 'text-white' : 'text-white/30'}`} fill="currentColor" viewBox="0 0 20 20">
                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                   </svg>
                 ))}
               </div>
               <p className="text-3xl font-bold text-white">{dashboardData.averageRating}</p>
               <p className="text-white/90 text-sm font-medium">Average Rating</p>
             </div>
           </div>
         </div>

         <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
             <h3 className="text-2xl font-bold text-white flex items-center">
               <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
               </svg>
               Customer Reviews
             </h3>
             <p className="text-blue-100 mt-1">Users who have rated your store</p>
           </div>
           
           {dashboardData.usersWhoRated.length === 0 ? (
             <div className="p-12 text-center">
               <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                 <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2"></path>
                 </svg>
               </div>
               <p className="text-xl text-gray-500 mb-2">No reviews yet</p>
               <p className="text-gray-400">Your first customer review will appear here</p>
             </div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead className="bg-gray-50/80">
                   <tr>
                     <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                       Customer
                     </th>
                     <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                       Contact
                     </th>
                     <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                       Rating
                     </th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {dashboardData.usersWhoRated.map((rating, index) => (
                     <tr key={rating.userId} className="hover:bg-blue-50/50 transition-colors duration-200">
                       <td className="px-8 py-6">
                         <div className="flex items-center">
                           <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-10 h-10 flex items-center justify-center mr-4 shadow-md">
                             <span className="text-white font-bold text-sm">
                               {rating.userName.charAt(0).toUpperCase()}
                             </span>
                           </div>
                           <span className="font-medium text-gray-900">{rating.userName}</span>
                         </div>
                       </td>
                       <td className="px-8 py-6 text-gray-600">{rating.userEmail}</td>
                       <td className="px-8 py-6">
                         <div className="flex items-center">
                           <div className="flex mr-2">
                             {[...Array(5)].map((_, i) => (
                               <svg key={i} className={`w-5 h-5 ${i < rating.ratingValue ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                               </svg>
                             ))}
                           </div>
                           <span className="text-lg font-semibold text-gray-700">{rating.ratingValue}</span>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
         </div>
       </div>
     ) : null}
   </div>
 </div>
);
};

export default StoreOwnerDashboard;