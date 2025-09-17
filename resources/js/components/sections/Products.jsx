import React, { useState } from 'react';
import { Leaf, Heart, ShoppingCart, Star, AlertCircle } from "lucide-react";
import { Button } from "../tools/button";
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext.js';
import { useCart } from "../../contexts/CartContext.js";
import { useFavorites } from "../../contexts/FavoritesContext.js";
import { useAuth } from "../../contexts/AuthContext.js";
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export default function Products({ visibleSections, navigateTo }) {
  const { products: dbProducts } = useContext(AppContext);
  const { addToCart, cartItems } = useCart();
  const { isFavorite, addToFavorites, removeFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [popupProductId, setPopupProductId] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  // Use database products, show first 3 for homepage (1 row of 3)
  const products = dbProducts.slice(0, 3);

  // Compute top 10 best sellers to show the 'Meilleur Vente' tag
  const topBestSellerIds = dbProducts
    .filter(p => (p?.sales_count || 0) > 0)
    .sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0))
    .slice(0, 10)
    .map(p => p.id);

  const handleAddToCart = async (e, product) => {
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

  const handleToggleFavorite = async (e, product) => {
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

  return (
    <section
      id="products"
      data-animate
      className={`py-20 bg-gray-50 relative overflow-hidden transition-all duration-1000 ${
        visibleSections.has("products") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Background decorations */}
      <div className="absolute top-10 left-10 text-green-300 opacity-20">
        <Leaf className="w-32 h-32 transform rotate-12" />
      </div>
      <div className="absolute bottom-10 right-10 text-green-300 opacity-20">
        <Leaf className="w-24 h-24 transform -rotate-45" />
      </div>
      <div className="absolute top-1/2 left-0 text-green-200 opacity-30">
        <div className="flex items-center space-x-2">
          <Leaf className="w-6 h-6" />
          <div className="w-32 h-0.5 bg-green-200"></div>
          <Leaf className="w-4 h-4" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="w-8 h-8 text-green-500 mr-3" />
            <h2 className="text-5xl font-bold text-gray-900">
              <span className="text-green-500">Derniers</span> Produits
            </h2>
          </div>
          <div className="w-24 h-1 bg-green-400 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de produits naturels et bio pour votre bien-être au quotidien.
          </p>
        </div>

        {/* Product cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mx-auto max-w-6xl px-4">
          {products.map((product, index) => {
            const hasDiscount = !!product.discount && Number(product.discount) > 0;

            return (
              <div
                key={product.id}
                className="professional-product-card animate-fade-in-up w-full max-w-[300px] cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
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
                      onLoad={() => console.log(`Product image loaded: ${product.img}`)}
                      onError={(e) => {
                        console.error(`Failed to load product image: ${product.img}`);
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
                    onClick={(e) => handleToggleFavorite(e, product)}
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
                    {product.category?.title || product.category || 'Produit'}
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
                        onClick={(e) => handleAddToCart(e, product)}
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

        {/* View All Button */}
        <div className="text-center mt-16">
          <button
            onClick={() => {
              if (navigateTo) {
                navigateTo('products');
              }
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-all shadow-lg cursor-pointer"
          >
            Voir tous les produits
          </button>
        </div>
      </div>
    </section>
  );
}
