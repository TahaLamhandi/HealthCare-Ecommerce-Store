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
  const [popupRefreshKey, setPopupRefreshKey] = useState(0);
  const [currentUserData, setCurrentUserData] = useState(null);
  const userButtonRef = useRef(null);

  // Helper function to safely display user data
  const safeUserData = (value, fallback = 'Non renseigné') => {
    if (!value || value === '' || value === '0' || value === 0 || value === null || value === undefined) {
      return fallback;
    }
    return value;
  };

  // Helper function to check if a value should be displayed
  const shouldDisplay = (value) => {
    return value && value !== '' && value !== '0' && value !== 0 && value !== null && value !== undefined;
  };


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

  // Session management - clear session on page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear user data from localStorage on page refresh
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('auth_token');
    };

    const handlePageShow = (event) => {
      // If page was loaded from cache (back/forward), clear session
      if (event.persisted) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('auth_token');
        setCurrentUserData(null);
        setShowUserPopup(false);
      }
    };

    // Clear session on page refresh
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pageshow', handlePageShow);

    // Also clear session on component mount (page load)
    const hasValidSession = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const user = localStorage.getItem('user');
      return token && user;
    };

    if (!hasValidSession()) {
      setCurrentUserData(null);
      setShowUserPopup(false);
      setIsEditing(false);
      setShowPassword(false);
      setUpdateMessage('');
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  // Periodic session check
  useEffect(() => {
    const checkSession = () => {
      if (!isAuthenticated()) {
        setCurrentUserData(null);
        setShowUserPopup(false);
        setIsEditing(false);
        setShowPassword(false);
        setUpdateMessage('');
      }
    };

    // Check session every 30 seconds
    const interval = setInterval(checkSession, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);


  
  // Navigation items with content for dropdowns
  const navItems = [
    {
      name: 'CATÉGORIES',
      hover: 'categories',
      href: '/categories',
      content: (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Nos Catégories</h3>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {categories.slice(0, 4).map((cat, i) => (
              <Link 
                key={cat.id || i} 
                href={`/categories/${cat.slug || 'category'}`}
                className="group block transform transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden border border-gray-100 h-full">
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img 
                      src={cat.img || cat.image || '/images/category-placeholder.jpg'} 
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 line-clamp-1">{cat.name}</h3>
                    <p className="mt-2 text-sm text-gray-500">{cat.products?.length || 0} produits</p>
                    <div className="mt-3">
                      <span className="inline-flex items-center text-sm font-medium text-emerald-700 group-hover:text-emerald-800">
                        Explorer
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )
    },
    {
      name: 'MEILLEURES VENTES',
      hover: 'bestsellers',
      href: '/best-sellers',
      content: (
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Nos Meilleures Ventes</h3>
          <div className="grid grid-cols-4 gap-6">
            {products
              .filter(p => p.sales_count > 0)
              .sort((a, b) => b.sales_count - a.sales_count)
              .slice(0, 4)
              .map((product, i) => (
                <Link 
                  key={product.id || i}
                  href={`/products/${product.slug || product.id}`}
                  className="group block"
                >
                  <div className="relative">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={product.img || product.image || product.images?.[0] || '/images/product-placeholder.jpg'} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    {/* Meilleur Vente tag */}
                    <div className="absolute bottom-2 left-2 bg-yellow-500/95 text-white text-[11px] font-semibold px-2 py-1 rounded-full shadow-sm">
                      Meilleur Vente
                    </div>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-emerald-600 font-medium">{product.price} DH</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
          <div className="mt-2" />
        </div>
      )
    },
    {
      name: 'PROMOTIONS',
      hover: 'promotions',
      href: '/promotions',
      content: (
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Promotions en cours</h3>
          {promotions.length > 0 ? (
            <>
              <div className="grid grid-cols-4 gap-6">
                {promotions.slice(0, 4).map((promo, i) => (
                  <Link 
                    key={promo.id || i}
                    href={`/promotions/${promo.slug || promo.id}`}
                    className="group block"
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                      <img 
                        src={promo.img || promo.image || '/images/promo-placeholder.jpg'} 
                        alt={promo.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{promo.discount}%
                      </div>
                    </div>
                    <div className="mt-3">
                      <h4 className="font-medium text-gray-900">{promo.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{promo.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link href="/promotions" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium">
                  Voir toutes les promotions
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3" />
              <p className="text-gray-500">Aucune promotion en ce moment</p>
            </div>
          )}
        </div>
      )
    },
    {
      name: 'CONTACT',
      hover: 'contact',
      href: '/contact',
      content: (
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Contactez-nous</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Informations de contact</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-emerald-50 p-2 rounded-lg mr-3 flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-gray-700">Appelez-nous</p>
                    <div className="flex items-center mt-1">
                      <a href="tel:+212612345678" className="text-emerald-600 hover:text-emerald-700 font-medium">
                        +212 6 12 34 56 78
                      </a>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText('+212 6 12 34 56 78');
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="ml-2 text-gray-400 hover:text-emerald-600 transition-colors"
                        title="Copier le numéro"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {copied && (
                        <span className="ml-2 text-xs text-emerald-600">
                          Copié !
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-emerald-50 p-2 rounded-lg mr-3 flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-gray-700">Email</p>
                    <a href="mailto:contact@bioecleel.ma" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      contact@bioecleel.ma
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Heures d'ouverture</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span className="font-medium">9h - 19h</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Samedi</span>
                    <span className="font-medium">10h - 18h</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="font-medium">Fermé</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link href="/contact" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium">
              Voir la page contact complète
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      )
    }
  ];

  // Update tabs width on resize
  useEffect(() => {
    const updateMetrics = () => {
      if (tabsRef.current) {
        const width = tabsRef.current.offsetWidth;
        setTabsWidth(width);
        // center the dropdown under the tabs group (screen-centered)
        const left = Math.max(0, (window.innerWidth - width) / 2);
        setDropdownLeft(left);
      }
    };
    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    return () => window.removeEventListener('resize', updateMetrics);
  }, []);

  // Handle copy to clipboard
  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+212 6 12 34 56 78');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle navigation with Inertia
  const handleNavigation = (path) => {
    router.visit(`/${path}`);
  };

  // User popup functions
  const openUserPopup = () => {
    // Check if user is authenticated before opening popup
    if (!isAuthenticated()) {
      return;
    }

    const userToUse = currentUserData || user;
    if (userToUse) {
      setUserForm({
        name: userToUse.name || '',
        email: userToUse.email || '',
        phone: (userToUse.phone && userToUse.phone !== '0') ? userToUse.phone : '',
        address: userToUse.address || '',
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
        
        // Update user data in real-time
        const userToUpdate = currentUserData || user;
        if (userToUpdate) {
          const updatedUser = {
            ...userToUpdate,
            name: userForm.name,
            email: userForm.email,
            phone: userForm.phone,
            address: userForm.address
          };
          
          // Update current user data state
          setCurrentUserData(updatedUser);
          
          // Update localStorage if it exists
          const userData = localStorage.getItem('user');
          if (userData) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          
          // Force re-render by updating the refresh key
          setPopupRefreshKey(prev => prev + 1);
          
          // Also update the user context if available
          if (window.updateUserContext) {
            window.updateUserContext(updatedUser);
          }
        }
        
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
                
                {/* User Popup - positioned exactly under button */}
                {showUserPopup && (
                  <div 
                    key={popupRefreshKey}
                    className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl border border-gray-200 z-[99999] user-popup"
                    onMouseEnter={() => setShowUserPopup(true)}
                    onMouseLeave={() => setShowUserPopup(false)}
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-t-xl text-white">
                      <div className="flex items-center space-x-3">
                        <User className="w-6 h-6 text-white" />
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
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900">{safeUserData((currentUserData || user)?.name, 'Utilisateur')}</h4>
                                {shouldDisplay((currentUserData || user)?.email) && (
                                  <p className="text-sm text-gray-600">{(currentUserData || user).email}</p>
                                )}
                                {(currentUserData || user)?.is_admin === 1 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Admin
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Info */}
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                              <Mail className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="text-sm font-medium text-gray-900">{safeUserData((currentUserData || user)?.email)}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                              <Phone className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="text-sm text-gray-600">Téléphone</p>
                                <p className="text-sm font-medium text-gray-900">{safeUserData((currentUserData || user)?.phone)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2 pt-3 border-t border-gray-200">
                            <button
                              onClick={() => setIsEditing(true)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 text-sm font-medium"
                            >
                              <Edit3 className="w-4 h-4" />
                              Modifier
                            </button>
                            
                            {(currentUserData || user)?.is_admin === 1 && (
                              <button
                                onClick={() => {
                                  closeUserPopup();
                                  navigateTo('admin-dashboard');
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium"
                              >
                                <Crown className="w-4 h-4" />
                                Admin Dashboard
                              </button>
                            )}
                            
                            <button
                              onClick={logout}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 text-sm font-medium"
                            >
                              <LogOut className="w-4 h-4" />
                              Se déconnecter
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Edit Form - Scrollable version */
                        <div 
                          className="max-h-96 overflow-y-auto"
                          onWheel={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const element = e.currentTarget;
                            const delta = e.deltaY;
                            element.scrollTop += delta;
                          }}
                          onTouchMove={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onScroll={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <div className="flex items-center justify-between mb-4">
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
                            <div className={`p-3 rounded-lg text-sm mb-4 ${
                              updateMessage.includes('succès') 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              {updateMessage}
                            </div>
                          )}

                          <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }} className="space-y-4">
                            {/* Basic Information */}
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nom complet</label>
                                <input
                                  type="text"
                                  value={userForm.name}
                                  onChange={(e) => handleUserFormChange('name', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                <input
                                  type="email"
                                  value={userForm.email}
                                  onChange={(e) => handleUserFormChange('email', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
                                <input
                                  type="tel"
                                  value={userForm.phone}
                                  onChange={(e) => handleUserFormChange('phone', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse</label>
                                <input
                                  type="text"
                                  value={userForm.address}
                                  onChange={(e) => handleUserFormChange('address', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
                                />
                              </div>
                            </div>

                            {/* Password Section */}
                            <div className="border-t border-gray-200 pt-4">
                              <h5 className="text-sm font-semibold text-gray-900 mb-3">Changer le mot de passe</h5>
                              
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe actuel</label>
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
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setShowPassword(!showPassword);
                                      }}
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nouveau</label>
                                    <input
                                      type="password"
                                      value={userForm.newPassword}
                                      onChange={(e) => handleUserFormChange('newPassword', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
                                      placeholder="Nouveau"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmer</label>
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
                            <div className="flex gap-2 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
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

        {/* Beautiful Navigation Menu with Hover Dropdowns */}
        <nav className={`hidden md:block relative transition-all duration-500 ease-in-out ${
          isScrollingDown
            ? 'opacity-0 -translate-y-4 pointer-events-none max-h-0 py-0 mt-0'
            : 'opacity-100 translate-y-0 pointer-events-auto max-h-16 py-3 mt-2'
        }`}>
          <div className="flex items-center justify-center space-x-1">
            {/* Categories Menu */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveMenu('categories')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                onClick={navigateToCategories}
                className={`relative flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-white font-semibold transition-all duration-300 rounded-xl group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-green-600 group-hover:shadow-lg ${
                  isScrollingDown ? 'scale-95' : 'scale-100'
                }`}
              >
                <Package className="w-4 h-4" />
                Catégories
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              
              {/* Categories Dropdown */}
              {activeMenu === 'categories' && (
                <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-2xl border border-green-100 z-50 mt-2 overflow-hidden animate-fade-in-up">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-green-600" />
                      Nos Catégories
                    </h3>
                    <div className="grid gap-3">
                      {categories.slice(0, 4).map((category, index) => (
                        <button
                          key={category.id || index}
                          onClick={() => navigateTo('category', category.title)}
                          className="flex items-center gap-3 p-3 text-left hover:bg-green-50 rounded-xl transition-all duration-200 group/item"
                          onMouseEnter={() => setHoveredCategory(index)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                            hoveredCategory === index 
                              ? 'bg-green-500 text-white scale-110' 
                              : 'bg-green-100 text-green-600'
                          }`}>
                            <Leaf className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 group-hover/item:text-green-600 transition-colors">
                              {category.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {products.filter(p => p.category?.title === category.title || p.category === category.title).length} produits
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover/item:text-green-600 transition-colors" />
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={navigateToCategories}
                      className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Voir toutes les catégories
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>


            {/* Best Sellers Menu */}
            <button
              onClick={() => navigateTo('best-sellers')}
              className={`relative flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-white font-semibold transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:shadow-lg ${
                isScrollingDown ? 'scale-95' : 'scale-100'
              }`}
            >
              <Crown className="w-4 h-4" />
              Meilleures Ventes
            </button>

            {/* Promotions Menu */}
            <button
              onClick={() => navigateTo('promotions')}
              className={`relative flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-white font-semibold transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:shadow-lg ${
                isScrollingDown ? 'scale-95' : 'scale-100'
              }`}
            >
              <Percent className="w-4 h-4" />
              Promotions
            </button>

            {/* Contact Menu */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveMenu('contact')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className={`relative flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-white font-semibold transition-all duration-300 rounded-xl group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-green-600 group-hover:shadow-lg ${
                  isScrollingDown ? 'scale-95' : 'scale-100'
                }`}
              >
                <Phone className="w-4 h-4" />
                Contact
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              
              {/* Contact Dropdown */}
              {activeMenu === 'contact' && (
                <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-2xl border border-blue-100 z-50 mt-2 overflow-hidden animate-fade-in-up">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-blue-600" />
                      Nous Contacter
                    </h3>
                    <div className="space-y-4">
                      {/* Phone Number with Copy Functionality */}
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Téléphone</div>
                            <div className="text-xl font-bold text-blue-700">0653561000</div>
                            <div className="text-xs text-gray-500 mt-1">Service client disponible 24/7</div>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText('0653561000');
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
                          >
                            {copied ? (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs">Copié!</span>
                              </div>
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {/* Email */}
                      <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all duration-200">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <Mail className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Email</div>
                          <div className="text-sm text-gray-500">contact.bioekleel@gmail.com</div>
                        </div>
                      </div>
                      
                      {/* Address */}
                      <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all duration-200">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Adresse</div>
                          <div className="text-sm text-gray-500">Casablanca, Maroc</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

      </div>



      {/* Beautiful Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-xl relative z-[9999]">
          <div className="px-4 py-3">
            <nav className="space-y-1">
              <button
                onClick={() => { 
                  setIsMobileMenuOpen(false);
                  handleFavoritesClick();
                }}
                className="block w-full text-left px-4 py-3 text-gray-800 font-medium text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100 hover:text-pink-700 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              >
                Mes Favoris
              </button>
              
              <button
                onClick={() => { navigateToCategories(); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-gray-800 font-medium text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              >
                Catégories
              </button>
              
              <button
                onClick={() => { navigateTo('best-sellers'); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-gray-800 font-medium text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              >
                Meilleures Ventes
              </button>
              
              <button
                onClick={() => { navigateTo('promotions'); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-gray-800 font-medium text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              >
                Promotions
              </button>
              
              <button
                onClick={() => { setActiveMenu('contact'); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-gray-800 font-medium text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              >
                Contact
              </button>
              
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left px-4 py-3 text-gray-800 font-medium text-base rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              >
                Contact
              </button>
            </nav>
          </div>
        </div>
      )}

    </header>
  );
}
