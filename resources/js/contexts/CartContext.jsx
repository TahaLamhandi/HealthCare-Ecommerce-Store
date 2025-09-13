import React from 'react';
import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
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

  // Fetch cart data from API or localStorage
  const fetchCart = async () => {
    try {
      setLoading(true);
      
      if (!isAuthenticated()) {
        // If not authenticated, use localStorage
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          const items = JSON.parse(localCart);
          setCartItems(items);
          updateCartCount(items);
        } else {
          setCartItems([]);
          updateCartCount([]);
        }
        return;
      }

      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Handle both response formats: {items: [...]} and {success: true, items: [...]}
        const items = data.items || data.data?.items || [];
        
        // Transform items to include product data and package information
        const transformedItems = items.map(item => {
          console.log('Transforming cart item from API:', item);
          return {
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            name: item.product?.name || 'Produit',
            price: Number(item.price) || Number(item.product?.price) || 0, // Use stored price first
            image: item.product?.image || item.product?.img || '/images/placeholder-product.jpg',
            category: item.product?.category?.title || item.product?.category || 'Produit',
            description: item.product?.description || '',
            rating: item.product?.rating || 4.8,
            // Package details - use stored package info from database
            package: item.package || 'Standard',
            package_id: item.package_id,
            package_quantity: item.package_quantity || item.quantity,
            package_old_price: item.package_old_price,
            package_save: item.package_save || 0,
            package_label: item.package_label || ''
          };
        });
        
        setCartItems(transformedItems);
        updateCartCount(transformedItems);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Fallback to localStorage
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        const items = JSON.parse(localCart);
        setCartItems(items);
        updateCartCount(items);
      } else {
        setCartItems([]);
        updateCartCount([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Update cart count
  const updateCartCount = (items) => {
    const count = items.reduce((total, item) => total + (item.quantity || 0), 0);
    setCartCount(count);
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1, productData = null) => {
    try {
      setLoading(true);
      
      if (!isAuthenticated()) {
        // If not authenticated, use localStorage
        const localCart = localStorage.getItem('cart') || '[]';
        const items = JSON.parse(localCart);
        
        // Check if item already exists
        const existingItemIndex = items.findIndex(item => item.id === productId);
        
        if (existingItemIndex >= 0) {
          items[existingItemIndex].quantity += quantity;
        } else {
          // Add new item with complete product and package data
          console.log('Adding to cart (localStorage):', { productId, productData, quantity });
          const newItem = {
            id: productId,
            product_id: productData?.product_id || productId,
            name: productData?.name || 'Produit',
            price: Number(productData?.price) || 0,
            image: productData?.image || productData?.img || '/images/placeholder-product.jpg',
            category: productData?.category?.title || productData?.category || 'Produit',
            description: productData?.description || '',
            rating: productData?.rating || 4.8,
            quantity: quantity,
            // Package details
            package: productData?.package || 'Standard',
            package_id: productData?.package_id,
            package_quantity: productData?.package_quantity || quantity,
            package_old_price: productData?.package_old_price,
            package_save: productData?.package_save || 0,
            package_label: productData?.package_label || ''
          };
          console.log('New cart item (localStorage):', newItem);
          items.push(newItem);
        }
        
        localStorage.setItem('cart', JSON.stringify(items));
        setCartItems(items);
        updateCartCount(items);
        return { success: true, message: 'Produit ajouté au panier' };
      }

      const requestBody = {
        product_id: productId,
        quantity: quantity,
        price: productData?.price,
        // Package information
        package: productData?.package || 'Standard',
        package_id: productData?.package_id,
        package_quantity: productData?.package_quantity || quantity,
        package_old_price: productData?.package_old_price,
        package_save: productData?.package_save || 0,
        package_label: productData?.package_label || ''
      };
      
      console.log('Adding to cart (API):', { productId, productData, quantity, requestBody });
      
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart data
        return { success: true, message: 'Produit ajouté au panier' };
      } else {
        throw new Error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Erreur lors de l\'ajout au panier' };
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated()) {
      // Update localStorage
      const localCart = localStorage.getItem('cart') || '[]';
      const items = JSON.parse(localCart);
      const itemIndex = items.findIndex(item => item.id === productId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          items.splice(itemIndex, 1);
        } else {
          items[itemIndex].quantity = quantity;
        }
        localStorage.setItem('cart', JSON.stringify(items));
        setCartItems(items);
        updateCartCount(items);
      }
      return { success: true };
    }

    // For authenticated users, update via API
    try {
      setLoading(true);
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity
        }),
      });

      if (response.ok) {
        // Immediately update local state for better UX
        setCartItems(prev => {
          const updatedItems = prev.map(item => 
            item.product_id === productId 
              ? { ...item, quantity: quantity }
              : item
          ).filter(item => item.quantity > 0);
          updateCartCount(updatedItems);
          return updatedItems;
        });
        
        await fetchCart(); // Refresh cart data
        return { success: true };
      } else {
        throw new Error('Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!isAuthenticated()) {
      // Update localStorage
      const localCart = localStorage.getItem('cart') || '[]';
      const items = JSON.parse(localCart);
      const filteredItems = items.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(filteredItems));
      setCartItems(filteredItems);
      updateCartCount(filteredItems);
      return { success: true, message: 'Produit retiré du panier' };
    }

    // For authenticated users, remove via API
    try {
      setLoading(true);
      const response = await fetch('/api/cart/remove', {
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
        // Immediately update local state for better UX
        setCartItems(prev => {
          const filteredItems = prev.filter(item => item.product_id !== productId);
          updateCartCount(filteredItems);
          return filteredItems;
        });
        
        await fetchCart(); // Refresh cart data
        return { success: true, message: 'Produit retiré du panier' };
      } else {
        throw new Error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, message: 'Erreur lors de la suppression' };
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!isAuthenticated()) {
      // Clear localStorage
      localStorage.removeItem('cart');
      setCartItems([]);
      setCartCount(0);
      return { success: true, message: 'Panier vidé' };
    }

    // For authenticated users, clear via API
    try {
      setLoading(true);
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setCartItems([]);
        setCartCount(0);
        return { success: true, message: 'Panier vidé' };
      } else {
        throw new Error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, message: 'Erreur lors du vidage du panier' };
    } finally {
      setLoading(false);
    }
  };

  // Calculate total price
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  // Calculate delivery fee
  const getDeliveryFee = () => {
    return 25; // Fixed delivery fee
  };


  // Calculate total with delivery
  const getTotalWithDelivery = () => {
    return getCartTotal() + getDeliveryFee();
  };

  // Load cart on component mount and when authentication changes
  useEffect(() => {
    fetchCart();
  }, []);

  // Refetch cart when authentication state changes
  useEffect(() => {
    if (isAuthenticated()) {
      // Clear any existing cart data first, then fetch fresh data
      setCartItems([]);
      setCartCount(0);
      fetchCart();
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  }, [isAuthenticated()]);

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getDeliveryFee,
    getTotalWithDelivery,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
