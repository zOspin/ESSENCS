import { CATALOG_URL } from '../config/constants.js';

export const DEFAULT_FILTERS = {
  families: [],
};

export async function getProducts() {
  const res = await fetch(CATALOG_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`No se pudo cargar el catálogo (${res.status})`);
  return res.json();
}

// `gender` en null = todos.
export function filterProducts(products, { families }, gender = null) {
  return products.filter((p) => {
    if (gender && p.gender !== gender) return false;
    if (families.length > 0 && !families.includes(p.family)) return false;
    return true;
  });
}

export function sortProducts(products, sortBy) {
  const list = [...products];
  if (sortBy === 'name') return list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
  return list.sort((a, b) => Number(b.featured) - Number(a.featured));
}

export function countActiveFilters({ families }) {
  return families.length;
}

export function getCartCount(items) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}
