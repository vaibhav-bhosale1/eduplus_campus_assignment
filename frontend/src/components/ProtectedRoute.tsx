// frontend/src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: Array<'SYSTEM_ADMIN' | 'NORMAL_USER' | 'STORE_OWNER'>;
  children?: React.ReactNode; // ✅ add this line
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

 
  return <>{children ? children : <Outlet />}</>;
};

export default ProtectedRoute;
