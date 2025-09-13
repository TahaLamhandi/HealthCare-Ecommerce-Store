import { Search, Menu, X, ShoppingCart, Copy, MessageCircle, Crown, Award, Percent, Tag, Star, Phone, Heart, Bell, User, Leaf, ChevronDown, Mail, MapPin, ExternalLink } from "lucide-react";
import { useState, useContext, useRef, useEffect } from "react";
import { Link } from '@inertiajs/react';
import { AppContext } from "../../contexts/AppContext";
import { Button } from '../tools/button';
import { Badge } from '../tools/badge';
import { Input } from '../tools/input';

export default function Header({ isScrolled, isMobileMenuOpen, setIsMobileMenuOpen, navigateTo }) {
  const { categories = [], products = [], promotions = [] } = useContext(AppContext);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const tabsRef = useRef(null);
  const [tabsWidth, setTabsWidth] = useState(0);

  // Handle scroll behavior for hiding/showing navigation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsScrollingDown(true);
      } else {
        // Scrolling up or at top
        setIsScrollingDown(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  // Update tabs width on resize
  useEffect(() => {
    const updateWidth = () => tabsRef.current && setTabsWidth(tabsRef.current.offsetWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Handle copy to clipboard
  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+212 6 12 34 56 78');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Navigation items with hover handlers
  const navItems = [
    {
      name: 'CATÉGORIES',
      hover: 'categories',
      content: (
        <div className="grid grid-cols-4 gap-6 p-6">
          {categories.slice(0, 4).map((cat, i) => (
            <div key={i} className="group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl h-full">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-3 shadow-sm">
                  <Tag className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.products?.length || 0} produits</p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      name: 'MEILLEURES VENTES',
      hover: 'bestsellers',
      content: (
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Nos meilleures ventes</h3>
          <div className="grid grid-cols-4 gap-6">
            {products
              .filter(p => p.sales_count > 0)
              .sort((a, b) => b.sales_count - a.sales_count)
              .slice(0, 4)
              .map((product, i) => (
                <div key={product.id} className="group relative">
                  <div className="absolute -top-2 -right-2 z-10">
                    <Crown className="w-6 h-6 text-amber-700 fill-amber-700" />
                  </div>
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-100">
                      <img
                        src={product.image || '/images/placeholder-product.png'}
                        alt={product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h4>
                      <div className="mt-1 flex items-center">
                        <Star className="h-3 w-3 text-amber-700 fill-amber-700" />
                        <span className="ml-1 text-xs text-gray-500">
                          {product.rating || '4.5'}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm font-medium text-emerald-600">{product.price} DH</p>
                        {product.sales_count > 0 && (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                            {product.sales_count} vendus
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )
    },
    {
      name: 'PROMOTIONS',
      hover: 'promotions',
      content: (
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Promotions en cours</h3>
          <div className="grid grid-cols-4 gap-6">
            {promotions.slice(0, 4).map((promo, i) => (
              <div key={i} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="relative">
                    <img
                      src={promo.image || '/images/promo-placeholder.jpg'}
                      alt={promo.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{promo.discount}%
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="font-medium text-gray-900 mb-2">{promo.title}</h4>
                    <p className="text-sm text-gray-500 mb-3 flex-1">{promo.description}</p>
                    <button className="w-full mt-auto bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors">
                      Voir l'offre
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      name: 'AIDE & CONTACT',
      hover: 'contact',
      content: (
        <div className="p-6">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4 mx-auto">
                <Phone className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Contactez-nous</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Notre équipe est à votre disposition pour toute question ou assistance.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">+212 6 12 34 56 78</p>
                  </div>
                  <div className="ml-auto flex space-x-2">
                    <button
                      onClick={handleCopyPhone}
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-500"
                      title="Copier le numéro"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <a
                      href="https://wa.me/212612345678"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md hover:bg-green-50 text-green-400 hover:text-green-500"
                      title="Ouvrir WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                
                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700">
                  Envoyer un message
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-2">
                  Réponse sous 24h, du lundi au vendredi
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const navigate = (page) => navigateTo ? navigateTo(page) : window.location.href = `/${page}`;

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-[1000]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with BioEkleel Text */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group transition-all duration-300 hover:scale-105 active:scale-95"
            onClick={() => navigate('home')}
          >
            <div className="relative">
              <img
                src="/images/logo.png"
                alt="BioEkleel Logo"
                className="h-12 w-auto transition-all duration-300 group-hover:drop-shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="group-hover:translate-x-1 transition-transform duration-300">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 via-green-600 to-green-700 bg-clip-text text-transparent group-hover:from-green-400 group-hover:via-green-500 group-hover:to-green-600 transition-all duration-300">
                BioEkleel
              </h1>
              <p className="text-xs text-gray-500 font-medium group-hover:text-green-600 transition-colors duration-300">
                Santé & Bien-être
              </p>
            </div>
          </div>

          {/* Desktop Navigation with Scroll Animation */}
          <nav className={`hidden md:block relative transition-all duration-500 ease-in-out ${
            isScrollingDown 
              ? 'opacity-0 -translate-y-4 pointer-events-none' 
              : 'opacity-100 translate-y-0 pointer-events-auto'
          }`}>
            <div className="flex space-x-1" ref={tabsRef}>
              {navItems.map((item, index) => (
                <div 
                  key={index}
                  className={`relative transition-all duration-300 ${
                    isScrollingDown ? 'scale-95' : 'scale-100'
                  }`}
                  style={{ 
                    transitionDelay: isScrollingDown ? '0ms' : `${index * 50}ms` 
                  }}
                  onMouseEnter={() => setHoveredMenu(item.hover)}
                  onMouseLeave={() => hoveredMenu === item.hover && setHoveredMenu(null)}
                >
                  <button
                    onClick={() => navigate(item.hover === 'contact' ? 'contact' : item.hover === 'bestsellers' ? 'bestsellers' : item.hover === 'promotions' ? 'promotions' : 'categories')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      hoveredMenu === item.hover 
                        ? 'text-emerald-600 bg-emerald-50 shadow-sm transform scale-105' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                    }`}
                  >
                    {item.name}
                  </button>
                  
                  {/* Active indicator with animation */}
                  {hoveredMenu === item.hover && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Dropdown container */}
            {hoveredMenu && (
              <div 
                className="absolute left-0 w-full bg-white shadow-2xl rounded-b-xl overflow-hidden transition-all duration-300"
                style={{
                  top: '100%',
                  opacity: hoveredMenu ? 1 : 0,
                  transform: hoveredMenu ? 'translateY(0)' : 'translateY(-10px)',
                  pointerEvents: hoveredMenu ? 'auto' : 'none',
                  width: tabsWidth
                }}
                onMouseEnter={() => setHoveredMenu(hoveredMenu)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                {navItems.find(item => item.hover === hoveredMenu)?.content}
              </div>
            )}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-emerald-600">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-gray-700 hover:text-emerald-600 relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-gray-900 ml-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(item.hover === 'contact' ? 'contact' : item.hover === 'bestsellers' ? 'bestsellers' : item.hover === 'promotions' ? 'promotions' : 'categories');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
