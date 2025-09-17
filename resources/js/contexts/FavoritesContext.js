import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext.js';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Safely get auth context with fallback
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    // If AuthProvider is not available, create a fallback
    authContext = {
      user: null,
      isAuthenticated: () => false
    };
  }
  
  const { user, isAuthenticated } = authContext;

  // Fetch favorites from API or localStorage
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      console.log('fetchFavorites called, isAuthenticated:', isAuthenticated());
      
      if (!isAuthenticated()) {
        console.log('User not authenticated, using localStorage');
        // If not authenticated, use localStorage
        const localFavorites = localStorage.getItem('favorites');
        if (localFavorites) {
          const items = JSON.parse(localFavorites);
          setFavorites(items);
        } else {
          setFavorites([]);
        }
        return;
      }

      console.log('User authenticated, fetching from API');

      const response = await fetch('/api/favorites', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Favorites API response:', data);
        // Handle response format: {success: true, favorites: [...]}
        const items = data.favorites || [];
        console.log('Favorites items:', items);
        
        // Transform items to include product data (same as cart)
        const transformedItems = items.map(item => ({
          id: item.id,
          name: item.name || 'Produit',
          price: Number(item.price) || 0,
          image: item.image || item.img || '/images/placeholder-product.jpg',
          category: item.category?.title || item.category || 'Produit',
          description: item.description || '',
          rating: item.rating || 4.8
        }));
        
        console.log('Transformed favorites:', transformedItems);
        setFavorites(transformedItems);
      } else {
        console.error('Favorites API error:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      // Fallback to localStorage
      const localFavorites = localStorage.getItem('favorites');
      if (localFavorites) {
        const items = JSON.parse(localFavorites);
        setFavorites(items);
      } else {
        setFavorites([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Add to favorites
  const addToFavorites = async (product) => {
    try {
      setLoading(true);
      
      if (!isAuthenticated()) {
        // If not authenticated, use localStorage
        const localFavorites = localStorage.getItem('favorites') || '[]';
        const items = JSON.parse(localFavorites);
        
        // Check if already in favorites
        const exists = items.find(item => item.id === product.id);
        if (!exists) {
          items.push(product);
          localStorage.setItem('favorites', JSON.stringify(items));
          setFavorites(items);
          setRefreshTrigger(prev => prev + 1); // Trigger re-render
        }
        return { success: true, message: 'Ajouté aux favoris' };
      }

      // For authenticated users, add to database first
      const response = await fetch('/api/favorites/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id
        }),
      });

      if (response.ok) {
        // Immediately update local state for better UX
        setFavorites(prev => {
          const exists = prev.find(item => String(item.id) === String(product.id));
          if (!exists) {
            const newFavorites = [...prev, product];
            setRefreshTrigger(prev => prev + 1); // Trigger re-render
            return newFavorites;
          }
          return prev;
        });
        
        // Also update localStorage for consistency
        const localFavorites = localStorage.getItem('favorites') || '[]';
        const items = JSON.parse(localFavorites);
        const exists = items.find(item => item.id === product.id);
        if (!exists) {
          items.push(product);
          localStorage.setItem('favorites', JSON.stringify(items));
        }
        
        return { success: true, message: 'Ajouté aux favoris' };
      } else {
        throw new Error('Failed to add to favorites');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return { success: false, message: 'Erreur lors de l\'ajout aux favoris' };
    } finally {
      setLoading(false);
    }
  };

  // Remove from favorites
  const removeFavorite = async (productId) => {
    if (!isAuthenticated()) {
      // Update localStorage
      const localFavorites = localStorage.getItem('favorites') || '[]';
      const items = JSON.parse(localFavorites);
      const filteredItems = items.filter(item => String(item.id) !== String(productId));
      localStorage.setItem('favorites', JSON.stringify(filteredItems));
      setFavorites(filteredItems);
      setRefreshTrigger(prev => prev + 1); // Trigger re-render
      return { success: true, message: 'Retiré des favoris' };
    }

    // For authenticated users, remove via API
    try {
      setLoading(true);
      
      // Immediately update local state for better UX
      setFavorites(prev => {
        const filteredItems = prev.filter(item => String(item.id) !== String(productId));
        setRefreshTrigger(prev => prev + 1); // Trigger re-render
        return filteredItems;
      });
      
      // Also update localStorage for consistency
      const localFavorites = localStorage.getItem('favorites') || '[]';
      const items = JSON.parse(localFavorites);
      const filteredItems = items.filter(item => item.id !== productId);
      localStorage.setItem('favorites', JSON.stringify(filteredItems));
      
      const response = await fetch('/api/favorites/remove', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId
        }),
      });

      if (response.ok) {
        return { success: true, message: 'Retiré des favoris' };
      } else {
        // If API call failed, revert the state change
        await fetchFavorites();
        throw new Error('Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      // Revert state on error
      await fetchFavorites();
      return { success: false, message: 'Erreur lors de la suppression' };
    } finally {
      setLoading(false);
    }
  };

  // Check if product is in favorites
  const isFavorite = (productId) => {
    // Convert both to strings for comparison to avoid type issues
    const productIdStr = String(productId);
    const result = favorites.some(item => String(item.id) === productIdStr);
    return result;
  };

  // Toggle favorite (add if not in favorites, remove if in favorites)
  const toggleFavorite = async (productId) => {
    if (isFavorite(productId)) {
      return await removeFavorite(productId);
    } else {
      // We need to get the product data to add it
      // This will be handled by the component calling addToFavorites with product data
      return { success: false, message: 'Product data needed' };
    }
  };

  // Load favorites on component mount and when authentication changes
  useEffect(() => {
    console.log('FavoritesContext mounted, fetching favorites');
    fetchFavorites();
  }, []);

  // Refetch favorites when authentication state changes
  useEffect(() => {
    console.log('Authentication state changed, isAuthenticated:', isAuthenticated());
    if (isAuthenticated()) {
      // Clear any existing favorites data first, then fetch fresh data
      setFavorites([]);
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated()]);


  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    fetchFavorites,
    refreshTrigger
  };

  return React.createElement(
    FavoritesContext.Provider,
    { value: value },
    children
  );
};