import React, { useState, useEffect, useContext } from 'react';
import { Search, ArrowRight, Leaf, Sparkles, Heart, Star } from 'lucide-react';
import { AppContext } from '../contexts/AppContext.js';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';

export default function CategoriesPage({ navigateTo }) {
  const { categories } = useContext(AppContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  const navigateToHome = () => {
    if (navigateTo) navigateTo('home');
    else window.location.href = '/';
  };

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filtered = categories.filter(c => {
    const title = (c.title || c.name || String(c)).toLowerCase();
    return title.includes(query.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-white">
      <Header isScrolled={isScrolled} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} navigateTo={navigateToHome} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
          <div className="inline-flex items-center bg-white/60 backdrop-blur-md rounded-2xl px-5 py-2 border border-emerald-100 shadow-sm mb-5">
            <Sparkles className="w-5 h-5 text-emerald-500 mr-2" />
            <span className="text-sm font-semibold text-emerald-700">Découvrez nos catégories</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Toutes les Catégories</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 leading-relaxed mb-8">
            Explorez notre catalogue par thématique et trouvez rapidement ce qu'il vous faut
          </p>
          <div className="max-w-xl mx-auto flex items-center bg-white rounded-2xl border border-emerald-100 shadow-sm focus-within:shadow-md transition p-2">
            <Search className="w-5 h-5 text-emerald-500 ml-2 mr-2" />
            <input
              type="text"
              placeholder="Rechercher une catégorie"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full outline-none bg-transparent py-3 pr-3 text-gray-700"
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">Aucune catégorie trouvée</h3>
                <p className="text-gray-500">Essayez un autre terme de recherche</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((category, idx) => {
                  const title = category.title || category.name || String(category);
                  const image = category.img || category.image;
                  return (
                    <a
                      key={category.id || idx}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (navigateTo) navigateTo('category', title);
                        else window.location.href = `/categories/${encodeURIComponent(title)}`;
                      }}
                      className="group relative bg-white rounded-3xl border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-xl transition-all overflow-hidden"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden relative">
                        {image ? (
                          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                            <Grid className="w-14 h-14 text-emerald-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-5">
                        <div className="inline-flex items-center bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-emerald-100">
                          <Tag className="w-3.5 h-3.5 mr-1.5" />
                          Catégorie
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">{title}</h3>
                        <div className="flex items-center text-emerald-600 font-semibold">
                          <span>Explorer</span>
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer navigateTo={navigateToHome} />
    </div>
  );
}
