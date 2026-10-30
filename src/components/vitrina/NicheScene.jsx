import { TEXTURES } from '../../config/vitrina.js';

const DUST = 12;

// Números pseudoaleatorios estables (iguales en cada render) para ubicar el polvo en la luz.
function seeded(seed) {
  let s = seed % 2147483647 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function dustFor(id) {
  const rand = seeded([...id].reduce((a, c) => a + c.charCodeAt(0) * 31, 7));
  return Array.from({ length: DUST }, () => ({
    x: (rand() - 0.5) * 0.7, // posición horizontal dentro del haz
    y: 0.15 + rand() * 0.6, // altura de partida
    s: 1 + rand() * 2.2, // tamaño en px
    d: 7 + rand() * 9, // duración del ciclo (s)
    dl: -rand() * 16, // desfase para que no arranquen juntas
    dr: (rand() - 0.5) * 30, // deriva lateral (px)
  }));
}

// Lo que se ve dentro de un nicho: pared de travertino en arco, haz de luz con polvo,
// frasco con destello, piso de mármol con reflejo. Todo se mide en % del nicho, así que
// la misma escena sirve para la vitrina pequeña y para el detalle grande.
export default function NicheScene({ item, priority = false }) {
  const dust = dustFor(item.id);
  const loading = priority ? 'eager' : 'lazy';

  return (
    <span
      className="ns"
      style={{
        '--light': item.light,
        '--scale': item.scale,
        '--ar': item.ratio,
        '--stone': `url(${TEXTURES.stone})`,
        '--marble': `url(${TEXTURES.marble})`,
        '--bottle': `url(${item.bottle})`,
      }}
      aria-hidden="true"
    >
      <span className="ns-wall" />
      <span className="ns-wall-light" />
      <span className="ns-beam ns-beam-soft" />
      <span className="ns-beam ns-beam-core" />
      <span className="ns-dust">
        {dust.map((p, i) => (
          <i
            key={i}
            style={{
              '--x': p.x,
              '--y': p.y,
              '--s': `${p.s}px`,
              '--d': `${p.d}s`,
              '--dl': `${p.dl}s`,
              '--dr': `${p.dr}px`,
            }}
          />
        ))}
      </span>
      <span className="ns-floor" />
      <span className="ns-pool" />

      <span className="ns-object">
        <span className="ns-float">
          <span className="ns-contact" />
          <img className="ns-bottle" src={item.bottle} alt="" loading={loading} draggable="false" />
          <span className="ns-tint" />
          <span className="ns-glint" />
        </span>
        <img className="ns-reflection" src={item.bottle} alt="" loading={loading} draggable="false" />
      </span>

      <span className="ns-arch" />
      <span className="ns-lamp" />
      <span className="ns-vignette" />
    </span>
  );
}
