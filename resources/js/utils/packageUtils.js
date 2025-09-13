/**
 * Utility functions for package management
 */

/**
 * Creates universal package structure for all products
 * @param {Object} product - Product object
 * @returns {Array} - Array of standard packages
 */
export const createUniversalPackages = (product) => {
  const basePrice = Number(product.price) || 0;
  
  return [
    {
      id: 1,
      name: product.name,
      price: basePrice,
      oldPrice: null,
      save: null,
      label: '',
      quantity: 1
    },
    {
      id: 2,
      name: 'Offre Populaire',
      price: Math.round(basePrice * 2.5), // 3 products for 2.5x price
      oldPrice: Math.round(basePrice * 3), // Original price for 3 products
      save: Math.round((basePrice * 3) - (basePrice * 2.5)), // Savings
      label: 'Offre Populaire',
      quantity: 3
    },
    {
      id: 3,
      name: 'Offre Économique',
      price: Math.round(basePrice * 4), // 5 products for 4x price
      oldPrice: Math.round(basePrice * 5), // Original price for 5 products
      save: Math.round((basePrice * 5) - (basePrice * 4)), // Savings
      label: 'Offre Économique',
      quantity: 5
    }
  ];
};

/**
 * Maps package names based on quantity
 * @param {Array} packages - Array of package objects
 * @returns {Array} - Array of packages with modified names
 */
export const mapPackageNames = (packages) => {
  if (!packages || !Array.isArray(packages)) return [];
  
  return packages.map(pkg => {
    let modifiedPkg = { ...pkg };
    
    // Change names based on quantity
    if (pkg.quantity === 3) {
      modifiedPkg.name = 'Offre Populaire';
    } else if (pkg.quantity === 5) {
      modifiedPkg.name = 'Offre Économique';
    }
    
    return modifiedPkg;
  });
};

/**
 * Creates a cart item with complete package information
 * @param {Object} product - Product object
 * @param {Object} selectedPackage - Selected package object
 * @returns {Object} - Complete cart item object
 */
export const createCartItem = (product, selectedPackage) => {
  const packagePrice = selectedPackage?.price || product.price || 0;
  const packageQuantity = selectedPackage?.quantity || 1;
  
  console.log('Creating cart item:', {
    product: product.name,
    selectedPackage: selectedPackage,
    packagePrice,
    packageQuantity
  });
  
  return {
    id: product.id,
    product_id: product.id,
    name: product.name,
    price: packagePrice, // This is the PACK PRICE, not per unit
    quantity: 1, // Always 1 because it's one pack
    image: product.images ? product.images[0] : product.img,
    category: product.category,
    description: product.description,
    rating: product.rating,
    // Package details
    package: selectedPackage?.name || 'Standard',
    package_id: selectedPackage?.id,
    package_quantity: packageQuantity, // How many products in the pack
    package_old_price: selectedPackage?.oldPrice,
    package_save: selectedPackage?.save || 0,
    package_label: selectedPackage?.label || ''
  };
};

/**
 * Gets the offer label for a package based on quantity
 * @param {number} quantity - Package quantity
 * @returns {string} - Offer label
 */
export const getOfferLabel = (quantity) => {
  if (quantity === 3) return 'Offre Populaire';
  if (quantity === 5) return 'Offre Économique';
  return '';
};
