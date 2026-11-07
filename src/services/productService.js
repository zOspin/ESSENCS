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
export function filterProducts(products, { families }, gender = null, note = null) {
  return products.filter((p) => {
    if (gender && p.gender !== gender) return false;
    if (families.length > 0 && !families.includes(p.family)) return false;
    if (note && !getNotes(p).includes(note)) return false;
    return true;
  });
}

// Todas las notas de un perfume (salida, corazón y fondo), sin repetir.
export function getNotes(product) {
  const pyramid = product.olfactoryPyramid ?? {};
  return [...new Set([...(pyramid.topNotes ?? []), ...(pyramid.heartNotes ?? []), ...(pyramid.baseNotes ?? [])])];
}

// Las notas que más se repiten en el catálogo, de la más común a la menos, con cuántos perfumes la llevan.
export function getTopNotes(products, limit = 10) {
  const count = new Map();
  for (const p of products) for (const n of getNotes(p)) count.set(n, (count.get(n) ?? 0) + 1);
  return [...count.entries()]
    .filter(([, n]) => n > 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'es'))
    .slice(0, limit)
    .map(([name, n]) => ({ name, count: n }));
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
