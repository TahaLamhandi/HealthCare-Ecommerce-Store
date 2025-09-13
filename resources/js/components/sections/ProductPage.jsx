import React from 'react';
const ProductPage = () => {
  /* ---------- images ---------- */
  const productImages = [
    '/images/Zitalgic orange.png',
    '/images/ZitalgicPharmacy.png',
    '/images/Zitalgic doctor.png',
    '/images/Zitakgic Old man.jpg',
    '/images/ZitalgicMen.jpg',
    '/images/ZitalgicDecor.png',
  ];
  const [selectedImage, setSelectedImage] = useState(0);

  /* ---------- quantity ---------- */
  const [quantity, setQuantity] = useState(1);

  /* ---------- packages ---------- */
  const packages = [
    { id: 1, name: '1 ZITALGIC®', price: 219.00, oldPrice: 249.00, save: 30, label: '' },
    { id: 2, name: '3 ZITALGIC®', price: 599.00, oldPrice: 747.00, save: 148, label: 'Meilleur Vente' },
    { id: 3, name: '5 ZITALGIC®', price: 899.00, oldPrice: 1245.00, save: 346, label: 'Pack économique' },
  ];
  const [selectedPackage, setSelectedPackage] = useState(packages[0]);

  /* ---------- medical info tabs ---------- */
  const medicalTabs = [
    {
      title: "Avant utilisation",
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="text-red-600 w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Symptômes courants</h4>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Douleurs articulaires intenses</li>
                <li>Raideur matinale</li>
                <li>Difficulté à bouger</li>
                <li>Inflammation visible</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "5 minutes après",
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Zap className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Effet immédiat</h4>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Sensation de chaud-froid apaisante</li>
                <li>Premier soulagement perceptible</li>
                <li>Détente musculaire initiale</li>
                <li>Début de réduction de l'inflammation</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "1 heure après",
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Clock className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Action prolongée</h4>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Soulagement significatif de la douleur</li>
                <li>Amélioration de la mobilité</li>
                <li>Pénétration profonde des actifs</li>
                <li>Effet anti-inflammatoire qui commence</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Après 1 semaine",
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="text-purple-600 w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Résultats durables</h4>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Réduction de 80% des douleurs</li>
                <li>Amélioration de la flexibilité</li>
                <li>Diminution visible de l'inflammation</li>
                <li>Restauration articulaire progressive</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];
  const [activeMedicalTab, setActiveMedicalTab] = useState(0);

  /* ---------- tabs ---------- */
  const [activeTab, setActiveTab] = useState('description');

  /* ---------- rating ---------- */
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  /* ---------- testimonials ---------- */
  const testimonials = [
    { 
      text: "ZITALGIC a complètement changé ma vie, mes douleurs ont disparu en quelques jours seulement !",
      name: "Karim", 
      city: "Casablanca",
      rating: 5
    },
    { 
      text: "Produit naturel et efficace, je le recommande à tous mes patients souffrant de douleurs articulaires.",
      name: "Dr. Leila", 
      city: "Rabat",
      rating: 5
    },
    { 
      text: "Après des années de douleurs chroniques, ZITALGIC m'a enfin apporté un soulagement durable.",
      name: "Fatima", 
      city: "Marrakech",
      rating: 4
    }
  ];

  /* ---------- product features ---------- */
  const features = [
    { img: '/images/badge1.png' },
    { img: '/images/badge2.png' },
    { img: '/images/badge3.png' },
  ];

  /* ---------- benefits ---------- */
  const benefits = [
    'Soulage en 5 minutes',
    'Élimine l\'inflammation profonde',
    'Sans effets secondaires',
    'Convient à toute la famille',
    'Fabriqué au Maroc',
    'Livraison offerte partout',
  ];

  /* ---------- similar products ---------- */
  const products = [
    { id: 1, name: 'Zitalgic Sport', category: 'Soins', description: 'Crème naturelle pour douleurs articulaires', price: 200, rating: 4, reviews: 120, img: '/images/zitalgic.png', isNew: true },
    { id: 2, name: 'Relaxoil', category: 'Soins', description: 'Gel apaisant pour muscles', price: 180, rating: 4, reviews: 85, img: '/images/Relaxoil.png', discount: 10 },
    { id: 3, name: 'Detoxoil', category: 'Soins', description: 'Huile essentielle relaxante', price: 250, rating: 5, reviews: 200, img: '/images/Detoxoil.png' },
  ];

  /* ---------- buy count ---------- */
  const totalBought = 12_450;

  /* ---------- copy phone number ---------- */
  const [isCopied, setIsCopied] = useState(false);

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText('0655895375');
  };

  /* ---------- scroll helpers ---------- */
  const scrollThumbs = (dir) => {
    const el = document.getElementById('thumb-row');
    if (!el) return;
    el.scrollBy({ top: dir === 'up' ? -100 : 100, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* HERO SECTION */}
      <section className="container mx-auto px-4 py-10 relative overflow-hidden">
        <div className="absolute top-10 left-10 text-green-300 opacity-20 animate-pulse">
          <Leaf className="w-32 h-32 transform rotate-12" />
        </div>
        <div className="absolute bottom-10 right-10 text-green-300 opacity-20 animate-pulse">
          <Leaf className="w-24 h-24 transform -rotate-45" />
        </div>
        <div className="absolute top-20 right-20 text-green-200 opacity-30">
          <svg className="w-16 h-16 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <div className="absolute bottom-20 left-20 text-green-200 opacity-30">
          <svg className="w-12 h-12 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" />
          </svg>
        </div>
        <div className="absolute top-1/2 left-0 text-green-200 opacity-30">
          <div className="flex items-center space-x-2">
            <Leaf className="w-6 h-6" />
            <div className="w-32 h-0.5 bg-green-200"></div>
            <Leaf className="w-4 h-4" />
          </div>
        </div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start mt-8">
            {/* IMAGE GALLERY SECTION */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6 transition-all duration-300">
              <div className="flex flex-col-reverse sm:flex-row gap-6">
                {/* HORIZONTAL THUMBNAILS (MOBILE) / VERTICAL THUMBNAILS (DESKTOP) */}
                <div className="relative flex sm:flex-col items-center justify-center">
                  <button
                    onClick={() => scrollThumbs('left')}
                    className="sm:hidden z-10 bg-white/80 rounded-full p-1 shadow mr-2 hover:bg-white hover:shadow-md transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div
                    id="thumb-row"
                    className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto scroll-smooth snap-x sm:snap-y snap-mandatory py-2 scrollbar-hidden max-w-full sm:max-h-[400px]"
                  >
                    {productImages.map((img, idx) => (
                      <div 
                        key={idx}
                        className={`relative snap-start transition ${selectedImage === idx ? 'mx-1 sm:my-2' : ''}`}
                      >
                        <img
                          src={img}
                          alt={`thumb ${idx}`}
                          onClick={() => setSelectedImage(idx)}
                          className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl cursor-pointer transition-all duration-300
                                      ${selectedImage === idx ? 'ring-4 ring-green-500 scale-105' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                        />
                        {selectedImage === idx && (
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-500 rounded-full sm:block hidden"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => scrollThumbs('right')}
                    className="sm:hidden z-10 bg-white/80 rounded-full p-1 shadow ml-2 hover:bg-white hover:shadow-md transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* MAIN IMAGE */}
                <div className="flex-1 flex items-center justify-center mt-4">
                  <img
                    key={selectedImage}
                    src={productImages[selectedImage]}
                    alt="ZITALGIC"
                    className="w-full max-w-lg h-[400px] sm:h-[450px] object-cover rounded-2xl transition-all duration-500"
                  />
                </div>
              </div>

              {/* ANIMATED EXTRA INFO */}
              <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 transition-all duration-300 hover:scale-105">
                  <div className="text-green-600">
                    <Truck size={20} />
                  </div>
                  <span className="text-sm">Livraison rapide</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 transition-all duration-300 hover:scale-105">
                  <div className="text-green-600">
                    <MapPin size={20} />
                  </div>
                  <span className="text-sm">Partout au Maroc</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 transition-all duration-300 hover:scale-105">
                  <div className="text-green-600">
                    <CreditCard size={20} />
                  </div>
                  <span className="text-sm">Paiement à la livraison</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 transition-all duration-300 hover:scale-105">
                  <div className="text-green-600">
                    <Leaf size={20} />
                  </div>
                  <span className="text-sm">Produit bio</span>
                </div>
              </div>

              {/* NEW QUALITY FEATURES SECTION */}
              <div className="mt-2 bg-white p-6 rounded-xl">
  <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Nos Garanties Qualité</h3>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Feature 1 */}
    <div className="bg-white p-5 rounded-lg hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
      <div className="bg-green-50 p-4 rounded-full mb-4">
        <BookOpen size={28} className="text-green-600" />
      </div>
      <h3 className="font-bold text-lg text-gray-800 mb-2">Formule Brevetée</h3>
      <p className="text-sm text-gray-600">Protection intellectuelle garantissant l'unicité de notre formule</p>
    </div>

    {/* Feature 2 */}
    <div className="bg-white p-5 rounded-lg hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
      <div className="bg-green-50 p-4 rounded-full mb-4">
        <CheckCircle size={28} className="text-green-600" />
      </div>
      <h3 className="font-bold text-lg text-gray-800 mb-2">Contrôles Qualité</h3>
      <p className="text-sm text-gray-600">Tests rigoureux à chaque étape de production</p>
    </div>

    {/* Feature 3 */}
    <div className="bg-white p-5 rounded-lg hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
      <div className="bg-green-50 p-4 rounded-full mb-4">
        <Award size={28} className="text-green-600" />
      </div>
      <h3 className="font-bold text-lg text-gray-800 mb-2">Expertise Reconnue</h3>
      <p className="text-sm text-gray-600">15+ ans d'expérience en recherche et développement</p>
    </div>
  </div>
</div>
</div>

            {/* PRODUCT INFO SECTION */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6 pb-8 pt-8 lg:pt-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent animate-gradient">
                ZITALGIC®
              </h1>
              <p className="text-base sm:text-lg text-gray-600">Solution naturelle contre les douleurs articulaires et musculaires</p>

              {/* RATING */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Notez ce produit</h3>
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setUserRating(star)}
                      className="cursor-pointer transition-transform duration-200 hover:scale-110"
                    >
                      <Star
                        size={28}
                        fill={star <= (hoverRating || userRating) ? '#facc15' : 'transparent'}
                        color={star <= (hoverRating || userRating) ? '#facc15' : '#9ca3af'}
                      />
                    </div>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {userRating ? `${userRating}/5` : 'Cliquez pour noter'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  ⭐ {totalBought.toLocaleString('fr-MA')} personnes ont déjà acheté ce produit
                </p>
              </div>

              {/* BENEFITS */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Pourquoi choisir ZITALGIC ?</h3>
                <ul className="space-y-2">
                  {benefits.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start hover:text-green-600 hover:translate-x-2 transition-all duration-300"
                    >
                      <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PACKAGES */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Choisir votre pack</h3>
                <div className="space-y-4">
                  {packages.map((p) => (
                    <div
                      key={p.id}
                      className="relative flex items-center"
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          id={`package-${p.id}`}
                          name="package"
                          checked={selectedPackage.id === p.id}
                          onChange={() => setSelectedPackage(p)}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`package-${p.id}`}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
                                      ${selectedPackage.id === p.id ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}
                        >
                          {selectedPackage.id === p.id && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </label>
                      </div>
                      <label
                        htmlFor={`package-${p.id}`}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 flex justify-between items-center ml-3 hover:shadow-md
                                    ${selectedPackage.id === p.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-400'}`}
                      >
                        <div>
                          <span className="text-base font-bold">{p.name}</span>
                          {p.label && (
                            <span className={`ml-2 px-2 py-1 text-white text-xs font-semibold rounded-full ${p.label === 'Meilleur Vente' ? 'bg-green-600' : 'bg-green-500'}`}>
                              {p.label}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-extrabold">{p.price.toFixed(2)} DH</span>
                          <span className="text-sm text-gray-500 line-through ml-2">{p.oldPrice.toFixed(2)} DH</span>
                          {p.save > 0 && <span className="text-xs text-green-600 block">Économisez {p.save} DH</span>}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* QUANTITY & TOTAL */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Quantité</h3>
                <div className="flex items-center gap-3 mb-4">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-200 hover:scale-105"><Minus size={16} /></button>
                  <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-200 hover:scale-105"><Plus size={16} /></button>
                </div>
                <p className="text-2xl font-bold">Total : {selectedPackage.price * quantity} DH</p>
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <ShoppingCart size={24} /> Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TABS SECTION */}
      <section className="container mx-auto px-4 py-10 bg-white relative overflow-hidden">
        <div className="absolute top-10 left-10 text-green-300 opacity-20 animate-pulse">
          <Leaf className="w-32 h-32 transform rotate-12" />
        </div>
        <div className="absolute bottom-10 right-10 text-green-300 opacity-20 animate-pulse">
          <Leaf className="w-24 h-24 transform -rotate-45" />
        </div>
        <div className="absolute top-20 right-20 text-green-200 opacity-30">
          <svg className="w-16 h-16 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <div className="absolute bottom-20 left-20 text-green-200 opacity-30">
          <svg className="w-12 h-12 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" />
          </svg>
        </div>
        <div className="absolute top-1/2 left-0 text-green-200 opacity-30">
          <div className="flex items-center space-x-2">
            <Leaf className="w-6 h-6" />
            <div className="w-32 h-0.5 bg-green-200"></div>
            <Leaf className="w-4 h-4" />
          </div>
        </div>
        <div className="relative z-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {['description', 'composition', 'utilisation', 'benefices'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-t-2xl font-bold transition-all duration-300
                            ${activeTab === tab
                              ? 'bg-gradient-to-r from-green-600 to-green-400 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'}`}
              >
                {tab === 'description' && 'Description'}
                {tab === 'composition' && 'Composition'}
                {tab === 'utilisation' && 'Mode d\'emploi'}
                {tab === 'benefices' && 'Bénéfices'}
              </button>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-inner transition-all duration-300">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-green-700">ZITALGIC® - Solution naturelle contre les douleurs</h3>
                <p>
                  ZITALGIC® est un produit révolutionnaire 100% naturel spécialement formulé pour soulager les douleurs articulaires, 
                  musculaires et nerveuses. Son action unique combine un effet chaud-froid pour un soulagement immédiat tout 
                  en réduisant l'inflammation à long terme.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-all duration-300">
                    <h4 className="font-bold text-green-600 mb-2">Cibles principales :</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Douleurs articulaires (arthrose, arthrite)</li>
                      <li>Douleurs musculaires (courbatures, contractures)</li>
                      <li>Douleurs nerveuses (sciatique, névralgie)</li>
                      <li>Raideurs matinales</li>
                      <li>Douleurs liées à l'âge</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-all duration-300">
                    <h4 className="font-bold text-green-600 mb-2">Avantages clés :</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Soulagement en moins de 5 minutes</li>
                      <li>Effet prolongé jusqu'à 12 heures</li>
                      <li>Réduction de l'inflammation en profondeur</li>
                      <li>Formule non addictive</li>
                      <li>Adapté à tous les types de peau</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'composition' && (
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-green-700">Composition 100% naturelle</h3>
                <p>
                  ZITALGIC® combine des ingrédients naturels soigneusement sélectionnés pour leur efficacité prouvée
                  contre les douleurs, sans aucun produit chimique agressif.
                </p>
                <div className="mt-4">
                  <h4 className="font-bold text-lg mb-2">Ingrédients actifs :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-all duration-300">
                      <h5 className="font-bold text-green-600 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h7z" />
                        </svg>
                        Huile d'Argan
                      </h5>
                      <p className="text-sm mt-1">Puissant anti-inflammatoire naturel, riche en vitamine E et acides gras essentiels.</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-all duration-300">
                      <h5 className="font-bold text-green-600 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h7z" />
                        </svg>
                        Menthol cristallisé
                      </h5>
                      <p className="text-sm mt-1">Procure un effet froid immédiat pour soulager la douleur localement.</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-all duration-300">
                      <h5 className="font-bold text-green-600 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h7z" />
                        </svg>
                        Capsaïcine naturelle
                      </h5>
                      <p className="text-sm mt-1">Extrait de piment rouge, crée un effet de chaleur thérapeutique.</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-all duration-300">
                      <h5 className="font-bold text-green-600 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h7z" />
                        </svg>
                        Huile essentielle d'Eucalyptus
                      </h5>
                      <p className="text-sm mt-1">Décongestionnante et analgésique, améliore la circulation sanguine.</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    <strong>Note :</strong> Sans parabènes, sans silicone, sans colorants artificiels. Testé dermatologiquement.
                  </p>
                </div>
              </div>
            )}
            {activeTab === 'utilisation' && (
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-green-700">Mode d'emploi optimal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-lg mb-2">Application standard :</h4>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Nettoyer et sécher la zone à traiter</li>
                      <li>Appliquer une noisette de ZITALGIC®</li>
                      <li>Masser doucement en mouvements circulaires jusqu'à pénétration complète</li>
                      <li>Laisser agir sans rinçage</li>
                      <li>Répéter 2 à 3 fois par jour selon besoin</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Conseils d'utilisation :</h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Pour les douleurs aiguës : appliquer toutes les 4 heures</li>
                      <li>Pour les douleurs chroniques : utiliser matin et soir</li>
                      <li>Peut être utilisé en prévention avant une activité physique</li>
                      <li>Conserver à température ambiante, à l'abri de la lumière</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-200 transition-all duration-300 hover:shadow-md">
                  <h4 className="font-bold text-blue-700 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Précautions d'emploi
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Ne pas appliquer sur plaies ouvertes ou peau irritée</li>
                    <li>• Éviter le contact avec les yeux et muqueuses</li>
                    <li>• En cas de réaction cutanée, cesser l'utilisation</li>
                    <li>• Tenir hors de portée des enfants</li>
                    <li>• Femmes enceintes : consulter un médecin avant utilisation</li>
                  </ul>
                </div>
              </div>
            )}
            {activeTab === 'benefices' && (
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-green-700">Bénéfices scientifiquement prouvés</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-lg mb-2">Effets immédiats :</h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Soulagement rapide de la douleur (dès 5 minutes)</li>
                      <li>Sensation apaisante chaud-froid</li>
                      <li>Détente musculaire immédiate</li>
                      <li>Amélioration de la mobilité articulaire</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Effets à long terme :</h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Réduction progressive de l'inflammation</li>
                      <li>Diminution de la fréquence des crises douloureuses</li>
                      <li>Amélioration de la qualité du sommeil</li>
                      <li>Restauration de la souplesse articulaire</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 bg-green-50 p-4 rounded-xl border border-green-200 transition-all duration-300 hover:shadow-md">
                  <h4 className="font-bold text-green-700 mb-2">Étude clinique (2023) :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-3 rounded-lg shadow hover:shadow-md transition-all duration-300">
                      <p className="text-3xl font-bold text-green-600">92%</p>
                      <p className="text-sm">des patients ont ressenti un soulagement dès la première application</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow hover:shadow-md transition-all duration-300">
                      <p className="text-3xl font-bold text-green-600">87%</p>
                      <p className="text-sm">réduction de l'inflammation après 2 semaines d'utilisation</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow hover:shadow-md transition-all duration-300">
                      <p className="text-3xl font-bold text-green-600">96%</p>
                      <p className="text-sm">des utilisateurs recommandent ZITALGIC®</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 text-center">
                    Étude réalisée sur 450 patients souffrant de douleurs articulaires chroniques (Université de Rabat)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BIG ADS IMAGE */}
      <section className="container mx-auto px-4 py-6">
        <div className="rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl">
          <img 
            src="/images/ZitalgicADS.jpg" 
            alt="Zitalgic Promotion" 
            className="w-full h-auto object-cover rounded-2xl"
          />
        </div>
      </section>

      {/* MEDICAL EFFECTS SECTION */}
      <section className="container mx-auto px-4 py-10 bg-white rounded-3xl my-10 relative overflow-hidden">
        <div className="absolute top-10 left-10 text-green-300 opacity-20 animate-pulse">
          <Leaf className="w-32 h-32 transform rotate-12" />
        </div>
        <div className="absolute bottom-10 right-10 text-green-300 opacity-20 animate-pulse">
          <Leaf className="w-24 h-24 transform -rotate-45" />
        </div>
        <div className="absolute top-20 right-20 text-green-200 opacity-30">
          <svg className="w-16 h-16 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <div className="absolute bottom-20 left-20 text-green-200 opacity-30">
          <svg className="w-12 h-12 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" />
          </svg>
        </div>
        <div className="absolute top-1/2 left-0 text-green-200 opacity-30">
          <div className="flex items-center space-x-2">
            <Leaf className="w-6 h-6" />
            <div className="w-32 h-0.5 bg-green-200"></div>
            <Leaf className="w-4 h-4" />
          </div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              <span className="text-green-600">L'effet ZITALGIC®</span> sur votre corps
            </h2>
            <div className="w-24 h-1 bg-green-400 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">
              Découvrez comment ZITALGIC® agit à chaque étape pour soulager vos douleurs
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* VERTICAL TABS */}
            <div className="w-full md:w-1/3">
              <div className="space-y-2 sticky top-20">
                {medicalTabs.map((tab, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMedicalTab(idx)}
                    className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 flex items-center gap-3
                                ${activeMedicalTab === idx
                                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeMedicalTab === idx ? 'bg-white text-green-600' : 'bg-green-100 text-green-600'}`}>
                      {idx + 1}
                    </div>
                    <span className="font-medium">{tab.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT */}
            <div className="w-full md:w-2/3">
              <div className="bg-white p-6 rounded-2xl shadow-inner border border-gray-100 transition-all duration-300">
                {medicalTabs[activeMedicalTab].content}
              </div>

              {/* PRODUCT SUMMARY */}
              <div className="mt-8 bg-green-50 p-6 rounded-2xl border border-green-200 transition-all duration-300 hover:shadow-md">
                <h3 className="text-xl font-bold text-green-700 mb-4">ZITALGIC® : Solution naturelle contre les douleurs</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span><strong>Cible :</strong> Douleurs articulaires, musculaires et nerveuses</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span><strong>Effet :</strong> Chaud-froid pour un soulagement immédiat</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span><strong>Avantage :</strong> Réduction de l'inflammation à long terme</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span><strong>Formule :</strong> 100% naturelle à base d'huiles essentielles marocaines</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span><strong>Résultats :</strong> 92% des utilisateurs satisfaits dès la première semaine</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="container mx-auto px-4 py-10 bg-white rounded-3xl my-10 relative overflow-hidden">
        <div className="absolute top-10 left-10 text-green-300 opacity-20 animate-pulse">
          <Leaf className="w-32 h-32 transform rotate-12" />
        </div>
        <div className="absolute bottom-10 right-10 text-green-300 opacity-20 animate-pulse">
          <Leaf className="w-24 h-24 transform -rotate-45" />
        </div>
        <div className="absolute top-20 right-20 text-green-200 opacity-30">
          <svg className="w-16 h-16 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <div className="absolute bottom-20 left-20 text-green-200 opacity-30">
          <svg className="w-12 h-12 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" />
          </svg>
        </div>
        <div className="absolute top-1/2 left-0 text-green-200 opacity-30">
          <div className="flex items-center space-x-2">
            <Leaf className="w-6 h-6" />
            <div className="w-32 h-0.5 bg-green-200"></div>
            <Leaf className="w-4 h-4" />
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Ils ont testé ZITALGIC®</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-6 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{t.text}"</p>
                <div className="flex items-center">
                  <div className="bg-green-100 text-green-800 rounded-full w-12 h-12 flex items-center justify-center font-bold mr-3 text-lg">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 bg-white rounded-3xl my-10 relative overflow-hidden">
        <div className="absolute top-10 left-10 text-green-300 opacity-20 animate-pulse">
          <Leaf className="w-32 h-32 transform rotate-12" />
        </div>
        <div className="absolute bottom-10 right-10 text-green-300 opacity-20 animate-pulse">
          <Leaf className="w-24 h-24 transform -rotate-45" />
        </div>
        <div className="absolute top-20 right-20 text-green-200 opacity-30">
          <svg className="w-16 h-16 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <div className="absolute bottom-20 left-20 text-green-200 opacity-30">
          <svg className="w-12 h-12 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" />
          </svg>
        </div>
        <div className="absolute top-1/2 left-0 text-green-200 opacity-30">
          <div className="flex items-center space-x-2">
            <Leaf className="w-6 h-6" />
            <div className="w-32 h-0.5 bg-green-200"></div>
            <Leaf className="w-4 h-4" />
          </div>
        </div>
        <div className="relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex justify-center items-center"
              >
                <img 
                  src={feature.img} 
                  alt="Badge" 
                  className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain transition-all duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 bg-white rounded-3xl my-10 relative overflow-hidden">
        <div className="absolute top-10 left-10 text-green-300 opacity-20 animate-pulse">
          <Leaf className="w-32 h-32 transform rotate-12" />
        </div>
        <div className="absolute bottom-10 right-10 text-green-300 opacity-20 animate-pulse">
          <Leaf className="w-24 h-24 transform -rotate-45" />
        </div>
        <div className="absolute top-20 right-20 text-green-200 opacity-30">
          <svg className="w-16 h-16 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <div className="absolute bottom-20 left-20 text-green-200 opacity-30">
          <svg className="w-12 h-12 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" />
          </svg>
        </div>
        <div className="absolute top-1/2 left-0 text-green-200 opacity-30">
          <div className="flex items-center space-x-2">
            <Leaf className="w-6 h-6" />
            <div className="w-32 h-0.5 bg-green-200"></div>
            <Leaf className="w-4 h-4" />
          </div>
        </div>
        <div className="relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="w-8 h-8 text-green-500 mr-3 animate-pulse" />
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                <span className="text-green-500">Produits</span> Similaires
              </h2>
            </div>
            <div className="w-24 h-1 bg-green-400 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection de produits naturels et bio pour votre bien-être quotidien
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mx-auto max-w-4xl px-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="w-full max-w-[300px] bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={product.img || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={220}
                    className="w-full h-48 object-cover rounded-t-2xl transition-all duration-300 hover:scale-105"
                  />
                  {(Boolean(product.isNew) || Number(product.discount) > 0) && (
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {Boolean(product.isNew) && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Nouveau</span>}
                      {Number(product.discount) > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">-{Number(product.discount)}%</span>
                      )}
                    </div>
                  )}
                  <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full shadow hover:bg-white transition-all duration-300">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">{product.category}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < product.rating ? 'text-amber-700 fill-current' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {Number(product.discount) > 0 ? (
                        <>
                          <span className="text-lg font-bold text-green-600">
                            {(product.price * (1 - Number(product.discount) / 100)).toFixed(2)} DH
                          </span>
                          <span className="text-sm text-gray-500 line-through ml-2">{product.price} DH</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-green-600">{product.price} DH</span>
                      )}
                    </div>
                    <button className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-full text-sm hover:bg-green-700 transition-all duration-300">
                      <ShoppingCart className="w-4 h-4" />
                      Panier
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <button className="bg-gradient-to-r from-green-600 to-green-500 text-white px-10 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg">
              Voir tous les produits
            </button>
          </div>
        </div>

        {/* CONTACT CONTAINER */}
        <div className="relative mt-12 bg-gradient-to-r from-green-600 to-green-400 rounded-3xl p-6 sm:p-8 text-white shadow-xl max-w-3xl mx-auto overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="absolute top-4 left-4 text-green-200 opacity-20 animate-pulse">
            <Leaf className="w-16 h-16 transform rotate-12" />
          </div>
          <div className="absolute bottom-4 right-4 text-green-200 opacity-20 animate-pulse">
            <Leaf className="w-12 h-12 transform -rotate-45" />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-200 opacity-10">
            <svg className="w-24 h-24 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" />
            </svg>
          </div>
          <div className="relative z-10 text-center space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold">Des questions ? Appelez-nous !</h3>
            <div className="flex items-center justify-center gap-3">
              <span className="text-lg sm:text-xl font-semibold flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                0655.89.53.75
              </span>
              <button
                onClick={copyPhoneNumber}
                className="flex items-center gap-2 bg-white text-green-600 px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-100 transition-all duration-300"
              >
                <Copy size={16} />
                {isCopied ? 'Copié !' : 'Copier'}
              </button>
            </div>
            <p className="text-sm sm:text-base">Disponible 7j/7 de 9h à 20h</p>
          </div>
        </div>
      </section>


      <style jsx>{`
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        @media (max-width: 640px) {
          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
          .grid-cols-3 {
            grid-template-columns: 1fr;
          }
          .grid-cols-4 {
            grid-template-columns: 1fr;
          }
          .max-w-lg {
            max-width: 100%;
          }
          .h-[400px] {
            height: 250px;
          }
          .sm\\:h-[450px] {
            height: 250px;
          }
          .sm\\:text-4xl {
            font-size: 2rem;
          }
          .lg\\:text-5xl {
            font-size: 2.25rem;
          }
          .sm\\:px-6 {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .sm\\:py-3 {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }
          .sm\\:max-h-[400px] {
            max-height: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductPage;
