import React from 'react';
import '../../../css/app.css';
import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Star, Sparkles, Leaf, CheckCircle } from 'lucide-react';
import { AppContext } from '../../contexts/AppContext';

export default function Suppliers({ visibleSections }) {
  const { suppliers, loading } = useContext(AppContext);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Fallback suppliers if database is empty
  const fallbackSuppliers = [
    {
      name: "BioNature",
      logo: "/images/bionature.png",
      description: "Laboratoire français spécialisé en cosmétiques bio",
    },
    {
      name: "GreenLab",
      logo: "/images/greenlab-dots-logo.jpg",
      description: "Recherche et développement en phytothérapie",
    },
    {
      name: "NaturalCare",
      logo: "/images/naturalCare.png",
      description: "Fabricant de compléments alimentaires naturels",
    },
    {
      name: "Authentic Laboratory",
      logo: "/images/Authentic Laboratory.png",
      description: "Laboratoire des compléments alimentaires",
    },
    {
      name: "HerbalPlus",
      logo: "/images/herbal.png",
      description: "Extraits de plantes médicinales premium",
    },
    {
      name: "PureLab",
      logo: "/images/pureLab.png",
      description: "Innovation en cosmétique naturelle",
    },
  ];

  const displaySuppliers = suppliers && suppliers.length > 0 ? suppliers : fallbackSuppliers;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.3,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const icons = [Award, Shield, Star, Sparkles, Leaf, CheckCircle];

  return (
    <section
      id="suppliers"
      className="py-24 bg-gradient-to-br from-green-50/40 via-white to-emerald-50/40 relative overflow-hidden"
    >
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated floating elements */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-green-200/20 to-emerald-300/30 animate-pulse"
            style={{
              width: `${Math.random() * 120 + 40}px`,
              height: `${Math.random() * 120 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 3}s`,
              filter: 'blur(40px)',
            }}
          />
        ))}
        
        {/* Mesh gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(34,197,94,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(16,185,129,0.04),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6"
          >
            <Award className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Nos <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">Partenaires</span>
          </h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mb-6 rounded-full"
          ></motion.div>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Nous collaborons avec les laboratoires les plus prestigieux pour vous offrir
            <span className="font-semibold text-green-600"> l'excellence en matière de qualité</span>
          </p>
        </motion.div>

        {/* Suppliers Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {displaySuppliers.map((supplier, index) => {
            const IconComponent = icons[index % icons.length];
            return (
              <motion.div
                key={supplier.id || index}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
              >
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    variants={iconVariants}
                    className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300"
                  >
                    <IconComponent className="w-7 h-7 text-white" />
                  </motion.div>

                  {/* Logo */}
                  <div className="mb-6 h-20 flex items-center justify-center">
                    {supplier.logo ? (
                      <img
                        src={supplier.logo}
                        alt={supplier.name}
                        className="max-w-full max-h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400"
                      style={{ display: supplier.logo ? 'none' : 'flex' }}
                    >
                      <span className="text-sm font-medium">{supplier.name}</span>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors duration-300">
                    {supplier.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {supplier.description}
                  </p>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Animated border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-green-200 transition-colors duration-500"></div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-2 text-green-600">
            <Sparkles className="w-5 h-5" />
            <span className="text-lg font-semibold">Qualité certifiée • Innovation continue • Excellence garantie</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}