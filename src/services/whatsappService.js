import { BRAND } from '../config/constants.js';
import { formatPrice, fullName, hasPrice } from '../utils/formatters.js';
import { getCartTotals } from './productService.js';

export function buildOrderMessage(items) {
  const { subtotal, hasUnpriced } = getCartTotals(items);
  const lines = items.map(({ product, qty }) => {
    const detail = product.subtitle ? ` (${product.subtitle})` : '';
    const price = hasPrice(product) ? formatPrice(product.price * qty) : 'precio a confirmar';
    return `• ${fullName(product)}${detail} x${qty} — ${price}`;
  });

  const totals =
    subtotal > 0
      ? [`${hasUnpriced ? 'Subtotal de los precios publicados' : 'Subtotal'}: ${formatPrice(subtotal)}`]
      : [];

  return [
    `Hola ${BRAND.name}, quiero hacer este pedido:`,
    '',
    ...lines,
    '',
    ...totals,
    'Envío: a coordinar',
    '',
    '¿Me confirmas disponibilidad, precio final y forma de pago?',
  ].join('\n');
}

// wa.me exige el número solo con dígitos y con indicativo de país (ej. 573001234567).
export function getWhatsAppUrl(message, phone = BRAND.whatsapp) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
