import React from 'react';
import { useState, useEffect, useContext, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Heart, ShoppingCart, Search, Menu, X, ChevronDown, Phone, Mail, MapPin, Copy, ExternalLink, Leaf, Bell, User, MessageCircle, ArrowRight, Package, Star, Crown, Percent, Tag, Award, LogOut, CheckCircle, Edit3, Save, Eye, EyeOff, Settings, UserCircle } from 'lucide-react';
import { Button } from '../tools/button';
import { Badge } from '../tools/badge';
import { Input } from '../tools/input';
import { AppContext } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useFavorites } from "../../contexts/FavoritesContext";

export default function Header({
  isScrolled = false,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen = () => {},
  navigateTo = () => {},
  currentPage = 'home'
}) {
  const { categories = [], products = [], promotions = [] } = useContext(AppContext);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { favorites, refreshTrigger } = useFavorites();
  const [activeMenu, setActiveMenu] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const tabsRef = useRef(null);
  const [tabsWidth, setTabsWidth] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  
  // User popup states
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const userButtonRef = useRef(null);

  // Navigation functions with beautiful transitions
  const navigateToHome = () => {
    navigateTo('home');
  };

  const navigateToProducts = () => {
    navigateTo('products');
  };

  const navigateToCategories = () => {
    navigateTo('categories');
  };

  const navigateToCategory = (categoryId) => {
    navigateTo('products', { categoryId });
  };

  // Authentication and navigation handlers
  const handleCartClick = () => {
    if (!isAuthenticated()) {
      navigateTo('auth');
    } else {
      navigateTo('cart');
    }
  };

  const handleFavoritesClick = () => {
    if (!isAuthenticated()) {
      navigateTo('auth');
    } else {
      navigateTo('favorites');
    }
  };

  // Handle scroll behavior for hiding/showing navigation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide tabs when scrolling down past hero section (around 200px)
      if (currentScrollY > 200) {
        setIsScrollingDown(true);
      } else {
        // Show tabs when at top or in hero section
        setIsScrollingDown(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // User popup functions
  const openUserPopup = () => {
    if (user) {
      setUserForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    setShowUserPopup(true);
  };

  const closeUserPopup = () => {
    setShowUserPopup(false);
    setIsEditing(false);
    setShowPassword(false);
    setUpdateMessage('');
  };

  const handleUserButtonMouseEnter = () => {
    openUserPopup();
  };

  const handleUserButtonMouseLeave = () => {
    // Add a small delay to prevent flickering
    setTimeout(() => {
      if (!document.querySelector('.user-popup:hover')) {
        closeUserPopup();
      }
    }, 100);
  };

  const handleUserFormChange = (field, value) => {
    setUserForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    setUpdateMessage('');

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userForm.name,
          email: userForm.email,
          phone: userForm.phone,
          address: userForm.address,
          currentPassword: userForm.currentPassword,
          newPassword: userForm.newPassword,
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUpdateMessage('Profil mis à jour avec succès!');
        // Update user context if needed
        setTimeout(() => {
          setUpdateMessage('');
          setIsEditing(false);
        }, 2000);
      } else {
        setUpdateMessage(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      setUpdateMessage('Erreur de connexion');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <header className={`bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-[9999] transition-all duration-500 ${
      isScrollingDown ? 'py-1' : 'py-2'
    }`}>
      <div className={`container mx-auto px-4 transition-all duration-500 ${
        isScrollingDown ? 'py-1' : 'py-2'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo with BioEkleel Text */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group transition-all duration-300 hover:scale-105 active:scale-95"
            onClick={navigateToHome}
          >
            <div className="relative">
              <img
                src="/images/logo.png"
                alt="BioEkleel Logo"
                className="h-12 w-auto transition-transform duration-300"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <div className="transition-transform duration-300">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 via-green-600 to-green-700 bg-clip-text text-transparent transition-all duration-300">
                BioEkleel
              </h1>
              <p className="text-sm text-gray-500 font-medium transition-colors duration-300">
                Santé & Bien-être
              </p>
            </div>
          </div>

          {/* Desktop Search Bar - Hidden on Mobile */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Rechercher des produits naturels..."
                className="w-full pl-12 pr-4 py-3 text-base border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-green-400 rounded-2xl transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Desktop Action Buttons - Hidden on Mobile */}
          <div className="hidden md:flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-3 hover:bg-green-50 rounded-2xl"
              onClick={handleFavoritesClick}
            >
              <Heart className="w-5 h-5 text-gray-600" />
              {isAuthenticated() && favorites.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-green-500 text-white">
                  {favorites.length}
                </Badge>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-3 hover:bg-green-50 rounded-2xl"
              onClick={handleCartClick}
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {isAuthenticated() && cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-green-500 text-white">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {isAuthenticated() ? (
              <div 
                className="relative group"
                onMouseEnter={handleUserButtonMouseEnter}
                onMouseLeave={handleUserButtonMouseLeave}
                ref={userButtonRef}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-3 hover:bg-green-50 rounded-2xl"
                >
                  <User className="w-5 h-5 text-gray-600" />
                </Button>
                
                {/* User Popup - positioned under button */}
                {showUserPopup && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[10001] user-popup">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-t-2xl text-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                          <UserCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">Mon Compte</h3>
                          <p className="text-green-100 text-sm">Gérez vos informations</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* User Info Display */}
                      {!isEditing ? (
                        <div className="space-y-4">
                          {/* Profile Summary */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900">{user?.name || 'Utilisateur'}</h4>
                                <p className="text-sm text-gray-600">{user?.email || ''}</p>
                                {user?.is_admin && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Admin
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* User Details */}
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                              <Mail className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="text-xs text-gray-600">Email</p>
                                <p className="text-sm font-medium text-gray-900">{user?.email || 'Non renseigné'}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                              <Phone className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="text-xs text-gray-600">Téléphone</p>
                                <p className="text-sm font-medium text-gray-900">{user?.phone || 'Non renseigné'}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl">
                              <MapPin className="w-4 h-4 text-purple-600" />
                              <div>
                                <p className="text-xs text-gray-600">Adresse</p>
                                <p className="text-sm font-medium text-gray-900">{user?.address || 'Non renseignée'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2 pt-3 border-t border-gray-200">
                            <button
                              onClick={() => setIsEditing(true)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 text-sm font-medium"
                            >
                              <Edit3 className="w-4 h-4" />
                              Modifier
                            </button>
                            
                            {user?.is_admin && (
                              <button
                                onClick={() => {
                                  closeUserPopup();
                                  navigateTo('admin-dashboard');
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium"
                              >
                                <Crown className="w-4 h-4" />
                                Admin Dashboard
                              </button>
                            )}
                            
                            <button
                              onClick={logout}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 text-sm font-medium"
                            >
                              <LogOut className="w-4 h-4" />
                              Se déconnecter
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Edit Form - Compact version */
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-bold text-gray-900">Modifier</h4>
                            <button
                              onClick={() => setIsEditing(false)}
                              className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Update Message */}
                          {updateMessage && (
                            <div className={`p-3 rounded-xl text-sm ${
                              updateMessage.includes('succès') 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              {updateMessage}
                            </div>
                          )}

                          <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }} className="space-y-3">
                            {/* Basic Information */}
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Nom complet</label>
                                <input
                                  type="text"
                                  value={userForm.name}
                                  onChange={(e) => handleUserFormChange('name', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                                <input
                                  type="email"
                                  value={userForm.email}
                                  onChange={(e) => handleUserFormChange('email', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Téléphone</label>
                                <input
                                  type="tel"
                                  value={userForm.phone}
                                  onChange={(e) => handleUserFormChange('phone', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Adresse</label>
                                <input
                                  type="text"
                                  value={userForm.address}
                                  onChange={(e) => handleUserFormChange('address', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
                                />
                              </div>
                            </div>

                            {/* Password Section */}
                            <div className="border-t border-gray-200 pt-3">
                              <h5 className="text-sm font-semibold text-gray-900 mb-2">Changer le mot de passe</h5>
                              
                              <div className="space-y-2">
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 mb-1">Mot de passe actuel</label>
                                  <div className="relative">
                                    <input
                                      type={showPassword ? "text" : "password"}
                                      value={userForm.currentPassword}
                                      onChange={(e) => handleUserFormChange('currentPassword', e.target.value)}
                                      className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
                                      placeholder="Mot de passe actuel"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nouveau</label>
                                    <input
                                      type="password"
                                      value={userForm.newPassword}
                                      onChange={(e) => handleUserFormChange('newPassword', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
                                      placeholder="Nouveau"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Confirmer</label>
                                    <input
                                      type="password"
                                      value={userForm.confirmPassword}
                                      onChange={(e) => handleUserFormChange('confirmPassword', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
                                      placeholder="Confirmer"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-2 pt-3 border-t border-gray-200">
                              <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex-1 px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                              >
                                Annuler
                              </button>
                              <button
                                type="submit"
                                disabled={isUpdating}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 text-sm font-medium disabled:opacity-50"
                              >
                                {isUpdating ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ...
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-4 h-4" />
                                    Sauvegarder
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-3 hover:bg-green-50 rounded-2xl"
                onClick={() => navigateTo('auth')}
              >
                <User className="w-5 h-5 text-gray-600" />
              </Button>
            )}
          </div>

          {/* Mobile Action Buttons - Only Search, Cart, and Menu */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile Search Button */}
            <Button variant="ghost" size="sm" className="p-3 hover:bg-green-50 rounded-2xl">
              <Search className="w-5 h-5 text-gray-600" />
            </Button>
            
            {/* Mobile Cart Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-3 hover:bg-green-50 rounded-2xl"
              onClick={handleCartClick}
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {isAuthenticated() && cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-green-500 text-white">
                  {cartCount}
                </Badge>
              )}
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="p-3 hover:bg-green-50 rounded-2xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

