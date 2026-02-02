import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './features/landing/LandingPage';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import CitizenDashboard from './features/citizen/CitizenDashboard';
import CollectorDashboardWrapper from './features/collector/CollectorDashboardWrapper';
import AdminDashboard from './features/admin/AdminDashboard';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes - Role-Based */}
          <Route
            path="/citizen"
            element={
              <PrivateRoute allowedRoles={['CITIZEN']}>
                <CitizenDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/collector"
            element={
              <PrivateRoute allowedRoles={['COLLECTOR']}>
                <CollectorDashboardWrapper />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Legacy route redirect */}
          <Route path="/app" element={<Navigate to="/login" replace />} />

          {/* Redirect unknown routes to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
