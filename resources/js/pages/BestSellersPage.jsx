import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Heart, ShoppingCart, ArrowLeft, Trophy, 
  Flame, TrendingUp, Award, Zap, Crown, Search, Filter, Leaf
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';

const BestSellersPage = ({ navigateTo }) => {
  const { addToCart } = useCart();
  const { addToFavorites, removeFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [addingToFavorites, setAddingToFavorites] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('sales');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Get best selling products with filters
  const getBestSellingProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        // The API returns products directly, not wrapped in a 'products' property
        const allProducts = Array.isArray(data) ? data : [];
        // Filter products that have "meilleur vente" badge (sales_count > 0 or isBestSeller flag)
        const bestSellers = allProducts.filter(product => 
          product.sales_count > 0 || product.isBestSeller || product.badge === 'meilleur vente'
        );
        setProducts(bestSellers);
        setFilteredProducts(bestSellers);
      }
    } catch (error) {
      console.error('Error fetching best sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBestSellingProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort filter
    switch (sortBy) {
      case 'sales':
        filtered.sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, sortBy]);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated()) {
      navigateTo('auth');
      return;
    }
    
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    try {
      await addToCart(product.id, 1, product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleToggleFavorite = async (e, product) => {
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      navigateTo('auth');
      return;
    }

    setAddingToFavorites(prev => ({ ...prev, [product.id]: true }));
    
    try {
      if (isFavorite(product.id)) {
        await removeFavorite(product.id);
      } else {
        await addToFavorites(product);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setAddingToFavorites(prev => ({ ...prev, [product.id]: false }));
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-600 text-lg">Chargement des meilleures ventes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-orange-50/20 to-amber-50/30 py-12 overflow-hidden">
        {/* Beautiful background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-100/15 via-amber-50/10 to-orange-100/20"></div>
          
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
              className="absolute rounded-full bg-gradient-to-r from-orange-200/30 to-amber-300/30 blur-xl"
              style={{
                width: `${60 + Math.random() * 80}px`,
                height: `${60 + Math.random() * 80}px`,
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
            />
          ))}
          
          {/* Mesh gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(249,115,22,0.06),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(245,158,11,0.04),transparent_50%)]"></div>
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
                className="inline-flex items-center gap-3 mb-8 px-8 py-4 bg-gradient-to-r from-orange-100/70 to-amber-100/70 backdrop-blur-sm rounded-full border border-orange-200/50 shadow-lg"
              >
                <Trophy className="w-6 h-6 text-orange-600" />
                <span className="text-orange-700 font-bold text-sm uppercase tracking-wider">
                  Meilleures Ventes
                </span>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight"
              >
                <span className="text-gray-800">Nos </span>
                <div className="relative inline-block">
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600"
                    style={{
                      background: 'linear-gradient(90deg, #f97316, #f59e0b, #ea580c, #fbbf24, #d97706, #f97316)',
                      backgroundSize: '300% auto',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      animation: 'gradient-shift 4s ease-in-out infinite'
                    }}
                  >
                    Meilleures Ventes
                  </motion.span>
                  {/* Decorative elements */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400/30 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -bottom-1 -left-1 w-4 h-4 bg-amber-400/40 rounded-full"
                  />
                </div>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6"
              >
                Découvrez notre sélection des{" "}
                <span className="font-bold text-orange-600 bg-orange-100/50 px-2 py-1 rounded-lg">produits les plus vendus</span>{" "}
                et les mieux notés par nos clients{" "}
                <span className="text-amber-600 font-semibold">satisfaits</span>
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
                { text: "100% Naturel", color: "from-orange-500 to-amber-500" },
                { text: "Qualité Premium", color: "from-amber-500 to-orange-600" },
                { text: "Livraison Rapide", color: "from-orange-600 to-amber-600" },
                { text: "Paiement Sécurisé", color: "from-amber-600 to-orange-500" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/70 backdrop-blur-sm px-8 py-4 rounded-full border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
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

      {/* Search and Filter Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-orange-100 shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher parmi les meilleures ventes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-orange-50/50"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-4 h-4" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-orange-50/50 appearance-none cursor-pointer"
                >
                  <option value="sales">Plus vendus</option>
                  <option value="rating">Mieux notés</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">

          {/* Section Title */}
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Produits Stars
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ces produits exceptionnels ont conquis le cœur de nos clients et continuent de briller par leur qualité
          </p>
        </div>

        {/* Products Grid - Smaller Cards like All Products */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
                <img
                  src={product.img || product.image || '/images/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Best Seller Badge */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  Meilleur Vente
                </div>

                {/* Sales Count Badge */}
                <div className="absolute top-3 right-3 bg-white/90 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                  {product.sales_count || 0} ventes
                </div>

                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => handleToggleFavorite(e, product)}
                    disabled={addingToFavorites[product.id]}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isAuthenticated() && isFavorite(product.id)
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-white/90 text-orange-600 hover:bg-orange-500 hover:text-white'
                    }`}
                    title={isAuthenticated() && isFavorite(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    <Heart className={`w-4 h-4 ${isAuthenticated() && isFavorite(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={addingToCart[product.id]}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 transform translate-y-full group-hover:translate-y-0 disabled:opacity-50"
                >
                  {addingToCart[product.id] ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Ajout...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Ajouter au panier
                    </>
                  )}
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    {product.category?.title || product.category || 'Produit'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 0) 
                          ? 'text-orange-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">({product.reviews || 0})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-orange-600">
                      {Number(product.price || 0).toFixed(2)} DH
                    </span>
                    {product.old_price && (
                      <span className="text-sm text-gray-500 line-through">
                        {Number(product.old_price).toFixed(2)} DH
                      </span>
                    )}
                  </div>
                  
                  {product.discount > 0 && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{product.discount}%
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-16 h-16 text-orange-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {searchTerm ? 'Aucun résultat trouvé' : 'Aucune vente pour le moment'}
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              {searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Les meilleures ventes apparaîtront ici'}
            </p>
                        <button
              onClick={() => navigateTo('products')}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
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

export default BestSellersPage;