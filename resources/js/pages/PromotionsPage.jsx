import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Heart, ShoppingCart, ArrowLeft, Tag, 
  Flame, Percent, Clock, Zap, Gift, ChevronLeft, ChevronRight, Search, Filter, Sparkles, X
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';

const PromotionsPage = ({ navigateTo }) => {
  const { addToCart } = useCart();
  const { addToFavorites, removeFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [addingToFavorites, setAddingToFavorites] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('discount');
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [promotionsPerPage] = useState(6);

  // Get promotions from database
  const getPromotions = async () => {
    try {
      setLoading(true);
      console.log('🔄 PromotionsPage: Fetching promotions...');
      const response = await fetch('/api/promotions');
      console.log('📡 PromotionsPage: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📦 PromotionsPage: Raw data received:', data);
        
        // Handle direct array response from API
        const allPromotions = Array.isArray(data) ? data : [];
        console.log('📊 PromotionsPage: All promotions count:', allPromotions.length);
        
        setPromotions(allPromotions);
        setFilteredPromotions(allPromotions);
      } else {
        console.error('❌ PromotionsPage: Failed to fetch promotions, status:', response.status);
      }
    } catch (error) {
      console.error('💥 PromotionsPage: Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPromotions();
  }, []);

  // Filter and sort promotions
  useEffect(() => {
    let filtered = [...promotions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(promotion =>
        promotion.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort filter
    switch (sortBy) {
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        break;
      default:
        break;
    }

    setFilteredPromotions(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [promotions, searchTerm, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPromotions.length / promotionsPerPage);
  const startIndex = (currentPage - 1) * promotionsPerPage;
  const currentPromotions = filteredPromotions.slice(startIndex, startIndex + promotionsPerPage);

  const handleAddToCart = async (promotion) => {
    if (!isAuthenticated()) {
      navigateTo('auth');
      return;
    }
    
    setAddingToCart(prev => ({ ...prev, [promotion.id]: true }));
    
    try {
      if (promotion.productId) {
        await addToCart(promotion.productId, 1);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [promotion.id]: false }));
    }
  };

  const handleToggleFavorite = async (e, promotion) => {
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      navigateTo('auth');
      return;
    }

    setAddingToFavorites(prev => ({ ...prev, [promotion.id]: true }));
    
    try {
      if (isFavorite(promotion.id)) {
        await removeFavorite(promotion.id);
      } else {
        await addToFavorites(promotion);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setAddingToFavorites(prev => ({ ...prev, [promotion.id]: false }));
    }
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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-red-600 text-lg">Chargement des promotions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Hero Section */}
      <section className="relative bg-white py-20 overflow-hidden">
        {/* Minimal Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-red-50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-rose-50 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center text-gray-900 max-w-4xl mx-auto"
          >
            {/* Modern Title */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-red-50 rounded-full border border-red-100">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-700 font-semibold text-sm uppercase tracking-wider">
                  Offres Spéciales
                </span>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                <span className="text-gray-900">Nos </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-red-700">
                  Promotions
                </span>
              </h1>
            </motion.div>

            {/* Modern Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto"
            >
              Découvrez notre univers de{" "}
              <span className="font-semibold text-red-600">promotions exceptionnelles</span>{" "}
              et profitez d'économies incroyables
            </motion.p>

            {/* Modern Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-red-100 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-lg group-hover:border-red-200 transition-all duration-300">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-500 w-6 h-6 transition-colors duration-300" />
                  <input
                    type="text"
                    placeholder="Rechercher une promotion..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-16 py-5 text-lg bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-300"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
            </div>
          </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">

        {/* Promotions Grid - Large Cards like Home Page */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {currentPromotions.map((promotion, index) => (
            <motion.div
              key={promotion.id}
              variants={itemVariants}
              className="group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 border border-red-100/50 backdrop-blur-sm"
              style={{
                backgroundImage: promotion.image || promotion.img || promotion.backgroundImage ?
                  `url(${promotion.image || promotion.img || promotion.backgroundImage})` :
                  'linear-gradient(135deg, #ef4444, #f87171)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '500px'
              }}
            >
              {/* Modern gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30"></div>
              
              {/* Animated decorative elements */}
              <div className="absolute top-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-8 left-8 w-24 h-24 bg-red-400/20 rounded-full blur-2xl animate-bounce" style={{animationDuration: '4s'}}></div>
              <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-yellow-400/15 rounded-full blur-xl animate-ping" style={{animationDuration: '5s'}}></div>
              <div className="absolute top-1/4 right-1/3 w-16 h-16 bg-rose-400/20 rounded-full blur-lg animate-pulse" style={{animationDuration: '3s'}}></div>
              
              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-white/40 rounded-full animate-float"
                    style={{
                      left: `${15 + i * 12}%`,
                      top: `${25 + (i % 4) * 15}%`,
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: `${4 + i * 0.2}s`
                    }}
                  ></div>
                ))}
              </div>
              
              {/* Geometric shapes */}
              <div className="absolute top-16 left-16 w-8 h-8 border-2 border-white/20 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
              <div className="absolute bottom-16 right-16 w-6 h-6 bg-white/10 rounded-full animate-ping" style={{animationDuration: '6s'}}></div>
              
              <div className="relative z-10 p-6 md:p-8 lg:p-10 h-full flex flex-col justify-center items-start text-left">
                <div className="max-w-2xl">
                  {/* Modern "Offre Limitée" Badge */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-base mb-6 md:mb-8 shadow-2xl backdrop-blur-md border border-red-400/30">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full animate-ping"></span>
                      <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full animate-ping" style={{animationDelay: '0.2s'}}></span>
                      <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full animate-ping" style={{animationDelay: '0.4s'}}></span>
                    </div>
                    <span className="tracking-wider">OFFRE LIMITÉE</span>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full animate-ping" style={{animationDelay: '0.6s'}}></span>
                      <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full animate-ping" style={{animationDelay: '0.8s'}}></span>
                      <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></span>
                    </div>
                  </div>
                  
                  {/* Modern Title with gradient text */}
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-white via-white to-red-200 bg-clip-text text-transparent drop-shadow-lg">
                      {promotion.title}
                    </span>
                  </h3>
                  
                  {/* Subtitle if available */}
                  {promotion.subtitle && (
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-3 sm:mb-4 md:mb-5 font-semibold drop-shadow-md">
                      {promotion.subtitle}
                    </p>
                  )}
                  
                  {/* Modern Description */}
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/85 mb-6 sm:mb-8 md:mb-10 leading-relaxed font-medium drop-shadow-md">
                    {promotion.description}
                  </p>
                  
                  {/* Modern CTA Button with glassmorphism */}
                  <button 
                    onClick={() => {
                      if (promotion.product_id) {
                        navigateTo('product', { productId: promotion.product_id });
                      }
                    }}
                    className="group/btn relative bg-white/95 backdrop-blur-md text-red-600 px-6 py-3 md:px-8 md:py-4 rounded-2xl font-bold text-sm md:text-base hover:bg-white transition-all duration-500 transform hover:scale-105 hover:shadow-2xl flex items-center gap-2 md:gap-3 border border-white/20 shadow-xl"
                  >
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-2xl blur-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                    
                    <span className="relative z-10 tracking-wide">Profiter de l'offre</span>
                    <svg className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                  </button>
                </div>
              </div>
              
              {/* Modern hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/8 to-rose-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* Border glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500/30 via-transparent to-rose-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </button>
            
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === index + 1
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredPromotions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Tag className="w-16 h-16 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {searchTerm ? 'Aucune promotion trouvée' : 'Aucune promotion disponible'}
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              {searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Revenez bientôt pour découvrir nos offres spéciales'}
            </p>
                    <button
              onClick={() => navigateTo('products')}
              className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
              Voir tous les produits
                    </button>
          </motion.div>
            )}
        </div>
      </section>
    </div>
  );
};

export default PromotionsPage;