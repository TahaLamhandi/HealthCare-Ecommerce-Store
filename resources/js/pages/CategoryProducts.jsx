import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, ShoppingCart, Search, ArrowLeft, Package, Leaf, AlertCircle } from 'lucide-react';
import { AppContext } from '../contexts/AppContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createPortal } from 'react-dom';

function CategoryProducts({ navigateTo, categoryId, categoryName }) {
  const { products: allProducts, loading } = useContext(AppContext);
  const { isFavorite, addToFavorites, removeFavorite } = useFavorites();
  const { addToCart, cartItems } = useCart();
  const { isAuthenticated } = useAuth();
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [popupProductId, setPopupProductId] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  const productsPerPage = 9;
  
  // Filter products by category
  const categoryProducts = allProducts.filter(product => 
    product.categorie_id === parseInt(categoryId)
  );
  
  // Filter products based on search
  const filteredProducts = categoryProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
  
  // Compute top 10 best sellers to show the 'Meilleur Vente' tag
  const topBestSellerIds = allProducts
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
  
  if (loading || !categoryId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Chargement des produits...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      
      {/* Beautiful Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 left-10 text-white/20">
          <Package className="w-32 h-32 transform rotate-12" />
        </div>
        <div className="absolute bottom-10 right-10 text-white/20">
          <Leaf className="w-24 h-24 transform -rotate-45" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateTo('categories')}
              className="inline-flex items-center mb-8 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour aux catégories
            </motion.button>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {categoryName}
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Découvrez tous nos produits dans cette catégorie
            </p>
            
            {/* Product Count */}
            <div className="mt-8 inline-flex items-center bg-white/20 rounded-full px-6 py-3">
              <Package className="w-5 h-5 mr-2" />
              <span className="font-semibold">
                {categoryProducts.length} produit{categoryProducts.length !== 1 ? 's' : ''} disponible{categoryProducts.length !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Products Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar - Filters */}
          <div className="lg:w-1/4">
            <div className="bg-gradient-to-br from-white to-green-50/30 rounded-3xl shadow-2xl p-8 sticky top-4 border border-green-100/50">
              {/* Filter Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Filtres
                </h3>
                <p className="text-gray-500 text-sm mt-1">Affinez votre recherche</p>
              </div>

              {/* Search Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Rechercher un produit
                </label>
                <input
                  type="text"
                  placeholder="Nom du produit..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80"
                />
              </div>

              {/* Sort Filter */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Trier par
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80"
                >
                  <option value="name">Nom (A-Z)</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                  <option value="newest">Plus récents</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 text-center mb-6 border border-green-200/50">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  {sortedProducts.length}
                </div>
                <div className="text-gray-600 font-medium">
                  produit{sortedProducts.length !== 1 ? 's' : ''} trouvé{sortedProducts.length !== 1 ? 's' : ''}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Page {currentPage} sur {totalPages}
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSortBy('name');
                  setCurrentPage(1);
                }}
                className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>

          {/* Right Content - Products */}
          <div className="lg:w-3/4">
            {/* Products Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Produits - {categoryName}
                  </h2>
                  <p className="text-gray-600">
                    Explorez notre sélection dans cette catégorie
                  </p>
                </div>
                <div className="text-sm text-gray-500 bg-green-50 px-4 py-2 rounded-full">
                  Page {currentPage} sur {totalPages}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-500">Aucun produit ne correspond à vos critères dans cette catégorie</p>
              </div>
            ) : (
              <>
                {/* Products Grid - Same as Homepage (3 per row) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mx-auto max-w-6xl px-4 mb-8">
                  {currentProducts.map((product, index) => {
                    const hasDiscount = !!product.discount && Number(product.discount) > 0;

                    return (
                      <div
                        key={product.id}
                        className="professional-product-card w-full max-w-[300px] cursor-pointer"
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
                            className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 rounded-t-2xl"
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
                              isFavorite(product.id)
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
                            {categoryName}
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
                    <div className="bg-white rounded-2xl shadow-lg p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-xl transition-all duration-200"
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
                                className={`px-3 py-2 rounded-xl font-semibold transition-all duration-200 ${
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
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-xl transition-all duration-200"
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
      
      {/* Removed Footer - it's handled by App.jsx */}
    </div>
  );
}

export default CategoryProducts;
