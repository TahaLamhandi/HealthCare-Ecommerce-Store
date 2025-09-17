import { createRoot } from 'react-dom/client';
import { AppProvider } from './contexts/AppContext.js';
import { FavoritesProvider } from './contexts/FavoritesContext.js';
import { CartProvider } from './contexts/CartContext.js';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <AppProvider>
      <FavoritesProvider>
        <CartProvider>
          <HomePage />
        </CartProvider>
      </FavoritesProvider>
    </AppProvider>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
