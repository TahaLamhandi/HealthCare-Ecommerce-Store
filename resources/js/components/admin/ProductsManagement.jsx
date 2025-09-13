import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Eye, Package, Star, Search, Filter, Upload, X, Image as ImageIcon, Camera } from 'lucide-react';
import ConfirmationPopup from './ConfirmationPopup';

const ProductsManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [additionalImagesPreview, setAdditionalImagesPreview] = useState([]);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        categorie_id: '',
        description: '',
        img: '',
        rating: 0,
        reviews: 0,
        isNew: false,
        discount: 0,
        long_description: '',
        composition: '',
        benefits: '',
        usage_instructions: '',
        target_conditions: '',
        medical_effects: '',
        features: '',
        quality_guarantees: '',
        packages: '',
        images: '',
        testimonials: '',
        brand: '',
        sku: '',
        stock_quantity: 0,
        in_stock: true,
        old_price: 0,
        savings_amount: 0,
        total_sold: 0,
        average_rating: 0,
        meta_title: '',
        meta_description: '',
        tags: ''
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

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
            } else {
                throw new Error('Échec de la récupération des produits');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
            }
        } catch (err) {
            console.error('Échec de la récupération des catégories:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = editingProduct 
                ? `/api/admin/products/${editingProduct.id}`
                : '/api/admin/products';
            
            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await fetchProducts();
                setShowModal(false);
                setEditingProduct(null);
                resetForm();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la sauvegarde du produit');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            price: product.price || '',
            categorie_id: product.categorie_id || '',
            description: product.description || '',
            img: product.img || '',
            rating: product.rating || 0,
            reviews: product.reviews || 0,
            isNew: product.isNew || false,
            discount: product.discount || 0,
            long_description: product.long_description || '',
            composition: product.composition || '',
            benefits: product.benefits || '',
            usage_instructions: product.usage_instructions || '',
            target_conditions: product.target_conditions || '',
            medical_effects: product.medical_effects || '',
            features: product.features || '',
            quality_guarantees: product.quality_guarantees || '',
            packages: product.packages || '',
            images: product.images || '',
            testimonials: product.testimonials || '',
            brand: product.brand || '',
            sku: product.sku || '',
            stock_quantity: product.stock_quantity || 0,
            in_stock: product.in_stock !== undefined ? product.in_stock : true,
            old_price: product.old_price || 0,
            savings_amount: product.savings_amount || 0,
            total_sold: product.total_sold || 0,
            average_rating: product.average_rating || 0,
            meta_title: product.meta_title || '',
            meta_description: product.meta_description || '',
            tags: product.tags || ''
        });
        
        // Set image previews
        setMainImagePreview(product.img || null);
        if (product.images) {
            try {
                const parsedImages = JSON.parse(product.images);
                setAdditionalImagesPreview(Array.isArray(parsedImages) ? parsedImages : []);
            } catch {
                setAdditionalImagesPreview([]);
            }
        } else {
            setAdditionalImagesPreview([]);
        }
        
        setShowModal(true);
    };

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowDeletePopup(true);
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/products/${productToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                await fetchProducts();
                setShowDeletePopup(false);
                setProductToDelete(null);
            } else {
                throw new Error('Échec de la suppression du produit');
            }
        } catch (err) {
            setError(err.message);
            setShowDeletePopup(false);
            setProductToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeletePopup(false);
        setProductToDelete(null);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            categorie_id: '',
            description: '',
            img: '',
            rating: 0,
            reviews: 0,
            isNew: false,
            discount: 0,
            long_description: '',
            composition: '',
            benefits: '',
            usage_instructions: '',
            target_conditions: '',
            medical_effects: '',
            features: '',
            quality_guarantees: '',
            packages: '',
            images: '',
            testimonials: '',
            brand: '',
            sku: '',
            stock_quantity: 0,
            in_stock: true,
            old_price: 0,
            savings_amount: 0,
            total_sold: 0,
            average_rating: 0,
            meta_title: '',
            meta_description: '',
            tags: ''
        });
        setMainImagePreview(null);
        setAdditionalImagesPreview([]);
    };

    const handleMainImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);
            uploadFormData.append('type', 'main');

            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: uploadFormData,
            });

            const result = await response.json();
            
            if (result.success) {
                setFormData(prev => ({ ...prev, img: result.url }));
                setMainImagePreview(result.url);
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            setError('Erreur lors du téléchargement de l\'image: ' + err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleAdditionalImagesUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        setUploadingImages(true);
        try {
            const uploadFormData = new FormData();
            files.forEach(file => {
                uploadFormData.append('images[]', file);
            });

            const response = await fetch('/api/upload/images', {
                method: 'POST',
                body: uploadFormData,
            });

            const result = await response.json();
            
            if (result.success) {
                const imageUrls = result.images.map(img => img.url);
                const currentImages = formData.images ? JSON.parse(formData.images) : [];
                const newImages = [...currentImages, ...imageUrls];
                
                setFormData(prev => ({ ...prev, images: JSON.stringify(newImages) }));
                setAdditionalImagesPreview(prev => [...prev, ...imageUrls]);
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            setError('Erreur lors du téléchargement des images: ' + err.message);
        } finally {
            setUploadingImages(false);
        }
    };

    const removeMainImage = () => {
        setFormData(prev => ({ ...prev, img: '' }));
        setMainImagePreview(null);
    };

    const removeAdditionalImage = (index) => {
        const currentImages = formData.images ? JSON.parse(formData.images) : [];
        const newImages = currentImages.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images: JSON.stringify(newImages) }));
        setAdditionalImagesPreview(prev => prev.filter((_, i) => i !== index));
    };

    const openAddModal = () => {
        setEditingProduct(null);
        resetForm();
        setShowModal(true);
    };

    if (loading && products.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Gestion des Produits</h2>
                    <p className="text-gray-600 mt-1">Gérez les produits et l\'inventaire de votre magasin</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" />
Ajouter un Produit
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    {error}
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg lg:rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="relative">
                            <img 
                                src={product.img} 
                                alt={product.name}
                                className="w-full h-32 lg:h-40 object-cover"
                            />
                            {product.isNew && (
                                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
Nouveau
                                </div>
                            )}
                            {product.discount > 0 && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                    -{product.discount}%
                                </div>
                            )}
                        </div>
                        <div className="p-3 lg:p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-sm lg:text-base font-semibold text-gray-800 truncate flex-1 mr-2">{product.name}</h3>
                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        <Edit3 className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(product)}
                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="space-y-2 mb-3">
                                <div className="flex items-center space-x-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {product.category?.title || 'N/A'}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-1">
                                        <span className="text-sm lg:text-base font-bold text-gray-900">${product.price}</span>
                                        {product.old_price > 0 && (
                                            <span className="text-xs text-gray-500 line-through">${product.old_price}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                                        <span className="text-xs lg:text-sm font-medium text-gray-900">{product.rating}</span>
                                        <span className="text-xs text-gray-500">({product.reviews})</span>
                                    </div>
                                </div>
                                
                                <p className="text-xs lg:text-sm text-gray-600 line-clamp-2">{product.description}</p>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span className="truncate">SKU: {product.sku || 'N/A'}</span>
                                <span>Stock: {product.stock_quantity || 0}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-10">
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                            {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
                                </h3>
                                        <p className="text-sm text-gray-500">
                                            {editingProduct ? 'Modifiez les informations du produit' : 'Remplissez les informations pour créer un nouveau produit'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <div className="p-8">
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="space-y-6">
                                    <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Informations de Base</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du Produit *</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                                placeholder="Entrez le nom du produit"
                                                required={!editingProduct}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Marque</label>
                                            <input
                                                type="text"
                                                value={formData.brand}
                                                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                                placeholder="Entrez le nom de la marque"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">SKU</label>
                                            <input
                                                type="text"
                                                value={formData.sku}
                                                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                                placeholder="Enter SKU"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie *</label>
                                            <select
                                                value={formData.categorie_id}
                                                onChange={(e) => setFormData({...formData, categorie_id: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                                required={!editingProduct}
                                            >
                                                <option value="">Sélectionnez une catégorie</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description Courte *</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            rows="3"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                            placeholder="Entrez une description courte"
                                            required={!editingProduct}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description Longue</label>
                                        <textarea
                                            value={formData.long_description}
                                            onChange={(e) => setFormData({...formData, long_description: e.target.value})}
                                            rows="4"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                            placeholder="Entrez une description détaillée"
                                        />
                                    </div>
                                </div>

                                {/* Pricing & Inventory */}
                                <div className="space-y-6">
                                    <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Prix et Inventaire</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Prix ($) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                                placeholder="0.00"
                                                required={!editingProduct}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Ancien Prix ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.old_price}
                                                onChange={(e) => setFormData({...formData, old_price: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Remise (%)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={formData.discount}
                                                onChange={(e) => setFormData({...formData, discount: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantité en Stock</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.stock_quantity}
                                                onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                                placeholder="0"
                                            />
                                        </div>

                                        <div className="flex items-center space-x-3 mt-8">
                                            <input
                                                type="checkbox"
                                                id="in_stock"
                                                checked={formData.in_stock}
                                                onChange={(e) => setFormData({...formData, in_stock: e.target.checked})}
                                                className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="in_stock" className="text-sm font-semibold text-gray-700">
En Stock
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Images & Media */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 pb-4 border-b-2 border-gradient-to-r from-green-500 to-blue-500">
                                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                                            <ImageIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-800">Images et Médias</h4>
                                            <p className="text-sm text-gray-500">Téléchargez les images de votre produit</p>
                                        </div>
                                    </div>
                                    
                                    {/* Main Image Upload */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Camera className="w-4 h-4 text-green-600" />
                                            </div>
                                            <label className="text-lg font-semibold text-gray-800">Image Principale *</label>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Obligatoire</span>
                                        </div>
                                        
                                        {mainImagePreview ? (
                                            <div className="relative group">
                                                <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300">
                                                    {/* Beautiful Gray Card with Image Icon */}
                                                    <div className="w-full h-80 flex items-center justify-center">
                                                        <div className="text-center">
                                                            <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                                                                <ImageIcon className="w-10 h-10 text-gray-500" />
                                                            </div>
                                                            <p className="text-lg font-semibold text-gray-600 mb-2">Image Principale</p>
                                                            <p className="text-sm text-gray-500">Image téléchargée avec succès</p>
                                                            <div className="mt-3 flex items-center justify-center gap-2">
                                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                                <span className="text-xs text-green-600 font-medium">Prête à utiliser</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={removeMainImage}
                                                    className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                                <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 px-3 py-1 rounded-full shadow-sm">
                                                    <span className="text-xs font-medium text-gray-700">Image Principale</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-green-400 hover:bg-green-50 transition-all duration-300 group">
                                        <input
                                                    type="file"
                                                    id="mainImage"
                                                    accept="image/*"
                                                    onChange={handleMainImageUpload}
                                                    className="hidden"
                                                    disabled={uploadingImage}
                                                />
                                                <label 
                                                    htmlFor="mainImage" 
                                                    className="cursor-pointer flex flex-col items-center space-y-4"
                                                >
                                                    {uploadingImage ? (
                                                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                            <Camera className="w-8 h-8 text-white" />
                                                        </div>
                                                    )}
                                                    <div className="space-y-2">
                                                        <p className="text-lg font-semibold text-gray-700">
                                                            {uploadingImage ? 'Téléchargement en cours...' : 'Cliquez pour télécharger l\'image principale'}
                                                        </p>
                                                        <p className="text-sm text-gray-500">PNG, JPG, WEBP jusqu'à 2MB</p>
                                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                            <span>Recommandé: 800x800px</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        )}
                                    </div>

                                    {/* Additional Images Upload */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Upload className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <label className="text-lg font-semibold text-gray-800">Images Supplémentaires</label>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Optionnel</span>
                                        </div>
                                        
                                        {/* Upload Area */}
                                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group">
                                            <input
                                                type="file"
                                                id="additionalImages"
                                                accept="image/*"
                                                multiple
                                                onChange={handleAdditionalImagesUpload}
                                                className="hidden"
                                                disabled={uploadingImages}
                                            />
                                            <label 
                                                htmlFor="additionalImages" 
                                                className="cursor-pointer flex flex-col items-center space-y-3"
                                            >
                                                {uploadingImages ? (
                                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                                                ) : (
                                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                        <Upload className="w-6 h-6 text-white" />
                                                    </div>
                                                )}
                                                <div className="space-y-1">
                                                    <p className="text-base font-semibold text-gray-700">
                                                        {uploadingImages ? 'Téléchargement en cours...' : 'Télécharger plusieurs images'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">Jusqu'à 10 images, 2MB chacune</p>
                                                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                        <span>Glissez-déposez ou cliquez pour sélectionner</span>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>

                                        {/* Image Previews */}
                                        {(additionalImagesPreview.length > 0 || uploadingImages) && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="text-sm font-semibold text-gray-700">
                                                        Images téléchargées ({additionalImagesPreview.length})
                                                        {uploadingImages && <span className="text-blue-500 ml-2">(Téléchargement...)</span>}
                                                    </h5>
                                                    <div className="text-xs text-gray-500">
                                                        Cliquez sur ✕ pour supprimer
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                    {/* Loading Card */}
                                                    {uploadingImages && (
                                                        <div className="relative group">
                                                            <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 shadow-md bg-gray-50 h-32 flex items-center justify-center">
                                                                <div className="text-center">
                                                                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto mb-2"></div>
                                                                    <p className="text-xs text-gray-500 font-medium">Téléchargement...</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {additionalImagesPreview.map((image, index) => (
                                                        <div key={index} className="relative group">
                                                            <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200">
                                                                {/* Beautiful Gray Card with Image Icon */}
                                                                <div className="w-full h-32 flex items-center justify-center">
                                                                    <div className="text-center">
                                                                        <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-inner">
                                                                            <ImageIcon className="w-6 h-6 text-gray-500" />
                                                                        </div>
                                                                        <p className="text-xs font-semibold text-gray-600">Image #{index + 1}</p>
                                                                        <div className="mt-1 flex items-center justify-center gap-1">
                                                                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                                                            <span className="text-xs text-green-600 font-medium">Prête</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeAdditionalImage(index)}
                                                                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                            <div className="absolute bottom-1 left-1 bg-white bg-opacity-95 px-2 py-1 rounded text-xs font-medium text-gray-700 shadow-sm">
                                                                #{index + 1}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="space-y-6">
                                    <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Détails du Produit</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Composition</label>
                                            <textarea
                                                value={formData.composition}
                                                onChange={(e) => setFormData({...formData, composition: e.target.value})}
                                                rows="3"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                                placeholder="Entrez la composition du produit"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Benefits</label>
                                            <textarea
                                                value={formData.benefits}
                                                onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                                                rows="3"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                                placeholder="Entrez les bénéfices du produit"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Instructions d\'Utilisation</label>
                                        <textarea
                                            value={formData.usage_instructions}
                                            onChange={(e) => setFormData({...formData, usage_instructions: e.target.value})}
                                            rows="3"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                            placeholder="Entrez les instructions d\'utilisation"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Conditions Ciblées</label>
                                        <input
                                            type="text"
                                            value={formData.target_conditions}
                                            onChange={(e) => setFormData({...formData, target_conditions: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                            placeholder="Entrez les conditions ciblées"
                                        />
                                    </div>
                                </div>

                                {/* Ratings & Reviews */}
                                <div className="space-y-6">
                                    <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Notes et Avis</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Note</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="5"
                                                value={formData.rating}
                                                onChange={(e) => setFormData({...formData, rating: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                                placeholder="4.5"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre d\'Avis</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.reviews}
                                                onChange={(e) => setFormData({...formData, reviews: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                                placeholder="0"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Total Vendu</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.total_sold}
                                                onChange={(e) => setFormData({...formData, total_sold: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Product Status */}
                                <div className="space-y-6">
                                    <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Statut du Produit</h4>
                                    
                                    <div className="flex items-center space-x-6">
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                id="isNew"
                                                checked={formData.isNew}
                                                onChange={(e) => setFormData({...formData, isNew: e.target.checked})}
                                                className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="isNew" className="text-sm font-semibold text-gray-700">
Marquer comme nouveau produit
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 -mx-8 -mb-8 rounded-b-3xl">
                                    <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                            className="px-8 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 flex items-center gap-2"
                                    >
                                            <X className="w-4 h-4" />
                                            Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                            className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Sauvegarde...
                                            </>
                                        ) : (
                                            <>
                                                <Package className="w-4 h-4" />
                                                    {editingProduct ? 'Mettre à jour le Produit' : 'Créer le Produit'}
                                            </>
                                        )}
                                    </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Popup */}
            <ConfirmationPopup
                isOpen={showDeletePopup}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Supprimer le produit"
                message={`Êtes-vous sûr de vouloir supprimer le produit "${productToDelete?.name}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                type="danger"
            />
        </div>
    );
};

export default ProductsManagement;
