import React, { useState } from "react";
import { Mail, Leaf, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import '../../../css/app.css';

export default function Newsletter({ newsletterEmail, setNewsletterEmail }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [emailError, setEmailError] = useState('');

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setMessage('');
    setMessageType('');
    setEmailError('');

    // Validate email
    if (!newsletterEmail.trim()) {
      setEmailError('Veuillez entrer votre adresse email');
      return;
    }

    if (!validateEmail(newsletterEmail)) {
      setEmailError('Veuillez entrer une adresse email valide');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          email: newsletterEmail
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setMessageType('success');
        setNewsletterEmail(''); // Clear the input
      } else {
        setMessage(data.message || 'Une erreur est survenue');
        setMessageType('error');
        
        // Show specific field errors if available
        if (data.errors && data.errors.email) {
          setEmailError(data.errors.email[0]);
        }
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage('Erreur de connexion. Veuillez réessayer.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-white to-green-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse" />
        <div className="absolute top-32 right-20 w-32 h-32 bg-green-300 rounded-full opacity-15 animate-pulse" />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-green-400 rounded-full opacity-25 animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-green-500 rounded-full opacity-10 animate-bounce" />
        <div className="absolute bottom-32 right-12 w-8 h-8 bg-green-300 rounded-full opacity-30 animate-ping" />
      </div>
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden relative z-10 border-2 border-green-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-6 md:p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-6 md:mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 md:mr-4">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Newsletter</h2>
                </div>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  Recevez nos conseils beauté, nos nouveautés et offres exclusives directement dans votre boîte mail.
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      setEmailError(''); // Clear error when user types
                    }}
                    className={`w-full px-4 md:px-6 py-3 md:py-4 text-sm md:text-base border-2 rounded-xl md:rounded-2xl bg-gray-50 focus:bg-white transition-all duration-300 outline-none hover:border-green-300 ${
                      emailError 
                        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100'
                    }`}
                    disabled={isSubmitting}
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {emailError}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 md:w-5 md:h-5 mr-2 inline-block animate-spin" />
                      Inscription en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 md:w-5 md:h-5 mr-2 inline-block transition-transform group-hover:translate-x-1" />
                      S'abonner gratuitement
                    </>
                  )}
                </button>
                
                {/* Success/Error Messages */}
                {message && (
                  <div className={`p-3 rounded-xl flex items-center ${
                    messageType === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-700' 
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    {messageType === 'success' ? (
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    )}
                    <span className="text-sm">{message}</span>
                  </div>
                )}
                
                <p className="text-gray-500 text-xs md:text-sm text-center">
                  ✨ Pas de spam • Désinscription en un clic • 100% gratuit
                </p>
              </form>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 md:p-8 lg:p-12 flex items-center justify-center relative min-h-[200px] md:min-h-[300px] overflow-hidden">
              <div className="text-center text-white relative z-10">
                <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 backdrop-blur-sm animate-float">
                  <Leaf className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Rejoignez +10k abonnés</h3>
                <p className="text-green-100 text-sm md:text-base">
                  Conseils beauté • Nouveautés • Offres exclusives
                </p>
              </div>
              <div className="absolute top-4 md:top-6 right-4 md:right-6 w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded-full animate-bounce pointer-events-none"></div>
              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 w-4 h-4 md:w-6 md:h-6 bg-white/30 rounded-full animate-pulse pointer-events-none"></div>
              <div className="absolute top-1/3 left-8 w-3 h-3 bg-white/25 rounded-full animate-ping pointer-events-none"></div>
              <div className="absolute bottom-1/3 right-8 w-2 h-2 bg-white/35 rounded-full animate-bounce pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}