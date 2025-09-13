import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useCart } from '../../contexts/CartContext';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import { Heart, Star, ShoppingCart, ArrowLeft, Leaf } from 'lucide-react';
import '../../../css/app.css';

export default function CategoryPage({ categoryName, onNavigateBack }) {
  const { products, categories, loading } = useContext(AppContext);
  const { isFavorite, addToFavorites, removeFavorite } = useFavorites();
  const { addToCart } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Find the category object
  const category = categories.find(cat => cat.title === categoryName);
  
  // Filter products by category
  const categoryProducts = products.filter(product => 
    product.category && product.category.title === categoryName
  );

  // Compute top 4 best sellers to show the 'Meilleur Vente' badge (no sales_count text)
  const topBestSellerIds = products
    .filter(p => (p?.sales_count || 0) > 0)
    .sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0))
    .slice(0, 4)
    .map(p => p.id);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [categoryName]);

  // Handle scroll for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFavoriteClick = async (product, e) => {
    e.stopPropagation();
    
    if (isFavorite(product.id)) {
      await removeFavorite(product.id);
    } else {
      await addToFavorites(product);
    }
  };

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    await addToCart(productId, 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header isScrolled={isScrolled} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} navigateTo={onNavigateBack} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Chargement de la catégorie...</p>
          </div>
        </div>
        <Footer navigateTo={onNavigateBack} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header isScrolled={isScrolled} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} navigateTo={onNavigateBack} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 py-24 overflow-hidden">
        <div className="absolute top-10 left-10 text-green-300 opacity-20 animate-pulse">
          <Leaf className="w-32 h-32 transform rotate-12" />
        </div>
        <div className="absolute bottom-10 right-10 text-green-300 opacity-20 animate-pulse">
          <Leaf className="w-24 h-24 transform -rotate-45" />
        </div>
        <div className="absolute top-20 right-20 text-green-200 opacity-30">
          <svg className="w-16 h-16 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={onNavigateBack}
              className="inline-flex items-center mb-8 px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-green-200 rounded-full hover:bg-green-50 hover:border-green-300 transition-all duration-300 shadow-lg group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 text-green-600 group-hover:translate-x-[-2px] transition-transform duration-300" />
              <span className="font-semibold text-green-700">Retour</span>
            </button>

            {/* Category Title */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                {categoryName}
              </span>
            </h1>

            {/* Category Description */}
            <div className="mb-8">
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-4">
                {category?.description || `Découvrez notre sélection de produits ${categoryName.toLowerCase()} soigneusement choisis pour votre bien-être.`}
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
            </div>

            {/* Products Count */}
            <div className="inline-flex items-center bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 border border-green-200 shadow-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-lg font-semibold text-gray-800">
                <span className="text-2xl font-bold text-green-600">{categoryProducts.length}</span>
                <span className="ml-2">produit{categoryProducts.length !== 1 ? 's' : ''} disponible{categoryProducts.length !== 1 ? 's' : ''}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {categoryProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Aucun produit dans cette catégorie</h3>
              <p className="text-gray-500 mb-6">Cette catégorie sera bientôt remplie de produits exceptionnels</p>
              <button
                onClick={onNavigateBack}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour à l'accueil
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categoryProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="professional-product-card animate-fade-in-up w-full max-w-[300px] mx-auto" 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="product-image-container">
                    {product.img ? (
                      <img
                        src={product.img}
                        alt={product.name}
                        width={400}
                        height={220}
                        className="product-image"
                        onLoad={() => console.log(`Product image loaded: ${product.img}`)}
                        onError={(e) => {
                          console.error(`Failed to load product image: ${product.img}`);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 rounded-t-2xl"
                      style={{ display: product.img ? 'none' : 'flex' }}
                    >
                      <span className="text-sm font-medium">Image non disponible</span>
                    </div>
                    {(Boolean(product.isNew) || Number(product.discount) > 0 || topBestSellerIds.includes(product.id)) && (
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {Boolean(product.isNew) && <span className="product-badge-new">Nouveau</span>}
                        {Number(product.discount) > 0 && (
                          <span className="product-badge-discount">-{Number(product.discount)}%</span>
                        )}
                        {topBestSellerIds.includes(product.id) && (
                          <span className="bg-yellow-500/95 text-white text-[11px] font-semibold px-2 py-1 rounded-full shadow-sm">
                            Meilleur Vente
                          </span>
                        )}
                      </div>
                    )}
                    <button
                      onClick={(e) => handleFavoriteClick(product, e)}
                      className={`product-heart-btn absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isFavorite(product.id)
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isAuthenticated() && isFavorite(product.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div className="product-info">
                    <span className="product-category-badge">{product.category?.title || product.category || 'Produit'}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`rating-star ${i < (product.rating || 4.5) ? "filled" : "empty"}`} />
                      ))}
                      <span className="rating-count">({product.reviews || 0} avis)</span>
                    </div>
                    <div className="product-price-container">
                      <div>
                        {Number(product.discount) > 0 ? (
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
                      <button
                        onClick={(e) => handleAddToCart(product.id, e)}
                        className="product-cart-btn"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Panier
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer navigateTo={onNavigateBack} />
    </div>
  );
}
