import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './contexts/AppContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { CartProvider } from './contexts/CartContext';

// Import our main App component with navigation
import App from './App.jsx';

// Main App Component with Navigation
const MainApp = () => {
  return (
    <AppProvider>
      <FavoritesProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </FavoritesProvider>
    </AppProvider>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<MainApp />);
