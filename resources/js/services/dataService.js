// Robust fetch with better error handling and retry
const robustFetch = async (url, timeout = 8000, retries = 1) => {
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      console.log(`🔄 Fetching ${url} (attempt ${attempt})...`);
      
      const response = await fetch(url, {
        signal: controller.signal,
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      clearTimeout(timeoutId);
      
      console.log(`📡 Response status for ${url}: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Successfully fetched ${url}:`, Array.isArray(data) ? `${data.length} items` : 'non-array data');
      
      return Array.isArray(data) ? data : [];
      
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`❌ Failed to fetch ${url} (attempt ${attempt}):`, error.message);
      
      if (attempt === retries + 1) {
        console.error(`💥 All attempts failed for ${url}`);
        return [];
      }
      
      // Wait before retry
      console.log(`⏳ Waiting 2 seconds before retry...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return [];
};

export const fetchBanners = async () => {
  return await robustFetch('/api/banners', 8000, 1);
};

export const fetchProducts = async () => {
  return await robustFetch('/api/products', 8000, 1);
};

export const fetchSlides = async () => {
  return await robustFetch('/api/slides', 8000, 1);
};

export const fetchCategories = async () => {
  return await robustFetch('/api/categories', 8000, 1);
};

export const fetchSuppliers = async () => {
  return await robustFetch('/api/suppliers', 8000, 1);
};

export const fetchPromotions = async () => {
  return await robustFetch('/api/promotions', 8000, 1);
};