import { Star, Quote, Heart, ThumbsUp } from "lucide-react";
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../tools/avatar.jsx";
import { useFavorites } from "../../contexts/FavoritesContext";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import '../../../css/app.css';

export default function Testimonials({ visibleSections }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const testimonials = [
    {
      id: 1,
      name: "Mohammed",
      avatar: "/images/testimonial-1.jpeg",
      rating: 5,
      comment: "Produits parfaits pour ma peau sensible. La qualité est exceptionnelle et les résultats sont visibles dès les premières utilisations.",
      product: "Detoxoil®",
      location: "Rabat"
    },
    {
      id: 2,
      name: "Fatims",
      avatar: "/images/testimonial-2.jpeg",
      rating: 5,
      comment: "Après des années de douleurs aux genoux, Zitalgic m'a redonné ma mobilité. Je recommande !",
      product: "Zitalgic®",
      location: "Casablanca"
    },
    {
      id: 3,
      name: "Ahmed",
      avatar: "/images/testimonial-3.jpeg",
      rating: 4,
      comment: "Très satisfait, qualité au rendez-vous ! L'équipe est professionnelle et les produits tiennent leurs promesses.",
      product: "Zitalgic Sport®",
      location: "Marrakech"
    },
    {
      id: 4,
      name: "Amina",
      avatar: "/images/testimonial-4.jpeg",
      rating: 5,
      comment: "J'étais sceptique au début, mais après quelques semaines j'ai vraiment ressenti un soulagement articulaire.",
      product: "Zitalgic®",
      location: "Fès"
    },
    {
      id: 5,
      name: "Youssef",
      avatar: "/images/testimonial-5.jpg",
      rating: 4,
      comment: "Relaxoil® m'aide à me détendre après une longue journée. Un produit naturel qui apporte vraiment la sérénité.",
      product: "Relaxoil®",
      location: "Essaouira"
    },
  ];

  // Touch handling for swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - next testimonial
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 5000);
    }

    if (isRightSwipe) {
      // Swipe right - previous testimonial
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 5000);
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, testimonials.length]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
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

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section
      id="testimonials"
      className="py-24 bg-gradient-to-br from-green-50/30 via-white to-emerald-50/30 relative overflow-hidden"
    >
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated floating elements */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-green-200/20 to-emerald-300/30 animate-pulse"
            style={{
              width: `${Math.random() * 100 + 40}px`,
              height: `${Math.random() * 100 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 3}s`,
              filter: 'blur(30px)',
            }}
          />
        ))}
        
        {/* Mesh gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(34,197,94,0.04),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(16,185,129,0.03),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-8 shadow-lg"
          >
            <Heart className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Nos clients <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">témoignent</span>
          </h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 120 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mb-8 rounded-full"
          ></motion.div>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez pourquoi plus de <span className="font-bold text-green-600">3,600 clients</span> nous font confiance
            pour leur bien-être naturel
          </p>
        </motion.div>
        {/* Main Testimonial Display */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            {/* Featured Testimonial Card */}
            <div
              className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 relative overflow-hidden cursor-pointer select-none"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-50 to-green-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>

              <div className="relative z-10">
                {/* Quote Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-8 mx-auto"
                >
                  <Quote className="w-8 h-8 text-white" />
                </motion.div>

                {/* Testimonial Text */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-2xl text-gray-700 leading-relaxed text-center mb-8 italic font-light"
                >
                  "{testimonials[currentIndex].comment}"
                </motion.p>

                {/* Rating */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex items-center justify-center mb-8"
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                    >
                      <Star
                        className={`w-6 h-6 mx-1 ${
                          i < testimonials[currentIndex].rating
                            ? "text-amber-700 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* User Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="flex items-center justify-center"
                >
                  <Avatar className="w-20 h-20 mr-6 ring-4 ring-green-100 shadow-lg">
                    <AvatarImage
                      src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                      alt={testimonials[currentIndex].name}
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                    <AvatarFallback className="bg-green-100 text-green-600 font-bold text-2xl">
                      {testimonials[currentIndex].name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h4 className="text-2xl font-bold text-gray-900 mb-1">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-green-600 font-semibold text-lg mb-1">
                      {testimonials[currentIndex].product}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {testimonials[currentIndex].location}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Dots */}
          <div className="flex items-center justify-center mt-12 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                  setTimeout(() => setIsAutoPlaying(true), 5000);
                }}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-green-500 scale-125 shadow-lg"
                    : "bg-gray-300 hover:bg-green-300"
                }`}
              />
            ))}
          </div>

          {/* Thumbnail Navigation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center justify-center mt-12 space-x-4 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none', /* Internet Explorer 10+ */
            }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.button
                key={testimonial.id}
                variants={cardVariants}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                  setTimeout(() => setIsAutoPlaying(true), 5000);
                }}
                className={`flex-shrink-0 p-4 rounded-2xl transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-green-100 border-2 border-green-400 shadow-lg scale-105"
                    : "bg-white border border-gray-200 hover:border-green-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12 ring-2 ring-green-100">
                    <AvatarImage
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                    <AvatarFallback className="bg-green-100 text-green-600 font-semibold">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-green-600 text-xs">
                      {testimonial.product}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-center mt-16"
          >
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">4.7/5</div>
                <div className="text-gray-600 text-sm">Note moyenne</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">3K+</div>
                <div className="text-gray-600 text-sm">Clients satisfaits</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                <div className="text-gray-600 text-sm">Recommandent</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}