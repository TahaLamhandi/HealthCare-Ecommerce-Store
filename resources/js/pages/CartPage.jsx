import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Trash2, Plus, Minus, 
  Truck, CreditCard, CheckCircle, ArrowLeft,
  Package, Star, Heart, Eye, X, ArrowRight,
  Shield, Clock, Gift, Zap, Sparkles, Crown,
  MapPin, Phone, Mail, User, Calendar,
  ChevronDown, ChevronUp, AlertCircle, Info,
  Check, PhoneCall, Mail as MailIcon, Home
} from 'lucide-react';
import { useCart } from '../contexts/CartContext.js';
import { useAuth } from '../contexts/AuthContext.js';

const CartPage = ({ navigateTo }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, getDeliveryFee, getTotalWithDelivery } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  // Debug cart items
  React.useEffect(() => {
    console.log('Cart items in CartPage:', cartItems);
  }, [cartItems]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    nom: user?.name || '',
    telephone: user?.phone || '',
    email: user?.email || '',
    adresse: user?.address || ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  const deliveryFee = getDeliveryFee();
  const subtotal = getCartTotal();
  const total = getTotalWithDelivery();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    const errors = {};
    
    if (!formData.nom.trim()) {
      errors.nom = true;
    }
    
    if (!formData.telephone.trim()) {
      errors.telephone = true;
    } else if (!/^[0-9]{10}$/.test(formData.telephone.replace(/\s/g, ''))) {
      errors.telephone = true;
    }
    
    if (!formData.email.trim()) {
      errors.email = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = true;
    }
    
    if (!formData.adresse.trim()) {
      errors.adresse = true;
    }
    
    setFormErrors(errors);
    
    // If there are errors, show popup and stop submission
    if (Object.keys(errors).length > 0) {
      setSubmissionError('Veuillez remplir tous les champs obligatoires correctement');
      setShowSuccessPopup(true);
      return;
    }
    
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      // Prepare order data
      const orderData = {
        nom: formData.nom,
        telephone: formData.telephone,
        email: formData.email,
        adresse: formData.adresse,
        total: total,
        livraison: deliveryFee,
        sousTotal: subtotal,
        produits: cartItems.map(item => ({
          nom: item.name,
          prix: item.price,
          quantite: item.quantity,
          total: item.price * item.quantity
        })),
        date: new Date().toLocaleString('fr-FR')
      };

      // Send to Formspree
      const formspreeResponse = await fetch('https://formspree.io/f/mvgbygpa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...orderData,
          _subject: 'Nouvelle commande BioEkleel',
          _replyto: formData.email,
          message: `
Commande BioEkleel

Client: ${formData.nom}
Email: ${formData.email}
Téléphone: ${formData.telephone}
Adresse: ${formData.adresse}

Produits commandés:
${cartItems.map(item => `- ${item.name} = ${item.price.toFixed(2)} DH (${item.package || 'Standard'} - ${item.package_quantity || 1} produit${(item.package_quantity || 1) > 1 ? 's' : ''})`).join('\n')}

Sous-total: ${subtotal.toFixed(2)} DH
Livraison: ${deliveryFee.toFixed(2)} DH
Total: ${total.toFixed(2)} DH

Date: ${new Date().toLocaleString('fr-FR')}
          `
        })
      });

      if (formspreeResponse.ok) {
        // Send order confirmation email
        try {
          const emailResponse = await fetch('/api/email/order-confirmation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
          });
          
          if (emailResponse.ok) {
            console.log('✅ Order confirmation email sent successfully');
          } else {
            console.error('❌ Failed to send order confirmation email:', await emailResponse.text());
          }
        } catch (error) {
          console.error('❌ Error sending order confirmation email:', error);
        }

        // Save order to database
        try {
          const orderResponse = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(orderData)
          });

          if (orderResponse.ok) {
            const orderResult = await orderResponse.json();
            console.log('✅ Order saved to database:', orderResult);
          } else {
            const errorText = await orderResponse.text();
            console.error('❌ Failed to save order to database:', orderResponse.status, errorText);
          }
        } catch (error) {
          console.error('❌ Error saving order to database:', error);
        }

        // Update sales count for each product based on package quantity
        for (const item of cartItems) {
          try {
            // Calculate total quantity: cart quantity * package quantity
            const totalQuantity = item.quantity * (item.package_quantity || 1);
            
            // Use product_id instead of id for the API call
            const productId = item.product_id || item.id;
            
            console.log(`Attempting to update sales count for ${item.name}:`, {
              productId: productId,
              itemId: item.id,
              totalQuantity,
              cartQuantity: item.quantity,
              packageQuantity: item.package_quantity
            });
            
            const response = await fetch(`/api/products/${productId}/increment-sales`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                quantity: totalQuantity
              })
            });
            
            if (response.ok) {
              const result = await response.json();
              console.log(`✅ Successfully updated sales count for ${item.name}:`, result);
            } else {
              const errorText = await response.text();
              console.error(`❌ Failed to update sales count for ${item.name}:`, response.status, errorText);
            }
          } catch (error) {
            console.error('❌ Error updating sales count:', error);
          }
        }
        
        setOrderConfirmed(true);
        setShowOrderForm(false);
        setShowSuccessPopup(true);
        
        // Clear cart after successful order (but don't redirect automatically)
        setTimeout(() => {
          clearCart();
        }, 1000);
      } else {
        throw new Error(`Formspree submission failed with status: ${formspreeResponse.status}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionError(`Erreur technique. Deux solutions :
        1. Réessayez dans 2 minutes
        2. Appelez-nous au 0655.89.53.75
        (Dites que vous venez du site web)`);
      setShowSuccessPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigateTo('auth');
    }
  }, [isAuthenticated, navigateTo]);

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-200/40 rounded-full blur-lg animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-teal-200/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
      <div className="absolute top-60 left-1/3 w-20 h-20 bg-green-300/30 rounded-full blur-md animate-pulse delay-500"></div>
      <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-emerald-300/25 rounded-full blur-xl animate-pulse delay-1500"></div>
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-green-600/95 to-emerald-600/95 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-green-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateTo('home')}
                className="p-3 hover:bg-white/20 rounded-full transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 text-white group-hover:text-green-100" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                  <ShoppingCart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Mon Panier</h1>
                  <p className="text-green-100 text-lg">
                    {cartItems.length} article{cartItems.length !== 1 ? 's' : ''} • {total.toFixed(2)} DH
                  </p>
                </div>
              </div>
            </div>
            
            {/* Cart Stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{cartItems.length}</div>
                <div className="text-sm text-green-100">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{total.toFixed(2)} DH</div>
                <div className="text-sm text-green-100">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-40 h-40 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <ShoppingCart className="w-20 h-20 text-green-500" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
            <p className="text-gray-600 mb-8 text-xl max-w-md mx-auto">
              Découvrez notre collection de produits naturels et ajoutez-les à votre panier
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigateTo('products')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                <Package className="w-5 h-5" />
                Découvrir nos produits
              </button>
              <button
                onClick={() => navigateTo('promotions')}
                className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                <Gift className="w-5 h-5" />
                Voir les promotions
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Cart Items - Enhanced Design */}
            <div className="xl:col-span-2">
              {/* Quick Actions Bar */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100 p-6 mb-6 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-16 h-16 bg-green-100/20 rounded-full -translate-y-8 -translate-x-8"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 bg-emerald-100/20 rounded-full translate-y-6 translate-x-6"></div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Articles sélectionnés</span>
                    </div>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <span className="text-gray-600">{cartItems.length} article{cartItems.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => clearCart()}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md"
                    >
                      <Trash2 className="w-4 h-4" />
                      Vider le panier
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Cards - Modern Design */}
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-green-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] cursor-pointer hover:border-green-200"
                    onClick={() => navigateTo('product', { productId: item.product_id })}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-6">
                        {/* Enhanced Product Image */}
                        <div className="relative w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden border-2 border-gray-200 flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <img
                            src={item.image || '/images/placeholder-product.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Eye className="w-8 h-8 text-white" />
                          </div>
                          {/* Badge */}
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            En stock
                          </div>
                        </div>

                        {/* Enhanced Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                                {item.name}
                              </h3>
                              <p className="text-gray-600 font-medium">{item.category}</p>
                              <div className="mt-2">
                                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                  {item.package || 'Standard'}
                                </span>
                                <span className="ml-2 text-sm text-gray-500">
                                  ({item.package_quantity || 1} produit{(item.package_quantity || 1) > 1 ? 's' : ''})
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600 mb-1">
                                {item.price.toFixed(2)} DH
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.package} - {item.package_quantity} produits
                              </div>
                            </div>
                          </div>
                          
                          {/* Description */}
                          {item.description && (
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>
                          )}
                          
                          {/* Rating and Reviews */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(item.rating || 4.5) 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-2">({item.rating || 4.5})</span>
                            </div>
                          </div>

                          {/* Quantity Controls - Enhanced */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                                className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors group"
                              >
                                <Minus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              </button>
                              <div className="w-12 text-center font-bold text-lg">{item.quantity}</div>
                              <button
                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors group"
                              >
                                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFromCart(item.product_id);
                                }}
                                className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
                                title="Supprimer du panier"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Enhanced Order Summary */}
            <div className="xl:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Order Summary Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-green-100 overflow-hidden relative">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/20 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-emerald-200/20 rounded-full translate-y-8 -translate-x-8"></div>
                  
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white relative">
                    <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <CreditCard className="w-6 h-6" />
                      Résumé de la commande
                    </h3>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {/* Order Details */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-600">
                        <span>Sous-total ({cartItems.length} article{cartItems.length !== 1 ? 's' : ''})</span>
                        <span className="font-semibold">{subtotal.toFixed(2)} DH</span>
                      </div>
                      
                      <div className="flex justify-between text-gray-600">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          <span>Livraison</span>
                        </div>
                        <span className="font-semibold">{deliveryFee.toFixed(2)} DH</span>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between text-xl font-bold text-gray-900">
                          <span>Total</span>
                          <span className="text-green-600">{total.toFixed(2)} DH</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-800">Paiement à la livraison</p>
                          <p className="text-sm text-green-600">Payez en espèces ou par carte lors de la livraison</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security & Trust */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100 p-6 relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-green-100/30 rounded-full -translate-y-6 translate-x-6"></div>
                  
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Sécurité & Garanties
                  </h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Paiement 100% sécurisé</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Livraison garantie</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Retour sous 30 jours</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Support client 24/7</span>
                    </div>
                  </div>
                </div>

                {/* Confirm Order Button */}
                <motion.button
                  onClick={() => setShowOrderForm(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <CreditCard className="w-5 h-5" />
                  Confirmer ma commande
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                {/* Continue Shopping */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => navigateTo('products')}
                    className="w-full text-gray-600 hover:text-green-600 font-medium py-3 px-4 border border-gray-200 rounded-xl hover:border-green-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    Continuer mes achats
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Form Modal */}
      <AnimatePresence>
        {showOrderForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
            onClick={() => setShowOrderForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <User className="w-6 h-6" />
                    Informations de livraison
                  </h2>
                  <button
                    onClick={() => setShowOrderForm(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-green-100 mt-2">Remplissez vos informations pour finaliser votre commande</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        formErrors.nom ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Votre nom complet"
                    />
                    {formErrors.nom && (
                      <p className="text-red-500 text-sm mt-1">Le nom est requis</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        formErrors.telephone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="06 12 34 56 78"
                    />
                    {formErrors.telephone && (
                      <p className="text-red-500 text-sm mt-1">Numéro de téléphone invalide</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="votre@email.com"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">Email invalide</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresse complète *
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      formErrors.adresse ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Rue, numéro, quartier, ville"
                  />
                  {formErrors.adresse && (
                    <p className="text-red-500 text-sm mt-1">L'adresse est requise</p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="font-bold text-gray-900 mb-3">Résumé de votre commande</h3>
                  <div className="space-y-2 text-sm">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <div>
                          <span>{item.name}</span>
                          <div className="text-xs text-gray-500 mt-1">
                            {item.package || 'Standard'} - {item.package_quantity || 1} produit{(item.package_quantity || 1) > 1 ? 's' : ''}
                          </div>
                        </div>
                        <span>{item.price.toFixed(2)} DH</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 font-bold">
                      <div className="flex justify-between">
                        <span>Total</span>
                        <span>{total.toFixed(2)} DH</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Confirmer la commande
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success/Error Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
            onClick={() => setShowSuccessPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {submissionError ? (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Erreur</h3>
                  <p className="text-gray-600 mb-6 whitespace-pre-line">{submissionError}</p>
                  <button
                    onClick={() => setShowSuccessPopup(false)}
                    className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
                  >
                    Fermer
                  </button>
                </>
              ) : orderConfirmed ? (
                <>
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Commande confirmée!</h3>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-green-600" />
                      </div>
                      <h4 className="font-bold text-green-800">Prochaines étapes</h4>
                    </div>
                    <p className="text-green-700 leading-relaxed">
                      Votre commande a été envoyée avec succès. Un de nos commerciaux vous contactera dans les plus brefs délais pour confirmer votre commande.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowSuccessPopup(false);
                      setOrderConfirmed(false);
                    }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Parfait!
                  </button>
                </>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;