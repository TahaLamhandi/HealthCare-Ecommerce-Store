import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Package, ArrowRight, Search } from 'lucide-react';
import { AppContext } from '../contexts/AppContext.js';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';

function AllCategories({ navigateTo }) {
  const { categories, products, loading } = useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categoriesPerPage = 6;

  // Handle scroll for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category && (category.name || category.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);
  const startIndex = (currentPage - 1) * categoriesPerPage;
  const currentCategories = filteredCategories.slice(startIndex, startIndex + categoriesPerPage);

  // Get product count for each category
  const getCategoryProductCount = (categoryId) => {
    return products.filter(product => product.categorie_id === categoryId).length;
  };

  // Handle category click to navigate to category products
  const handleCategoryClick = (category) => {
    if (navigateTo) {
      navigateTo('category-products', { categoryId: category.id, categoryName: category.title || category.name });
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
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header isScrolled={isScrolled} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">{/* Removed Header - it's handled by App.jsx */}

      {/* Modern Hero Section */}
      <section className="relative bg-white py-20 overflow-hidden">
        {/* Minimal Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-green-50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-emerald-50 rounded-full blur-3xl"></div>
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
              <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-green-50 rounded-full border border-green-100">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-semibold text-sm uppercase tracking-wider">
                  Collection Complète
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                <span className="text-gray-900">Nos </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-green-700">
                  Catégories
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
              <span className="font-semibold text-green-600">produits naturels</span>{" "}
              soigneusement organisés pour votre bien-être
            </motion.p>

            {/* Modern Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-green-100 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-lg group-hover:border-green-200 transition-all duration-300">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 w-6 h-6 transition-colors duration-300" />
                  <input
                    type="text"
                    placeholder="Rechercher une catégorie..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-16 pr-16 py-5 text-lg bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-300"
                  />
                  {searchTerm && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => {
                        setSearchTerm('');
                        setCurrentPage(1);
                      }}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors duration-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Modern Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-8"
            >
              <div className="bg-white rounded-2xl px-8 py-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-3xl font-bold text-green-600 mb-2">{filteredCategories.length}</div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">Catégories</div>
              </div>
              <div className="bg-white rounded-2xl px-8 py-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{products.length}</div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">Produits</div>
              </div>
              <div className="bg-white rounded-2xl px-8 py-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-3xl font-bold text-teal-600 mb-2">100%</div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">Naturel</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modern Categories Grid Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          {filteredCategories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="bg-white rounded-3xl p-12 max-w-lg mx-auto border border-gray-100 shadow-lg">
                <div className="text-8xl mb-6">🔍</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Aucune catégorie trouvée
                </h3>
                <p className="text-gray-600 text-lg mb-6">Essayez de modifier votre recherche</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300"
                >
                  Voir toutes les catégories
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Modern Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-green-50 rounded-full border border-green-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-semibold text-sm uppercase tracking-wider">
                    {searchTerm ? 'Résultats de recherche' : 'Nos collections'}
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                  {searchTerm ? `"${searchTerm}"` : 'Explorez Nos Catégories'}
                </h2>
                
                <div className="w-32 h-1 bg-green-500 mx-auto mb-6 rounded-full"></div>
                
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                  {searchTerm 
                    ? `${filteredCategories.length} catégorie${filteredCategories.length !== 1 ? 's' : ''} trouvée${filteredCategories.length !== 1 ? 's' : ''}`
                    : 'Chaque catégorie a été soigneusement sélectionnée pour votre bien-être'
                  }
                </p>
                
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Effacer la recherche
                  </motion.button>
                )}
              </motion.div>

              {/* Categories Grid */}
              <motion.div
                key={`categories-${searchTerm}-${currentPage}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {currentCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {/* Modern Card Container */}
                    <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-green-200">
                      {/* Category Image */}
                      <div className="relative h-56 bg-gray-50 overflow-hidden">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.title || category.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ display: category.image ? 'none' : 'flex' }}
                        >
                          <div className="relative">
                            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center">
                              <Package className="w-10 h-10 text-green-600" />
                            </div>
                          </div>
                        </div>

                        {/* Product Count Badge */}
                        <div className="absolute top-4 right-4 bg-green-600 text-white rounded-full px-4 py-2 shadow-lg">
                          <span className="text-sm font-semibold">
                            {getCategoryProductCount(category.id)} produit{getCategoryProductCount(category.id) !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                      </div>

                      {/* Category Content */}
                      <div className="relative p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                          {category.title || category.name}
                        </h3>

                        {category.description && (
                          <p className="text-gray-600 mb-6 text-base leading-relaxed line-clamp-2">
                            {category.description}
                          </p>
                        )}

                        {/* Modern Action Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-green-600 text-white py-4 px-6 rounded-2xl font-semibold text-base hover:bg-green-700 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg group-hover:shadow-green-500/25"
                        >
                          <span>Explorer cette catégorie</span>
                          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                        </motion.button>
                      </div>

                      {/* Modern Accent Line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}

          {/* Modern Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mt-16"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-3 bg-gray-100 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    ← Précédent
                  </motion.button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <motion.button
                          key={page}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
                            currentPage === page
                              ? 'bg-green-600 text-white shadow-green-500/25'
                              : 'bg-gray-100 hover:bg-green-100 text-gray-700'
                          }`}
                        >
                          {page}
                        </motion.button>
                      );
                    } else if (
                      page === currentPage - 3 ||
                      page === currentPage + 3
                    ) {
                      return <span key={page} className="px-3 text-green-500 font-semibold">...</span>;
                    }
                    return null;
                  })}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-6 py-3 bg-gray-100 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Suivant →
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Modern Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-green-50 rounded-full border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-semibold text-sm uppercase tracking-wider">
                Notre gamme complète
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            
            <h2 className="text-4xl font-black text-gray-900 mb-12">
              Des Chiffres qui Parlent
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-5xl font-black text-green-600 mb-4">
                  {categories.length}
                </div>
                <div className="text-gray-600 text-lg font-medium">
                  Catégories disponibles
                </div>
              </div>
              <div className="text-center bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-5xl font-black text-emerald-600 mb-4">
                  {products.length}
                </div>
                <div className="text-gray-600 text-lg font-medium">
                  Produits au total
                </div>
              </div>
              <div className="text-center bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-5xl font-black text-teal-600 mb-4">
                  100%
                </div>
                <div className="text-gray-600 text-lg font-medium">
                  Produits naturels
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Removed Footer - it's handled by App.jsx */}
    </div>
  );
}

// Export the component
export default AllCategories;
