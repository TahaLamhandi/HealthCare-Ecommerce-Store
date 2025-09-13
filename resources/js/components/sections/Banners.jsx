import React from "react";
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import '../../../css/app.css';

export default function PromotionalBanner({ bannerNumber, navigateTo }) {
  const { banners, loading } = useContext(AppContext);
  
  // Get the specific banner for this bannerNumber (banners are 1-indexed)
  const banner = banners && banners.length >= bannerNumber ? banners[bannerNumber - 1] : null;
  
  // Define fallback banners with backgroundImage field (camelCase)
  const fallbackBanners = [
    {
      id: 1,
      title: "Offres Spéciales Bio",
      subtitle: "Découvrez nos produits naturels à prix réduits",
      cta_text: "Découvrir les offres",
      backgroundImage: "/images/banner1.jpg"
    },
    {
      id: 2, 
      title: "Collection Premium",
      subtitle: "Votre bien-être mérite le meilleur de la nature",
      cta_text: "Explorer la collection",
      backgroundImage: "/images/banner2.jpg"
    }
  ];
  
  // Use banner data or fallback
  const displayBanner = banner || fallbackBanners[bannerNumber - 1] || fallbackBanners[0];
  
  if (loading) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-green-50/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-green-200/20 to-emerald-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-emerald-200/20 to-green-300/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 w-full">
        <div 
          className="relative rounded-3xl overflow-hidden transition-all duration-700 group border border-white/20 backdrop-blur-sm w-full banner-container"
          style={{
            backgroundImage: displayBanner.backgroundImage ? 
              `url(${displayBanner.backgroundImage})` : 
              displayBanner.background_image ? 
              `url(${displayBanner.background_image})` : 
              displayBanner.image ? 
              `url(${displayBanner.image})` : 
              'linear-gradient(135deg, #22c55e, #10b981)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Animated decorative elements */}
          <div className="absolute top-6 right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-6 left-6 w-20 h-20 bg-green-400/20 rounded-full blur-xl animate-bounce" style={{animationDuration: '3s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-yellow-400/15 rounded-full blur-lg animate-ping" style={{animationDuration: '4s'}}></div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + i * 0.5}s`
                }}
              ></div>
            ))}
              </div>
          
          {/* Content positioned at bottom left corner */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="text-left">
              {/* Modern button with glassmorphism effect */}
              <button 
                onClick={() => {
                  if (navigateTo && displayBanner.product_id) {
                    navigateTo('product', { productId: displayBanner.product_id });
                  }
                }}
                className="group/btn relative bg-white/95 backdrop-blur-md text-green-600 px-6 py-3 rounded-2xl font-bold text-base hover:bg-white transition-all duration-500 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 border border-white/20 shadow-xl"
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                
                <span className="relative z-10">Profiter de l'offre</span>
                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </div>
          </div>
          
          {/* Modern hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          {/* Border glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500/20 via-transparent to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>
    </section>
  );
}