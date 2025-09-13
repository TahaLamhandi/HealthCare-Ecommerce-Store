import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, ShoppingCart, Search, Filter, Leaf, AlertCircle } from 'lucide-react';
import { AppContext } from '../contexts/AppContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createPortal } from 'react-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';

function AllProducts({ navigateTo }) {
  const { products: allProducts, loading } = useContext(AppContext);
  const { isFavorite, addToFavorites, removeFavorite } = useFavorites();
  const { addToCart, cartItems } = useCart();
  const { isAuthenticated } = useAuth();
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [popupProductId, setPopupProductId] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  // Ensure we use ALL products (not limited like homepage)
  const products = allProducts || [];

  // Debug: Log products count
  console.log('🔍 AllProducts - Total products from context:', allProducts?.length || 0);
  console.log('🔍 AllProducts - Loading state:', loading);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const productsPerPage = 6;

  // Handle scroll for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter products based on search, category, and price
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ||
                           product.category?.title === selectedCategory ||
                           product.category?.name === selectedCategory;

    let matchesPrice = true;
    if (priceRange !== 'all') {
      const price = parseFloat(product.price);
      switch (priceRange) {
        case '0-25':
          matchesPrice = price <= 25;
          break;
        case '25-50':
          matchesPrice = price > 25 && price <= 50;
          break;
        case '50-100':
          matchesPrice = price > 50 && price <= 100;
          break;
        case '100+':
          matchesPrice = price > 100;
          break;
      }
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  // Get unique categories from both category.name and category.title
  const categories = [...new Set(products.map(product =>
    product.category?.title || product.category?.name
  ).filter(Boolean))];

  // Compute top 10 best sellers to show the 'Meilleur Vente' tag (same as homepage)
  const topBestSellerIds = products
    .filter(p => (p?.sales_count || 0) > 0)
    .sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0))
    .slice(0, 10)
    .map(p => p.id);

  const handleFavoriteClick = async (product, e) => {
    e.stopPropagation();
    if (!isAuthenticated()) {
      navigateTo('auth');
      return;
    }
    
    if (isFavorite(product.id)) {
      await removeFavorite(product.id);
    } else {
      await addToFavorites(product);
    }
  };

  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    if (!isAuthenticated()) {
      navigateTo('auth');
      return;
    }

    // Check if product is already in cart
    const isInCart = cartItems.find(item => item.id === product.id || item.product_id === product.id);
    if (isInCart) {
      // Get button position for popup
      const buttonRect = e.target.getBoundingClientRect();
      setPopupPosition({
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top - 10
      });
      setPopupProductId(product.id);
      setShowCartPopup(true);
      setTimeout(() => setShowCartPopup(false), 3000);
      return;
    }

    await addToCart(product.id, 1, product);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading || products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Chargement des produits...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">{/* Removed Header - it's handled by App.jsx */}
      
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-green-50/20 to-emerald-50/30 py-12 overflow-hidden">
        {/* Beautiful background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-100/15 via-emerald-50/10 to-green-100/20"></div>
          
          {/* Floating orbs */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
              className="absolute rounded-full bg-gradient-to-r from-green-200/30 to-emerald-300/30 blur-xl"
              style={{
                width: `${60 + Math.random() * 80}px`,
                height: `${60 + Math.random() * 80}px`,
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
            />
          ))}
          
          {/* Mesh gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,197,94,0.06),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.04),transparent_50%)]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Enhanced Title Section */}
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 mb-8 px-8 py-4 bg-gradient-to-r from-green-100/70 to-emerald-100/70 backdrop-blur-sm rounded-full border border-green-200/50 shadow-lg"
              >
                <Leaf className="w-6 h-6 text-green-600" />
                <span className="text-green-700 font-bold text-sm uppercase tracking-wider">
                  Collection Complète
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight"
              >
                <span className="text-gray-800">Tous nos </span>
                <div className="relative inline-block">
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-400 to-green-600"
                    style={{
                      background: 'linear-gradient(90deg, #22c55e, #10b981, #059669, #34d399, #16a34a, #22c55e)',
                      backgroundSize: '300% auto',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      animation: 'gradient-shift 4s ease-in-out infinite'
                    }}
                  >
                    Produits
                  </motion.span>
                  {/* Decorative elements */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-400/30 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-400/40 rounded-full"
                  />
                </div>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6"
              >
                Découvrez notre gamme complète de{" "}
                <span className="font-bold text-green-600 bg-green-100/50 px-2 py-1 rounded-lg">produits naturels</span>{" "}
                soigneusement sélectionnés pour votre{" "}
                <span className="text-emerald-600 font-semibold">bien-être et votre santé</span>
              </motion.p>
            </div>

            {/* Enhanced Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-6 lg:gap-8"
            >
              {[
                { text: "100% Naturel", color: "from-green-500 to-emerald-500" },
                { text: "Qualité Premium", color: "from-emerald-500 to-green-600" },
                { text: "Livraison Rapide", color: "from-green-600 to-emerald-600" },
                { text: "Paiement Sécurisé", color: "from-emerald-600 to-green-500" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/70 backdrop-blur-sm px-8 py-4 rounded-full border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${feature.color} font-bold text-base lg:text-lg`}>
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Main Content Section */}
      <section className="relative py-6 bg-gradient-to-br from-white via-green-50/10 to-emerald-50/15 overflow-hidden">
        {/* Subtle background patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-100/5 via-transparent to-emerald-100/5"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/3 left-1/6 w-72 h-72 bg-green-200/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/6 w-72 h-72 bg-emerald-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

          {/* Left Sidebar - Beautiful Filters */}
          <div className="lg:w-1/4">
            <div className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl shadow-xl p-6 sticky top-4 border border-green-100/50 backdrop-blur-sm filters-sidebar">
              {/* Enhanced Filter Header */}
              <div className="text-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full animate-shimmer"></div>
                  <Search className="w-8 h-8 text-white relative z-10" />
                </motion.div>
                <h3 className="text-2xl font-black mb-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-green-700">
                    Filtres
                  </span>
                </h3>
                <p className="text-gray-600 text-sm font-medium">Trouvez votre produit idéal</p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>

              {/* Search Filter */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Rechercher un produit
                </label>
                <input
                  type="text"
                  placeholder="Tapez le nom du produit..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-800"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Gamme de prix
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-800"
                >
                  <option value="all">Tous les prix</option>
                  <option value="0-25">0 DH - 25 DH</option>
                  <option value="25-50">25 DH - 50 DH</option>
                  <option value="50-100">50 DH - 100 DH</option>
                  <option value="100+">100 DH et plus</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Trier par
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-800"
                >
                  <option value="name">Nom (A-Z)</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                  <option value="newest">Plus récents</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 text-center mb-4 border border-green-200/50">
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                  {sortedProducts.length}
                </div>
                <div className="text-gray-600 font-medium text-sm">
                  produit{sortedProducts.length !== 1 ? 's' : ''} trouvé{sortedProducts.length !== 1 ? 's' : ''}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Page {currentPage} sur {totalPages}
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange('all');
                  setSortBy('name');
                  setCurrentPage(1);
                }}
                className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          </div>

          {/* Right Content - Products */}
          <div className="lg:w-3/4 products-content">
            {/* Products Header */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    Nos Produits
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Découvrez notre sélection de produits naturels et bio
                  </p>
                </div>
                <div className="text-xs text-gray-500 bg-green-50 px-3 py-2 rounded-full">
                  Page {currentPage} sur {totalPages}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              <>
                {/* Products Grid - 3 per row for better display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 justify-items-center mx-auto max-w-6xl px-4 mb-6">
                  {currentProducts.map((product, index) => {
                    const hasDiscount = !!product.discount && Number(product.discount) > 0;

                    return (
                      <div
                        key={product.id}
                        className="professional-product-card w-full max-w-[280px] cursor-pointer"
                        onClick={() => navigateTo('product', { productId: product.id })}
                      >
                        <div className="product-image-container relative">
                          {product.img ? (
                            <img
                              src={product.img}
                              alt={product.name}
                              width={400}
                              height={220}
                              className="product-image"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}

                          {/* Fallback image placeholder */}
                          <div
                            className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-400 rounded-t-2xl"
                            style={{ display: product.img ? 'none' : 'flex' }}
                          >
                            <span className="text-sm font-medium">Image non disponible</span>
                          </div>

                          {/* Badges: Nouveau, Discount, Meilleur Vente */}
                          {(Boolean(product.isNew) || hasDiscount || topBestSellerIds.includes(product.id)) && (
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                              {Boolean(product.isNew) && (
                                <span className="product-badge-new">Nouveau</span>
                              )}
                              {hasDiscount && (
                                <span className="product-badge-discount">-{Number(product.discount)}%</span>
                              )}
                              {topBestSellerIds.includes(product.id) && (
                                <span className="bg-yellow-500/95 text-white text-[11px] font-semibold px-2 py-1 rounded-full shadow-sm">
                                  Meilleur Vente
                                </span>
                              )}
                            </div>
                          )}

                          {/* Favorites (heart) button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleFavoriteClick(product, e); }}
                            className={`product-heart-btn absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isAuthenticated() && isFavorite(product.id)
                                ? 'bg-red-500 text-white shadow-lg'
                                : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                            }`}
                            aria-label="Ajouter aux favoris"
                          >
                            <Heart className={`w-5 h-5 ${isAuthenticated() && isFavorite(product.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Product Info */}
                        <div className="product-info">
                          <span className="product-category-badge">
                            {product.category?.title || product.category?.name || 'Produit'}
                          </span>
                          <h3 className="product-name">{product.name}</h3>
                          <p className="product-description">{product.description}</p>

                          {/* Rating */}
                          <div className="product-rating">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`rating-star ${i < (product.rating || 4.5) ? "filled" : "empty"}`}
                              />
                            ))}
                            <span className="rating-count">({product.reviews || 0} avis)</span>
                          </div>

                          {/* Price + Cart button */}
                          <div className="product-price-container">
                            <div>
                              {hasDiscount ? (
                                <>
                                  <span className="product-price-discounted">
                                    {(product.price * (1 - Number(product.discount) / 100)).toFixed(2)} DH
                                  </span>
                                  <span className="product-price-original">{product.price} DH</span>
                                </>
                              ) : (
                                <span className="product-price">{product.price} DH</span>
                              )}
                            </div>
                            <div className="relative">
                              <button
                                className="product-cart-btn"
                                onClick={(e) => { e.stopPropagation(); handleAddToCart(product, e); }}
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Panier
                              </button>
                              
                              {/* Cart Popup - Rendered via Portal */}
                              {showCartPopup && popupProductId === product.id && createPortal(
                                <AnimatePresence>
                                  <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="fixed z-[9999] pointer-events-none"
                                    style={{
                                      left: `${popupPosition.x}px`,
                                      top: `${popupPosition.y}px`,
                                      transform: 'translateX(-50%)'
                                    }}
                                  >
                                    <div className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 whitespace-nowrap text-sm">
                                      <AlertCircle className="w-3 h-3" />
                                      <span className="font-medium">Déjà dans le panier</span>
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-red-500"></div>
                                    </div>
                                  </motion.div>
                                </AnimatePresence>,
                                document.body
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <div className="bg-white rounded-xl shadow-lg p-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-lg transition-all duration-200 text-sm"
                        >
                          ← Précédent
                        </button>

                        {[...Array(totalPages)].map((_, index) => {
                          const page = index + 1;
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 2 && page <= currentPage + 2)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-2 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
                                  currentPage === page
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (
                            page === currentPage - 3 ||
                            page === currentPage + 3
                          ) {
                            return <span key={page} className="px-2 text-gray-400">...</span>;
                          }
                          return null;
                        })}

                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-lg transition-all duration-200 text-sm"
                        >
                          Suivant →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      </section>
      {/* Removed Footer - it's handled by App.jsx */}
    </div>
  );
}

// Export the component
export default AllProducts;
