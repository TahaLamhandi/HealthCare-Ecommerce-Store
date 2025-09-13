import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Target, Image as ImageIcon, Upload, X, Calendar, Percent, Package, Star } from 'lucide-react';
import ConfirmationPopup from './ConfirmationPopup';

const PromotionsManagement = () => {
    const [promotions, setPromotions] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [promotionToDelete, setPromotionToDelete] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [backgroundImagePreview, setBackgroundImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        backgroundImage: '',
        product_id: '',
        discount: 0
    });

    useEffect(() => {
        fetchPromotions();
        fetchProducts();
    }, []);

    const fetchPromotions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/promotions', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPromotions(data.data);
            } else {
                throw new Error('Échec de la récupération des promotions');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/products', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProducts(data.data);
            }
        } catch (err) {
            console.error('Échec de la récupération des produits:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = editingPromotion 
                ? `/api/admin/promotions/${editingPromotion.id}`
                : '/api/admin/promotions';
            
            const method = editingPromotion ? 'PUT' : 'POST';

            // Only send fields that have values for partial editing
            const dataToSend = {};
            if (formData.title) dataToSend.title = formData.title;
            if (formData.subtitle) dataToSend.subtitle = formData.subtitle;
            if (formData.description) dataToSend.description = formData.description;
            if (formData.backgroundImage) dataToSend.backgroundImage = formData.backgroundImage;
            if (formData.product_id) dataToSend.product_id = formData.product_id;
            if (formData.discount) dataToSend.discount = formData.discount;
            

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                try {
                    const updatedPromotion = await response.json();
                    
                    if (editingPromotion) {
                        // Update existing promotion in local state
                        setPromotions(prev => prev.map(promo => 
                            promo.id === editingPromotion.id 
                                ? { ...promo, ...updatedPromotion.data || updatedPromotion }
                                : promo
                        ));
                    } else {
                        // Add new promotion to local state
                        const newPromotion = updatedPromotion.data || updatedPromotion;
                        setPromotions(prev => [newPromotion, ...prev]);
                    }
                } catch (jsonError) {
                    // If JSON parsing fails, fallback to fetching all promotions
                    console.warn('Failed to parse response, fetching all promotions:', jsonError);
                await fetchPromotions();
                }
                
                setShowModal(false);
                setEditingPromotion(null);
                resetForm();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la sauvegarde de la promotion');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (promotion) => {
        setEditingPromotion(promotion);
        setFormData({
            title: promotion.title,
            subtitle: promotion.subtitle,
            description: promotion.description,
            backgroundImage: promotion.backgroundImage,
            product_id: promotion.product_id,
            discount: promotion.discount
        });
        setBackgroundImagePreview(promotion.backgroundImage);
        setShowModal(true);
    };

    const handleDeleteClick = (promotion) => {
        setPromotionToDelete(promotion);
        setShowDeletePopup(true);
    };

    const handleDeleteConfirm = async () => {
        if (!promotionToDelete) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/promotions/${promotionToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Remove promotion from local state immediately
                setPromotions(prev => prev.filter(promo => promo.id !== promotionToDelete.id));
                setShowDeletePopup(false);
                setPromotionToDelete(null);
            } else {
                throw new Error('Échec de la suppression de la promotion');
            }
        } catch (err) {
            setError(err.message);
            setShowDeletePopup(false);
            setPromotionToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeletePopup(false);
        setPromotionToDelete(null);
    };

    const handleBackgroundImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('type', 'promotion');

            const token = localStorage.getItem('token');
            const response = await fetch('/api/upload/image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                // Check if response is JSON
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    setFormData(prev => ({ ...prev, backgroundImage: data.url }));
                    setBackgroundImagePreview(data.url);
                } else {
                    // If not JSON, try to get text response
                    const text = await response.text();
                    console.log('Response text:', text);
                    throw new Error('Réponse du serveur invalide');
                }
            } else {
                const errorText = await response.text();
                console.error('Upload error:', errorText);
                throw new Error(`Échec du téléchargement de l'image: ${response.status}`);
            }
        } catch (err) {
            console.error('Upload error details:', err);
            setError(err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const removeBackgroundImage = () => {
        setFormData(prev => ({ ...prev, backgroundImage: '' }));
        setBackgroundImagePreview(null);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            subtitle: '',
            description: '',
            backgroundImage: '',
            product_id: '',
            discount: 0
        });
        setBackgroundImagePreview(null);
    };

    const openAddModal = () => {
        setEditingPromotion(null);
        resetForm();
        setShowModal(true);
    };

    if (loading && promotions.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Gestion des Promotions</h2>
                            <p className="text-gray-600 mt-1">Créez et gérez des promotions attractives pour vos produits</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-white px-6 py-3 rounded-2xl shadow-lg">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span className="text-lg font-semibold text-gray-800">{promotions.length} Promotions</span>
                            </div>
                        </div>
                <button
                    onClick={openAddModal}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                            <Plus className="w-5 h-5" />
                            <span className="font-semibold">Nouvelle Promotion</span>
                </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <Target className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Promotions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
                {promotions.map((promotion) => (
                    <div key={promotion.id} className="group bg-white rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                        <div className="relative h-64 lg:h-72 overflow-hidden">
                            <img 
                                src={promotion.backgroundImage} 
                                alt={promotion.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                            <div className="absolute top-4 right-4">
                                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                                    <Percent className="w-4 h-4" />
                                    {promotion.discount}%
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 drop-shadow-lg">{promotion.title}</h3>
                                <p className="text-white/90 text-sm lg:text-base drop-shadow-md">{promotion.subtitle}</p>
                            </div>
                        </div>
                        <div className="p-6 lg:p-8 space-y-4">
                            <div className="space-y-3">
                                <p className="text-gray-600 text-sm lg:text-base line-clamp-3 leading-relaxed">{promotion.description}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                                    <Package className="w-4 h-4 text-purple-500" />
                                    <span className="font-medium">Produit: {promotion.product?.name || 'N/A'}</span>
                            </div>
                        </div>
                            
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => handleEdit(promotion)}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                    <Edit3 className="w-4 h-4" />
                                    Modifier
                                    </button>
                                    <button
                                    onClick={() => handleDeleteClick(promotion)}
                                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                    <Trash2 className="w-4 h-4" />
                                    Supprimer
                                    </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {promotions.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Target className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">Aucune promotion trouvée</h3>
                    <p className="text-gray-400">Les promotions apparaîtront ici une fois créées</p>
                </div>
            )}

            {/* Confirmation Popup */}
            <ConfirmationPopup
                isOpen={showDeletePopup}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Supprimer la promotion"
                message={`Êtes-vous sûr de vouloir supprimer la promotion "${promotionToDelete?.title}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                type="danger"
            />

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-10">
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-t-3xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                                        <Target className="w-6 h-6 text-purple-800" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">
                                            {editingPromotion ? 'Modifier la Promotion' : 'Nouvelle Promotion'}
                            </h3>
                                        <p className="text-white text-opacity-80 text-sm">
                                            {editingPromotion ? 'Modifiez les informations de la promotion' : 'Créez une promotion attractive pour vos produits'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-10 h-10 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
                                >
                                    <X className="w-5 h-5 text-purple-800" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <Star className="w-4 h-4 text-purple-500" />
                                            Titre de la Promotion
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Ex: Offre Spéciale Été"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <Target className="w-4 h-4 text-purple-500" />
                                            Sous-titre
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subtitle}
                                            onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Ex: Jusqu'à -50% sur tous les produits"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-purple-500" />
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        rows="3"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Décrivez votre promotion en détail..."
                                    />
                                </div>

                                {/* Image Upload Section */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-purple-500" />
                                        Image de Fond
                                    </label>
                                    
                                    {backgroundImagePreview ? (
                                        <div className="relative">
                                            <img 
                                                src={backgroundImagePreview} 
                                                alt="Image de fond"
                                                className="w-full h-48 object-cover rounded-2xl border-2 border-gray-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeBackgroundImage}
                                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
                                            <div className="text-center">
                                                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-500 font-medium">Aucune image sélectionnée</p>
                                                <p className="text-xs text-gray-400">Cliquez pour télécharger</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBackgroundImageUpload}
                                        className="mt-4 w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                        disabled={uploadingImage}
                                    />
                                    {uploadingImage && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-purple-600">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                                            Téléchargement en cours...
                                        </div>
                                    )}
                                </div>

                                {/* Product and Discount */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <Package className="w-4 h-4 text-purple-500" />
                                            Produit Associé
                                        </label>
                                        <select
                                            value={formData.product_id}
                                            onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                        >
                                            <option value="">Sélectionnez un produit (optionnel)</option>
                                            {products.map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <Percent className="w-4 h-4 text-purple-500" />
                                            Remise (%)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.discount}
                                            onChange={(e) => setFormData({...formData, discount: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Ex: 25"
                                        />
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-200">
                                    <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all duration-200 font-semibold"
                                    >
                                            Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Enregistrement...
                                                </div>
                                            ) : (
                                                editingPromotion ? 'Mettre à jour' : 'Créer la Promotion'
                                            )}
                                    </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromotionsManagement;

