// frontend/src/components/Auth/UpdatePasswordPage.tsx
import React, { useState } from 'react';
import api from '../../services/api';
import Toast from '../Common/Toast'; // Import the new Toast component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const UpdatePasswordPage: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  // Removed 'error' and 'success' states as toasts will handle feedback
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const navigate = useNavigate(); // Initialize navigate

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
    dismissToast(); // Dismiss any existing toasts before new submission

    if (newPassword !== confirmNewPassword) {
      showCustomToast('New password and confirmation do not match.', 'error');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
    if (!passwordRegex.test(newPassword)) {
      showCustomToast('Password must be 8-16 characters long, include at least one uppercase letter and one special character.', 'error');
      return;
    }

    try {
      await api.put('/auth/update-password', { oldPassword, newPassword });
      showCustomToast('Password updated successfully!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      // Redirect to home page after a short delay to allow toast to be seen
      setTimeout(() => {
        navigate('/');
      }, 1500); // 1.5 second delay before redirect
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update password.';
      showCustomToast(msg, 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-full opacity-30 animate-pulse animation-delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-25 animate-pulse animation-delay-2000"></div>
      
      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-3xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                Update Password
              </h2>
              <p className="text-slate-600">Keep your account secure with a new password</p>
            </div>

            {/* Error Message (removed - replaced by Toast) */}
            {/* Success Message (removed - replaced by Toast) */}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Old Password Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-orange-600 transition-colors duration-200">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2a3 3 0 11-6 0v-2m0 0V9a3 3 0 116 0v6h6a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2h6z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="oldPassword"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 bg-white/70 hover:bg-white/90 focus:bg-white placeholder-slate-400"
                    placeholder="Enter your current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* New Password Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-orange-600 transition-colors duration-200">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="newPassword"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 bg-white/70 hover:bg-white/90 focus:bg-white placeholder-slate-400"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Confirm New Password Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-orange-600 transition-colors duration-200">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 bg-white/70 hover:bg-white/90 focus:bg-white placeholder-slate-400"
                    placeholder="Confirm your new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Security Tips */}
              <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-xl p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Password Security Tips:</p>
                    <ul className="text-xs space-y-1">
                      <li>• Use at least 8 characters</li>
                      <li>• Include uppercase and lowercase letters</li>
                      <li>• Add numbers and special characters</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white/80"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Update Password
                </span>
              </button>

              {/* Additional Actions */}
              <div className="text-center pt-4">
                <p className="text-slate-600 text-sm mb-2">Need help with your password?</p>
                <button 
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Contact Support
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Your security is our priority - passwords are encrypted end-to-end
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onDismiss={dismissToast}
          duration={3000} // Toast will disappear after 3 seconds
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

export default UpdatePasswordPage;
