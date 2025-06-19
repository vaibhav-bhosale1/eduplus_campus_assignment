
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Toast from '../Common/Toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState(''); 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(''); 
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info'); 

  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const requestedRole = queryParams.get('role');

  const getLoginTitle = () => {
    switch (requestedRole) {
      case 'normal_user':
        return 'Login as Normal User';
      case 'store_owner':
        return 'Login as Store Owner';
      case 'system_admin':
        return 'Login as System Administrator';
      default:
        return 'Login';
    }
  };

  const showCustomToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const dismissToast = () => {
    setShowToast(false);
    setToastMessage('');
    setToastType('info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    dismissToast(); 

    try {
      const res = await api.post('/auth/login', { email, password });
      
      showCustomToast('Login successful!', 'success'); 

      dispatch({ type: 'LOGIN', payload: res.data });
      
      setTimeout(() => {
        if (res.data.role === 'SYSTEM_ADMIN') {
          navigate('/admin/dashboard');
        } else if (res.data.role === 'NORMAL_USER') {
          navigate('/user/stores');
        } else if (res.data.role === 'STORE_OWNER') {
          navigate('/owner/dashboard');
        } else {
          navigate('/');
        }
      }, 1000); 
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg); 
      showCustomToast(msg, 'error'); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-full opacity-30 animate-pulse animation-delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-25 animate-pulse animation-delay-2000"></div>
      
      <div className="relative w-full max-w-md">

        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 mb-6 shadow-md flex items-start space-x-3">
          <svg className="w-6 h-6 flex-shrink-0 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold text-lg mb-1 text-amber-700">For Testing Purposes:</h3>
            <p className="text-sm">
              You can log in as a **System Administrator** using these credentials:
            </p>
            <p className="text-sm font-semibold mt-2">
              Email: <code className="bg-amber-100 px-2 py-1 rounded">system@gmail.com</code>
            </p>
            <p className="text-sm font-semibold">
              Password: <code className="bg-amber-100 px-2 py-1 rounded">System@12345</code>
            </p>
            <p className="text-xs text-amber-600 mt-2">
             (Remember to replace `admin@example.com` and `AdminPassword123!` with the actual admin credentials you set up, Also this credentials are only for testing purpose please do not misuse it)
            </p>
          </div>
        </div>


        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">

          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-3xl"></div>
    
          <div className="relative z-10">
           
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {getLoginTitle()}
              </h2>
              <p className="text-slate-600">Welcome back! Please sign in to continue</p>
            </div>

        
            {error && (
              <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 rounded-xl flex items-center animate-shake">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}


            <div onSubmit={handleSubmit} className="space-y-6">
       
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white/70 hover:bg-white/90 focus:bg-white placeholder-slate-400"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2a3 3 0 11-6 0v-2m0 0V9a3 3 0 116 0v6h6a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2h6z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white/70 hover:bg-white/90 focus:bg-white placeholder-slate-400"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white/80"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </span>
              </button>

            
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">or</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-slate-600 text-sm mb-2">Don't have an account?</p>
                <Link 
                  to="/register" 
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create New Account
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Secure login powered by modern encryption
          </p>
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onDismiss={dismissToast}
          duration={3000} 
        />
      )}

      <style>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #e2e8f0 1px, transparent 1px);
          background-size: 24px 24px;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
