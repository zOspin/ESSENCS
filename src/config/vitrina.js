// Prototipo "vitrina": perfumes que aparecen en los nichos iluminados del inicio.
// - id: el mismo id del catálogo (de ahí salen nombre, marca, descripción y notas).
// - bottle: foto del frasco solo, sin fondo (PNG/WebP transparente).
// - light: color de la luz del nicho.
// - scale: alto del frasco dentro del nicho (1 = el más alto), para respetar tamaños reales.
export const VITRINA = [
  { id: 'jpg-le-beau-le-parfum', bottle: '/assets/vitrina/jpg-le-beau-le-parfum.webp', light: '#4fd1b0', scale: 1 },
  { id: 'ariana-grande-cloud', bottle: '/assets/vitrina/ariana-grande-cloud.webp', light: '#b6a6ff', scale: 0.68 },
  { id: 'jpg-le-male-le-parfum', bottle: '/assets/vitrina/jpg-le-male-le-parfum.webp', light: '#ffcf7a', scale: 0.98 },
  { id: 'lattafa-haya', bottle: '/assets/vitrina/lattafa-haya.webp', light: '#ff8fb4', scale: 0.84 },
  { id: 'versace-eros', bottle: '/assets/vitrina/versace-eros.webp', light: '#3fd3ea', scale: 0.8 },
  { id: 'lattafa-khamrah', bottle: '/assets/vitrina/lattafa-khamrah.webp', light: '#ff9a3c', scale: 0.56 },
];

// Prefijo del hash al abrir un perfume (#perfume-<id>), así el botón Atrás lo cierra.
export const VITRINA_HASH = '#perfume-';
