// Habla con la API local de vite-plugins/adminApi.js (solo disponible con `npm run dev`).

async function request(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
  return data;
}

export function saveCatalog(products) {
  return request('/__admin/catalog', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(products),
  });
}

// Reduce la foto a máx. 900 px y JPEG antes de subirla, para que la web cargue rápido.
export async function uploadImage(file, id) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; // fondo blanco para PNG transparentes
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));

  const { path } = await request(`/__admin/image?id=${encodeURIComponent(id)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'image/jpeg' },
    body: blob,
  });
  return path;
}

export function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function uniqueId(base, products) {
  const slug = slugify(base) || 'perfume';
  let id = slug;
  for (let n = 2; products.some((p) => p.id === id); n++) id = `${slug}-${n}`;
  return id;
}
