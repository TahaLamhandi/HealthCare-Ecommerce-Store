import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing tokens on page load
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (token) {
      // Verify token is still valid by making a request
      fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Token invalid');
        }
      })
      .then(data => {
        if (data.success) {
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('auth_token');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('auth_token');
      })
      .finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('auth_token', data.token); // Keep both for compatibility
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        // Handle validation errors
        if (data.errors) {
          const firstError = Object.values(data.errors)[0];
          return { success: false, error: Array.isArray(firstError) ? firstError[0] : firstError };
        }
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok && data.success === true) {
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        // Handle validation errors
        if (data.errors) {
          const firstError = Object.values(data.errors)[0];
          const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          return { success: false, error: errorMessage };
        }
        
        const errorMessage = data.message || 'Erreur d\'inscription';
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      return { success: false, error: 'Erreur d\'inscription' };
    }
  };

  const logout = async () => {
    try {
      // Call logout API to destroy session on server
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      if (token) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
    } finally {
      // Clear all local storage and user state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
