import React from 'react';
import { createContext, useState, useEffect } from 'react';
import { fetchBanners, fetchProducts , fetchCategories, fetchPromotions , fetchSlides , fetchSuppliers } from '../services/dataService';
import { CartProvider } from './CartContext';
import { FavoritesProvider } from './FavoritesContext';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initialize with fallback data immediately to avoid loading state
  const [banners, setBanners] = useState([
          {
            id: 1,
            title: "Offres Spéciales Bio",
            subtitle: "Découvrez nos produits naturels à prix réduits",
            backgroundImage: '/images/banner-zitalgic.png',
            cta_text: "Découvrir les offres"
          },
          {
            id: 2,
            title: "Collection Premium",
            subtitle: "Votre bien-être mérite le meilleur de la nature",
            backgroundImage: '/images/banner2.jpg',
            cta_text: "Explorer la collection"
          }
        ]);
  const [products, setProducts] = useState([
          {
            id: 1,
            name: 'Zitalgic®',
            price: 89.99,
            img: '/images/zitalgic.jpg',
            rating: 4.8,
            reviews: 124,
            isNew: true,
            discount: 15,
            description: 'Solution naturelle contre les douleurs articulaires, musculaires et nerveuses.',
            category: { id: 1, title: 'Compléments alimentaires' },
            long_description: 'Zitalgic® est une formule naturelle innovante développée par Authentic Laboratory pour soulager efficacement les douleurs articulaires, musculaires et nerveuses. Cette solution combine des ingrédients actifs naturels pour offrir un soulagement rapide et durable.',
            composition: ['Menthol naturel', 'Camphre bio', 'Eucalyptus', 'Arnica montana', 'Extrait de curcuma'],
            benefits: ['Soulagement rapide des douleurs', 'Effet chaud-froid apaisant', 'Réduction de l\'inflammation', 'Formule 100% naturelle', 'Absorption cutanée optimale'],
            usage_instructions: 'Appliquer une noisette de produit sur la zone douloureuse et masser délicatement jusqu\'à pénétration complète. Renouveler 2-3 fois par jour selon les besoins.',
            target_conditions: 'Douleurs articulaires, contractures musculaires, courbatures, raideurs, douleurs nerveuses',
            medical_effects: ['Anti-inflammatoire naturel', 'Analgésique local', 'Relaxant musculaire', 'Stimulant circulatoire'],
            features: ['Texture non grasse', 'Absorption rapide', 'Odeur agréable', 'Certifié bio'],
            quality_guarantees: ['Formule Authentic Laboratory', 'Ingrédients certifiés bio', 'Testé dermatologiquement', 'Fabriqué en France'],
            packages: [
              { id: 1, name: '1 ZITALGIC®', price: 89.99, oldPrice: 99.99, save: 10, label: '' },
              { id: 2, name: '3 ZITALGIC®', price: 249.99, oldPrice: 299.97, save: 49.98, label: 'Meilleur Vente' },
              { id: 3, name: '5 ZITALGIC®', price: 399.99, oldPrice: 499.95, save: 99.96, label: 'Pack économique' }
            ],
            images: ['/images/zitalgic.jpg', '/images/zitalgic-2.jpg', '/images/zitalgic-3.jpg'],
            testimonials: [
              { name: 'Marie L.', rating: 5, comment: 'Excellent produit, soulagement immédiat de mes douleurs articulaires.' },
              { name: 'Ahmed K.', rating: 5, comment: 'Formule naturelle très efficace, je recommande vivement.' },
              { name: 'Sophie M.', rating: 4, comment: 'Très bon rapport qualité-prix, effet durable.' }
            ]
          },
          {
            id: 2,
            name: 'Zitalgic® Sport',
            price: 94.99,
            img: '/images/zitalgic-sport.jpg',
            rating: 4.9,
            reviews: 89,
            isNew: false,
            discount: 0,
            description: 'Formule naturelle de récupération musculaire pour athlètes et personnes actives.',
            category: { id: 1, title: 'Compléments alimentaires' },
            long_description: 'Zitalgic® Sport est spécialement formulé pour les sportifs et les personnes actives. Cette version enrichie en menthol procure une sensation de fraîcheur intense tout en préparant les muscles à l\'effort et en accélérant la récupération.',
            composition: ['Menthol renforcé', 'Camphre bio', 'Eucalyptus', 'Arnica montana', 'Extrait de curcuma', 'Huile de menthe poivrée'],
            benefits: ['Préparation musculaire optimale', 'Récupération accélérée', 'Sensation de fraîcheur intense', 'Réduction des tensions', 'Formule non grasse'],
            usage_instructions: 'Appliquer avant l\'entraînement pour préparer les muscles, et après pour favoriser la récupération. Masser jusqu\'à pénétration complète.',
            target_conditions: 'Récupération sportive, préparation musculaire, courbatures post-entraînement, tensions musculaires',
            medical_effects: ['Stimulant circulatoire', 'Relaxant musculaire', 'Anti-inflammatoire', 'Rafraîchissant'],
            features: ['Texture non grasse', 'Absorption ultra-rapide', 'Odeur mentholée', 'Certifié sport'],
            quality_guarantees: ['Formule Authentic Laboratory', 'Testé par des sportifs', 'Conforme aux normes sport', 'Fabriqué en France'],
            packages: [
              { id: 1, name: '1 ZITALGIC® SPORT', price: 94.99, oldPrice: null, save: 0, label: '' },
              { id: 2, name: '3 ZITALGIC® SPORT', price: 269.99, oldPrice: 284.97, save: 14.98, label: 'Pack Sport' },
              { id: 3, name: '5 ZITALGIC® SPORT', price: 429.99, oldPrice: 474.95, save: 44.96, label: 'Pack Champion' }
            ],
            images: ['/images/zitalgic-sport.jpg', '/images/zitalgic-sport-2.jpg', '/images/zitalgic-sport-3.jpg'],
            testimonials: [
              { name: 'Karim B.', rating: 5, comment: 'Parfait pour ma récupération après le foot, sensation de fraîcheur incroyable.' },
              { name: 'Fatima A.', rating: 5, comment: 'Utilisé avant mes cours de yoga, préparation musculaire excellente.' },
              { name: 'Youssef M.', rating: 4, comment: 'Très efficace pour les courbatures, je l\'utilise régulièrement.' }
            ]
          },
          {
            id: 3,
            name: 'Detoxoil®',
            price: 79.99,
            img: '/images/detoxoil.jpg',
            rating: 4.7,
            reviews: 156,
            isNew: false,
            discount: 10,
            description: 'Huile de massage détoxifiante stimulant la circulation lymphatique.',
            category: { id: 1, title: 'Compléments alimentaires' },
            long_description: 'Detoxoil® est une huile de massage détoxifiante qui stimule naturellement la circulation lymphatique. Cette synergie d\'huiles essentielles purifie, tonifie et revitalise le corps en éliminant les toxines accumulées.',
            composition: ['Huile de pamplemousse', 'Huile de citron', 'Huile de genévrier', 'Huile de romarin', 'Huile de cèdre'],
            benefits: ['Élimination des toxines', 'Drainage lymphatique', 'Sensation de légèreté', 'Stimulation circulatoire', 'Purification naturelle'],
            usage_instructions: 'Appliquer sur les zones à traiter et masser en mouvements circulaires de bas en haut. Utiliser de préférence le matin pour un effet drainant optimal.',
            target_conditions: 'Rétention d\'eau, jambes lourdes, cellulite, fatigue générale, accumulation de toxines',
            medical_effects: ['Drainant lymphatique', 'Stimulant circulatoire', 'Détoxifiant naturel', 'Tonifiant cutané'],
            features: ['Texture huileuse fluide', 'Odeur agréable', 'Absorption rapide', 'Certifié bio'],
            quality_guarantees: ['Formule Authentic Laboratory', 'Huiles essentielles pures', 'Testé dermatologiquement', 'Fabriqué en France'],
            packages: [
              { id: 1, name: '1 DETOXOIL®', price: 79.99, oldPrice: 89.99, save: 10, label: '' },
              { id: 2, name: '3 DETOXOIL®', price: 219.99, oldPrice: 269.97, save: 49.98, label: 'Pack Détox' },
              { id: 3, name: '5 DETOXOIL®', price: 349.99, oldPrice: 449.95, save: 99.96, label: 'Pack Purification' }
            ],
            images: ['/images/detoxoil.jpg', '/images/detoxoil-2.jpg', '/images/detoxoil-3.jpg'],
            testimonials: [
              { name: 'Aicha R.', rating: 5, comment: 'Excellent pour les jambes lourdes, effet drainant remarquable.' },
              { name: 'Hassan T.', rating: 4, comment: 'Très bon produit, sensation de légèreté après utilisation.' },
              { name: 'Nadia S.', rating: 5, comment: 'Utilisé en cure détox, résultats visibles rapidement.' }
            ]
          },
          {
            id: 4,
            name: 'Relaxoil®',
            price: 69.99,
            img: '/images/relaxoil.jpg',
            rating: 4.8,
            reviews: 203,
            isNew: false,
            discount: 0,
            description: 'Mélange d\'huiles essentielles apaisantes pour relaxation profonde.',
            category: { id: 1, title: 'Compléments alimentaires' },
            long_description: 'Relaxoil® est un mélange harmonieux d\'huiles essentielles apaisantes qui favorise la relaxation profonde et améliore la qualité du sommeil. Cette formule naturelle soulage les tensions et calme l\'esprit pour une récupération optimale.',
            composition: ['Huile de lavande', 'Huile de camomille', 'Huile d\'ylang-ylang', 'Huile de bergamote', 'Huile de marjolaine'],
            benefits: ['Relaxation profonde', 'Amélioration du sommeil', 'Soulagement des tensions', 'Calme l\'esprit', 'Récupération naturelle'],
            usage_instructions: 'Appliquer quelques gouttes sur les tempes, le cou et les poignets. Masser délicatement en respirant profondément. Utiliser de préférence le soir.',
            target_conditions: 'Stress, anxiété, troubles du sommeil, tensions musculaires, fatigue nerveuse',
            medical_effects: ['Relaxant naturel', 'Sédatif doux', 'Anti-stress', 'Apaisant nerveux'],
            features: ['Odeur apaisante', 'Texture légère', 'Absorption rapide', 'Certifié bio'],
            quality_guarantees: ['Formule Authentic Laboratory', 'Huiles essentielles pures', 'Testé dermatologiquement', 'Fabriqué en France'],
            packages: [
              { id: 1, name: '1 RELAXOIL®', price: 69.99, oldPrice: null, save: 0, label: '' },
              { id: 2, name: '3 RELAXOIL®', price: 189.99, oldPrice: 209.97, save: 19.98, label: 'Pack Relaxation' },
              { id: 3, name: '5 RELAXOIL®', price: 299.99, oldPrice: 349.95, save: 49.96, label: 'Pack Zen' }
            ],
            images: ['/images/relaxoil.jpg', '/images/relaxoil-2.jpg', '/images/relaxoil-3.jpg'],
            testimonials: [
              { name: 'Leila M.', rating: 5, comment: 'Parfait pour se détendre le soir, odeur très apaisante.' },
              { name: 'Omar F.', rating: 5, comment: 'Excellent pour le stress, m\'aide beaucoup à dormir.' },
              { name: 'Khadija L.', rating: 4, comment: 'Très bon produit relaxant, qualité premium.' }
            ]
          }
        ]);
  const [categories, setCategories] = useState([
    { 
      id: 1, 
      title: 'Compléments alimentaires', 
      description: 'Solutions naturelles pour la santé et le bien-être, formulées par Authentic Laboratory',
      img: '/images/category-complements.jpg',
      icon: '💊',
      benefits: ['Formules naturelles', 'Certifiées bio', 'Efficacité prouvée', 'Qualité premium'],
      popular_products: ['Zitalgic®', 'Zitalgic® Sport', 'Detoxoil®', 'Relaxoil®'],
      target_audience: 'Personnes soucieuses de leur santé et bien-être naturel'
    },
    { 
      id: 2, 
      title: 'Aromathérapie', 
      description: 'Huiles essentielles pures et mélanges aromatiques pour le bien-être au quotidien',
      img: '/images/category-aromatherapie.jpg',
      icon: '🌸',
      benefits: ['Huiles essentielles pures', 'Mélanges exclusifs', 'Effets thérapeutiques', 'Odeurs naturelles'],
      popular_products: ['Huile de lavande', 'Mélange relaxant', 'Diffuseur premium', 'Roll-on stress'],
      target_audience: 'Amateurs d\'aromathérapie et de bien-être naturel'
    },
    { 
      id: 3, 
      title: 'Nutrition naturelle', 
      description: 'Superaliments, compléments nutritionnels et produits bio pour une alimentation saine',
      img: '/images/category-nutrition.jpg',
      icon: '🥗',
      benefits: ['Superaliments bio', 'Compléments nutritionnels', 'Qualité premium', 'Traçabilité garantie'],
      popular_products: ['Spiruline bio', 'Curcuma premium', 'Oméga-3', 'Vitamines naturelles'],
      target_audience: 'Personnes soucieuses d\'une alimentation saine et naturelle'
    },
    { 
      id: 4, 
      title: 'Cosmétique naturelle', 
      description: 'Soins visage et corps 100% naturels, sans ingrédients chimiques nocifs',
      img: '/images/category-cosmetique.jpg',
      icon: '✨',
      benefits: ['100% naturel', 'Sans parabens', 'Testé dermatologiquement', 'Efficacité prouvée'],
      popular_products: ['Crème hydratante', 'Sérum anti-âge', 'Masque purifiant', 'Lotion corporelle'],
      target_audience: 'Personnes privilégiant les soins naturels et respectueux de la peau'
    }
  ]);
  const [promotions, setPromotions] = useState([
          {
            id: 1,
            title: 'Offre Spéciale Zitalgic®',
            subtitle: 'Solution naturelle contre les douleurs',
            description: 'Profitez de -50% sur toute la gamme Zitalgic® pour une récupération optimale',
            backgroundImage: '/images/promZital.png',
            discount: 50
          },
          {
            id: 2,
            title: 'Pack Détox Complet',
            subtitle: 'Purifiez votre Corps',
            description: 'Detoxoil® + Jus Naturel à prix réduit pour une détox complète',
            backgroundImage: '/images/promoDetox.png',
            discount: 35
          }
        ]);
  const [slides, setSlides] = useState([
          { id: 1, image: '/images/slide1.png', alt: 'BioEkleel - Votre bien-être naturel' },
          { id: 2, image: '/images/slide2.png', alt: 'Découvrez nos compléments alimentaires bio' }
        ]);
  const [suppliers, setSuppliers] = useState([
          { id: 1, name: 'Authentic Laboratory', logo: '/images/authentic-lab.png', description: 'Leader des formulations naturelles innovantes' },
          { id: 2, name: 'BioNature', logo: '/images/bionature.png', description: 'Laboratoire français spécialisé en cosmétiques bio' }
  ]);
  const [loading, setLoading] = useState(true);

  // Function to preload images and wait for them to load
  const preloadImages = (imageUrls) => {
    return Promise.all(
      imageUrls.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(url);
          img.onerror = () => resolve(url); // Still resolve even if image fails to load
          img.src = url;
        });
      })
    );
  };

  // Function to collect all image URLs from data
  const getAllImageUrls = (data) => {
    const urls = [];
    
    // Add logo
    urls.push('/images/logo.png');
    
    // Add banner images
    if (data.banners) {
      data.banners.forEach(banner => {
        if (banner.backgroundImage) urls.push(banner.backgroundImage);
        if (banner.image) urls.push(banner.image);
      });
    }
    
    // Add product images
    if (data.products) {
      data.products.forEach(product => {
        if (product.img) urls.push(product.img);
        if (product.images && Array.isArray(product.images)) {
          product.images.forEach(img => urls.push(img));
        }
      });
    }
    
    // Add category images
    if (data.categories) {
      data.categories.forEach(category => {
        if (category.image) urls.push(category.image);
        if (category.backgroundImage) urls.push(category.backgroundImage);
      });
    }
    
    // Add slide images
    if (data.slides) {
      data.slides.forEach(slide => {
        if (slide.image) urls.push(slide.image);
        if (slide.backgroundImage) urls.push(slide.backgroundImage);
      });
    }
    
    // Add supplier logos
    if (data.suppliers) {
      data.suppliers.forEach(supplier => {
        if (supplier.logo) urls.push(supplier.logo);
      });
    }
    
    // Remove duplicates
    return [...new Set(urls)];
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load from database with retry mechanism
        let bannersData = [], productsData = [], categoriesData = [], promotionsData = [], slidesData = [], suppliersData = [];
        
        try {
          // Fetch all data from database with proper delays
          const [bannersResult, productsResult, categoriesResult, promotionsResult, slidesResult, suppliersResult] = await Promise.allSettled([
            fetchBanners(),
            new Promise(resolve => setTimeout(() => resolve(fetchProducts()), 500)),
            new Promise(resolve => setTimeout(() => resolve(fetchCategories()), 1000)),
            new Promise(resolve => setTimeout(() => resolve(fetchPromotions()), 1500)),
            new Promise(resolve => setTimeout(() => resolve(fetchSlides()), 2000)),
            new Promise(resolve => setTimeout(() => resolve(fetchSuppliers()), 2500))
          ]);

          // Process each result individually
          if (bannersResult.status === 'fulfilled' && Array.isArray(bannersResult.value) && bannersResult.value.length > 0) {
            bannersData = bannersResult.value;
          } else {
            bannersData = banners;
          }

          if (productsResult.status === 'fulfilled' && Array.isArray(productsResult.value) && productsResult.value.length > 0) {
            productsData = productsResult.value;
          } else {
            productsData = products;
          }

          if (categoriesResult.status === 'fulfilled' && Array.isArray(categoriesResult.value) && categoriesResult.value.length > 0) {
            categoriesData = categoriesResult.value;
          } else {
            categoriesData = categories;
          }

          if (promotionsResult.status === 'fulfilled' && Array.isArray(promotionsResult.value) && promotionsResult.value.length > 0) {
            promotionsData = promotionsResult.value;
          } else {
            promotionsData = promotions;
          }

          if (slidesResult.status === 'fulfilled' && Array.isArray(slidesResult.value) && slidesResult.value.length > 0) {
            slidesData = slidesResult.value;
          } else {
            slidesData = slides;
          }

          if (suppliersResult.status === 'fulfilled' && Array.isArray(suppliersResult.value) && suppliersResult.value.length > 0) {
            suppliersData = suppliersResult.value;
          } else {
            suppliersData = suppliers;
          }

        } catch (dbError) {
          // Database connection failed, using fallback data
          bannersData = banners;
          productsData = products;
          categoriesData = categories;
          promotionsData = promotions;
          slidesData = slides;
          suppliersData = suppliers;
        }

        // Update state with loaded data (either from database or fallback)
        setBanners(bannersData);
        setProducts(productsData);
        setCategories(categoriesData);
        setPromotions(promotionsData);
        setSlides(slidesData);
        setSuppliers(suppliersData);

        // Collect all image URLs and preload them
        const allData = { banners: bannersData, products: productsData, categories: categoriesData, slides: slidesData, suppliers: suppliersData };
        const imageUrls = getAllImageUrls(allData);
        await preloadImages(imageUrls);
        
        // Add 1-second delay after everything is loaded
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set loading to false after delay
        setLoading(false);
        
      } catch (error) {
        // Even in case of critical error, ensure we have fallback data
        const fallbackData = { banners, products, categories, slides, suppliers };
        const imageUrls = getAllImageUrls(fallbackData);
        await preloadImages(imageUrls);
        
        // Add 1-second delay even for fallback
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <AppContext.Provider value={{ banners, products, categories, promotions, slides, suppliers, loading }}>
      <CartProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </CartProvider>
    </AppContext.Provider>
  );
};