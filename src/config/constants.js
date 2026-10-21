export const BRAND = {
  name: 'ESSENCS',
  tagline: 'Perfumería',
  email: 'hola@essencs.com',
  logo: '/assets/brand/essencs-logo.png',
  isotipo: '/assets/brand/essencs-isotipo.png',
};

export const CURRENCY = 'USD';
export const LOCALE = 'es-ES';

export const SHIPPING = {
  flatRate: 12,
  freeFrom: 250,
};

export const FAMILIES = ['Oriental', 'Floral', 'Amaderada', 'Cítrica', 'Chipre'];

export const PRICE_RANGE = { min: 0, max: 300 };

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Destacados' },
  { value: 'price-asc', label: 'Menor a mayor precio' },
  { value: 'price-desc', label: 'Mayor a menor precio' },
];

export const NAV_LINKS = [
  { href: '#coleccion', label: 'Colección' },
  { href: '#maison', label: 'La Maison' },
  { href: '#contacto', label: 'Contacto' },
];

// Reservado para cuando exista backend.
export const API_ROUTES = {
  products: '/api/products',
};
