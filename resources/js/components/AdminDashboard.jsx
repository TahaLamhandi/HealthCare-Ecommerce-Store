import React, { useState, useEffect } from 'react';
import { 
    Home, 
    Package, 
    FolderOpen, 
    Target, 
    Image, 
    Film, 
    LogOut, 
    BarChart3, 
    TrendingUp, 
    Users, 
    ShoppingCart,
    Star,
    Eye,
    Edit3,
    Trash2,
    Plus,
    Search,
    Filter,
    Calendar,
    DollarSign,
    Crown,
    Phone,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import ProductsManagement from './admin/ProductsManagement';
import CategoriesManagement from './admin/CategoriesManagement';
import PromotionsManagement from './admin/PromotionsManagement';
import BannersManagement from './admin/BannersManagement';
import SlidesManagement from './admin/SlidesManagement';
import UsersManagement from './admin/UsersManagement';

const AdminDashboard = ({ navigateTo }) => {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('home');
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        
        if (!token) {
            // No token, redirect to home
            navigateTo('home');
            return;
        }
        
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Échec de la récupération des données du tableau de bord');
            }

            const data = await response.json();
            setDashboardData(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigateTo('home');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">Erreur : {error}</div>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Mobile Menu Button - Fixed at top */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-green-700 transition-all duration-300"
            >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-green-600 via-green-700 to-green-800 z-50 transform transition-transform duration-300 ${
                mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0 lg:shadow-2xl'
            }`}>
                <div className="p-6 lg:p-8">
                    <div className="flex items-center justify-between">
                        <div className="text-center flex-1">
                            <h1 className="text-2xl lg:text-3xl font-bold text-white">BioEkleel</h1>
                            <p className="text-green-100 text-sm lg:text-base">Tableau de bord Admin</p>
                        </div>
                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="lg:hidden text-white hover:text-green-200 transition-all duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                
                <nav className="mt-6 lg:mt-8 px-4">
                    {[
                        { id: 'home', name: 'Tableau de bord', icon: Home },
                        { id: 'users', name: 'Utilisateurs', icon: Users },
                        { id: 'products', name: 'Produits', icon: Package },
                        { id: 'categories', name: 'Catégories', icon: FolderOpen },
                        { id: 'promotions', name: 'Promotions', icon: Target },
                        { id: 'banners', name: 'Bannières', icon: Image },
                        { id: 'slides', name: 'Diapositives', icon: Film },
                    ].map((tab) => {
                        const IconComponent = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center px-4 py-4 text-left rounded-xl mb-2 transition-all duration-200 ${
                                    activeTab === tab.id 
                                        ? 'bg-white text-green-700 shadow-lg transform scale-105' 
                                        : 'text-green-100 hover:bg-green-500 hover:text-white hover:transform hover:scale-105'
                                }`}
                            >
                                <IconComponent className="w-5 h-5 mr-4" />
                                <span className="font-medium">{tab.name}</span>
                            </button>
                        );
                    })}
                    
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-4 text-left rounded-xl mt-8 text-red-200 hover:bg-red-500 hover:text-white transition-all duration-200 hover:transform hover:scale-105"
                    >
                        <LogOut className="w-5 h-5 mr-4" />
                        <span className="font-medium">Déconnexion</span>
                    </button>
                </nav>
            </div>

            {/* Mobile Overlay - No background, just clickable area */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <div className="lg:ml-72 p-4 lg:p-8 bg-gray-50 min-h-screen">
                <div className="mt-16 lg:mt-0">
                {activeTab === 'home' && <HomeTab data={dashboardData} />}
                {activeTab === 'products' && <ProductsManagement />}
                {activeTab === 'categories' && <CategoriesManagement />}
                {activeTab === 'promotions' && <PromotionsManagement />}
                {activeTab === 'banners' && <BannersManagement />}
                {activeTab === 'slides' && <SlidesManagement />}
                {activeTab === 'users' && <UsersManagement />}
                </div>
            </div>
        </div>
    );
};

// Home Tab Component
const HomeTab = ({ data }) => {
    const [filters, setFilters] = useState({
        phone: '',
        status: '',
        minPrice: '',
        maxPrice: ''
    });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    const fetchOrders = async (page = 1) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams();
            
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });
            queryParams.append('page', page);

            const response = await fetch(`/api/admin/orders?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setOrders(result.data.data || []);
                setPagination({
                    current_page: result.data.current_page,
                    last_page: result.data.last_page,
                    per_page: result.data.per_page,
                    total: result.data.total
                });
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                // Refresh orders after status update
                fetchOrders(pagination.current_page);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [filters]);

    if (!data) return <div>Chargement...</div>;

    return (
        <div className="space-y-6 lg:space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl lg:text-4xl font-bold mb-2">Bon retour !</h1>
                        <p className="text-green-100 text-sm lg:text-lg">Voici ce qui se passe avec votre magasin aujourd'hui.</p>
                    </div>
                    <div className="hidden md:block">
                        <Crown className="w-16 h-16 lg:w-20 lg:h-20 text-white" />
                    </div>
                </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Produits Totaux</p>
                            <p className="text-2xl lg:text-3xl font-bold text-gray-900">{data.total_products}</p>
                            <p className="text-green-600 text-xs lg:text-sm font-medium flex items-center mt-1">
                                <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                                +12% par rapport au mois dernier
                            </p>
                        </div>
                        <div className="p-3 lg:p-4 rounded-2xl bg-blue-100">
                            <Package className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Catégories</p>
                            <p className="text-2xl lg:text-3xl font-bold text-gray-900">{data.total_categories}</p>
                            <p className="text-green-600 text-xs lg:text-sm font-medium flex items-center mt-1">
                                <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                                +3 nouvelles cette semaine
                            </p>
                        </div>
                        <div className="p-3 lg:p-4 rounded-2xl bg-green-100">
                            <FolderOpen className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Commandes Totales</p>
                            <p className="text-2xl lg:text-3xl font-bold text-gray-900">{data.total_orders}</p>
                            <p className="text-green-600 text-xs lg:text-sm font-medium flex items-center mt-1">
                                <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                                +8% par rapport à la semaine dernière
                            </p>
                        </div>
                        <div className="p-3 lg:p-4 rounded-2xl bg-yellow-100">
                            <ShoppingCart className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Promotions</p>
                            <p className="text-2xl lg:text-3xl font-bold text-gray-900">{data.total_promotions}</p>
                            <p className="text-green-600 text-xs lg:text-sm font-medium flex items-center mt-1">
                                <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                                Campagnes actives
                            </p>
                        </div>
                        <div className="p-3 lg:p-4 rounded-2xl bg-purple-100">
                            <Target className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Sales Overview - Beautiful Circle Stats */}
                <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between mb-4 lg:mb-6">
                        <h3 className="text-lg lg:text-xl font-bold text-gray-800">Aperçu des Ventes</h3>
                    </div>
                    <div className="h-48 lg:h-56 flex flex-row items-center justify-center space-x-4 lg:space-x-6">
                        {/* Circle Progress Chart */}
                        <div className="relative flex-shrink-0">
                            <svg className="w-24 h-24 lg:w-40 lg:h-40 transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="none"
                                    className="text-gray-200"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 40}`}
                                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - (data?.sales_data?.progress_percentage || 0) / 100)}`}
                                    className="text-green-500"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-lg lg:text-3xl font-bold text-gray-800">
                                        {data?.sales_data?.progress_percentage || 0}%
                                    </div>
                                    <div className="text-xs lg:text-sm text-gray-500 font-medium">Objectif</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Sales Stats */}
                        <div className="flex-1 grid grid-cols-3 gap-2 lg:grid-cols-1 lg:gap-3">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-2 lg:p-4 rounded-xl border border-green-100">
                                <div className="text-sm lg:text-xl font-bold text-gray-800">
                                    {data?.sales_data?.current_month_sales || 0}
                                </div>
                                <div className="text-xs lg:text-sm text-gray-600 font-medium">Commandes</div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-2 lg:p-4 rounded-xl border border-blue-100">
                                <div className={`text-sm lg:text-xl font-bold ${(data?.sales_data?.sales_growth || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {(data?.sales_data?.sales_growth || 0) >= 0 ? '+' : ''}{data?.sales_data?.sales_growth || 0}%
                                </div>
                                <div className="text-xs lg:text-sm text-gray-600 font-medium">Croissance</div>
                            </div>
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-2 lg:p-4 rounded-xl border border-purple-100">
                                <div className="text-sm lg:text-xl font-bold text-gray-800">
                                    {data?.sales_data?.current_month_revenue || 0} MAD
                    </div>
                                <div className="text-xs lg:text-sm text-gray-600 font-medium">Revenus</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Meilleures Ventes Produits */}
                <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-6">Meilleures Ventes Produits</h3>
                    <div className="space-y-3 lg:space-y-4">
                        {data.top_products?.slice(0, 5).map((product, index) => (
                            <div key={product.id} className="flex items-center justify-between p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                                        <Package className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm lg:text-base">{product.name}</p>
                                        <p className="text-xs lg:text-sm text-gray-500">{product.sales_count} ventes</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span className="text-sm font-medium">{product.rating}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Commandes Récentes Section */}
            <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-800">Commandes Récentes</h3>
                    <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                        <span className="text-xs lg:text-sm text-gray-500">Filtrer les commandes</span>
                    </div>
                </div>
                
                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 mb-6 lg:mb-8">
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Filtrer par téléphone..."
                            value={filters.phone}
                            onChange={(e) => setFilters({...filters, phone: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            className="w-full px-4 py-2 lg:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        >
                            <option value="">Tous les statuts</option>
                            <option value="pending">En attente</option>
                            <option value="completed">Terminé</option>
                            <option value="cancelled">Annulé</option>
                        </select>
                    </div>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="number"
                            placeholder="Prix min..."
                            value={filters.minPrice}
                            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                    </div>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="number"
                            placeholder="Prix max..."
                            value={filters.maxPrice}
                            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Commande</th>
                                <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                                <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                                <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Téléphone</th>
                                <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-3 lg:px-6 py-6 lg:py-8 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 lg:h-8 lg:w-8 border-b-2 border-green-600"></div>
                                            <span className="ml-3 text-gray-500 text-sm">Chargement des commandes...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-3 lg:px-6 py-6 lg:py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <ShoppingCart className="w-8 h-8 lg:w-12 lg:h-12 text-gray-300 mb-4" />
                                            <p className="text-sm">Aucune commande trouvée</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-green-600">#{order.id}</div>
                                        </td>
                                        <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 lg:mr-3">
                                                    <Users className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{order.user?.name || 'N/A'}</div>
                                                    <div className="text-xs text-gray-500">{order.user?.email || ''}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                            <span className="text-sm font-semibold text-gray-900">{order.total} MAD</span>
                                        </td>
                                        <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">{order.phone || 'N/A'}</span>
                                        </td>
                                        <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                                                {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                            </div>
                                        </td>
                                        <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                            <select
                                                value={order.status || 'pending'}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                <option value="pending">En attente</option>
                                                <option value="completed">Terminé</option>
                                                <option value="cancelled">Annulé</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="flex items-center justify-between mt-6 lg:mt-8">
                        <div className="text-sm text-gray-500">
                            Affichage de {((pagination.current_page - 1) * pagination.per_page) + 1} à {Math.min(pagination.current_page * pagination.per_page, pagination.total)} sur {pagination.total} résultats
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => fetchOrders(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Précédent
                            </button>
                            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => fetchOrders(page)}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                        page === pagination.current_page
                                            ? 'bg-green-600 text-white'
                                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => fetchOrders(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default AdminDashboard;
