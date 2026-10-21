# ESSENCS Perfumería

E-commerce de alta perfumería (React + Vite + Tailwind CSS v4). La especificación completa está en [[PERFUMERIA]].

## Requisitos

- Node.js 20 o superior

## Uso

```bash
npm install     # instalar dependencias (solo la primera vez)
npm run dev     # servidor de desarrollo en http://localhost:5173
npm run build   # compilación de producción en dist/
```

## Administrar el catálogo (perfumes y precios)

1. Ejecuta `npm run dev` y abre http://localhost:5173/#admin (o el botón «Administrar catálogo» abajo a la izquierda).
2. Desde ahí puedes:
   - **Editar precios** directamente en la lista: escribe el precio en pesos y pulsa Enter. Vacío = «Precio a consultar».
   - **Agregar perfume**: foto, marca, nombre, presentación, precio, para quién, familia y notas (opcional).
   - **Editar** o **eliminar** un perfume, y marcarlo como **Destacado** (aparece primero).
3. Los cambios se guardan en `public/catalog.json` y las fotos en `public/assets/products/`.
4. Para que lleguen a la web publicada, súbelos a GitHub (`git add -A`, `git commit`, `git push`).

El panel solo existe en tu computador con `npm run dev`: la web publicada no lo incluye, así que nadie más puede cambiar el catálogo.

Las fotos originales del catálogo base están en `CATALOGO/`.

## Estructura

```text
public/
├── catalog.json        catálogo (lo escribe el panel de administración)
└── assets/products/    fotos de los perfumes
vite-plugins/adminApi.js  API local que usa el panel (solo en desarrollo)
src/
├── config/      theme.js (tokens de diseño), constants.js (marca, WhatsApp, moneda, familias, orden)
├── styles/      globals.css (Tailwind + @theme), animations.css (Aura Ripple, transiciones)
├── utils/       formatters.js (moneda COP), auraEffect.js, cartStorage.js (bolsa guardada)
├── services/    productService.js (catálogo, filtros, orden, totales), whatsappService.js (pedido),
│                catalogAdminService.js (guardar catálogo y subir fotos)
└── components/
    ├── common/   Button, Badge, Chip, Select, Logo, Overlay, CloseButton
    ├── layout/   Header, NavigationMenu, Footer
    ├── catalog/  ControlBar, ProductCard, ProductGrid, ProductImage, OlfactoryPyramid, PerfumeBottle (SVG)
    ├── modals/   CartDrawer, FilterModal, ProductDetailModal
    └── admin/    AdminPanel, ProductForm
```

El logotipo vive en `public/assets/brand/` (`essencs-logo.png` completo, `essencs-isotipo.png` para el encabezado); el original en alta resolución está en `LOGO/`. Nombre, lema y correo de la marca se cambian en `src/config/constants.js` (`BRAND`).

Los colores de marca están en `src/styles/globals.css` (bloque `@theme`) y se usan como utilidades de Tailwind: `bg-ink`, `bg-surface`, `text-gold`, `border-gold-line`, `text-gold-gradient`, `shadow-glow`.
