// Prototipo "vitrina": perfumes que aparecen en los nichos iluminados del inicio.
// - id: el mismo id del catálogo (de ahí salen nombre, marca, descripción y notas).
// - bottle: foto del frasco solo, sin fondo (WebP/PNG transparente).
// - ratio: ancho / alto de esa foto (para el destello que recorre el cristal).
// - light: color de la luz del nicho.
// - scale: alto del frasco dentro del nicho (1 = el más alto), para respetar tamaños reales.
export const VITRINA = [
  { id: 'jpg-le-beau-le-parfum', bottle: '/assets/vitrina/jpg-le-beau-le-parfum.webp', ratio: 0.4982, light: '#4fd1b0', scale: 1 },
  { id: 'ariana-grande-cloud', bottle: '/assets/vitrina/ariana-grande-cloud.webp', ratio: 0.9073, light: '#b6a6ff', scale: 0.66 },
  { id: 'jpg-le-male-le-parfum', bottle: '/assets/vitrina/jpg-le-male-le-parfum.webp', ratio: 0.4475, light: '#ffcf7a', scale: 0.98 },
  { id: 'lattafa-haya', bottle: '/assets/vitrina/lattafa-haya.webp', ratio: 0.4821, light: '#ff8fb4', scale: 0.84 },
  { id: 'versace-eros', bottle: '/assets/vitrina/versace-eros.webp', ratio: 0.7317, light: '#3fd3ea', scale: 0.78 },
  { id: 'lattafa-khamrah', bottle: '/assets/vitrina/lattafa-khamrah.webp', ratio: 0.8158, light: '#ff9a3c', scale: 0.56 },
];

// Prefijo del hash al abrir un perfume (#perfume-<id>), así el botón Atrás lo cierra.
export const VITRINA_HASH = '#perfume-';

// Texturas generadas para la escena (piedra de la pared y mármol del piso).
export const TEXTURES = {
  stone: '/assets/vitrina/texturas/piedra.webp',
  marble: '/assets/vitrina/texturas/marmol.webp',
};
