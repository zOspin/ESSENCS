const KEY = 'essencs-cart';

// Solo se guardan id y cantidad; el producto completo se recupera del catálogo al cargar,
// así un cambio de precio en el catálogo no deja precios viejos en la bolsa.
// localStorage puede fallar (modo privado, almacenamiento bloqueado): en ese caso la bolsa
// simplemente no se recuerda.
export function loadCart(products) {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return saved
      .map(({ id, qty }) => ({ product: products.find((p) => p.id === id), qty }))
      .filter((item) => item.product && Number.isInteger(item.qty) && item.qty > 0);
  } catch {
    return [];
  }
}

export function saveCart(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items.map((i) => ({ id: i.product.id, qty: i.qty }))));
  } catch {
    // Sin almacenamiento disponible: la bolsa vive solo en esta visita.
  }
}
