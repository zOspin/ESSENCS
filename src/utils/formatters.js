import { CURRENCY, LOCALE } from '../config/constants.js';

export function formatPrice(amount, currency = CURRENCY, locale = LOCALE) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
