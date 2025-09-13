import './bootstrap';
import '../css/app.css';

import React, { useState, useEffect, useContext } from 'react';
import { AppProvider, AppContext } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { CartProvider } from './contexts/CartContext';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './pages/HomePage.jsx';
import AllCategories from './pages/AllCategories.jsx';
import PromotionsPage from './pages/PromotionsPage.jsx';
import BestSellersPage from './pages/BestSellersPage.jsx';
import AllProducts from './pages/AllProducts.jsx';
import CategoryProducts from './pages/CategoryProducts.jsx';
import ProductPage from './pages/ProductPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import CartPage from './pages/CartPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import Header from './components/layouts/Header.jsx';
import Footer from './components/layouts/Footer.jsx';
import LoadingScreen from './components/ui/LoadingScreen.jsx';

// Main App Component with Navigation
function AppContent() {
    const [currentPage, setCurrentPage] = useState('home');
    const [pageData, setPageData] = useState({});
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { loading } = useContext(AppContext);

    useEffect(() => {
        const initialPageData = window.pageData || { page: 'home' };
        setCurrentPage(initialPageData.page);
        setPageData(initialPageData);
    }, []);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navigateTo = (page, data = {}) => {
        setCurrentPage(page);
        setPageData(data);
        window.scrollTo({ top: 0, behavior: 'instant' });
        setIsMobileMenuOpen(false);
    };

    const pageVariants = {
        initial: { opacity: 0, x: 300 },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: -300 }
    };

    const pageTransition = {
        type: 'tween',
        ease: 'anticipate',
        duration: 0.6
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'categories':
                return <AllCategories navigateTo={navigateTo} />;
            case 'products':
            case 'produits':
                return <AllProducts navigateTo={navigateTo} categoryId={pageData.categoryId} />;
            case 'category-products':
                return <CategoryProducts navigateTo={navigateTo} categoryId={pageData.categoryId} categoryName={pageData.categoryName} />;
            case 'product':
                return <ProductPage navigateTo={navigateTo} productId={pageData.productId} />;
            case 'promotions':
                return <PromotionsPage navigateTo={navigateTo} />;
            case 'auth':
                return <AuthPage navigateTo={navigateTo} />;
            case 'cart':
                return <CartPage navigateTo={navigateTo} />;
            case 'favorites':
                return <FavoritesPage navigateTo={navigateTo} />;
            case 'best-sellers':
                return <BestSellersPage navigateTo={navigateTo} />;
            case 'admin-dashboard':
                return <AdminDashboard navigateTo={navigateTo} />;
            default:
                return <HomePage navigateTo={navigateTo} />;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <LoadingScreen isLoading={loading} />
            
            {!loading && (
                <>
                    {currentPage !== 'auth' && currentPage !== 'admin-dashboard' && (
                        <Header
                            isScrolled={isScrolled}
                            isMobileMenuOpen={isMobileMenuOpen}
                            setIsMobileMenuOpen={setIsMobileMenuOpen}
                            navigateTo={navigateTo}
                            currentPage={currentPage}
                        />
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            {renderPage()}
                        </motion.div>
                    </AnimatePresence>

                    {currentPage !== 'auth' && currentPage !== 'admin-dashboard' && (
                        <Footer navigateTo={navigateTo} />
                    )}
                </>
            )}
        </div>
    );
}

// Main App wrapper with providers
function App() {
    return (
        <AuthProvider>
            <AppProvider>
                <FavoritesProvider>
                    <CartProvider>
                        <AppContent />
                    </CartProvider>
                </FavoritesProvider>
            </AppProvider>
        </AuthProvider>
    );
}

// Export the App component as default
export default App;

// App.jsx is now imported by main.jsx, no need for root creation here
