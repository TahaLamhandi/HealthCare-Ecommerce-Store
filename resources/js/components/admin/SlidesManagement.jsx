import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Image as ImageIcon, Upload, X, Film, Calendar } from 'lucide-react';
import ConfirmationPopup from './ConfirmationPopup';

const SlidesManagement = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [slideToDelete, setSlideToDelete] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        image: '',
        alt: ''
    });

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/slides', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setSlides(data.data);
            } else {
                throw new Error('Échec de la récupération des diapositives');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = editingSlide 
                ? `/api/admin/slides/${editingSlide.id}`
                : '/api/admin/slides';
            
            const method = editingSlide ? 'PUT' : 'POST';

            // Only send fields that have values for partial editing
            const dataToSend = {};
            if (formData.image) dataToSend.image = formData.image;
            if (formData.alt) dataToSend.alt = formData.alt;

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
                    if (editingSlide) {
                        // Real-time update for existing slide
                        setSlides(prev => prev.map(slide => 
                            slide.id === editingSlide.id 
                                ? { ...slide, ...dataToSend }
                                : slide
                        ));
                    } else {
                        // Add new slide to the list
                        const newSlide = data.data || data;
                        setSlides(prev => [newSlide, ...prev]);
                    }
                } catch (jsonError) {
                    // If JSON parsing fails, refetch all slides
                    await fetchSlides();
                }
                
                setShowModal(false);
                setEditingSlide(null);
                resetForm();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la sauvegarde de la diapositive');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (slide) => {
        setEditingSlide(slide);
        setFormData({
            image: slide.image,
            alt: slide.alt
        });
        setImagePreview(slide.image);
        setShowModal(true);
    };

    const handleDeleteClick = (slide) => {
        setSlideToDelete(slide);
        setShowDeletePopup(true);
    };

    const handleDeleteConfirm = async () => {
        if (!slideToDelete) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/slides/${slideToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Real-time update - remove from list
                setSlides(prev => prev.filter(slide => slide.id !== slideToDelete.id));
                setShowDeletePopup(false);
                setSlideToDelete(null);
            } else {
                throw new Error('Échec de la suppression de la diapositive');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeletePopup(false);
        setSlideToDelete(null);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('type', 'slide');

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
                    setFormData(prev => ({ ...prev, image: data.url }));
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
        setFormData(prev => ({ ...prev, image: '' }));
        setImagePreview('');
    };

    const resetForm = () => {
        setFormData({
            image: '',
            alt: ''
        });
        setImagePreview('');
    };

    const openAddModal = () => {
        setEditingSlide(null);
        resetForm();
        setShowModal(true);
    };

    if (loading && slides.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                            <Film className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Gestion des Diapositives</h2>
                            <p className="text-gray-600 mt-1">Gérez les diapositives du carousel de votre magasin</p>
                            <p className="text-sm text-gray-500 mt-1">{slides.length} diapositive{slides.length !== 1 ? 's' : ''} disponible{slides.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5" />
                        Nouvelle Diapositive
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center gap-2">
                    <Film className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Slides Grid */}
            <div className="grid grid-cols-1 gap-4 lg:gap-6">
                {slides.map((slide) => (
                    <div key={slide.id} className="group bg-white rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                        <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 overflow-hidden">
                            <img 
                                src={slide.image} 
                                alt={slide.alt}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg truncate">{slide.alt}</h3>
                                <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg drop-shadow-md">Diapositive</p>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 bg-gray-50 rounded-lg p-2 sm:p-3">
                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                                    <span className="font-medium">Créé: {new Date(slide.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-2 sm:space-x-3 pt-3 sm:pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleEdit(slide)}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-1 sm:gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-xs sm:text-sm"
                                >
                                    <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">Modifier</span>
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(slide)}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-1 sm:gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-xs sm:text-sm"
                                >
                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">Supprimer</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {slides.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Film className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">Aucune diapositive trouvée</h3>
                    <p className="text-gray-400 mb-6">Les diapositives apparaîtront ici une fois créées</p>
                    <button
                        onClick={openAddModal}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5" />
                        Créer la Première Diapositive
                    </button>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-10 backdrop-blur-sm">
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-6 rounded-t-3xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                                        <Film className="w-6 h-6 text-gray-800" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">
                                        {editingSlide ? 'Modifier la Diapositive' : 'Nouvelle Diapositive'}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-800" />
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-purple-500" />
                                    Image de la Diapositive
                                </label>
                                
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Image de la diapositive"
                                            className="w-full h-48 object-cover rounded-2xl border-2 border-gray-300"
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
                                    onChange={handleImageUpload}
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

                            {/* Alt Text */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Film className="w-5 h-5 text-pink-500" />
                                    Texte Alt
                                </label>
                                <input
                                    type="text"
                                    value={formData.alt}
                                    onChange={(e) => setFormData({...formData, alt: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Entrez le texte alt pour l'image"
                                />
                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 -mx-8 -mb-8 rounded-b-3xl">
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50"
                                    >
                                        {loading ? 'Sauvegarde...' : (editingSlide ? 'Mettre à jour' : 'Créer')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation Popup */}
            <ConfirmationPopup
                isOpen={showDeletePopup}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Supprimer la diapositive"
                message={`Êtes-vous sûr de vouloir supprimer cette diapositive ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                type="danger"
            />
        </div>
    );
};

export default SlidesManagement;

