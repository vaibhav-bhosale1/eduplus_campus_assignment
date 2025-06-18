// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Navbar from './components/Common/Navbar';
import HomePage from './pages/HomePage';
import AdminDashboard from './components/Admin/AdminDashboard';
import UserManagement from './components/Admin/UserManagement';
import StoreManagement from './components/Admin/StoreManagement';
import StoreList from './components/User/StoreList';
import StoreOwnerDashboard from './components/StoreOwner/StoreOwnerDashboard';
import NotFoundPage from './pages/NotFoundPage';
import UpdatePasswordPage from './components/Auth/UpdatePasswordPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/update-password" element={<ProtectedRoute><UpdatePasswordPage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/stores" element={<StoreManagement />} />
          </Route>

          {/* Normal User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['NORMAL_USER']} />}>
            <Route path="/user/stores" element={<StoreList />} />
          </Route>

          {/* Store Owner Routes */}
          <Route element={<ProtectedRoute allowedRoles={['STORE_OWNER']} />}>
            <Route path="/owner/dashboard" element={<StoreOwnerDashboard />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;