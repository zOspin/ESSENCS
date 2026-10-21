import { BRAND } from '../config/constants.js';
import { formatPrice } from '../utils/formatters.js';
import { getCartTotals } from './productService.js';

export function buildOrderMessage(items) {
  const { subtotal, shipping, total } = getCartTotals(items);
  const lines = items.map(
    ({ product, qty }) => `• ${product.name} (${product.subtitle}) x${qty} — ${formatPrice(product.price * qty)}`,
  );

  return [
    `Hola ${BRAND.name}, quiero hacer este pedido:`,
    '',
    ...lines,
    '',
    `Subtotal: ${formatPrice(subtotal)}`,
    `Envío: ${shipping === 0 ? 'Cortesía' : formatPrice(shipping)}`,
    `Total: ${formatPrice(total)}`,
    '',
    '¿Me confirmas disponibilidad y forma de pago?',
  ].join('\n');
}

// wa.me exige el número solo con dígitos y con indicativo de país (ej. 573001234567).
export function getWhatsAppUrl(message, phone = BRAND.whatsapp) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
