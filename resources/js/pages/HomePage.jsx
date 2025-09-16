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
// Removed Footer import - handled by App.jsx
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

// Removed large unused components to reduce bundle size

// Removed large unused components to reduce bundle size
