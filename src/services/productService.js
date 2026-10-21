import { mockProducts } from '../data/mockProducts.js';
import { PRICE_RANGE, SHIPPING } from '../config/constants.js';

export const DEFAULT_FILTERS = {
  families: [],
  minPrice: PRICE_RANGE.min,
  maxPrice: PRICE_RANGE.max,
};

// Async para que el cambio a una API real no toque a los componentes.
export async function getProducts() {
  return mockProducts;
}

export function filterProducts(products, { families, minPrice, maxPrice }) {
  return products.filter(
    (p) =>
      (families.length === 0 || families.includes(p.family)) &&
      p.price >= minPrice &&
      p.price <= maxPrice,
  );
}

export function sortProducts(products, sortBy) {
  const list = [...products];
  switch (sortBy) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price);
    default:
      return list.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export function countActiveFilters({ families, minPrice, maxPrice }) {
  return (
    families.length +
    (minPrice !== PRICE_RANGE.min || maxPrice !== PRICE_RANGE.max ? 1 : 0)
  );
}

export function getCartTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const shipping = subtotal === 0 || subtotal >= SHIPPING.freeFrom ? 0 : SHIPPING.flatRate;
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  return { subtotal, shipping, total: subtotal + shipping, count };
}
