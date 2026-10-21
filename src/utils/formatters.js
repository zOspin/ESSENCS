import { CURRENCY, LOCALE } from '../config/constants.js';

export function formatPrice(amount, currency = CURRENCY, locale = LOCALE) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'COP' ? 0 : 2,
  }).format(amount);
}

export function hasPrice(product) {
  return typeof product.price === 'number' && product.price > 0;
}

// "Versace Eros Flame", o solo el nombre si no hay marca.
export function fullName(product) {
  return product.brand ? `${product.brand} ${product.name}` : product.name;
}
