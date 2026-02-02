import React from 'react';
import AppNavbar from './AppNavbar';
import PageContainer from './PageContainer';

const Layout = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen bg-background">
      <AppNavbar activeTab={activeTab} onTabChange={onTabChange} />
      <PageContainer>{children}</PageContainer>
    </div>
  );
};

export default Layout;

