import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Image as ImageIcon, Upload, X, Target, Calendar } from 'lucide-react';
import ConfirmationPopup from './ConfirmationPopup';

const BannersManagement = () => {
    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        backgroundImage: '',
        product_id: '',
        discount: 0
    });

    useEffect(() => {
        fetchBanners();
        fetchProducts();
    }, []);

    const fetchBanners = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/banners', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setBanners(data.data);
            } else {
                throw new Error('Échec de la récupération des bannières');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data.data || data);
            }
        } catch (err) {
            // Silent error handling for production
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = editingBanner 
                ? `/api/admin/banners/${editingBanner.id}`
                : '/api/admin/banners';
            
            const method = editingBanner ? 'PUT' : 'POST';

            // Only send fields that have values for partial editing
            const dataToSend = {};
            if (formData.backgroundImage) dataToSend.backgroundImage = formData.backgroundImage;
            if (formData.product_id) dataToSend.product_id = formData.product_id;
            if (formData.discount !== undefined) dataToSend.discount = formData.discount;

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
                    const data = await response.json();
                    if (editingBanner) {
                        // Real-time update for existing banner
                        setBanners(prev => prev.map(banner => 
                            banner.id === editingBanner.id 
                                ? { ...banner, ...dataToSend }
                                : banner
                        ));
                    } else {
                        // Add new banner to the list
                        const newBanner = data.data || data;
                        setBanners(prev => [newBanner, ...prev]);
                    }
                } catch (jsonError) {
                    // If JSON parsing fails, refetch all banners
                await fetchBanners();
                }
                
                setShowModal(false);
                setEditingBanner(null);
                resetForm();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la sauvegarde de la bannière');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner);
        setFormData({
            backgroundImage: banner.backgroundImage,
            product_id: banner.product_id,
            discount: banner.discount
        });
        setImagePreview(banner.backgroundImage);
        setShowModal(true);
    };

    const handleDeleteClick = (banner) => {
        setBannerToDelete(banner);
        setShowDeletePopup(true);
    };

    const handleDeleteConfirm = async () => {
        if (!bannerToDelete) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/banners/${bannerToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Real-time update - remove from list
                setBanners(prev => prev.filter(banner => banner.id !== bannerToDelete.id));
                setShowDeletePopup(false);
                setBannerToDelete(null);
            } else {
                throw new Error('Échec de la suppression de la bannière');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeletePopup(false);
        setBannerToDelete(null);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('type', 'banner');

            const response = await fetch('/api/upload/image', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData,
            });

            if (response.ok) {
                const responseText = await response.text();
                
                try {
                    const data = JSON.parse(responseText);
                    setFormData(prev => ({ ...prev, backgroundImage: data.url }));
                    setImagePreview(data.url);
                } catch (parseError) {
                    throw new Error('Réponse invalide du serveur');
                }
            } else {
                const errorText = await response.text();
                
                if (response.status === 401) {
                    throw new Error('Session expirée. Veuillez vous reconnecter.');
                } else if (response.status === 422) {
                    try {
                        const errorData = JSON.parse(errorText);
                        throw new Error(errorData.message || 'Données invalides');
                    } catch {
                        throw new Error('Données invalides');
                    }
                } else {
                    throw new Error('Échec du téléchargement de l\'image');
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, backgroundImage: '' }));
        setImagePreview('');
    };

    const resetForm = () => {
        setFormData({
            backgroundImage: '',
            product_id: '',
            discount: 0
        });
        setImagePreview('');
    };

    const openAddModal = () => {
        setEditingBanner(null);
        resetForm();
        setShowModal(true);
    };

    if (loading && banners.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Gestion des Bannières</h2>
                            <p className="text-gray-600 mt-1">Gérez les bannières promotionnelles de votre magasin</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                                <span className="bg-white px-3 py-1 rounded-full shadow-sm">
                                    {banners.length} bannière{banners.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                <button
                    onClick={openAddModal}
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Nouvelle Bannière</span>
                </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                        <p className="text-red-800 font-medium">Erreur</p>
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                    <button
                        onClick={() => setError(null)}
                        className="ml-auto text-red-400 hover:text-red-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Banners Grid */}
            {banners.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune bannière</h3>
                    <p className="text-gray-500 mb-6">Commencez par créer votre première bannière promotionnelle</p>
                    <button
                        onClick={openAddModal}
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
                    >
                        <Plus className="w-5 h-5" />
                        Créer une bannière
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 lg:gap-6">
                {banners.map((banner) => (
                        <div
                            key={banner.id}
                            className="bg-white rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden group transition-all duration-300"
                        >
                        <div className="relative">
                            <img 
                                src={banner.backgroundImage} 
                                    alt="Bannière"
                                    className="w-full h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                
                                {/* Discount Badge */}
                                {banner.discount > 0 && (
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                -{banner.discount}%
                                        </span>
                            </div>
                                )}

                                {/* Action Buttons */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(banner)}
                                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                                        title="Modifier"
                                    >
                                        <Edit3 className="w-4 h-4 text-gray-700" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(banner)}
                                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 lg:p-8 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                                        Bannière #{banner.id}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {new Date(banner.created_at).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-sm text-gray-600 mb-1">Produit</p>
                                        <p className="font-semibold text-gray-800">
                                            {banner.product_id ? 
                                                (products.find(p => p.id == banner.product_id)?.name || `ID: ${banner.product_id}`) 
                                                : 'N/A'
                                            }
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-sm text-gray-600 mb-1">Remise</p>
                                        <p className="font-semibold text-gray-800">{banner.discount}%</p>
                            </div>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <Target className="w-5 h-5 text-gray-800" />
                                    </div>
                                    <h2 className="text-xl font-bold">
                                        {editingBanner ? 'Modifier la bannière' : 'Nouvelle bannière'}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-800" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                            {/* Image Upload Section */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Image de Fond
                                </label>
                                
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors">
                                        <div className="space-y-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                                <ImageIcon className="w-8 h-8 text-gray-400" />
                                            </div>
                                <div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Cliquez pour télécharger une image
                                                </p>
                                    <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    id="image-upload"
                                                    disabled={uploadingImage}
                                                />
                                                <label
                                                    htmlFor="image-upload"
                                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                        uploadingImage
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer'
                                                    }`}
                                                >
                                                    {uploadingImage ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                                            Téléchargement...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="w-4 h-4" />
                                                            Choisir une image
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                </div>

                            {/* Product Selection */}
                                <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Produit
                                </label>
                                <select
                                    value={formData.product_id}
                                    onChange={(e) => setFormData(prev => ({ ...prev, product_id: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Sélectionner un produit</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                                </div>

                            {/* Discount */}
                                <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Remise (%)
                                </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.discount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="Entrez le pourcentage de remise"
                                    />
                                </div>
                        </form>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                Annuler
                                    </button>
                                    <button
                                        type="submit"
                                onClick={handleSubmit}
                                        disabled={loading}
                                className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                {loading ? 'Sauvegarde...' : (editingBanner ? 'Modifier' : 'Créer')}
                                    </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Popup */}
            <ConfirmationPopup
                isOpen={showDeletePopup}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Supprimer la bannière"
                message="Êtes-vous sûr de vouloir supprimer cette bannière ? Cette action est irréversible."
                confirmText="Supprimer"
                cancelText="Annuler"
                type="danger"
            />
        </div>
    );
};

export default BannersManagement;