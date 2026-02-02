import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CitizenPickupForm from './features/citizen/CitizenPickupForm';
import CitizenStatusView from './features/citizen/CitizenStatusView';
import CollectorDashboard from './features/collector/CollectorDashboard';
import LandingPage from './features/landing/LandingPage';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';

// Protected Route Component (Mock)
const ProtectedRoute = ({ children }) => {
  // For demo purposes, we'll allow access. 
  // In a real app, this would check authentication state.
  return children;
};

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('citizen');

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'citizen' ? (
        <>
          <CitizenPickupForm />
          <CitizenStatusView />
        </>
      ) : (
        <CollectorDashboard />
      )}
    </Layout>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
        {/* Redirect unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
