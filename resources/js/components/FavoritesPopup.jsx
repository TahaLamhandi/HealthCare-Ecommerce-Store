import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Heart, Trash2, Eye, Star, Sparkles
} from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext.js';
import { useAuth } from '../contexts/AuthContext.js';

const FavoritesPopup = ({ isOpen, onClose, onNavigateToProduct }) => {
  const { favorites, removeFavorite } = useFavorites();
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Mes Favoris</h2>
                  <p className="text-pink-100 text-sm">
                    {favorites.length} produit{favorites.length !== 1 ? 's' : ''} favori{favorites.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-12 h-12 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun favori pour le moment</h3>
                <p className="text-gray-600">Ajoutez des produits à vos favoris pour les retrouver facilement</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-white rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                        <img
                          src={product.img || '/images/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.category?.title || product.category || 'Produit'}</p>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating || 4.5)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">
                            ({product.reviews || Math.floor(Math.random() * 50) + 10})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div>
                            {Number(product.discount) > 0 ? (
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-green-600">
                                  {(product.price * (1 - Number(product.discount) / 100)).toFixed(2)} DH
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                  {product.price} DH
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-green-600">
                                {product.price} DH
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          onNavigateToProduct && onNavigateToProduct('product', { productId: product.id });
                          onClose();
                        }}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Voir le produit
                      </button>
                      <button
                        onClick={() => removeFavorite(product.id)}
                        className="w-12 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {favorites.length > 0 && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Vous avez {favorites.length} produit{favorites.length !== 1 ? 's' : ''} dans vos favoris
                </p>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-8 rounded-2xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
                >
                  Continuer mes achats
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FavoritesPopup;





