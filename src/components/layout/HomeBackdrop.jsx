import { useEffect, useRef } from 'react';

// Fondo del inicio: paneles negros en diagonal con filos dorados que apuntan hacia el logo,
// y el centro oscuro para que el logo resalte. Se estira a cualquier pantalla (celular o
// computador) sin engrosar las líneas.
const PANELS = [
  // Esquinas
  '0,0 520,0 0,330',
  '1600,0 1080,0 1600,330',
  '0,900 520,900 0,570',
  '1600,900 1080,900 1600,570',
  // Puntas laterales hacia el centro
  '0,150 470,450 0,750',
  '1600,150 1130,450 1600,750',
];

// Filos dorados: el borde de cada panel y una segunda línea paralela que hace de bisel.
// `d`: retraso del trazo al entrar. Las puntas laterales (las que señalan el logo) se dibujan
// primero; las esquinas y los biseles después, con huecos que se acortan, como una ola.
const EDGES = [
  { path: 'M0 150 L470 450 L0 750', d: 0 },
  { path: 'M1600 150 L1130 450 L1600 750', d: 0 },
  { path: 'M0 230 L345 450 L0 670', d: 140 },
  { path: 'M1600 230 L1255 450 L1600 670', d: 140 },
  { path: 'M520 0 L0 330', d: 240 },
  { path: 'M1080 0 L1600 330', d: 240 },
  { path: 'M520 900 L0 570', d: 300 },
  { path: 'M1080 900 L1600 570', d: 300 },
  { path: 'M600 0 L0 380', d: 360 },
  { path: 'M1000 0 L1600 380', d: 360 },
  { path: 'M600 900 L0 520', d: 400 },
  { path: 'M1000 900 L1600 520', d: 400 },
];

export default function HomeBackdrop() {
  const ref = useRef(null);

  // Profundidad (solo con mouse): los paneles se corren unos píxeles en contra del cursor y
  // el logo parece flotar delante. Se suaviza con un seguimiento que se detiene al llegar.
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let raf = 0;
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.06;
      pos.y += (target.y - pos.y) * 0.06;
      el.style.transform = `translate3d(${(-pos.x * 14).toFixed(2)}px, ${(-pos.y * 10).toFixed(2)}px, 0)`;
      raf = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <>
      <div ref={ref} className="pointer-events-none absolute inset-0 scale-[1.03] will-change-transform">
        <Panels />
      </div>
      {/* Halo dorado detrás del logo, fuera del SVG para que siga redondo en el celular. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(212,175,55,0.18)_0,rgba(10,10,12,0.85)_32vmax,transparent_55vmax)]" />
    </>
  );
}

function Panels() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="home-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e1e24" />
          <stop offset="1" stopColor="#0b0b0e" />
        </linearGradient>
        <linearGradient id="home-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff0b3" />
          <stop offset="0.5" stopColor="#d4af37" />
          <stop offset="1" stopColor="#8c6211" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="#0a0a0c" />
      <g className="home-panel">
        {PANELS.map((points) => (
          <polygon key={points} points={points} fill="url(#home-panel)" />
        ))}
      </g>
      <g stroke="url(#home-gold)" strokeWidth="1.2" fill="none" opacity="0.55">
        {EDGES.map(({ path, d }) => (
          <path
            key={path}
            d={path}
            pathLength="1"
            vectorEffect="non-scaling-stroke"
            className="home-line"
            style={{ '--d': `${d}ms` }}
          />
        ))}
      </g>
    </svg>
  );
}
