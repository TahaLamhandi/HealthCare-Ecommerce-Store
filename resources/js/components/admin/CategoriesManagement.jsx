import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Tag, Calendar, FileText, X } from 'lucide-react';

const CategoriesManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/categories', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCategories(data.data);
            } else {
                throw new Error('Échec de la récupération des catégories');
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
            const url = editingCategory 
                ? `/api/admin/categories/${editingCategory.id}`
                : '/api/admin/categories';
            
            const method = editingCategory ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await fetchCategories();
                setShowModal(false);
                setEditingCategory(null);
                resetForm();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la sauvegarde de la catégorie');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            title: category.title,
            description: category.description
        });
        setShowModal(true);
    };

    const handleDelete = async (categoryId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/categories/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                await fetchCategories();
            } else {
                throw new Error('Échec de la suppression de la catégorie');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: ''
        });
    };

    const openAddModal = () => {
        setEditingCategory(null);
        resetForm();
        setShowModal(true);
    };

    if (loading && categories.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 border border-green-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Tag className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Gestion des Catégories</h2>
                            <p className="text-gray-600 text-lg">Organisez vos produits par catégories</p>
                        </div>
                    </div>
                <button
                    onClick={openAddModal}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3"
                >
                        <Plus className="w-6 h-6" />
                        Ajouter une Catégorie
                </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-sm">
                    <div className="flex items-center">
                        <div className="w-5 h-5 bg-red-400 rounded-full mr-3"></div>
                    {error}
                    </div>
                </div>
            )}

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                    <div key={category.id} className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100 h-80 flex flex-col">
                        {/* Beautiful Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${
                            index % 4 === 0 ? 'from-emerald-50 via-green-50 to-teal-50' :
                            index % 4 === 1 ? 'from-blue-50 via-cyan-50 to-sky-50' :
                            index % 4 === 2 ? 'from-purple-50 via-pink-50 to-rose-50' :
                            'from-orange-50 via-amber-50 to-yellow-50'
                        } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                        
                        {/* Animated Border */}
                        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${
                            index % 4 === 0 ? 'from-emerald-400 to-green-400' :
                            index % 4 === 1 ? 'from-blue-400 to-cyan-400' :
                            index % 4 === 2 ? 'from-purple-400 to-pink-400' :
                            'from-orange-400 to-amber-400'
                        } opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                        
                        {/* Card Content */}
                        <div className="relative p-6 flex flex-col h-full z-10">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${
                                        index % 4 === 0 ? 'from-emerald-500 to-green-600' :
                                        index % 4 === 1 ? 'from-blue-500 to-cyan-600' :
                                        index % 4 === 2 ? 'from-purple-500 to-pink-600' :
                                        'from-orange-500 to-amber-600'
                                    } rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}>
                                        <Tag className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-gray-900 transition-colors duration-500 leading-tight">
                                        {category.title}
                                    </h3>
                                </div>
                                
                                {/* Smaller Action Buttons */}
                                <div className="flex space-x-1.5">
                                <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(category);
                                        }}
                                        className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 z-20"
                                        title="Modifier"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(category.id);
                                        }}
                                        className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 z-20"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                            {/* Description - Fixed to 3 lines */}
                            <div className="mb-4 flex-1 min-h-0">
                                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed group-hover:text-gray-700 transition-colors duration-500">
                                    {category.description}
                                </p>
                            </div>

                            {/* Beautiful Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                <div className="flex items-center text-gray-500 text-xs group-hover:text-gray-600 transition-colors duration-500">
                                    <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center mr-2 group-hover:bg-gray-200 transition-colors duration-300">
                                        <Calendar className="w-3 h-3" />
                                    </div>
                                    <span className="font-medium">{new Date(category.created_at).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                        index % 4 === 0 ? 'bg-emerald-400' :
                                        index % 4 === 1 ? 'bg-blue-400' :
                                        index % 4 === 2 ? 'bg-purple-400' :
                                        'bg-orange-400'
                                    } group-hover:scale-125 transition-transform duration-300`}></div>
                                    <span className="text-xs text-gray-400 font-medium">Active</span>
                                </div>
                        </div>
                        </div>

                        {/* Enhanced Hover Effect Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${
                            index % 4 === 0 ? 'from-emerald-500/5 to-green-500/5' :
                            index % 4 === 1 ? 'from-blue-500/5 to-cyan-500/5' :
                            index % 4 === 2 ? 'from-purple-500/5 to-pink-500/5' :
                            'from-orange-500/5 to-amber-500/5'
                        } opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none`}></div>
                        
                        {/* Subtle Pattern Overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" style={{
                            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                                            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                                            radial-gradient(circle at 40% 40%, rgba(120, 255, 198, 0.3) 0%, transparent 50%)`,
                        }}></div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Tag className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-600 mb-4">Aucune catégorie trouvée</h3>
                    <p className="text-gray-500 mb-8 text-lg">Commencez par créer votre première catégorie</p>
                    <button
                        onClick={openAddModal}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3 mx-auto"
                    >
                        <Plus className="w-6 h-6" />
                        Ajouter la Première Catégorie
                    </button>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-10">
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                                        <Tag className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {editingCategory ? 'Modifier la Catégorie' : 'Ajouter une Nouvelle Catégorie'}
                            </h3>
                                        <p className="text-sm text-gray-500">
                                            {editingCategory ? 'Modifiez les informations de la catégorie' : 'Créez une nouvelle catégorie pour organiser vos produits'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl flex items-center justify-center transition-all duration-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Titre de la Catégorie
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 text-lg"
                                        placeholder="Entrez le nom de la catégorie"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        rows="4"
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 resize-none"
                                        placeholder="Décrivez cette catégorie..."
                                        required
                                    />
                                </div>
                                </div>

                            {/* Footer */}
                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    className="px-8 py-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                    Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sauvegarde...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            {editingCategory ? 'Mettre à jour' : 'Créer la Catégorie'}
                                        </>
                                    )}
                                    </button>
                                </div>
                            </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesManagement;

