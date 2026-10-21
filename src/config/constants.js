export const BRAND = {
  name: 'ESSENCS',
  tagline: 'Perfumería',
  email: 'hola@essencs.com',
  // Número con indicativo de país, solo dígitos. Ej. Colombia: '573001234567'.
  whatsapp: '573024316353',
  logo: '/assets/brand/essencs-logo.png',
  isotipo: '/assets/brand/essencs-isotipo.png',
};

export const CURRENCY = 'COP';
export const LOCALE = 'es-CO';

// Catálogo servido desde public/; el panel de administración lo reescribe en desarrollo.
export const CATALOG_URL = '/catalog.json';

export const FAMILIES = ['Ámbar', 'Amaderada', 'Aromática', 'Cítrica', 'Floral', 'Frutal', 'Gourmand'];

export const GENDERS = ['Hombre', 'Mujer', 'Unisex'];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Destacados' },
  { value: 'name', label: 'Nombre (A-Z)' },
  { value: 'price-asc', label: 'Menor a mayor precio' },
  { value: 'price-desc', label: 'Mayor a menor precio' },
];

export const NAV_LINKS = [
  { href: '#coleccion', label: 'Colección' },
  { href: '#maison', label: 'La Maison' },
  { href: '#contacto', label: 'Contacto' },
];
