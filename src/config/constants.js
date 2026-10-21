export const BRAND = {
  name: 'ESSENCS',
  tagline: 'Perfumería',
  email: 'hola@essencs.com',
  // Número con indicativo de país, solo dígitos. Ej. Colombia: '573001234567'.
  whatsapp: '573024316353',
  logo: '/assets/brand/essencs-logo.png',
  isotipo: '/assets/brand/essencs-isotipo.png',
};

// Catálogo servido desde public/; el panel de administración lo reescribe en desarrollo.
export const CATALOG_URL = '/catalog.json';

export const FAMILIES = ['Ámbar', 'Amaderada', 'Aromática', 'Cítrica', 'Floral', 'Frutal', 'Gourmand'];

export const GENDERS = ['Hombre', 'Mujer', 'Unisex'];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Destacados' },
  { value: 'name', label: 'Nombre (A-Z)' },
];

export const NAV_LINKS = [
  { href: '#coleccion', label: 'Colección' },
];

// Mensaje con el que se abre el chat desde el botón de WhatsApp del encabezado.
export const WHATSAPP_GREETING = 'Hola ESSENCS, quiero información sobre sus perfumes.';
