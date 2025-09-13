const LandingPage = () => {
  const [selectedPack, setSelectedPack] = useState('1-flacon');
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    ville: '',
  });
  const [isVisible, setIsVisible] = useState({});
  const [openFaq, setOpenFaq] = useState(null);
  const [counters, setCounters] = useState({
    clients: 0,
    satisfaction: 0,
    recommendation: 0,
    rating: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(null);
  const [audioElements, setAudioElements] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const formRef = useRef(null);

  const faqData = [
    {
      question: "Comment utiliser Zitalgic® ?",
      answer: "Appliquez quelques gouttes de Zitalgic® sur la zone douloureuse et massez délicatement. L'effet se ressent généralement dans les 15-30 minutes. Utilisez 2-3 fois par jour selon vos besoins.",
    },
    {
      question: "Zitalgic® convient-il à tous les types de douleurs ?",
      answer: "Oui, Zitalgic® est efficace contre les douleurs articulaires, musculaires et nerveuses. Sa formule brevetée agit sur l'inflammation et procure un soulagement ciblé pour différents types de douleurs chroniques.",
    },
    {
      question: "Y a-t-il des effets secondaires ?",
      answer: "Zitalgic® est 100% naturel et ne présente aucun effet secondaire connu. Cependant, nous recommandons un test sur une petite zone de peau avant la première utilisation, surtout si vous avez des allergies connues aux huiles essentielles.",
    },
    {
      question: "Combien de temps dure un flacon de 30ml ?",
      answer: "Un flacon de 30ml dure environ 10-15 jours avec une utilisation régulière (2-3 applications par jour). Grâce à sa formule concentrée, quelques gouttes suffisent pour chaque application.",
    },
    {
      question: "Puis-je utiliser Zitalgic® avec d'autres médicaments ?",
      answer: "Zitalgic® étant un produit naturel à usage externe, il n'y a généralement pas d'interactions médicamenteuses. Cependant, consultez votre médecin si vous suivez un traitement spécifique.",
    },
    {
      question: "Livrez-vous partout au Maroc ?",
      answer: "Oui, nous livrons partout au Maroc. La livraison prend généralement 24-48h dans les grandes villes et 2-4 jours dans les zones rurales. Paiement à la livraison disponible.",
    },
    {
      question: "Que faire si le produit ne me convient pas ?",
      answer: "Nous offrons une garantie satisfait ou remboursé de 30 jours. Si Zitalgic® ne vous convient pas, contactez notre service client pour un remboursement complet, sans questions.",
    },
    {
      question: "Zitalgic® est-il certifié ?",
      answer: "Oui, Zitalgic® est développé par BioEkeel Laboratory, un laboratoire certifié au Maroc. Notre formule est brevetée et tous nos produits respectent les standards internationaux de qualité.",
    },
  ];

  const packs = {
    '1-flacon': { price: 219, original: 249, savings: 30, quantity: '1 Flacon (30ml)' },
    '3-flacons': { price: 599, original: 747, savings: 148, quantity: '3 Flacons (3x30ml)' },
    '5-flacons': { price: 899, original: 1245, savings: 346, quantity: '5 Flacons (5x30ml)' },
  };

  const audioTestimonials = [
    {
      name: 'Fatima, 52 ans',
      location: 'Casablanca',
      audioSrc: '/audios/testimonial-fatima.mp3',
      transcript: 'Après des années de douleurs aux genoux, Zitalgic m\'a redonné ma mobilité. Je recommande vivement !',
    },
    {
      name: 'Mohammed, 45 ans',
      location: 'Rabat',
      audioSrc: '/audios/testimonial-mohammed.mp3',
      transcript: 'Les douleurs musculaires ont disparu en quelques minutes. Un produit miracle !',
    },
    {
      name: 'Amina, 60 ans',
      location: 'Marrakech',
      audioSrc: '/audios/testimonial-amina.mp3',
      transcript: 'Naturel et efficace, je ne peux plus m\'en passer. Merci Zitalgic !',
    },
  ];

  useEffect(() => {
    const sections = ['hero', 'problem', 'solution', 'composition', 'scientific', 'benefits', 'testimonials', 'audio-testimonials', 'pricing', 'order-form', 'faq', 'how-it-works', 'why-choose'];
    const handleScroll = () => {
      const newVisibility = {};
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          newVisibility[section] = rect.top <= window.innerHeight * 0.8;
        }
      });
      setIsVisible(newVisibility);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!hasAnimated) {
      const interval = setInterval(() => {
        setCounters((prev) => ({
          clients: Math.min(prev.clients + 100, 15000),
          satisfaction: Math.min(prev.satisfaction + 1, 95),
          recommendation: Math.min(prev.recommendation + 1, 92),
          rating: Math.min(prev.rating + 0.1, 4.8),
        }));
      }, 50);

      setTimeout(() => {
        clearInterval(interval);
        setHasAnimated(true);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [hasAnimated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmissionError(null);

  try {
    // 1. Prepare data
    const submissionPayload = {
      "Nom": formData.nom,
      "Téléphone": formData.telephone,
      "Email": formData.email,
      "Ville": formData.ville,
      "Pack": packs[selectedPack].quantity,
      "Prix": packs[selectedPack].price,
      "Date": new Date().toLocaleString('fr-FR')
    };

    console.log('Submitting data to Formspree:', submissionPayload);

    // 2. Submit to Formspree only
    const formspreeResponse = await fetch('https://formspree.io/f/xpwlgwag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        nom: submissionPayload.Nom,
        telephone: submissionPayload.Téléphone,
        email: submissionPayload.Email,
        ville: submissionPayload.Ville,
        pack: submissionPayload.Pack,
        prix: submissionPayload.Prix,
        date: submissionPayload.Date,
        _subject: 'Nouvelle commande Zitalgic®',
        _replyto: submissionPayload.Email
      })
    });

    console.log('Formspree response:', formspreeResponse);

    // 3. Check if submission was successful
    if (formspreeResponse.ok) {
      const responseData = await formspreeResponse.json();
      console.log('✅ Formspree submission successful:', responseData);
      
      // Success - show success popup
      setShowPopup(true);
      setFormData({
        nom: '',
        telephone: '',
        email: '',
        ville: ''
      });
    } else {
      throw new Error(`Formspree submission failed with status: ${formspreeResponse.status}`);
    }

  } catch (error) {
    console.error('Submission error:', error);
    setSubmissionError(`
      Erreur technique. Deux solutions :
      1. Réessayez dans 2 minutes
      2. Appelez-nous au 0655.89.53.75
      (Dites que vous venez du site web)
    `);
    setShowPopup(true);
  } finally {
    setIsSubmitting(false);
  }
};

  const closePopup = () => {
    setShowPopup(false);
    setSubmissionError(null);
  };

  const handlePlayAudio = (index) => {
    if (!audioElements[index]) {
      const audio = new Audio(process.env.PUBLIC_URL + audioTestimonials[index].audioSrc);
      setAudioElements((prev) => ({ ...prev, [index]: audio }));
    }

    const audio = audioElements[index] || new Audio(process.env.PUBLIC_URL + audioTestimonials[index].audioSrc);

    if (isPlaying === index) {
      audio.pause();
      setIsPlaying(null);
    } else {
      if (isPlaying !== null && audioElements[isPlaying]) {
        audioElements[isPlaying].pause();
      }
      audio.play();
      setIsPlaying(index);
      audio.onended = () => {
        setIsPlaying(null);
      };
    }
  };

  const scrollToForm = () => {
    const formSection = document.getElementById('order-form');
    if (formSection) {
      const targetPosition = formSection.offsetTop - 100;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 1000;
      let startTime = null;

      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      };

      const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      };

      requestAnimationFrame(animation);

      setTimeout(() => {
        formSection.classList.add('highlight-form');
        setTimeout(() => {
          formSection.classList.remove('highlight-form');
        }, 2000);
      }, duration + 100);
    }
  };

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText('0655895375');
  };

  return (
    <div className="zitalgic-landing">
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <button className="popup-close" onClick={closePopup}>
              <X size={24} />
            </button>
            <div className="popup-content">
              {submissionError ? (
                <>
                  <div className="popup-icon error">
                    <AlertCircle size={48} />
                  </div>
                  <h3>Erreur lors de l'envoi</h3>
                  <p>{submissionError}</p>
                  <p>Veuillez réessayer ou nous contacter directement au <strong>0655.89.53.75</strong>.</p>
                  <button className="popup-button" onClick={closePopup}>
                    Fermer
                  </button>
                </>
              ) : (
                <>
                  <div className="popup-icon success">
                    <CheckCircle size={48} />
                  </div>
                  <h3>Commande Enregistrée !</h3>
                  <p>Merci pour votre commande ! Notre commercial vous contactera dans les 24h pour confirmer votre commande.</p>
                  <button className="popup-button" onClick={closePopup}>
                    Fermer
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>ZITALGIC<sup>®</sup></h1>
            <p>Solution naturelle contre les douleurs</p>
          </div>
          <div className="header-cta">
            <button className="cta-button" onClick={scrollToForm}>
              Commander Maintenant
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className={`hero ${isVisible.hero ? 'animate' : ''}`}>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Soulagez vos douleurs naturellement avec Zitalgic<sup>®</sup>
              </h1>
              <p className="hero-subtitle">
                La solution 100% naturelle pour les douleurs articulaires, musculaires et nerveuses.
                Efficacité prouvée en 15-30 minutes.
              </p>
              <button className="cta-button" onClick={scrollToForm}>
                Découvrir la solution
              </button>
            </div>
            <div className="hero-image">
              <img src="/images/Zitalgic PNG.png" alt="Flacon Zitalgic" />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className={`problem ${isVisible.problem ? 'animate' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>Les douleurs chroniques vous gâchent la vie ?</h2>
            <p>Des millions de personnes souffrent quotidiennement sans solution efficace</p>
          </div>
          <div className="pain-points">
            <div className="pain-point">
              <div className="pain-icon">
                <Activity className="icon" />
              </div>
              <div>
                <h3>Mobilité réduite</h3>
                <p>Difficulté à effectuer les gestes simples du quotidien</p>
              </div>
            </div>
            <div className="pain-point">
              <div className="pain-icon">
                <Moon className="icon" />
              </div>
              <div>
                <h3>Sommeil perturbé</h3>
                <p>Les douleurs vous empêchent de trouver le repos</p>
              </div>
            </div>
            <div className="pain-point">
              <div className="pain-icon">
                <AlertCircle className="icon" />
              </div>
              <div>
                <h3>Effets secondaires</h3>
                <p>Les solutions chimiques peuvent causer d'autres problèmes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={`how-it-works ${isVisible['how-it-works'] ? 'animate' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>Comment Zitalgic agit-il ?</h2>
            <p>Une synergie d'huiles essentielles soigneusement sélectionnées pour une action ciblée</p>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Pénétration</h3>
              <p>Les huiles essentielles pénètrent profondément dans les tissus</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Action</h3>
              <p>Réduction de l'inflammation et détente musculaire immédiate</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Soulagement</h3>
              <p>Amélioration durable du confort et de la mobilité</p>
            </div>
          </div>
        </div>
      </section>

      {/* Composition Section */}
      <section id="composition" className={`composition ${isVisible.composition ? 'animate' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>Composition Scientifiquement Optimisée</h2>
            <p>Chaque ingrédient a été sélectionné pour ses propriétés spécifiques et son action synergique dans notre formule brevetée.</p>
          </div>
          <div className="composition-content">
            <img src="/images/ZitalgicLAB.png" alt="Composition Zitalgic" className="composition-image" />
            <div className="composition-list">
              <h3>Zitalgic® Composition</h3>
              <div className="ingredient-card">
                <span className="ingredient-number">1</span>
                <div>
                  <h4>Huile d'Eucalyptus</h4>
                  <p>Action anti-inflammatoire naturelle</p>
                </div>
              </div>
              <div className="ingredient-card">
                <span className="ingredient-number">2</span>
                <div>
                  <h4>Huile de Menthe</h4>
                  <p>Effet rafraîchissant et analgésique</p>
                </div>
              </div>
              <div className="ingredient-card">
                <span className="ingredient-number">3</span>
                <div>
                  <h4>Huile de Romarin</h4>
                  <p>Stimule la circulation sanguine</p>
                </div>
              </div>
              <div className="ingredient-card">
                <span className="ingredient-number">4</span>
                <div>
                  <h4>Huile de Lavande</h4>
                  <p>Propriétés relaxantes et apaisantes</p>
                </div>
              </div>
              <div className="ingredient-card">
                <span className="ingredient-number">5</span>
                <div>
                  <h4>Complexe Naturel Breveté</h4>
                  <p>Synergie optimisée pour l'efficacité</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Proof Section */}
      <section id="scientific" className={`scientific ${isVisible.scientific ? 'animate' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>Preuve Scientifique</h2>
            <p>La Science au Cœur de Notre Formule Brevetée</p>
          </div>
          <div className="scientific-image-container">
            <img src="/images/labo.jpg" alt="Laboratoire BioEkeel" className="scientific-main-image" />
          </div>
          <div className="scientific-features">
            <div className="scientific-feature">
              <div className="feature-icon"><FlaskConical /></div>
              <div className="feature-content">
                <h4>Scientifique BioEkeel - BioEkeel Laboratory</h4>
                <p>Un laboratoire de référence au Maroc, spécialisé dans le développement de solutions naturelles innovantes pour le bien-être et la santé.</p>
              </div>
            </div>
            <div className="scientific-feature">
              <div className="feature-icon"><Award /></div>
              <div className="feature-content">
                <h4>Formule Brevetée</h4>
                <p>Développée par BioEkeel Laboratory avec des années de recherche. Innovation protégée garantissant qualité et efficacité.</p>
              </div>
            </div>
            <div className="scientific-feature">
              <div className="feature-icon"><CheckCircle /></div>
              <div className="feature-content">
                <h4>Tests Rigoureux</h4>
                <p>Composition vérifiée et testée selon les standards internationaux. Contrôles qualité à chaque étape de production.</p>
              </div>
            </div>
            <div className="scientific-feature">
              <div className="feature-icon"><Leaf /></div>
              <div className="feature-content">
                <h4>Expertise Reconnue</h4>
                <p>BioEkeel, leader en produits naturels au Maroc. Plus de 15 ans d'expérience en recherche et développement.</p>
              </div>
            </div>
            <div className="scientific-feature">
              <div className="feature-icon"><Zap /></div>
              <div className="feature-content">
                <h4>Efficacité Prouvée</h4>
                <p>Des résultats mesurables et documentés. 95% de satisfaction client selon nos études internes.</p>
              </div>
            </div>
            <div className="scientific-feature">
              <div className="feature-icon"><Activity /></div>
              <div className="feature-content">
                <h4>Résultats Vérifiés</h4>
                <p>Notre formule a démontré une réduction de 78% des douleurs articulaires dans des tests cliniques contrôlés</p>
              </div>
            </div>
          </div>
          <p className="scientific-intro">Zitalgic® n'est pas un simple mélange d'huiles. C'est le fruit de recherches approfondies et d'une expertise scientifique reconnue.</p>
          <div className="beautiful-cta-banner">
            <div className="cta-content">
              <h3>Le Choix Est Évident</h3>
              <p>Essayez Zitalgic® aujourd'hui et ressentez la différence</p>
              <button className="cta-button-no-border" onClick={scrollToForm}>
                Commander Maintenant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section id="why-choose" className={`why-choose ${isVisible['why-choose'] ? 'animate' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>Pourquoi Choisir Zitalgic® ?</h2>
            <p>Découvrez les avantages de notre solution naturelle comparée aux alternatives traditionnelles</p>
          </div>
          <div className="comparison-grid">
            <div className="comparison-column zitalgic-column">
              <div className="comparison-header">
                <div className="check-icon">✓</div>
                <h3>Zitalgic®</h3>
              </div>
              <ul className="comparison-features">
                <li>Formule brevetée scientifiquement prouvée</li>
                <li>Soulagement rapide (15-30 minutes)</li>
                <li>100% naturel - Synergie d'huiles essentielles</li>
                <li>Aucun effet secondaire</li>
                <li>Action ciblée : Articulaire, Musculaire & Nerveux</li>
                <li>Format 30ml concentré - Haute efficacité</li>
                <li>Recommandé par les professionnels</li>
                <li>Garantie satisfait ou remboursé</li>
              </ul>
            </div>
            <div className="comparison-column home-remedies-column">
              <div className="comparison-header">
                <div className="warning-icon">⚠️</div>
                <h3>Remèdes Maison</h3>
              </div>
              <ul className="comparison-features">
                <li>Efficacité limitée et imprévisible</li>
                <li>Soulagement temporaire seulement</li>
                <li>Ingrédients non standardisés</li>
                <li>Risque d'allergies ou irritations</li>
                <li>Action générale non ciblée</li>
                <li>Préparation longue et fastidieuse</li>
                <li>Pas de validation scientifique</li>
                <li>Aucune garantie de résultat</li>
              </ul>
            </div>
            <div className="comparison-column chemical-column">
              <div className="comparison-header">
                <div className="stop-icon">⛔</div>
                <h3>Traitements Chimiques</h3>
              </div>
              <ul className="comparison-features">
                <li>Effets secondaires nombreux</li>
                <li>Soulagement mais risques pour l'estomac</li>
                <li>Substances chimiques synthétiques</li>
                <li>Accoutumance possible</li>
                <li>Masque les symptômes sans traiter</li>
                <li>Coût élevé sur le long terme</li>
                <li>Contre-indications multiples</li>
                <li>Surveillance médicale obligatoire</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className={`solution ${isVisible.solution ? 'animate' : ''}`}>
        <div className="container">
          <div className="solution-content">
            <div className="solution-image">
              <img src="/images/ApplicationZitalgic.jpg" alt="Application de Zitalgic" />
            </div>
            <div className="solution-text">
              <h2>La solution naturelle Zitalgic<sup>®</sup></h2>
              <p>Une formule brevetée développée par BioEkeel Laboratory, combinant les bienfaits des huiles essentielles avec une technologie avancée pour un soulagement rapide et durable.</p>
              <div className="solution-features">
                <div className="feature">
                  <CheckCircle className="icon" />
                  <span>Action rapide en 15-30 minutes</span>
                </div>
                <div className="feature">
                  <CheckCircle className="icon" />
                  <span>100% naturel - sans effets secondaires</span>
                </div>
                <div className="feature">
                  <CheckCircle className="icon" />
                  <span>Formule concentrée - haute efficacité</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Info Banner */}
      <div id="delivery" className={`delivery-banner ${isVisible.delivery ? 'animate' : ''}`}>
        <div className="container">
          <h2>Livraison & Paiement</h2>
          <p>Livraison incluse dans le prix partout au Maroc – Paiement à la livraison disponible</p>
        </div>
      </div>

      {/* Benefits Section */}
      <section id="benefits" className={`benefits ${isVisible.benefits ? 'animate' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>Pourquoi choisir Zitalgic<sup>®</sup> ?</h2>
            <p>Une solution naturelle avec des bénéfices multiples</p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <Leaf className="icon" />
              </div>
              <h3>Naturel & Sûr</h3>
              <p>Synergie d'huiles essentielles pures sans produits chimiques agressifs</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <Zap className="icon" />
              </div>
              <h3>Action Rapide</h3>
              <p>Soulagement perceptible dès les premières applications</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <FlaskConical className="icon" />
              </div>
              <h3>Formule Brevetée</h3>
              <p>Développée par des experts en phytothérapie</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <Award className="icon" />
              </div>
              <h3>Garantie Satisfait</h3>
              <p>30 jours pour tester sans risque</p>
            </div>
          </div>
        </div>
      </section>

      {/* Phone CTA Banner */}
      <div id="phone-cta" className={`phone-cta ${isVisible['phone-cta'] ? 'animate' : ''}`}>
        <div className="container beautiful-cta-banner">
          <h3>Des questions ? Appelez-nous !</h3>
          <p className="phone-number">0655.89.53.75</p>
          <p>Disponible 7j/7 de 9h à 20h</p>
          <button className="cta-button-no-border" onClick={copyPhoneNumber}>
            Copier le numéro
          </button>
        </div>
      </div>

      {/* Testimonials Section */}
      <section id="testimonials" className={`testimonials ${isVisible.testimonials ? 'animate' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>Ils ont essayé Zitalgic<sup>®</sup></h2>
            <p>Découvrez les témoignages de nos clients satisfaits</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Après des années de douleurs aux genoux, Zitalgic m'a redonné ma mobilité. Je recommande !"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src="/images/testimonial-1.jpeg" alt="Fatima" />
                </div>
                <div className="author-info">
                  <h4>Fatima, 52 ans</h4>
                  <p>Casablanca</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Les douleurs musculaires ont disparu en quelques minutes. Un produit miracle !"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src="/images/testimonial-2.jpg" alt="Mohammed" />
                </div>
                <div className="author-info">
                  <h4>Mohammed, 45 ans</h4>
                  <p>Rabat</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Naturel et efficace, je ne peux plus m'en passer. Merci Zitalgic !"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src="/images/testimonial-3.jpeg" alt="Amina" />
                </div>
                <div className="author-info">
                  <h4>Amina, 36 ans</h4>
                  <p>Marrakech</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Grâce à Zitalgic, mes douleurs au dos ont diminué et je peux enfin profiter de mes promenades quotidiennes."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src="/images/testimonial-4.jpeg" alt="Mohamed" />
                </div>
                <div className="author-info">
                  <h4>Khalid, 60 ans</h4>
                  <p>Marrakech</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"J'étais sceptique au début, mais après quelques semaines j'ai vraiment ressenti un soulagement articulaire."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src="/images/testimonial-5.jpeg" alt="Amina" />
                </div>
                <div className="author-info">
                  <h4>Halima, 40 ans</h4>
                  <p>Rabat</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Zitalgic m'a aidé à retrouver mon énergie et à reprendre mes activités sportives doucement mais sûrement."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src="/images/testimonial-6.jpeg" alt="Youssef" />
                </div>
                <div className="author-info">
                  <h4>Youssef, 38 ans</h4>
                  <p>Tanger</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audio Testimonials Section */}
      <section id="audio-testimonials" className={`audio-testimonials ${isVisible['audio-testimonials'] ? 'animate' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>Écoutez Nos Clients Satisfaits</h2>
            <p>Des voix réelles, des résultats réels. Laissez-vous convaincre par leurs expériences.</p>
          </div>
          <div className="audio-grid">
            {audioTestimonials.map((testimonial, index) => (
              <div key={index} className="audio-card">
                <div className="audio-player-container">
                  <div className="audio-player">
                    <div className="audio-controls">
                      <button
                        className={`play-pause-btn ${isPlaying === index ? 'playing' : ''}`}
                        onClick={() => handlePlayAudio(index)}
                      >
                        {isPlaying === index ? <Pause className="play-icon" /> : <Play className="play-icon" />}
                      </button>
                      <div className="progress-container">
                        <div className="progress-bar"></div>
                      </div>
                      <div className="time-display">0:00</div>
                    </div>
                  </div>
                </div>
                <div className="audio-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.location}</p>
                  <p className="transcript-snippet">{testimonial.transcript}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`pricing ${isVisible.pricing ? 'animate' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>Choisissez votre formule</h2>
            <p>Profitez de notre offre spéciale de lancement</p>
          </div>
          <div className="pricing-grid">
            {Object.entries(packs).map(([key, pack]) => (
              <div key={key} className={`pricing-card ${selectedPack === key ? 'selected' : ''}`}>
                <div className="pricing-header">
                  <h3>{pack.quantity}</h3>
                  <p>Traitement {key === '1-flacon' ? '10-15 jours' : key === '3-flacons' ? '1 mois' : '2 mois'}</p>
                </div>
                <div className="pricing-price">
                  <span className="original-price">{pack.original} DH</span>
                  <span className="current-price">{pack.price} DH</span>
                  <span className="savings">Économisez {pack.savings} DH</span>
                </div>
                <button
                  className="pricing-button"
                  onClick={() => {
                    setSelectedPack(key);
                    scrollToForm();
                  }}
                >
                  Choisir ce pack
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent CTA Banner */}
      <div className="urgent-cta-banner">
        <div className="container">
          <div className="urgent-cta-content">
            <h3>Ne Laissez Pas Passer Cette Chance !</h3>
            <p>Cette offre exceptionnelle ne durera pas. Commandez maintenant et retrouvez votre confort dès demain !</p>
            <button className="cta-button" onClick={scrollToForm}>
              Commander maintenant
            </button>
          </div>
        </div>
      </div>

      {/* Order Form Section */}
      <section id="order-form" ref={formRef} className={`order-form ${isVisible['order-form'] ? 'animate' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>Commandez maintenant</h2>
            <p>Remplissez le formulaire et recevez Zitalgic<sup>®</sup> sous 48h</p>
          </div>
          <div className="order-content">
            <form onSubmit={handleSubmit} className="order-form-fields">
              <div className="form-group">
                <label>Nom Complet</label>
                <input name="nom" value={formData.nom} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input 
                  name="telephone"
                  value={formData.telephone}
                  onChange={(e) => {
                    // Allow only numbers
                    const value = e.target.value.replace(/\D/g, '');
                    // Limit to 10 characters (for Moroccan numbers)
                    const formattedValue = value.slice(0, 10);
                    setFormData(prev => ({...prev, telephone: formattedValue}));
                  }}
                  required
                  pattern="[0-9]{10}"
                  title="Un numéro de téléphone valide (10 chiffres)"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Ville</label>
                <input name="ville" value={formData.ville} onChange={handleInputChange} required />
              </div>
              <button type="submit" className="cta-button" disabled={isSubmitting}>
                {isSubmitting ? 'Envoi en cours...' : 'Passer la commande'}
              </button>
            </form>
            <div className="order-summary">
              <h3>Résumé de commande</h3>
              <p>Pack: {packs[selectedPack].quantity}</p>
              <p>Prix: {packs[selectedPack].price} DH</p>
              <p>Économies: {packs[selectedPack].savings} DH</p>
              <p>Livraison partout au Maroc</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={`faq ${isVisible.faq ? 'animate' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>Questions fréquentes</h2>
            <p>Trouvez les réponses à vos questions sur Zitalgic<sup>®</sup></p>
          </div>
          <div className="faq-list">
            {faqData.map((faq, index) => (
              <div key={index} className={`faq-item ${openFaq === index ? 'open' : ''}`}>
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  {faq.question}
                  <ChevronDown className={`faq-icon ${openFaq === index ? 'open' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <h1>ZITALGIC<sup>®</sup></h1>
                <p>Solution naturelle contre les douleurs</p>
              </div>
              <p>Développé par BioEkeel Laboratory, laboratoire certifié au Maroc.</p>
            </div>
            <div className="footer-section">
              <h3>Contact</h3>
              <p>
                <Phone className="icon" /> 0655.89.53.75
              </p>
              <p>Disponible 7j/7 de 9h à 20h</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} BioEkleel. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;