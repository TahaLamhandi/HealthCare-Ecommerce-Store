import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  ShoppingCart, Star, Heart, ChevronLeft, ChevronRight,
  Truck, MapPin, CreditCard, Leaf, AlertTriangle, Zap, Clock, Calendar,
  BookOpen, CheckCircle, Award, Copy, ArrowRight, Package, X, Shield,
  Users, TrendingUp, Globe, Sparkles, Target, Activity, Droplets,
  Sun, Moon, Wind, Flame, Eye, Brain, Zap as Lightning, AlertCircle
} from 'lucide-react';
import { AppContext } from '../contexts/AppContext.js';
import { useAuth } from '../contexts/AuthContext.js';
import { useCart } from '../contexts/CartContext.js';
import { useFavorites } from '../contexts/FavoritesContext.js';
import { createUniversalPackages, mapPackageNames, createCartItem, getOfferLabel } from '../utils/packageUtils';

// Testimonials data for reviews with Moroccan names
const testimonials = [
  {
    id: 1,
    name: "Mohammed Alami",
    avatar: "/images/testimonial-1.jpeg",
    rating: 5,
    comment: "Produits parfaits pour ma peau sensible. La qualité est exceptionnelle et les résultats sont visibles dès les premières utilisations.",
    product: "Detoxoil®",
    location: "Rabat"
  },
  {
    id: 2,
    name: "Fatima Zahra",
    avatar: "/images/testimonial-2.jpeg",
    rating: 5,
    comment: "Après des années de douleurs aux genoux, Zitalgic m'a redonné ma mobilité. Je recommande !",
    product: "Zitalgic®",
    location: "Casablanca"
  },
  {
    id: 3,
    name: "Ahmed Benali",
    avatar: "/images/testimonial-3.jpeg",
    rating: 4,
    comment: "Très satisfait, qualité au rendez-vous ! L'équipe est professionnelle et les produits tiennent leurs promesses.",
    product: "Zitalgic Sport®",
    location: "Marrakech"
  },
  {
    id: 4,
    name: "Amina Tazi",
    avatar: "/images/testimonial-4.jpeg",
    rating: 5,
    comment: "J'étais sceptique au début, mais après quelques semaines j'ai vraiment ressenti un soulagement articulaire.",
    product: "Zitalgic®",
    location: "Fès"
  },
  {
    id: 5,
    name: "Youssef El Mansouri",
    avatar: "/images/testimonial-5.jpg",
    rating: 4,
    comment: "Relaxoil® m'aide à me détendre après une longue journée. Un produit naturel qui apporte vraiment la sérénité.",
    product: "Relaxoil®",
    location: "Essaouira"
  },
  {
    id: 6,
    name: "Khadija Idrissi",
    avatar: "/images/testimonial-1.jpeg",
    rating: 5,
    comment: "Service client excellent et livraison rapide partout au Maroc. Les produits sont de très bonne qualité.",
    product: "Detoxoil®",
    location: "Tanger"
  },
  {
    id: 7,
    name: "Omar Chraibi",
    avatar: "/images/testimonial-2.jpeg",
    rating: 4,
    comment: "J'utilise ces produits depuis 6 mois et je vois vraiment la différence. Merci BioEkleel !",
    product: "Zitalgic®",
    location: "Agadir"
  },
  {
    id: 8,
    name: "Zineb Alaoui",
    avatar: "/images/testimonial-3.jpeg",
    rating: 5,
    comment: "Produits naturels et efficaces. Je recommande vivement à tous mes amis et famille.",
    product: "Relaxoil®",
    location: "Meknès"
  },
];

// Get review count from product data
const getReviewCount = (product) => product?.reviews || 0;

const ProductPage = ({ navigateTo, productId }) => {
  const { products } = useContext(AppContext);
  const { user, isAuthenticated } = useAuth();
  const { addToCart, cartItems } = useCart();
  const { isFavorite, addToFavorites, removeFavorite } = useFavorites();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeMedicalTab, setActiveMedicalTab] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  useEffect(() => {
    if (products && products.length > 0) {
      const foundProduct = products.find(p => p.id === parseInt(productId));
      
      if (foundProduct) {
        setProduct(foundProduct);
        // Always use universal packages and set the first one as selected
        const universalPackages = createUniversalPackages(foundProduct);
        setSelectedPackage(universalPackages[0]);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [products, productId]);

  // Check if product is already in cart
  useEffect(() => {
    if (product && cartItems) {
      const productInCart = cartItems.find(item => item.id === product.id || item.product_id === product.id);
      setIsInCart(!!productInCart);
    }
  }, [product, cartItems]);


  // Auto-rotate images every 3 seconds - moved after productImages declaration

  // Pause auto-rotation when user hovers over the image
  const handleImageMouseEnter = () => {
    setIsAutoRotating(false);
  };

  const handleImageMouseLeave = () => {
    setIsAutoRotating(true);
  };

  const copyPhoneNumber = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const scrollThumbs = (dir) => {
    const el = document.getElementById('thumb-row');
    if (!el) return;
    el.scrollBy({ top: dir === 'up' ? -100 : 100, behavior: 'smooth' });
  };

  const handleAddToCart = (e) => {
    if (!isAuthenticated()) {
      navigateTo('auth');
      return;
    }

    // Check if product is already in cart
    if (isInCart) {
      // Get button position for popup
      const buttonRect = e.target.getBoundingClientRect();
      setPopupPosition({
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top - 10
      });
      setShowCartPopup(true);
      setTimeout(() => setShowCartPopup(false), 3000);
      return;
    }

    if (product) {
      const cartItem = createCartItem(product, selectedPackage);
      addToCart(product.id, 1, cartItem); // Always add 1 pack
    }
  };

  // Ensure all data is properly formatted as arrays - MUST be called before any returns
  const productImages = React.useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images)) return product.images;
    if (product.images && typeof product.images === 'string') {
      try {
        const parsed = JSON.parse(product.images);
        return Array.isArray(parsed) ? parsed : [product.img];
      } catch {
        return [product.img];
      }
    }
    return [product.img];
  }, [product]);

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    if (!isAutoRotating || productImages.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage(prev => (prev + 1) % productImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoRotating, productImages.length]);

  const packages = React.useMemo(() => {
    if (!product) return [];
    
    // Always use universal package structure for all products
    const universalPackages = createUniversalPackages(product);
    return universalPackages;
  }, [product]);

  const testimonials = React.useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.testimonials)) return product.testimonials;
    if (product.testimonials && typeof product.testimonials === 'string') {
      try {
        const parsed = JSON.parse(product.testimonials);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }, [product]);

  const features = React.useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.features)) return product.features;
    if (product.features && typeof product.features === 'string') {
      try {
        const parsed = JSON.parse(product.features);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }, [product]);

  const benefits = React.useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.benefits)) return product.benefits;
    if (product.benefits && typeof product.benefits === 'string') {
      try {
        const parsed = JSON.parse(product.benefits);
        return Array.isArray(parsed) ? parsed : (product.benefits ? [product.benefits] : []);
      } catch {
        return product.benefits ? [product.benefits] : [];
      }
    }
    return product.benefits ? [product.benefits] : [];
  }, [product]);

  const composition = React.useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.composition)) return product.composition;
    if (product.composition && typeof product.composition === 'string') {
      try {
        const parsed = JSON.parse(product.composition);
        return Array.isArray(parsed) ? parsed : (product.composition ? [product.composition] : []);
      } catch {
        return product.composition ? [product.composition] : [];
      }
    }
    return product.composition ? [product.composition] : [];
  }, [product]);

  const medicalEffects = React.useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.medical_effects)) return product.medical_effects;
    if (product.medical_effects && typeof product.medical_effects === 'string') {
      try {
        const parsed = JSON.parse(product.medical_effects);
        return Array.isArray(parsed) ? parsed : (product.medical_effects ? [product.medical_effects] : []);
      } catch {
        return product.medical_effects ? [product.medical_effects] : [];
      }
    }
    return product.medical_effects ? [product.medical_effects] : [];
  }, [product]);

  const qualityGuarantees = React.useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.quality_guarantees)) return product.quality_guarantees;
    if (product.quality_guarantees && typeof product.quality_guarantees === 'string') {
      try {
        const parsed = JSON.parse(product.quality_guarantees);
        return Array.isArray(parsed) ? parsed : (product.quality_guarantees ? [product.quality_guarantees] : []);
      } catch {
        return product.quality_guarantees ? [product.quality_guarantees] : [];
      }
    }
    return product.quality_guarantees ? [product.quality_guarantees] : [];
  }, [product]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
          <p className="text-gray-600 mb-8">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
          <button 
            onClick={() => navigateTo('home')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Additional safety check to ensure arrays are properly initialized
  if (!Array.isArray(productImages) || !Array.isArray(packages)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Chargement des données du produit...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: Eye },
    { id: 'composition', label: 'Composition', icon: Droplets },
    { id: 'benefits', label: 'Bénéfices', icon: Target },
    { id: 'usage', label: 'Utilisation', icon: BookOpen },
    { id: 'reviews', label: 'Avis', icon: Star },
    { id: 'guarantees', label: 'Garanties', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-green-200/20 to-emerald-300/30 animate-pulse"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 3 + 4}s`,
              filter: 'blur(50px)',
            }}
          />
        ))}
        
        {/* Mesh gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(34,197,94,0.04),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(16,185,129,0.03),transparent_50%)]"></div>
      </div>

      {/* Hero Section with Product Header */}
      <section className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Enhanced background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-lg">
                {product.name}
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-6 max-w-3xl mx-auto">
                {product.description}
              </p>
              <div className="flex items-center justify-center gap-4 text-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="opacity-75">({getReviewCount(product)} avis)</span>
        </div>
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  <span>100% Naturel</span>
        </div>
        </div>
            </motion.div>
        </div>
          </div>
      </section>

      {/* Main Product Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            
            {/* Product Images */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Main Image */}
              <div 
                className="relative group"
                onMouseEnter={handleImageMouseEnter}
                onMouseLeave={handleImageMouseLeave}
              >
                <div className="aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => setShowImageModal(true)}
                  />
        </div>

                {/* Image Navigation */}
                {productImages.length > 1 && (
                  <>
                  <button
                      onClick={() => {
                        setIsAutoRotating(false);
                        setSelectedImage(Math.max(0, selectedImage - 1));
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 hover:shadow-xl transition-all duration-300 group-hover:opacity-100 opacity-0 hover:opacity-100"
                  >
                      <ChevronLeft className="w-6 h-6 text-gray-700 hover:text-gray-900 transition-colors duration-200" />
                  </button>
                    <button
                      onClick={() => {
                        setIsAutoRotating(false);
                        setSelectedImage(Math.min(productImages.length - 1, selectedImage + 1));
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 hover:shadow-xl transition-all duration-300 group-hover:opacity-100 opacity-0 hover:opacity-100"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700 hover:text-gray-900 transition-colors duration-200" />
                    </button>
                  </>
                )}

                {/* Favorite Button */}
                  <button
                  onClick={async () => {
                    if (!isAuthenticated()) {
                      navigateTo('auth');
                      return;
                    }
                    
                    if (isFavorite(product.id)) {
                      await removeFavorite(product.id);
                    } else {
                      await addToFavorites(product);
                    }
                  }}
                  className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                    isFavorite(product.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isAuthenticated() && isFavorite(product.id) ? 'fill-current' : ''}`} />
                  </button>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      Nouveau
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* Auto-rotation indicator */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 left-4">
                    <button
                      onClick={() => setIsAutoRotating(!isAutoRotating)}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
                      title={isAutoRotating ? "Pause rotation" : "Start rotation"}
                    >
                      {isAutoRotating ? (
                        <div className="flex space-x-1">
                          <div className="w-1 h-4 bg-gray-700 rounded"></div>
                          <div className="w-1 h-4 bg-gray-700 rounded"></div>
                        </div>
                      ) : (
                        <div className="w-0 h-0 border-l-[6px] border-l-gray-700 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button
                        key={index}
                      onClick={() => {
                        setIsAutoRotating(false);
                        setSelectedImage(index);
                      }}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index
                          ? 'border-green-500 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
              <motion.div
              className="space-y-8 relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Decorative background */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full opacity-50 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-green-50 to-emerald-50 rounded-full opacity-60 blur-lg"></div>
              {/* Product Title & Rating */}
              <div>
                <h1 className="text-4xl font-black text-gray-900 mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-lg font-semibold text-gray-700 ml-2">
                      {product.rating} ({getReviewCount(product)} avis)
                  </span>
                </div>
                </div>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {product.long_description || product.description}
                </p>
              </div>

              {/* Package Selection */}
              <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl p-8 shadow-xl border border-green-100">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Choisissez votre offre</h3>
                  <p className="text-gray-600">Sélectionnez la quantité qui vous convient le mieux</p>
                </div>
                <div className="grid gap-4">
                  {packages.map((pkg) => {
                    // Use utility function to get offer label
                    const offerLabel = getOfferLabel(pkg.quantity);
                    const isSelected = selectedPackage?.id === pkg.id;
                    
                    return (
                    <motion.button
                      key={pkg.id}
                      onClick={() => {
                        setSelectedPackage(pkg);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
                        isSelected
                          ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 shadow-xl ring-2 ring-green-200'
                          : 'border-gray-200 hover:border-green-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50 hover:shadow-lg'
                      }`}
                    >
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="font-bold text-lg text-gray-900">{pkg.name}</div>
                            {offerLabel && (
                              <span className="inline-block text-xs bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full font-semibold shadow-md">
                                {offerLabel}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <Package className="w-4 h-4 inline mr-1" />
                            {pkg.quantity} produit{pkg.quantity > 1 ? 's' : ''}
                          </div>
                          {pkg.save && pkg.save > 0 && (
                            <div className="text-sm text-green-600 font-semibold flex items-center gap-1">
                              <Zap className="w-4 h-4" />
                              Économisez {pkg.save.toFixed(2)} DH
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600 mb-1">
                            {pkg.price.toFixed(2)} DH
                          </div>
                          {pkg.oldPrice && pkg.oldPrice > 0 && pkg.oldPrice > pkg.price && (
                            <div className="text-sm text-gray-500 line-through">
                              {pkg.oldPrice.toFixed(2)} DH
                            </div>
                          )}
                          {pkg.quantity > 1 && (
                            <div className="text-xs text-gray-500 mt-1">
                              {(pkg.price / pkg.quantity).toFixed(2)} DH par produit
                            </div>
                          )}
                          {pkg.quantity === 1 && (
                            <div className="text-xs text-gray-500 mt-1">
                              Prix unitaire
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Add to Cart */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative">
                    <button
                  onClick={(e) => handleAddToCart(e)}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${
                    isInCart 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600' 
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                  }`}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {isInCart 
                    ? `Déjà dans le panier - ${(Number(selectedPackage?.price || product?.price || 0)).toFixed(2)} DH`
                    : `Ajouter au panier - ${(Number(selectedPackage?.price || product?.price || 0)).toFixed(2)} DH`
                  }
                    </button>

                {/* Cart Popup - Rendered via Portal */}
                {showCartPopup && createPortal(
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
                      <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 whitespace-nowrap">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Ce produit est déjà dans votre panier</span>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
                </div>
                    </motion.div>
                  </AnimatePresence>,
                  document.body
                )}
            </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
                  <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">Livraison partout au Maroc</div>
                  <div className="text-xs text-gray-600">Service de livraison national</div>
          </div>
                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
                  <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">Garantie qualité</div>
                  <div className="text-xs text-gray-600">30 jours satisfait</div>
        </div>
        </div>
            </motion.div>
        </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
            {tabs.map((tab) => (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                {tab.label}
                </button>
            ))}
          </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl"
              >
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Aperçu du produit</h2>
                      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        {product.long_description || product.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <Target className="w-12 h-12 text-green-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Cibles principales</h3>
                        <p className="text-gray-600">{product.target_conditions || 'Douleurs articulaires, musculaires et nerveuses'}</p>
                    </div>
                      
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <Activity className="w-12 h-12 text-green-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Effets médicaux</h3>
                        <div className="space-y-2">
                          {medicalEffects.slice(0, 3).map((effect, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-gray-600">{effect}</span>
                    </div>
                          ))}
                    </div>
                  </div>
                      
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <Award className="w-12 h-12 text-green-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Garanties qualité</h3>
                        <div className="space-y-2">
                          {qualityGuarantees.slice(0, 3).map((guarantee, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-green-500" />
                              <span className="text-gray-600">{guarantee}</span>
                    </div>
                          ))}
                    </div>
                  </div>
        </div>
            </div>
                )}

                {activeTab === 'composition' && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Composition naturelle</h2>
                      <p className="text-lg text-gray-600">Ingrédients actifs soigneusement sélectionnés</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {composition.map((ingredient, index) => (
                      <motion.div
                          key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center gap-4"
                      >
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-white" />
                    </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{ingredient}</h3>
                            <p className="text-gray-600">Ingrédient naturel certifié</p>
                  </div>
                </motion.div>
              ))}
            </div>
                    </div>
                )}

                {activeTab === 'benefits' && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Bénéfices du produit</h2>
                      <p className="text-lg text-gray-600">Découvrez tous les avantages de {product.name}</p>
            </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-start gap-4"
                        >
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit}</h3>
                            <p className="text-gray-600">Bénéfice scientifiquement prouvé</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
                )}

                {activeTab === 'usage' && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Mode d'utilisation</h2>
                      <p className="text-lg text-gray-600">Instructions d'utilisation optimale</p>
            </div>

                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                      <div className="flex items-start gap-4">
                        <BookOpen className="w-8 h-8 text-green-600 mt-1" />
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Instructions détaillées</h3>
                          <p className="text-gray-700 leading-relaxed text-lg">
                            {product.usage_instructions || 'Appliquer selon les besoins sur la zone concernée.'}
                          </p>
                  </div>
                </div>
              </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                        <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Fréquence</h3>
                        <p className="text-gray-600">2-3 fois par jour selon les besoins</p>
          </div>

                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                        <Droplets className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Quantité</h3>
                        <p className="text-gray-600">Une noisette suffit pour une application</p>
            </div>

                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                        <AlertTriangle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Précautions</h3>
                        <p className="text-gray-600">Éviter le contact avec les yeux</p>
                      </div>
                </div>
              </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Avis clients</h2>
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-6 h-6 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                      </div>
                        <span className="text-2xl font-bold text-gray-900">{product.rating}</span>
                        <span className="text-gray-600">({getReviewCount(product)} avis)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {testimonials.map((testimonial, index) => (
              <motion.div
                          key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                        >
                          <div className="flex items-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                          <Star 
                                key={i}
                                className={`w-4 h-4 ${
                                  i < testimonial.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`} 
                          />
                            ))}
                          </div>
                          <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                          <div className="font-semibold text-gray-900">- {testimonial.name}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'guarantees' && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos garanties</h2>
                      <p className="text-lg text-gray-600">Votre satisfaction est notre priorité</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {qualityGuarantees.map((guarantee, index) => (
                      <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center gap-4"
                        >
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                      </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{guarantee}</h3>
                            <p className="text-gray-600">Garantie Authentic Laboratory</p>
                  </div>
                </motion.div>
              ))}
            </div>

                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
                      <Award className="w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-4">Garantie satisfaction 30 jours</h3>
                      <p className="text-lg opacity-90">
                        Si vous n'êtes pas entièrement satisfait de votre achat, nous vous remboursons intégralement.
                      </p>
              </div>
          </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
                <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute -top-12 right-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain rounded-2xl"
                  />
                </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProductPage;
