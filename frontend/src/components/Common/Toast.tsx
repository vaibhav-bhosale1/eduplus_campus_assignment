// frontend/src/components/Common/Toast.tsx
import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: () => void;
  duration?: number; 
}

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss(); 
    }, duration);

    return () => clearTimeout(timer); 
  }, [duration, onDismiss]);

  const toastClasses = {
    success: 'bg-green-500 border-green-700',
    error: 'bg-red-500 border-red-700',
    info: 'bg-blue-500 border-blue-700',
  };

  const icon = {
    success: (
      <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-xl text-white flex items-center transform transition-all duration-300 ease-out z-50
        ${toastClasses[type]}
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}
      style={{ minWidth: '250px' }}
    >
      {icon[type]}
      <span className="flex-grow">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          onDismiss();
        }}
        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
