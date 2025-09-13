import React from 'react';
import { Leaf, Heart, Sparkles, Apple, Star, ArrowRight, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

export default function Categories({ visibleSections, hoveredCategory, setHoveredCategory, navigateTo }) {
  const { categories, products, loading } = useContext(AppContext);

  // Icon mapping for categories
  const iconMap = {
    'Compléments alimentaires': Heart,
    'Cosmétiques Bio': Sparkles,
    'Huiles Essentielles': Leaf,
    'Produits Minceur': Apple,
    'Soins Capillaires': Star
  };

  // Darker green gradient variations for 4 categories - darker green colors for better text visibility
  const greenGradients = [
    {
      gradient: "linear-gradient(135deg, #6ee7b7 0%, #34d399 50%, #10b981 100%)",
      hoverGradient: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
      iconColor: "#ffffff",
      buttonColor: "#ffffff",
      buttonTextColor: "#10b981",
      glowColor: "rgba(16, 185, 129, 0.4)",
      shimmerColor: "rgba(52, 211, 153, 0.5)"
    },
    {
      gradient: "linear-gradient(135deg, #86efac 0%, #4ade80 50%, #22c55e 100%)",
      hoverGradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)",
      iconColor: "#ffffff",
      buttonColor: "#ffffff",
      buttonTextColor: "#22c55e",
      glowColor: "rgba(34, 197, 94, 0.4)",
      shimmerColor: "rgba(74, 222, 128, 0.5)"
    },
    {
      gradient: "linear-gradient(135deg, #bef264 0%, #a3e635 50%, #84cc16 100%)",
      hoverGradient: "linear-gradient(135deg, #84cc16 0%, #65a30d 50%, #4d7c0f 100%)",
      iconColor: "#ffffff",
      buttonColor: "#ffffff",
      buttonTextColor: "#84cc16",
      glowColor: "rgba(132, 204, 22, 0.4)",
      shimmerColor: "rgba(163, 230, 53, 0.5)"
    },
    {
      gradient: "linear-gradient(135deg, #a0d911 0%, #73d13d 50%, #52c41a 100%)",
      hoverGradient: "linear-gradient(135deg, #52c41a 0%, #389e0d 50%, #2d7d0f 100%)",
      iconColor: "#ffffff",
      buttonColor: "#ffffff",
      buttonTextColor: "#52c41a",
      glowColor: "rgba(82, 196, 26, 0.4)",
      shimmerColor: "rgba(115, 209, 61, 0.5)"
    }
  ];

  // Transform database categories to include UI properties (limit to 4 for better display)
  const transformedCategories = categories?.slice(0, 4).map((category, index) => {
    const colors = greenGradients[index % greenGradients.length];
    const IconComponent = iconMap[category.title] || Heart;

    // Get actual product count from database
    const getProductCount = () => {
      // Count products that belong to this category
      if (products && Array.isArray(products)) {
        const categoryProducts = products.filter(product => {
          // Check if product has category relationship
          if (product.category && product.category.id === category.id) {
            return true;
          }
          if (product.categorie_id === category.id) {
            return true;
          }
          // Check by category title/name
          if (product.category && product.category.title === category.title) {
            return true;
          }
          return false;
        });
        
        // Return exact count, not "+" format
        const count = categoryProducts.length;
        if (count === 0) {
          return '0 produits';
        } else if (count === 1) {
          return '1 produit';
        } else {
          return `${count} produits`;
        }
      }
      
      // If no products found, return 0
      return '0 produits';
    };

    return {
      ...category,
      icon: IconComponent,
      gradient: colors.gradient,
      hoverGradient: colors.hoverGradient,
      iconColor: colors.iconColor,
      buttonColor: colors.buttonColor,
      buttonTextColor: colors.buttonTextColor,
      glowColor: colors.glowColor,
      shimmerColor: colors.shimmerColor,
      features: Array.isArray(category.features) ? category.features : JSON.parse(category.features || '[]'),
      stats: getProductCount()
    };
  }) || [];

  // Fallback categories if database is empty or loading
  const fallbackCategories = [
    {
      id: 1,
      title: "Compléments alimentaires",
      subtitle: "Énergie naturelle",
      description: "Vitamines et minéraux pour une santé vibrante.",
      icon: Heart,
      gradient: "linear-gradient(135deg, #6ee7b7 0%, #34d399 50%, #10b981 100%)",
      hoverGradient: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
      stats: "0 produits",
      features: ["Vitamines pures", "Minéraux bio", "Plantes naturelles"],
      iconColor: "#ffffff",
      buttonColor: "#ffffff",
      buttonTextColor: "#10b981",
      glowColor: "rgba(16, 185, 129, 0.4)",
      shimmerColor: "rgba(52, 211, 153, 0.5)"
    }
  ];

  const displayCategories = transformedCategories.length > 0 ? transformedCategories : fallbackCategories;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "backOut"
      }
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hover: {
      rotate: [0, 15, -15, 0],
      transition: {
        duration: 0.8
      }
    }
  };

  return (
    <section className="relative py-20 overflow-hidden bg-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-green-50/30"></div>
        {/* Gentle floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-green-200/20 to-emerald-300/20"
            initial={{
              scale: 0,
              opacity: 0,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
            }}
            animate={{
              scale: [0, Math.random() * 0.8 + 0.3, 0],
              opacity: [0, 0.15, 0],
              x: [
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)
              ],
              y: [
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
              ]
            }}
            transition={{
              duration: Math.random() * 25 + 25,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear'
            }}
            style={{
              width: `${Math.random() * 80 + 40}px`,
              height: `${Math.random() * 80 + 40}px`
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 mb-6 px-8 py-4 bg-gradient-to-r from-green-100/80 to-emerald-100/80 backdrop-blur-sm rounded-full shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative"
            >
              <div className="absolute inset-0 bg-green-300/40 rounded-full blur-lg animate-pulse"></div>
              <Leaf className="w-7 h-7 text-green-600 relative z-10" />
            </motion.div>
            <span className="text-green-700 font-bold text-sm uppercase tracking-wider">
              Nos Collections
            </span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full ml-2"
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800">
              Découvrez nos{' '}
            </span>
            <span className="relative inline-block">
              <motion.span
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-400 to-green-600"
                style={{
                  background: 'linear-gradient(90deg, #22c55e, #10b981, #059669, #34d399, #16a34a, #22c55e)',
                  backgroundSize: '300% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Trésors Naturels
              </motion.span>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-500 rounded-full shadow-lg"
                style={{ originX: 0 }}
              />
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -inset-2 bg-gradient-to-r from-green-300/20 to-emerald-400/20 rounded-lg blur-lg -z-10"
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Plongez dans notre sélection de produits naturels premium pour votre bien-être holistique.
          </motion.p>
        </motion.div>

        {/* Categories grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {displayCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={cardVariants}
              whileHover="hover"
              className="relative group rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500"
            >
              {/* Glow effect */}
              <motion.div
                className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"
                style={{ background: category.glowColor }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Main gradient backgrounds */}
              <div 
                className="absolute inset-0 z-0 transition-all duration-700 group-hover:opacity-0"
                style={{ background: category.gradient }}
              />
              <div 
                className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-all duration-700"
                style={{ background: category.hoverGradient }}
              />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(45deg, transparent 30%, ${category.shimmerColor} 50%, transparent 70%)`
                }}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut"
                }}
              />
              
              <div className="relative z-10 p-6 h-full flex flex-col">
                {/* Enhanced Icon */}
                <motion.div 
                  variants={iconVariants}
                  whileHover="hover"
                  className="mb-6 relative"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative p-4 rounded-2xl w-16 h-16 flex items-center justify-center bg-white/98 backdrop-blur-sm shadow-lg border border-green-100/50"
                  >
                    <motion.div
                      animate={{
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 rounded-2xl blur-md"
                      style={{ background: category.glowColor }}
                    />
                    <category.icon 
                      className="w-8 h-8 relative z-10 drop-shadow-lg" 
                      style={{ color: category.iconColor }} 
                    />
                  </motion.div>
                  
                  {/* Floating particles around icon */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full opacity-60"
                      style={{ 
                        background: category.iconColor,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                      animate={{
                        x: [0, Math.cos(i * 2.094) * 25, 0],
                        y: [0, Math.sin(i * 2.094) * 25, 0],
                        scale: [0, 1, 0],
                        opacity: [0, 0.6, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>

                {/* Enhanced Content */}
                <div className="flex-1 flex flex-col">
                  <motion.h3 
                    className="text-xl lg:text-2xl font-bold mb-3 text-white drop-shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {category.title}
                  </motion.h3>
                  <motion.p 
                    className="text-white/90 mb-6 text-sm lg:text-base leading-relaxed"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {category.subtitle || category.description}
                  </motion.p>
                  
                  <div className="space-y-3 mb-6">
                    {category.features.slice(0, 3).map((feature, idx) => (
                      <motion.div 
                        key={idx} 
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <motion.div 
                          className="w-2 h-2 rounded-full mt-2 flex-shrink-0 shadow-lg"
                          style={{ background: category.iconColor }}
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: idx * 0.3
                          }}
                        />
                        <span className="text-sm lg:text-base text-white/90 font-medium">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Enhanced Stats */}
                  <motion.div 
                    className="mt-auto pt-4 border-t border-white/30"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-white/95 flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="w-3 h-3 rounded-full"
                          style={{ background: category.iconColor }}
                        />
                        {category.stats}
                      </p>
                      <motion.div
                        animate={{
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity
                        }}
                        className="text-xs text-white/80 font-medium bg-white/20 px-2 py-1 rounded-full"
                      >
                        Premium
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Enhanced Explore button */}
                <motion.button
                  onClick={() => {
                    console.log('Category Explorer clicked:', category.title);
                    if (navigateTo) {
                      // Navigate to category-products page
                      navigateTo('category-products', { categoryName: category.title, categoryId: category.id });
                    } else {
                      // Fallback navigation
                      window.location.href = `/category/${encodeURIComponent(category.title)}`;
                    }
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full relative overflow-hidden backdrop-blur-sm px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 group cursor-pointer shadow-xl border-2"
                  style={{ 
                    backgroundColor: '#ffffff',
                    color: category.buttonTextColor,
                    borderColor: category.buttonTextColor
                  }}
                >
                  {/* Button glow effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: category.glowColor }}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Button shimmer */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(45deg, transparent 30%, ${category.shimmerColor} 50%, transparent 70%)`
                    }}
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <span className="relative z-10 text-sm lg:text-base font-bold" style={{ color: category.buttonTextColor }}>
                    Explorer
                  </span>
                  <motion.div
                    animate={{ 
                      x: [0, 4, 0],
                      rotate: [0, 15, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative z-10"
                  >
                    <ChevronRight 
                      className="w-5 h-5 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110 drop-shadow-sm" 
                      style={{ color: category.iconColor }}
                    />
                  </motion.div>
                </motion.button>
              </div>

              {/* Floating elements animation */}
              <div className="absolute inset-0 overflow-hidden z-0">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-white bg-opacity-10"
                    initial={{
                      scale: 0,
                      opacity: 0,
                      x: Math.random() * 100 - 50,
                      y: Math.random() * 100 - 50
                    }}
                    animate={{
                      scale: [0, Math.random() * 0.5 + 0.5, 0],
                      opacity: [0, 0.2, 0],
                      x: [
                        Math.random() * 100 - 50,
                        Math.random() * 200 - 100,
                        Math.random() * 100 - 50
                      ],
                      y: [
                        Math.random() * 100 - 50,
                        Math.random() * 200 - 100,
                        Math.random() * 100 - 50
                      ]
                    }}
                    transition={{
                      duration: Math.random() * 10 + 10,
                      repeat: Infinity,
                      repeatType: 'loop',
                      ease: 'linear'
                    }}
                    style={{
                      width: `${Math.random() * 50 + 20}px`,
                      height: `${Math.random() * 50 + 20}px`
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced View all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mt-16"
        >
          <motion.button
            onClick={() => {
              if (navigateTo) {
                navigateTo('categories');
              }
            }}
            whileHover={{
              scale: 1.05,
              y: -3
            }}
            whileTap={{ scale: 0.98 }}
            className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 mx-auto shadow-xl hover:shadow-2xl transition-all duration-500 group text-base md:text-lg cursor-pointer overflow-hidden border border-green-400/30"
          >
            {/* Background glow */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-green-400/40 to-emerald-400/40 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(110, 231, 183, 0.3) 50%, transparent 70%)'
              }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut"
              }}
            />
            
            <span className="relative z-10 font-bold">Voir toutes les catégories</span>
            
            <motion.div
              animate={{ 
                x: [0, 5, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
            </motion.div>
            
            {/* Particles effect */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-emerald-300 rounded-full opacity-0 group-hover:opacity-100"
                animate={{
                  x: [0, Math.cos(i * 0.785) * 40],
                  y: [0, Math.sin(i * 0.785) * 40],
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}