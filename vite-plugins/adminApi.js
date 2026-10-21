import fs from 'node:fs/promises';
import path from 'node:path';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const WATCH_FREE_DIRS = ['/assets/products/', '/assets/videos/'];
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm' };

// API local para el panel de administración. Solo existe con `npm run dev` (apply: 'serve'):
// la web publicada no la incluye, así que nadie de afuera puede modificar el catálogo.
//   PUT  /__admin/catalog        cuerpo JSON (lista de perfumes) -> public/catalog.json
//   POST /__admin/image?id=slug  cuerpo JPEG                     -> public/assets/products/slug.jpg
export default function adminApi() {
  return {
    name: 'essencs-admin-api',
    apply: 'serve',
    // Sin esto, cada guardado recargaría la página entera y cerraría el panel a mitad de edición.
    config: () => ({
      // Los videos tampoco se vigilan: OneDrive los bloquea mientras sincroniza y el watcher se cae (EBUSY).
      server: {
        watch: {
          ignored: ['**/public/catalog.json', '**/public/assets/products/**', '**/public/assets/videos/**', '**/VIDEOS/**'],
        },
      },
    }),
    configureServer(server) {
      const publicDir = path.join(server.config.root, 'public');

      // Como esas carpetas no se vigilan, Vite no se entera de los archivos nuevos (fotos subidas
      // desde el panel, videos copiados) y respondería con index.html. Se sirven aquí desde disco.
      server.middlewares.use(async (req, res, next) => {
        const pathname = decodeURIComponent((req.url ?? '').split('?')[0]);
        if (req.method !== 'GET' && req.method !== 'HEAD') return next();
        if (!WATCH_FREE_DIRS.some((dir) => pathname.startsWith(dir))) return next();

        const file = path.join(publicDir, pathname);
        if (!file.startsWith(publicDir)) return next();
        try {
          await serveFile(req, res, file);
        } catch {
          next();
        }
      });

      server.middlewares.use('/__admin', async (req, res) => {
        try {
          const url = new URL(req.url, 'http://localhost');

          if (req.method === 'PUT' && url.pathname === '/catalog') {
            const list = JSON.parse((await readBody(req, MAX_IMAGE_BYTES)).toString('utf8'));
            if (!Array.isArray(list) || list.some((p) => !p?.id || !p?.name)) {
              throw new Error('El catálogo debe ser una lista de perfumes con id y nombre');
            }
            await fs.writeFile(path.join(publicDir, 'catalog.json'), `${JSON.stringify(list, null, 2)}\n`);
            return send(res, 200, { ok: true });
          }

          if (req.method === 'POST' && url.pathname === '/image') {
            const id = url.searchParams.get('id') ?? '';
            if (!/^[a-z0-9-]+$/.test(id)) throw new Error('Identificador de imagen inválido');
            const body = await readBody(req, MAX_IMAGE_BYTES);
            const dir = path.join(publicDir, 'assets', 'products');
            await fs.mkdir(dir, { recursive: true });
            await fs.writeFile(path.join(dir, `${id}.jpg`), body);
            // ?v= evita que el navegador muestre la foto anterior en caché al reemplazarla.
            return send(res, 200, { path: `/assets/products/${id}.jpg?v=${Date.now()}` });
          }

          send(res, 404, { error: 'Ruta no encontrada' });
        } catch (err) {
          send(res, 400, { error: err.message });
        }
      });
    },
  };
}

// Sirve un archivo con soporte de Range: los navegadores lo exigen para reproducir y adelantar videos.
async function serveFile(req, res, file) {
  const { size } = await fs.stat(file);
  const type = MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? '');

  let start = 0;
  let end = size - 1;
  if (range) {
    start = range[1] ? Number(range[1]) : size - Number(range[2]);
    end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    res.statusCode = 206;
    res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
  }
  res.setHeader('Content-Type', type);
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Length', end - start + 1);
  res.setHeader('Cache-Control', 'no-cache');
  if (req.method === 'HEAD') return res.end();

  const handle = await fs.open(file);
  handle.createReadStream({ start, end }).pipe(res);
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error('El archivo es demasiado grande'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}
