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

## Estructura

```text
src/
├── config/      theme.js (tokens de diseño), constants.js (marca, envío, familias, orden)
├── data/        mockProducts.js (catálogo local con pirámide olfativa)
├── styles/      globals.css (Tailwind + @theme), animations.css (Aura Ripple, transiciones)
├── utils/       formatters.js (moneda), auraEffect.js (onda dorada al hacer clic)
├── services/    productService.js (consulta, filtro, orden, totales del carrito)
└── components/
    ├── common/   Button, Badge, Select, Logo, Overlay, CloseButton
    ├── layout/   Header, NavigationMenu, Footer
    ├── catalog/  ControlBar, ProductCard, ProductGrid, OlfactoryPyramid, PerfumeBottle (SVG)
    └── modals/   CartDrawer, FilterModal, ProductDetailModal
```

El logotipo vive en `public/assets/brand/` (`essencs-logo.png` completo, `essencs-isotipo.png` para el encabezado); los originales en alta resolución están en la raíz. Nombre, lema y correo de la marca se cambian en `src/config/constants.js` (`BRAND`).

Los colores de marca están en `src/styles/globals.css` (bloque `@theme`) y se usan como utilidades de Tailwind: `bg-ink`, `bg-surface`, `text-gold`, `border-gold-line`, `text-gold-gradient`, `shadow-glow`.

Para añadir un perfume, agrega un objeto a `src/data/mockProducts.js` con su `bottle` (color del líquido y forma: `classic`, `tall` o `round`).
