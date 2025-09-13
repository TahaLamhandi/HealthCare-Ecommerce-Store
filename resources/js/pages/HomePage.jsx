import React from 'react';
import { useState, useEffect, useContext } from 'react';
// Removed createRoot import - not needed anymore
import { AppProvider } from '../contexts/AppContext';
import { AppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites, FavoritesProvider } from '../contexts/FavoritesContext';
import { useCart, CartProvider } from '../contexts/CartContext';
// Removed Header import - handled by App.jsx
import Hero from '../components/sections/Hero';
import Features from "../components/sections/Features";
import Products from '../components/sections/Products';
import Promotions from '../components/sections/Promotions';
import Categories from '../components/sections/Categories';
import Testimonials from '../components/sections/Testimonials';
import Chatbot from '../components/ui/chatbot';
import Banners from '../components/sections/Banners';
import Suppliers from '../components/sections/Suppliers';
import Newsletter from "../components/sections/Newsletter";
import AllProducts from './AllProducts.jsx';
// Removed Footer import - handled by App.jsx
import CategoryPage from '../components/pages/CategoryPage';
import { Heart, Star, ShoppingCart, Search, Filter, Package, ArrowRight, Crown } from 'lucide-react';

const CHATBOT_TRAINING = `
  Tu es un assistant virtuel pour Bioekleel, une boutique en ligne spécialisée dans les produits de santé et bien-être naturels et bio.
  INFORMATIONS SUR L'ENTREPRISE :
  - Nom : Bioekleel
  - Spécialité : Produits naturels et bio pour la santé et le bien-être
  - Valeurs : Qualité, naturalité, bien-être, expertise
  - Fournisseur exclusif : Authentic Laboratory (leader des formulations naturelles innovantes)
  
  NOS 4 CATÉGORIES PRINCIPALES :
  1. COMPLÉMENTS ALIMENTAIRES 💊
     - Solutions naturelles pour la santé et le bien-être
     - Formulées par Authentic Laboratory
     - Certifiées bio et efficacité prouvée
     - Produits phares : Zitalgic®, Zitalgic® Sport, Detoxoil®, Relaxoil®
  
  2. AROMATHÉRAPIE 🌸
     - Huiles essentielles pures et mélanges aromatiques
     - Effets thérapeutiques naturels
     - Odeurs naturelles et apaisantes
     - Pour le bien-être au quotidien
  
  3. NUTRITION NATURELLE 🥗
     - Superaliments et compléments nutritionnels bio
     - Qualité premium et traçabilité garantie
     - Pour une alimentation saine et naturelle
     - Spiruline, curcuma, oméga-3, vitamines naturelles
  
  4. COSMÉTIQUE NATURELLE ✨
     - Soins visage et corps 100% naturels
     - Sans parabens ni ingrédients chimiques nocifs
     - Testé dermatologiquement
     - Crèmes, sérums, masques, lotions naturelles
  
  PRODUITS PHARES (Compléments alimentaires) :
  - ZITALGIC® : Solution naturelle contre les douleurs articulaires, musculaires et nerveuses
    * Prix : 89.99 DH (avec réduction de 15%)
    * Composition : Menthol naturel, Camphre bio, Eucalyptus, Arnica montana, Extrait de curcuma
    * Bénéfices : Soulagement rapide, effet chaud-froid, réduction inflammation, 100% naturel
    * Usage : Appliquer 2-3 fois par jour sur la zone douloureuse
  
  - ZITALGIC® SPORT : Formule naturelle de récupération musculaire pour athlètes
    * Prix : 94.99 DH
    * Composition : Menthol renforcé, Camphre bio, Eucalyptus, Arnica montana, Extrait de curcuma, Huile de menthe poivrée
    * Bénéfices : Préparation musculaire, récupération accélérée, fraîcheur intense, non gras
    * Usage : Avant et après l'entraînement
  
  - DETOXOIL® : Huile de massage détoxifiante stimulant la circulation lymphatique
    * Prix : 79.99 DH (avec réduction de 10%)
    * Composition : Huile de pamplemousse, citron, genévrier, romarin, cèdre
    * Bénéfices : Élimination toxines, drainage lymphatique, sensation de légèreté
    * Usage : Massage circulaire de bas en haut, de préférence le matin
  
  - RELAXOIL® : Mélange d'huiles essentielles apaisantes pour relaxation profonde
    * Prix : 69.99 DH
    * Composition : Huile de lavande, camomille, ylang-ylang, bergamote, marjolaine
    * Bénéfices : Relaxation profonde, amélioration sommeil, soulagement tensions
    * Usage : Quelques gouttes sur tempes, cou et poignets, de préférence le soir
  
  SERVICES :
  - Livraison partout au Maroc
  - Produits certifiés bio et naturels par Authentic Laboratory
  - Support client 7j/7
  - Paiements sécurisés
  - Retours gratuits sous 30 jours
  - Garantie satisfaction 30 jours
  
  QUESTIONS FRÉQUEMMENT POSÉES À ANTICIPER :
  - "Quelle est la différence entre Zitalgic® et Zitalgic® Sport ?"
  - "Comment appliquer Detoxoil® pour un drainage optimal ?"
  - "Relaxoil® est-il adapté aux femmes enceintes ?"
  - "Puis-je utiliser plusieurs produits ensemble ?"
  - "Quels produits pour des douleurs chroniques ?"
  - "Avez-vous des routines spécifiques pour le soir ?"
  - "Comment vérifier l'authenticité des produits ?"
  - "Quelle est la durée d'effet typique de Zitalgic® ?"
  - "Vos produits sont-ils testés sur les animaux ?"
  - "Que faire en cas d'allergie à une huile essentielle ?"
  - "Quelles sont vos 4 catégories de produits ?"
  - "Puis-je mélanger Relaxoil® avec d'autres huiles ?"
  
  INSTRUCTIONS :
  - Réponds toujours en français
  - Sois chaleureux (ton amical mais professionnel)
  - Met en avant les certifications Authentic Laboratory
  - Pour les conseils : Associe toujours les produits aux besoins spécifiques
  - En cas de doute médical : Recommande de consulter un professionnel de santé
  - Utilise des emojis pertinents (🌿 pour le naturel, 💆 pour le bien-être, 💊 pour compléments, etc.)
  - Mentionne toujours que tous nos produits phares sont dans la catégorie "Compléments alimentaires"
  
  EXEMPLES DE RÉPONSES :
  - "Detoxoil® est particulièrement efficace en massage circulaire le matin 🌿 Il fait partie de nos compléments alimentaires !"
  - "Zitalgic® Sport et Zitalgic® partagent la même base naturelle, mais la version Sport contient du menthol renforcé pour une fraîcheur intense ❄️"
  - "Tous nos produits sont développés avec Authentic Laboratory, garantissant une traçabilité parfaite des ingrédients."
  - "Pour une routine soir complète : 1) Nettoyage 2) Relaxoil® en massage 3) Sérum nuit 🌙"
  - "Nous avons 4 catégories principales : Compléments alimentaires 💊, Aromathérapie 🌸, Nutrition naturelle 🥗, et Cosmétique naturelle ✨"
  - "Nos 4 produits phares (Zitalgic®, Zitalgic® Sport, Detoxoil®, Relaxoil®) sont tous dans la catégorie Compléments alimentaires 💊"
`;

export default function HomePage({ navigateTo }) {
  // Get data from AppContext
  const { banners, products, categories, promotions, slides, suppliers, loading } = useContext(AppContext);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set(['hero', 'features', 'products', 'promotions', 'categories', 'suppliers', 'testimonials', 'newsletter']));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isPopupCenterOpen, setIsPopupCenterOpen] = useState(false);
  const [isPopupBottomLeftOpen, setIsPopupBottomLeftOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [showPopupCenter, setShowPopupCenter] = useState(false);
  const [showPopupBottomLeft, setShowPopupBottomLeft] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Disabled IntersectionObserver for faster loading - all sections now visible by default
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           setVisibleSections((prev) => new Set([...prev, entry.target.id]));
  //         }
  //       });
  //     },
  //     { threshold: 0.1 }
  //   );
  //   const sections = document.querySelectorAll("[data-animate]");
  //   sections.forEach((section) => observer.observe(section));
  //   return () => observer.disconnect();
  // }, []);

  useEffect(() => {
    const centerTimer = setTimeout(() => {
      setShowPopupCenter(true);
      setTimeout(() => setIsPopupCenterOpen(true), 100);
    }, 2000);
    const bottomLeftTimer = setTimeout(() => {
      setShowPopupBottomLeft(true);
      setTimeout(() => setIsPopupBottomLeftOpen(true), 100);
    }, 4000);
    const loginTimer = setTimeout(() => {
      setShowLoginPopup(true);
      setTimeout(() => setIsLoginPopupOpen(true), 100);
    }, 6000);
    return () => {
      clearTimeout(centerTimer);
      clearTimeout(bottomLeftTimer);
      clearTimeout(loginTimer);
    };
  }, []);

  const sendMessageToGemini = async (message) => {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": "AIzaSyANctnUN2JuqNKu3S-yd37yiQ1dhUyCWW8",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${CHATBOT_TRAINING}\n\nQuestion du client : ${message}` }] }],
          }),
        }
      );
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Erreur API Gemini:", error);
      return "Désolé, je rencontre un problème technique. Veuillez contacter notre service client au 01 23 45 67 89 📞";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    try {
      const botResponse = await sendMessageToGemini(inputMessage);
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      setIsTyping(false);
    }
  };

  const initializeChat = () => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        text: "Bonjour ! 👋 Je suis votre assistant Bioekleel. Comment puis-je vous aider aujourd'hui ? Je peux vous conseiller sur nos produits naturels et bio !",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  };


  // No loading state - content shows immediately with fallback data

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header removed - handled by App.jsx */}
      <Hero slides={slides} />
      <Features visibleSections={visibleSections} />
      <Banners bannerNumber={1} navigateTo={navigateTo} />
      <Products visibleSections={visibleSections} navigateTo={navigateTo} />
      <Banners bannerNumber={2} navigateTo={navigateTo} />
      <Promotions visibleSections={visibleSections} navigateTo={navigateTo} />
      <Categories 
        visibleSections={visibleSections} 
        hoveredCategory={hoveredCategory} 
        setHoveredCategory={setHoveredCategory} 
        navigateTo={navigateTo}
      />
      <Suppliers visibleSections={visibleSections} />
      <Testimonials visibleSections={visibleSections} />
      <Newsletter newsletterEmail={newsletterEmail} setNewsletterEmail={setNewsletterEmail} />
      {/* Footer removed - handled by App.jsx */}
      {/*
      <CenterPopup
        showPopupCenter={showPopupCenter}
        isPopupCenterOpen={isPopupCenterOpen}
        setIsPopupCenterOpen={setIsPopupCenterOpen}
        setShowPopupCenter={setShowPopupCenter}
      />
      <BottomLeftPopup
        showPopupBottomLeft={showPopupBottomLeft}
        isPopupBottomLeftOpen={isPopupBottomLeftOpen}
        setIsPopupBottomLeftOpen={setIsPopupBottomLeftOpen}
        setShowPopupBottomLeft={setShowPopupBottomLeft}
      />
      */}
      <Chatbot
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        messages={messages}
        setMessages={setMessages}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        isTyping={isTyping}
        setIsTyping={setIsTyping}
        initializeChat={initializeChat}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}

// Import additional components for separate pages
// AllProducts import moved to top of file

// Simple Products Page Component
function ProductsPageComponent({ navigateTo }) {
  const { products, categories, loading } = useContext(AppContext);
  const { isAuthenticated } = useAuth();
  const { isFavorite, addToFavorites, removeFavorite } = useFavorites();
  const { addToCart } = useCart();

  // Get top 10 best selling products (by sales_count) for gold tags
  const topBestSellers = [...products]
    .filter(p => (p?.sales_count || 0) > 0)
    .sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0))
    .slice(0, 10)
    .map(p => p.id);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simple navigation function for this component
  const navigateToHome = () => {
    if (navigateTo) {
      navigateTo('home');
    } else {
      window.location.href = '/';
    }
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const productsPerPage = 9;

  // Handle scroll for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter products based on search, category, and price
  const filteredProducts = products.filter(product => {
    // Search by name (case insensitive)
    const matchesSearch = product && product.name &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by category
    const matchesCategory = selectedCategory === 'all' ||
      (product.category && (
        (typeof product.category === 'string' && product.category === selectedCategory) ||
        (typeof product.category === 'object' && product.category.title === selectedCategory)
      ));

    // Filter by price range
    let matchesPrice = true;
    if (priceRange !== 'all' && product.price) {
      const price = parseFloat(product.price);
      switch (priceRange) {
        case '0-50':
          matchesPrice = price >= 0 && price <= 50;
          break;
        case '50-100':
          matchesPrice = price > 50 && price <= 100;
          break;
        case '100-200':
          matchesPrice = price > 100 && price <= 200;
          break;
        case '200+':
          matchesPrice = price > 200;
          break;
        default:
          matchesPrice = true;
      }
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'price-low':
        return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
      case 'price-high':
        return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
      case 'rating':
        return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  // Use categories from AppContext instead of deriving from products
  // This ensures all 5 categories from the database appear in the filter

  const handleFavoriteClick = async (product, e) => {
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

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    if (!isAuthenticated()) {
      navigateTo('auth');
      return;
    }
    await addToCart(productId, 1);
  };

  // No loading state - content shows immediately with fallback data

  return (
    <div className="min-h-screen bg-white">
      <Header isScrolled={isScrolled} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} navigateTo={navigateToHome} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 py-16 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Tous nos Produits
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6">
              Explorez notre collection complète de produits naturels et bio
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Main Content - Responsive Filters and Products */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto">
            {/* Left Sidebar - Professional Search and Filters */}
            <div className="lg:w-1/4 w-full">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 lg:p-8 lg:sticky lg:top-6 backdrop-blur-sm">
                {/* Filter Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Filtres</h2>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setPriceRange('all');
                      setSortBy('name');
                      setCurrentPage(1);
                    }}
                    className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    Réinitialiser
                  </button>
                </div>
                {/* Professional Search Bar */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Rechercher un produit</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tapez le nom du produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500 text-base font-medium"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        <span className="text-xl">×</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Beautiful Filters */}
                <div className="space-y-8">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Catégorie</label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-900 font-medium appearance-none cursor-pointer text-base"
                        style={{color: 'black'}}
                      >
                        <option value="all" style={{color: 'black'}}>Toutes les catégories</option>
                        {categories.map((category, index) => (
                          <option key={category.id || index} value={category.title || category} style={{color: 'black'}}>
                            {category.title || category}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <Filter className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Gamme de prix (DH)</label>
                    <div className="relative">
                      <select
                        value={priceRange}
                        onChange={(e) => {
                          setPriceRange(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-900 font-medium appearance-none cursor-pointer text-base"
                        style={{color: 'black'}}
                      >
                        <option value="all" style={{color: 'black'}}>Tous les prix</option>
                        <option value="0-50" style={{color: 'black'}}>0 - 50 DH</option>
                        <option value="50-100" style={{color: 'black'}}>50 - 100 DH</option>
                        <option value="100-200" style={{color: 'black'}}>100 - 200 DH</option>
                        <option value="200+" style={{color: 'black'}}>200+ DH</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-gray-400 font-bold">DH</span>
                      </div>
                    </div>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Trier par</label>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-900 font-medium appearance-none cursor-pointer text-base"
                        style={{color: 'black'}}
                      >
                        <option value="name" style={{color: 'black'}}>Nom A-Z</option>
                        <option value="price-low" style={{color: 'black'}}>Prix croissant</option>
                        <option value="price-high" style={{color: 'black'}}>Prix décroissant</option>
                        <option value="rating" style={{color: 'black'}}>Mieux notés</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <ArrowRight className="h-5 w-5 text-gray-400 transform rotate-90" />
                      </div>
                    </div>
                  </div>

                  {/* Professional Results Count */}
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="text-center">
                      <div className="text-sm font-medium opacity-90 mb-2">Produits trouvés</div>
                      <div className="text-3xl font-bold mb-1">{filteredProducts.length}</div>
                      <div className="text-sm opacity-80">résultat{filteredProducts.length !== 1 ? 's' : ''}</div>
                      {selectedCategory !== 'all' && (
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <div className="text-xs opacity-75">Catégorie:</div>
                          <div className="text-sm font-medium">{selectedCategory}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Responsive Products Grid */}
            <div className="lg:w-3/4 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {currentProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="professional-product-card animate-fade-in-up w-full max-w-[300px] mx-auto cursor-pointer" 
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => navigateTo('product', { productId: product.id })}
                  >
                    <div className="product-image-container">
                      {product.img ? (
                        <img
                          src={product.img}
                          alt={product.name}
                          width={400}
                          height={220}
                          className="product-image"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 rounded-t-2xl">
                          <span className="text-sm font-medium">Image non disponible</span>
                        </div>
                      )}
                      {(Boolean(product.isNew) || Number(product.discount) > 0 || topBestSellers.includes(product.id)) && (
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {Boolean(product.isNew) && <span className="product-badge-new">Nouveau</span>}
                          {Number(product.discount) > 0 && (
                            <span className="product-badge-discount">-{Number(product.discount)}%</span>
                          )}
                          {topBestSellers.includes(product.id) && (
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center space-x-1 shadow-lg">
                              <Crown className="w-3 h-3" />
                              <span>Meilleur Vente</span>
                            </span>
                          )}
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleFavoriteClick(product, e); }}
                        className={`product-heart-btn absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isFavorite(product.id)
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isAuthenticated() && isFavorite(product.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <div className="product-info">
                      <span className="product-category-badge">{product.category?.title || product.category || 'Produit'}</span>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <div className="product-rating">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`rating-star ${i < (product.rating || 4.5) ? "filled" : "empty"}`} />
                        ))}
                        <span className="rating-count">({product.reviews || 0} avis)</span>
                      </div>
                      <div className="product-price-container">
                        <div>
                          {Number(product.discount) > 0 ? (
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
                        <button
                          onClick={(e) => handleAddToCart(product.id, e)}
                          className="product-cart-btn"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Panier
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 transition-colors"
                  >
                    Précédent
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === index + 1
                          ? 'bg-green-500 text-white'
                          : 'border border-gray-200 hover:bg-green-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 transition-colors"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer navigateTo={navigateToHome} />
    </div>
  );
}

// Simple Categories Page Component  
function CategoriesPageComponent({ navigateTo }) {
  const { categories, products, loading } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateToHome = () => {
    window.location.href = '/';
  };

  const categoriesPerPage = 6;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredCategories = categories.filter(category =>
    category && category.title && category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);
  const startIndex = (currentPage - 1) * categoriesPerPage;
  const currentCategories = filteredCategories.slice(startIndex, startIndex + categoriesPerPage);

  // No loading state - content shows immediately with fallback data

  const getProductCountForCategory = (categoryTitle) => {
    return products.filter(product => 
      product.category && 
      (typeof product.category === 'string' ? product.category === categoryTitle : product.category.title === categoryTitle)
    ).length;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header isScrolled={isScrolled} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} navigateTo={navigateToHome} />

      {/* Beautiful Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-green-50/30 to-emerald-50/40 py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-100/10 via-emerald-50/5 to-green-100/15"></div>
          {/* Floating orbs */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-green-200/30 to-emerald-300/40 animate-pulse"
              style={{
                width: `${Math.random() * 150 + 40}px`,
                height: `${Math.random() * 150 + 40}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 4 + 3}s`,
                filter: 'blur(50px)',
              }}
            />
          ))}
          {/* Mesh gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.08),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.06),transparent_50%)]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-6xl mx-auto">
            <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-12 leading-tight">
              <div className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 drop-shadow-lg">
                  Nos
                </span>
                {/* Glow effect behind "Nos" */}
                <div className="absolute -inset-4 bg-gradient-to-r from-green-300/10 to-emerald-300/10 rounded-2xl blur-2xl animate-pulse"></div>
              </div>
              <br />
              <div className="relative inline-block mt-6">
                <span 
                  className="text-transparent bg-clip-text font-black relative z-10"
                  style={{
                    background: 'linear-gradient(90deg, #16a34a, #22c55e, #10b981, #059669, #34d399, #16a34a)',
                    backgroundSize: '400% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'gradient-shift 5s ease-in-out infinite'
                  }}
                >
                  Catégories
                </span>
                
                {/* Enhanced decorative elements */}
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gradient-to-r from-emerald-400/40 to-green-500/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/2 -left-12 w-6 h-6 bg-gradient-to-r from-green-300/35 to-emerald-300/35 rounded-full animate-ping"></div>
                <div className="absolute -top-2 right-0 w-4 h-4 bg-gradient-to-r from-emerald-500/40 to-green-400/40 rounded-full animate-pulse"></div>
                
                {/* Beautiful underline effect */}
                <div className="absolute -bottom-6 left-0 right-0 h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full shadow-lg transform scale-x-0 animate-[scaleX_2s_ease-in-out_0.8s_forwards] origin-left"></div>
              </div>
            </h1>
            
            <div className="relative mb-16">
              <p className="text-2xl md:text-3xl lg:text-4xl text-gray-600 leading-relaxed font-light max-w-5xl mx-auto">
                Découvrez notre univers de{' '}
                <span className="relative inline-block">
                  <span className="text-green-600 font-bold bg-gradient-to-r from-green-100/80 to-emerald-100/80 px-3 py-2 rounded-xl border border-green-200/50 shadow-lg">
                    produits naturels
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-xl blur animate-pulse"></div>
                </span>
              </p>
              
              {/* Floating elements around text */}
              <div className="absolute top-0 left-1/4 w-3 h-3 bg-green-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute bottom-0 right-1/4 w-2 h-2 bg-emerald-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }}></div>
              <div className="absolute top-1/2 left-1/6 w-2 h-2 bg-green-500/60 rounded-full animate-ping" style={{ animationDelay: '1.2s' }}></div>
              <div className="absolute top-1/2 right-1/6 w-3 h-3 bg-emerald-500/60 rounded-full animate-pulse" style={{ animationDelay: '1.6s' }}></div>
            </div>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="relative group">
                {/* Search bar glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Rechercher une catégorie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-12 py-6 text-xl lg:text-2xl border-2 border-green-300/40 rounded-full focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-500 transition-all duration-500 bg-white/80 backdrop-blur-md shadow-xl text-gray-700 placeholder-gray-500 font-medium"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(34,197,94,0.05) 100%)',
                      backdropFilter: 'blur(20px)'
                    }}
                  />
                  <div className="absolute inset-y-0 right-0 pr-8 flex items-center pointer-events-none">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-400/30 rounded-full blur-md animate-pulse"></div>
                      <Search className="h-8 w-8 lg:h-10 lg:w-10 text-green-600 relative z-10 drop-shadow-sm" />
                    </div>
                  </div>
                  
                  {/* Search bar sparkles */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-green-400 rounded-full animate-ping opacity-50"
                      style={{
                        left: `${20 + i * 12}%`,
                        top: `${30 + (i % 2) * 40}%`,
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: '2s'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="inline-flex items-center bg-gradient-to-r from-green-100/80 to-emerald-100/80 backdrop-blur-md rounded-3xl px-8 py-5 border border-green-200/50 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-50"></div>
                </div>
                <span className="text-lg lg:text-xl font-bold text-gray-700">
                  <span className="text-3xl lg:text-4xl font-black text-green-600 drop-shadow-sm">
                    {filteredCategories.length}
                  </span>
                  <span className="ml-3 text-gray-600">
                    catégorie{filteredCategories.length !== 1 ? 's' : ''} disponible{filteredCategories.length !== 1 ? 's' : ''}
                  </span>
                </span>
                <div className="relative">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Grid */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Subtle Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-50/20 via-emerald-50/10 to-green-50/20"></div>
          {/* Animated mesh background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-200/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {currentCategories.length === 0 ? (
            <div className="text-center py-32">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-600 to-green-500 rounded-full mx-auto mb-8 flex items-center justify-center">
                  <Search className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">Aucune catégorie trouvée</h3>
                <p className="text-xl text-gray-600">Essayez de modifier vos critères de recherche</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-20">
                {currentCategories.map((category, index) => (
                  <div
                    key={category.id}
                    className="group relative cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Card glow effect with individual colors */}
                    <div 
                      className="absolute -inset-1 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"
                      style={{
                        background: index === 0 ? 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.15) 100%)' :
                                   index === 1 ? 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(22,163,74,0.15) 100%)' :
                                   index === 2 ? 'linear-gradient(135deg, rgba(20,184,166,0.2) 0%, rgba(15,118,110,0.15) 100%)' :
                                   'linear-gradient(135deg, rgba(132,204,22,0.2) 0%, rgba(101,163,13,0.15) 100%)'
                      }}
                    ></div>
                    
                    <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-3xl transition-all duration-700 overflow-hidden border border-emerald-100/50 hover:border-emerald-300/50 group-hover:-translate-y-3 group-hover:scale-[1.02]">
                      {/* Enhanced image section with unique green shades */}
                      <div 
                        className="relative h-56 overflow-hidden"
                        style={{
                          background: index === 0 ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)' :
                                     index === 1 ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)' :
                                     index === 2 ? 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)' :
                                     'linear-gradient(135deg, #fefffe 0%, #f7fee7 50%, #d9f99d 100%)'
                        }}
                      >
                        {/* Background pattern */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: index === 0 ? 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.05) 100%)' :
                                       index === 1 ? 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(22,163,74,0.05) 100%)' :
                                       index === 2 ? 'linear-gradient(135deg, rgba(20,184,166,0.1) 0%, rgba(15,118,110,0.05) 100%)' :
                                       'linear-gradient(135deg, rgba(132,204,22,0.1) 0%, rgba(101,163,13,0.05) 100%)'
                          }}
                        ></div>
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: index === 0 ? 'radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)' :
                                       index === 1 ? 'radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.15),transparent_50%)' :
                                       index === 2 ? 'radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.15),transparent_50%)' :
                                       'radial-gradient(circle_at_30%_20%,rgba(132,204,22,0.15),transparent_50%)'
                          }}
                        ></div>
                        
                        {category.img ? (
                          <img
                            src={category.img}
                            alt={category.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-overlay opacity-80"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center relative z-10">
                            <div className="text-center">
                              <div className="relative">
                                <div 
                                  className="w-24 h-24 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border shadow-xl"
                                  style={{
                                    background: index === 0 ? 'linear-gradient(135deg, rgba(16,185,129,0.3) 0%, rgba(5,150,105,0.2) 100%)' :
                                               index === 1 ? 'linear-gradient(135deg, rgba(34,197,94,0.3) 0%, rgba(22,163,74,0.2) 100%)' :
                                               index === 2 ? 'linear-gradient(135deg, rgba(20,184,166,0.3) 0%, rgba(15,118,110,0.2) 100%)' :
                                               'linear-gradient(135deg, rgba(132,204,22,0.3) 0%, rgba(101,163,13,0.2) 100%)',
                                    borderColor: index === 0 ? 'rgba(16,185,129,0.4)' :
                                                index === 1 ? 'rgba(34,197,94,0.4)' :
                                                index === 2 ? 'rgba(20,184,166,0.4)' :
                                                'rgba(132,204,22,0.4)'
                                  }}
                                >
                                  <Package 
                                    className="w-12 h-12 drop-shadow-lg" 
                                    style={{
                                      color: index === 0 ? '#059669' :
                                            index === 1 ? '#16a34a' :
                                            index === 2 ? '#0f766e' :
                                            '#65a30d'
                                    }}
                                  />
                                </div>
                                {/* Floating particles around icon */}
                                {[...Array(6)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="absolute w-2 h-2 rounded-full animate-ping opacity-50"
                                    style={{
                                      left: `${50 + Math.cos(i * 1.047) * 40}%`,
                                      top: `${50 + Math.sin(i * 1.047) * 40}%`,
                                      animationDelay: `${i * 0.3}s`,
                                      animationDuration: '2s',
                                      backgroundColor: index === 0 ? '#10b981' :
                                                      index === 1 ? '#22c55e' :
                                                      index === 2 ? '#14b8a6' :
                                                      '#84cc16'
                                    }}
                                  />
                                ))}
                              </div>
                              <span 
                                className="text-lg font-bold drop-shadow-lg"
                                style={{
                                  color: index === 0 ? '#047857' :
                                        index === 1 ? '#15803d' :
                                        index === 2 ? '#0f766e' :
                                        '#4d7c0f'
                                }}
                              >
                                Catégorie Premium
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Enhanced product count badge with individual colors */}
                        <div className="absolute top-4 right-4">
                          <div className="relative">
                            <div 
                              className="absolute -inset-1 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                              style={{
                                background: index === 0 ? 'linear-gradient(135deg, rgba(16,185,129,0.4) 0%, rgba(5,150,105,0.3) 100%)' :
                                           index === 1 ? 'linear-gradient(135deg, rgba(34,197,94,0.4) 0%, rgba(22,163,74,0.3) 100%)' :
                                           index === 2 ? 'linear-gradient(135deg, rgba(20,184,166,0.4) 0%, rgba(15,118,110,0.3) 100%)' :
                                           'linear-gradient(135deg, rgba(132,204,22,0.4) 0%, rgba(101,163,13,0.3) 100%)'
                              }}
                            ></div>
                            <span 
                              className="relative backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold shadow-xl border"
                              style={{
                                background: index === 0 ? 'linear-gradient(135deg, rgba(5,150,105,0.9) 0%, rgba(16,185,129,0.8) 100%)' :
                                           index === 1 ? 'linear-gradient(135deg, rgba(22,163,74,0.9) 0%, rgba(34,197,94,0.8) 100%)' :
                                           index === 2 ? 'linear-gradient(135deg, rgba(15,118,110,0.9) 0%, rgba(20,184,166,0.8) 100%)' :
                                           'linear-gradient(135deg, rgba(101,163,13,0.9) 0%, rgba(132,204,22,0.8) 100%)',
                                color: 'white',
                                borderColor: index === 0 ? 'rgba(16,185,129,0.5)' :
                                            index === 1 ? 'rgba(34,197,94,0.5)' :
                                            index === 2 ? 'rgba(20,184,166,0.5)' :
                                            'rgba(132,204,22,0.5)'
                              }}
                            >
                              <span 
                                style={{
                                  color: index === 0 ? '#a7f3d0' :
                                        index === 1 ? '#bbf7d0' :
                                        index === 2 ? '#99f6e4' :
                                        '#d9f99d'
                                }}
                              >
                                {getProductCountForCategory(category.title)}
                              </span> produits
                            </span>
                          </div>
                        </div>
                        
                        {/* Shimmer overlay with individual colors */}
                        <div 
                          className="absolute inset-0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
                          style={{
                            background: index === 0 ? 'linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)' :
                                       index === 1 ? 'linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent)' :
                                       index === 2 ? 'linear-gradient(90deg, transparent, rgba(20,184,166,0.3), transparent)' :
                                       'linear-gradient(90deg, transparent, rgba(132,204,22,0.3), transparent)'
                          }}
                        ></div>
                      </div>

                      {/* Enhanced content section */}
                      <div className="p-8">
                        <div className="flex items-start gap-4 mb-4">
                          <div 
                            className="w-3 h-3 rounded-full mt-2 group-hover:animate-pulse"
                            style={{
                              background: index === 0 ? 'linear-gradient(135deg, #10b981, #059669)' :
                                         index === 1 ? 'linear-gradient(135deg, #22c55e, #16a34a)' :
                                         index === 2 ? 'linear-gradient(135deg, #14b8a6, #0f766e)' :
                                         'linear-gradient(135deg, #84cc16, #65a30d)'
                            }}
                          ></div>
                          <h3 
                            className="text-2xl lg:text-3xl font-bold text-gray-900 transition-colors duration-500 leading-tight group-hover:transition-colors"
                            style={{
                              color: undefined // Use default gray-900
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.color = index === 0 ? '#047857' :
                                                    index === 1 ? '#15803d' :
                                                    index === 2 ? '#0f766e' :
                                                    '#4d7c0f';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = '#111827'; // gray-900
                            }}
                          >
                            {category.title}
                          </h3>
                        </div>

                        <p className="text-gray-600 group-hover:text-gray-700 mb-8 text-lg leading-relaxed transition-colors duration-300">
                          {category.description || `Découvrez notre sélection premium de produits dans la catégorie ${category.title}.`}
                        </p>

                        {/* Enhanced button with individual colors */}
                        <button 
                          onClick={() => {
                            if (navigateTo) {
                              navigateTo('category', category.title);
                            }
                          }}
                          className="w-full relative overflow-hidden text-white py-4 px-6 rounded-2xl font-bold transition-all duration-500 flex items-center justify-center cursor-pointer shadow-xl hover:shadow-2xl group/btn border"
                          style={{
                            background: index === 0 ? 'linear-gradient(135deg, #10b981, #059669, #047857)' :
                                       index === 1 ? 'linear-gradient(135deg, #22c55e, #16a34a, #15803d)' :
                                       index === 2 ? 'linear-gradient(135deg, #14b8a6, #0f766e, #134e4a)' :
                                       'linear-gradient(135deg, #84cc16, #65a30d, #4d7c0f)',
                            borderColor: index === 0 ? 'rgba(16,185,129,0.3)' :
                                        index === 1 ? 'rgba(34,197,94,0.3)' :
                                        index === 2 ? 'rgba(20,184,166,0.3)' :
                                        'rgba(132,204,22,0.3)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = index === 0 ? 'linear-gradient(135deg, #047857, #10b981, #059669)' :
                                                       index === 1 ? 'linear-gradient(135deg, #15803d, #22c55e, #16a34a)' :
                                                       index === 2 ? 'linear-gradient(135deg, #134e4a, #14b8a6, #0f766e)' :
                                                       'linear-gradient(135deg, #4d7c0f, #84cc16, #65a30d)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = index === 0 ? 'linear-gradient(135deg, #10b981, #059669, #047857)' :
                                                       index === 1 ? 'linear-gradient(135deg, #22c55e, #16a34a, #15803d)' :
                                                       index === 2 ? 'linear-gradient(135deg, #14b8a6, #0f766e, #134e4a)' :
                                                       'linear-gradient(135deg, #84cc16, #65a30d, #4d7c0f)';
                          }}
                        >
                          {/* Button glow with individual colors */}
                          <div 
                            className="absolute -inset-1 rounded-2xl blur opacity-0 group-hover/btn:opacity-30 transition-opacity duration-500"
                            style={{
                              background: index === 0 ? 'linear-gradient(135deg, #10b981, #047857)' :
                                         index === 1 ? 'linear-gradient(135deg, #22c55e, #15803d)' :
                                         index === 2 ? 'linear-gradient(135deg, #14b8a6, #134e4a)' :
                                         'linear-gradient(135deg, #84cc16, #4d7c0f)'
                            }}
                          ></div>
                          
                          {/* Button shimmer */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                          
                          <span className="relative z-10 text-lg">Explorer cette catégorie</span>
                          <div className="relative z-10 ml-3 transform group-hover/btn:translate-x-1 group-hover/btn:scale-110 transition-all duration-300">
                            <ArrowRight className="w-6 h-6" />
                          </div>
                          
                          {/* Floating particles with individual colors */}
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-1 h-1 rounded-full opacity-0 group-hover/btn:opacity-100"
                              style={{
                                left: `${20 + i * 12}%`,
                                top: `${30 + (i % 2) * 40}%`,
                                animationDelay: `${i * 0.1}s`,
                                backgroundColor: index === 0 ? '#a7f3d0' :
                                                index === 1 ? '#bbf7d0' :
                                                index === 2 ? '#99f6e4' :
                                                '#d9f99d'
                              }}
                            />
                          ))}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="group px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-700 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:hover:from-emerald-600 disabled:hover:to-green-500 flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span>Précédent</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl ${
                          currentPage === index + 1
                            ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white scale-110'
                            : 'bg-white border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 hover:scale-105'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="group px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-700 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:hover:from-emerald-600 disabled:hover:to-green-500 flex items-center gap-2"
                  >
                    <span>Suivant</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer navigateTo={navigateToHome} />
    </div>
  );
}

// Simple Router Component
function SimpleRouter() {
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname;
    if (path === '/products' || path === '/produits') return 'products';
    if (path === '/categories') return 'categories';
    return 'home';
  });
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/products' || path === '/produits') setCurrentPage('products');
      else if (path === '/categories') setCurrentPage('categories');
      else setCurrentPage('home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation function
  const navigateTo = (page, categoryName = null) => {
    console.log('🚀 navigateTo called with:', { page, categoryName });
    console.log('📍 Current state before:', { currentPage, selectedCategory });
    
    // Always scroll to top first
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === 'category' && categoryName) {
      console.log('🏷️ Setting category page:', categoryName);
      setSelectedCategory(categoryName);
      setCurrentPage('category');
      // Update URL for category page
      window.history.pushState({}, '', `/category/${encodeURIComponent(categoryName)}`);
    } else {
      console.log('📄 Setting page:', page);
      setCurrentPage(page);
      setSelectedCategory(null);
      const url = page === 'home' ? '/' : `/${page}`;
      window.history.pushState({}, '', url);
    }
    
    console.log('✅ Navigation completed. New state:', { 
      newPage: page === 'category' ? 'category' : page, 
      newCategory: page === 'category' ? categoryName : null 
    });
  };

  const navigateBack = () => {
    setCurrentPage('home');
    setSelectedCategory(null);
  };

  if (currentPage === 'products') {
    return (
      <FavoritesProvider>
        <CartProvider>
          <AllProducts navigateTo={navigateTo} />
        </CartProvider>
      </FavoritesProvider>
    );
  }

  if (currentPage === 'bestsellers') {
    const BestSellersPage = React.lazy(() => import('./BestSellersPage'));
    return (
      <FavoritesProvider>
        <CartProvider>
          <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div></div>}>
            <BestSellersPage navigateTo={navigateTo} />
          </React.Suspense>
        </CartProvider>
      </FavoritesProvider>
    );
  }

  if (currentPage === 'promotions') {
    const PromotionsPage = React.lazy(() => import('./PromotionsPage'));
    return (
      <FavoritesProvider>
        <CartProvider>
          <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div></div>}>
            <PromotionsPage navigateTo={navigateTo} />
          </React.Suspense>
        </CartProvider>
      </FavoritesProvider>
    );
  }

  if (currentPage === 'products') {
    return (
      <AppProvider>
        <FavoritesProvider>
          <CartProvider>
            <AllProducts navigateTo={navigateTo} />
          </CartProvider>
        </FavoritesProvider>
      </AppProvider>
    );
  }

  if (currentPage === 'categories') {
    return (
      <AppProvider>
        <CategoriesPageComponent navigateTo={navigateTo} />
      </AppProvider>
    );
  }

  if (currentPage === 'category' && selectedCategory) {
    return (
      <FavoritesProvider>
        <CartProvider>
          <CategoryPage categoryName={selectedCategory} onNavigateBack={navigateBack} />
        </CartProvider>
      </FavoritesProvider>
    );
  }

  // Default to homepage with navigation props
  return <App navigateTo={navigateTo} />;
}

// Removed standalone rendering logic - App.jsx handles all routing now
