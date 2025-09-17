import React, { useState, useEffect, useContext } from "react";
import { Gift, Sparkles, ArrowRight } from "lucide-react";
import { AppContext } from '../../contexts/AppContext.js';

export default function PromotionsSlider({ visibleSections, navigateTo }) {
  const { promotions: dbPromotions, loading } = useContext(AppContext);
  const [currentPromoSlide, setCurrentPromoSlide] = useState(0);
  const [allPromotions, setAllPromotions] = useState([]);
  
  // Load last 4 promotions from database for home page
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        console.log('🔄 Fetching promotions from API...');
        const response = await fetch('/api/promotions');
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('📦 Raw data received:', data);
          
          // Handle direct array response from API
          const allPromotions = Array.isArray(data) ? data : [];
          console.log('📊 All promotions count:', allPromotions.length);
          
          // Get only the last 4 promotions for home page
          const last4Promotions = allPromotions.slice(-4);
          console.log('🎯 Last 4 promotions:', last4Promotions);
          
          setAllPromotions(last4Promotions);
        } else {
          console.error('❌ Failed to fetch promotions, status:', response.status);
        }
      } catch (error) {
        console.error('💥 Error fetching promotions:', error);
      }
    };
    
    fetchPromotions();
  }, []);
  
  // Fallback promotions with database field names (camelCase)
  const fallbackPromotions = [
    {
      id: 1,
      title: "Offre Spéciale Zitalgic®",
      subtitle: "Solution naturelle contre les douleurs",
      description: "Profitez de -50% sur toute la gamme Zitalgic® pour une récupération optimale",
      backgroundImage: "/images/promZital.png",
      discount: 50
    },
    {
      id: 2,
      title: "Pack Détox Complet",
      subtitle: "Purifiez votre Corps",
      description: "Detoxoil® + Jus Naturel à prix réduit pour une détox complète",
      backgroundImage: "/images/promoDetox.png",
      discount: 35
    }
  ];

  const promotions = allPromotions.length > 0 ? allPromotions : fallbackPromotions;
  const currentPromo = promotions[currentPromoSlide];

  // Auto-play effect
  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentPromoSlide((prev) => (prev + 1) % promotions.length);
      }, 5000);
    return () => clearInterval(interval);
  }, [promotions.length]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </section>
    );
  }

  return (
    <section
  id="promotions"
  data-animate
      className={`py-12 bg-gradient-to-br from-green-50/30 via-white to-emerald-50/30 transition-all duration-1000 ${
        visibleSections?.has("promotions") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
  }`}
>
  <div className="container mx-auto px-4">
        {/* Keep the beautiful title design */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-green-100 text-green-800 px-6 py-3 rounded-full text-sm font-bold mb-6">
            <Gift className="w-5 h-5 animate-bounce" />
            <span>Offres Exclusives</span>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
            Promotions{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-green-500 to-emerald-600">
                Exceptionnelles
              </span>
              {/* Decorative underline */}
              <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-green-400/30 via-green-500/40 to-emerald-400/30 rounded-full transform -skew-x-12"></div>
            </span>
        </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Profitez de nos offres limitées sur une sélection premium de produits naturels
          </p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
            <Gift className="w-6 h-6 text-green-500" />
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Modern Promotions Container with Background Image */}
        <div className="max-w-5xl mx-auto">
                  <div
          className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 group border border-white/10 backdrop-blur-sm promotions-container"
          style={{
            backgroundImage: currentPromo.backgroundImage ?
              `url(${currentPromo.backgroundImage})` :
              currentPromo.background_image ?
              `url(${currentPromo.background_image})` :
              currentPromo.image ?
              `url(${currentPromo.image})` :
              'linear-gradient(135deg, #22c55e, #10b981)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '500px'
          }}
          >
            {/* Modern gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30"></div>
            
            {/* Animated decorative elements */}
            <div className="absolute top-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 bg-green-400/20 rounded-full blur-2xl animate-bounce" style={{animationDuration: '4s'}}></div>
            <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-yellow-400/15 rounded-full blur-xl animate-ping" style={{animationDuration: '5s'}}></div>
            <div className="absolute top-1/4 right-1/3 w-16 h-16 bg-emerald-400/20 rounded-full blur-lg animate-pulse" style={{animationDuration: '3s'}}></div>
            
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-white/40 rounded-full animate-float"
                  style={{
                    left: `${15 + i * 12}%`,
                    top: `${25 + (i % 4) * 15}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: `${4 + i * 0.2}s`
                  }}
                ></div>
              ))}
            </div>
            
            {/* Geometric shapes */}
            <div className="absolute top-16 left-16 w-8 h-8 border-2 border-white/20 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
            <div className="absolute bottom-16 right-16 w-6 h-6 bg-white/10 rounded-full animate-ping" style={{animationDuration: '6s'}}></div>
            
            <div className="relative z-10 p-6 md:p-8 lg:p-10 h-full flex flex-col justify-center items-start text-left mobile-promo-content">
              <div className="max-w-2xl">
                {/* Modern "Offre Limitée" Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-base mb-6 md:mb-8 shadow-2xl backdrop-blur-md border border-green-400/30">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full animate-ping"></span>
                    <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full animate-ping" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full animate-ping" style={{animationDelay: '0.4s'}}></span>
                  </div>
                  <span className="tracking-wider">OFFRE LIMITÉE</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full animate-ping" style={{animationDelay: '0.6s'}}></span>
                    <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full animate-ping" style={{animationDelay: '0.8s'}}></span>
                    <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></span>
                  </div>
                </div>
                
                {/* Modern Title with gradient text */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-white to-green-200 bg-clip-text text-transparent drop-shadow-lg">
                    {currentPromo.title}
                  </span>
                </h3>
                
                {/* Subtitle if available */}
                {currentPromo.subtitle && (
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-3 sm:mb-4 md:mb-5 font-semibold drop-shadow-md">
                    {currentPromo.subtitle}
                  </p>
                )}
                
                {/* Modern Description */}
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/85 mb-6 sm:mb-8 md:mb-10 leading-relaxed font-medium drop-shadow-md">
                  {currentPromo.description}
                </p>
                
                {/* Modern CTA Button with glassmorphism */}
                <button 
                  onClick={() => {
                    if (navigateTo && currentPromo.product_id) {
                      navigateTo('product', { productId: currentPromo.product_id });
                    }
                  }}
                  className="group/btn relative bg-white/95 backdrop-blur-md text-green-600 px-6 py-3 md:px-8 md:py-4 rounded-2xl font-bold text-sm md:text-base hover:bg-white transition-all duration-500 transform hover:scale-105 hover:shadow-2xl flex items-center gap-2 md:gap-3 border border-white/20 shadow-xl"
                >
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                  
                  <span className="relative z-10 tracking-wide">Profiter de l'offre</span>
                  <svg className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
              </div>
            </div>
            
            {/* Modern hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/8 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Border glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500/30 via-transparent to-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Navigation dots inside container */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex justify-center gap-3 z-20">
              {promotions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPromoSlide(index)}
                  className={`relative w-3 h-3 rounded-full transition-all duration-300 border-2 ${
                    index === currentPromoSlide
                      ? "bg-green-500 border-green-400 scale-125 shadow-lg shadow-green-500/50"
                      : "bg-white/60 border-white/80 hover:bg-white/80 hover:border-white hover:scale-110"
                  }`}
                  aria-label={`Go to promotion ${index + 1}`}
                >
                  {/* Active dot glow effect */}
                  {index === currentPromoSlide && (
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-sm opacity-60 animate-pulse"></div>
                  )}
                  
                  {/* Inner dot for better visibility */}
                  <div className={`absolute inset-0.5 rounded-full transition-all duration-300 ${
                    index === currentPromoSlide 
                      ? "bg-white" 
                      : "bg-transparent"
                  }`}></div>
                </button>
              ))}
            </div>
      </div>
    </div>

        {/* See All Button - Under Promotions Container */}
        {navigateTo && (
          <div className="text-center mt-12">
            <button
              onClick={() => navigateTo('promotions')}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>Voir toutes les promotions</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        )}

        {/* Info section under promotions container */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Offres Limitées</h3>
            <p className="text-gray-600">Profitez de réductions exceptionnelles sur nos meilleurs produits</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Qualité Premium</h3>
            <p className="text-gray-600">Tous nos produits en promotion maintiennent nos standards de qualité</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Livraison Gratuite</h3>
            <p className="text-gray-600">Livraison offerte pour toute commande de produits en promotion</p>
          </div>
        </div>
  </div>
</section>
  );
}