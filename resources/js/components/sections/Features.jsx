import React, { useState } from "react";
import { Leaf, Shield, Truck, Award, Heart, Star, CheckCircle, Sparkles } from "lucide-react";

export default function Features({ visibleSections }) {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    { 
      icon: Leaf, 
      title: "100% Naturel", 
      description: "Produits certifiés bio",
      details: "Nos produits sont issus de l'agriculture biologique et ne contiennent aucun additif chimique",
      color: "green",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      textColor: "text-green-600"
    },
    { 
      icon: Shield, 
      title: "Qualité Garantie", 
      description: "Testés dermatologiquement",
      details: "Tous nos produits passent des tests rigoureux pour garantir sécurité et efficacité",
      color: "emerald",
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-600"
    },
    { 
      icon: Truck, 
      title: "Livraison Partout au Maroc", 
      description: "Service national",
      details: "Profitez de la livraison partout au Maroc pour vos commandes",
      color: "teal",
      gradient: "from-teal-500 to-teal-600",
      bgGradient: "from-teal-50 to-teal-100",
      borderColor: "border-teal-200",
      textColor: "text-teal-600"
    },
    { 
      icon: Award, 
      title: "Expertise", 
      description: "15 ans d'expérience",
      details: "Une équipe d'experts passionnés au service de votre bien-être depuis 15 ans",
      color: "lime",
      gradient: "from-lime-500 to-lime-600",
      bgGradient: "from-lime-50 to-lime-100",
      borderColor: "border-lime-200",
      textColor: "text-lime-600"
    },
  ];

  return (
    <section
      id="features"
      data-animate
      className={`relative py-16 md:py-20 bg-gradient-to-br from-green-50/50 via-white to-emerald-50/50 overflow-hidden transition-all duration-1000 ${
        visibleSections?.has("features") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        {[...Array(8)].map((_, i) => (
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
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Pourquoi nous choisir</span>
            <Star className="w-4 h-4" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Engagements</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez les valeurs qui nous distinguent et font de BioEkleel votre partenaire de confiance pour votre bien-être naturel
          </p>
          
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative cursor-pointer transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] ${
                visibleSections?.has("features") 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8"
              }`}
              style={{ 
                animationDelay: `${index * 150}ms`,
                transitionDelay: `${index * 100}ms`
              }}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              {/* Card Background with Gradient */}
              <div className={`relative p-8 rounded-3xl border-2 transition-all duration-500 overflow-hidden bg-gradient-to-br ${feature.bgGradient} ${feature.borderColor} group-hover:border-opacity-50 group-hover:shadow-2xl group-hover:shadow-${feature.color}-500/20`}>
                
                {/* Glow effect on hover */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Icon Container */}
                  <div className={`relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {/* Icon glow */}
                    <div className={`absolute -inset-2 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500`}></div>
                    
                    {/* Icon */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      <feature.icon className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                    
                    {/* Floating particles */}
                    {hoveredFeature === index && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-2 h-2 bg-white rounded-full animate-ping opacity-75"
                            style={{
                              left: `${50 + Math.cos(i * 1.047) * 35}%`,
                              top: `${50 + Math.sin(i * 1.047) * 35}%`,
                              animationDelay: `${i * 0.2}s`,
                              animationDuration: '1.5s'
                            }}
                          />
                        ))}
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl font-bold text-gray-900 mb-3 transition-colors duration-300 group-hover:${feature.textColor}`}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 font-medium">
                    {feature.description}
                  </p>

                  {/* Detailed description on hover */}
                  <div className={`transition-all duration-300 overflow-hidden ${
                    hoveredFeature === index 
                      ? "max-h-20 opacity-100" 
                      : "max-h-0 opacity-0"
                  }`}>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {feature.details}
                    </p>
                  </div>

                  {/* Check mark indicator */}
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mt-4 transition-all duration-300 ${
                    hoveredFeature === index 
                      ? `bg-gradient-to-r ${feature.gradient} text-white scale-110` 
                      : `bg-gray-100 ${feature.textColor} scale-100`
                  }`}>
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>

                {/* Corner decoration */}
                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className={`absolute bottom-4 left-4 w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Stats Section */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group">
              <div className="text-3xl md:text-4xl font-black text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                15+
              </div>
              <div className="text-gray-600 font-semibold">
                Années d'expérience
              </div>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-black text-emerald-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                1000+
              </div>
              <div className="text-gray-600 font-semibold">
                Clients satisfaits
              </div>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-black text-teal-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                100%
              </div>
              <div className="text-gray-600 font-semibold">
                Produits naturels
              </div>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-black text-lime-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-gray-600 font-semibold">
                Support client
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}