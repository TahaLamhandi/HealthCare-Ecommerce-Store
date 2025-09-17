import React, { createContext, useContext } from 'react';

const TestContext = createContext();

export const TestProvider = ({ children }) => {
  return (
    <TestContext.Provider value={{ test: 'value' }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};

