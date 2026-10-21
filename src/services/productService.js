import { CATALOG_URL } from '../config/constants.js';
import { hasPrice } from '../utils/formatters.js';

// minPrice/maxPrice en null = sin límite.
export const DEFAULT_FILTERS = {
  families: [],
  minPrice: null,
  maxPrice: null,
};

export async function getProducts() {
  const res = await fetch(CATALOG_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`No se pudo cargar el catálogo (${res.status})`);
  return res.json();
}

export function getPriceBounds(products) {
  const prices = products.filter(hasPrice).map((p) => p.price);
  if (prices.length === 0) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

// `gender` en null = todos.
export function filterProducts(products, { families, minPrice, maxPrice }, gender = null) {
  const priceFiltered = minPrice !== null || maxPrice !== null;
  return products.filter((p) => {
    if (gender && p.gender !== gender) return false;
    if (families.length > 0 && !families.includes(p.family)) return false;
    if (!priceFiltered) return true;
    // Con filtro de precio activo, los perfumes sin precio no pueden compararse.
    if (!hasPrice(p)) return false;
    return (minPrice === null || p.price >= minPrice) && (maxPrice === null || p.price <= maxPrice);
  });
}

// Los perfumes sin precio van al final al ordenar por precio.
function byPrice(dir) {
  return (a, b) => {
    if (!hasPrice(a) || !hasPrice(b)) return Number(hasPrice(b)) - Number(hasPrice(a));
    return (a.price - b.price) * dir;
  };
}

export function sortProducts(products, sortBy) {
  const list = [...products];
  switch (sortBy) {
    case 'price-asc':
      return list.sort(byPrice(1));
    case 'price-desc':
      return list.sort(byPrice(-1));
    case 'name':
      return list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    default:
      return list.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export function countActiveFilters({ families, minPrice, maxPrice }) {
  return families.length + (minPrice !== null || maxPrice !== null ? 1 : 0);
}

export function getCartTotals(items) {
  const subtotal = items.reduce((sum, i) => sum + (hasPrice(i.product) ? i.product.price * i.qty : 0), 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const hasUnpriced = items.some((i) => !hasPrice(i.product));
  return { subtotal, count, hasUnpriced };
}
