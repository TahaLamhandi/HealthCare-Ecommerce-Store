import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, Calendar, Trash2, UserCheck, User, Shield } from 'lucide-react';
import ConfirmationPopup from './ConfirmationPopup';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Filter out admin accounts
                const regularUsers = data.data.filter(user => !user.is_admin);
                setUsers(regularUsers);
            } else {
                throw new Error('Échec de la récupération des utilisateurs');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeletePopup(true);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/users/${userToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                await fetchUsers();
                setShowDeletePopup(false);
                setUserToDelete(null);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la suppression de l\'utilisateur');
            }
        } catch (err) {
            setError(err.message);
            setShowDeletePopup(false);
            setUserToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeletePopup(false);
        setUserToDelete(null);
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Gestion des Utilisateurs</h2>
                            <p className="text-gray-600 mt-1">Gérez les comptes utilisateurs et leurs informations</p>
                        </div>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-lg">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-lg font-semibold text-gray-800">{users.length} Utilisateurs</span>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <Shield className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                {users.map((user, index) => {
                    const colorThemes = [
                        'from-blue-500 to-cyan-500',
                        'from-blue-600 to-indigo-600',
                        'from-cyan-500 to-blue-500',
                        'from-indigo-500 to-blue-500',
                        'from-sky-500 to-blue-500',
                        'from-blue-500 to-purple-500'
                    ];
                    const theme = colorThemes[index % colorThemes.length];
                    
                    return (
                        <div key={user.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                            {/* Card Header with Gradient */}
                            <div className={`h-28 bg-gradient-to-r ${theme} relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-blue-900 bg-opacity-10"></div>
                                <div className="relative p-6 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <User className="w-8 h-8 text-white" />
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-xl font-bold text-white truncate">{user.name}</h3>
                                            <p className="text-white text-opacity-80 text-sm">ID: #{user.id}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteClick(user)}
                                        className="w-12 h-12 bg-white bg-opacity-90 rounded-2xl flex items-center justify-center hover:bg-opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-500" />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Card Content */}
                            <div className="p-6 space-y-5">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <Mail className="w-5 h-5 text-blue-500" />
                                        <span className="text-sm text-gray-700 truncate flex-1">{user.email}</span>
                                    </div>
                                    
                                    {user.phone && (
                                        <div className="flex items-center space-x-4">
                                            <Phone className="w-5 h-5 text-blue-500" />
                                            <span className="text-sm text-gray-700">{user.phone}</span>
                                        </div>
                                    )}
                                    
                                    {user.address && (
                                        <div className="flex items-center space-x-4">
                                            <MapPin className="w-5 h-5 text-blue-500" />
                                            <span className="text-sm text-gray-700 truncate flex-1">{user.address}</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center space-x-4">
                                        <Calendar className="w-5 h-5 text-blue-500" />
                                        <span className="text-sm text-gray-600">
                                            Inscrit: {new Date(user.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Status Badge */}
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Statut</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span className="text-sm font-medium text-blue-600">Actif</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {users.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Users className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">Aucun utilisateur trouvé</h3>
                    <p className="text-gray-400">Les utilisateurs apparaîtront ici une fois inscrits</p>
                </div>
            )}

            {/* Confirmation Popup */}
            <ConfirmationPopup
                isOpen={showDeletePopup}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Supprimer l'utilisateur"
                message={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userToDelete?.name}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                type="danger"
            />
        </div>
    );
};

export default UsersManagement;
