import { BRAND } from '../config/constants.js';
import { fullName } from '../utils/formatters.js';

// La tienda no publica precios: el pedido llega por WhatsApp y ahí se confirman.
export function buildOrderMessage(items) {
  const lines = items.map(({ product, qty }) => {
    const detail = product.subtitle ? ` (${product.subtitle})` : '';
    return `• ${fullName(product)}${detail} x${qty}`;
  });

  return [
    `Hola ${BRAND.name}, quiero hacer este pedido:`,
    '',
    ...lines,
    '',
    '¿Me confirmas precio, disponibilidad y forma de envío?',
  ].join('\n');
}

// wa.me exige el número solo con dígitos y con indicativo de país (ej. 573001234567).
export function getWhatsAppUrl(message, phone = BRAND.whatsapp) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
