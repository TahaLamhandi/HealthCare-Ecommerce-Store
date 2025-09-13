import { createContext, useState, useEffect } from 'react';
import { fetchBanners, fetchProducts , fetchCategories, fetchPromotions , fetchSlides , fetchSuppliers , f } from '../services/dataService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [slides, setSlides] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bannersData, productsData , categoriesData , promotionsData , slidesData , suppliersData] = await Promise.all([
          fetchBanners(),
          fetchProducts(),
          fetchCategories(),
          fetchPromotions(),
          fetchSlides(),
          fetchSuppliers()
        ]);
        setBanners(bannersData);
        // Normalize product fields
        const normalizedProducts = (productsData || []).map(p => ({
          ...p,
          // Ensure numeric fields are numbers and never null/undefined
          sales_count: Number(p?.sales_count ?? 0) || 0,
          discount: Number(p?.discount ?? 0) || 0,
          // Coerce isNew to boolean to avoid rendering 0 in JSX
          isNew: Boolean(p?.isNew),
        }));
        setProducts(normalizedProducts);
        setCategories(categoriesData);
        setPromotions(promotionsData);
        setSlides(slidesData);
        setSuppliers(suppliersData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <AppContext.Provider value={{ banners, products, categories, promotions, slides, suppliers, loading }}>
      {children}
    </AppContext.Provider>
  );
};