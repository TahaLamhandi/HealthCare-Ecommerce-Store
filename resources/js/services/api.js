import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

export const getBanners = () => api.get('/banners');
export const getProducts = () => api.get('/products');
export const getSlides = () => api.get('/slides');
export const getCategories = () => api.get('/categories');
export const getSuppliers = () => api.get('/suppliers');
export const getPromotions = () => api.get('/promotions');