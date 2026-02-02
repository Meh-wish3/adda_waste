import React from 'react';

const PageContainer = ({ children }) => {
  return (
    <main className="mx-auto max-w-6xl px-4 py-4 sm:py-8">
      {children}
    </main>
  );
};

export default PageContainer;

