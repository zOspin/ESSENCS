// "Versace Eros Flame", o solo el nombre si no hay marca.
export function fullName(product) {
  return product.brand ? `${product.brand} ${product.name}` : product.name;
}
