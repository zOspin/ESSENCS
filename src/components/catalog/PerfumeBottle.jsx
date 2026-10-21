import { useId } from 'react';

// Siluetas del cuerpo del frasco en un lienzo de 120x200.
const BODIES = {
  classic: 'M28 78 Q28 70 36 70 H84 Q92 70 92 78 V178 Q92 188 82 188 H38 Q28 188 28 178 Z',
  tall: 'M38 66 Q38 60 44 60 H76 Q82 60 82 66 V182 Q82 190 74 190 H46 Q38 190 38 182 Z',
  round: 'M60 72 C96 72 104 104 104 132 C104 166 86 188 60 188 C34 188 16 166 16 132 C16 104 24 72 60 72 Z',
};

const LIQUID_TOP = { classic: 96, tall: 88, round: 104 };

// Frasco de cristal ahumado con tapón dorado metálico, dibujado por código.
export default function PerfumeBottle({ liquid = '#C8902A', shape = 'classic', className = '' }) {
  const uid = useId().replace(/:/g, '');
  const body = BODIES[shape] ?? BODIES.classic;
  const ids = {
    gold: `gold-${uid}`,
    glass: `glass-${uid}`,
    liquid: `liquid-${uid}`,
    clip: `clip-${uid}`,
    shine: `shine-${uid}`,
  };

  return (
    <svg viewBox="0 0 120 200" className={className} role="img" aria-hidden="true">
      <defs>
        <linearGradient id={ids.gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF0B3" />
          <stop offset=".5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#8C6211" />
        </linearGradient>
        <linearGradient id={ids.glass} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2a2a30" stopOpacity=".9" />
          <stop offset=".5" stopColor="#141418" stopOpacity=".7" />
          <stop offset="1" stopColor="#2a2a30" stopOpacity=".9" />
        </linearGradient>
        <linearGradient id={ids.liquid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={liquid} stopOpacity=".55" />
          <stop offset="1" stopColor={liquid} stopOpacity=".95" />
        </linearGradient>
        <linearGradient id={ids.shine} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".18" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={ids.clip}>
          <path d={body} />
        </clipPath>
      </defs>

      {/* Tapón */}
      <rect x="44" y="14" width="32" height="34" rx="3" fill={`url(#${ids.gold})`} />
      <rect x="44" y="20" width="32" height="1" fill="#0A0A0C" opacity=".35" />
      <rect x="44" y="40" width="32" height="1" fill="#0A0A0C" opacity=".35" />
      {/* Cuello */}
      <rect x="50" y="48" width="20" height="14" fill={`url(#${ids.gold})`} opacity=".85" />

      {/* Cristal y líquido */}
      <path d={body} fill={`url(#${ids.glass})`} />
      <g clipPath={`url(#${ids.clip})`}>
        <rect x="0" y={LIQUID_TOP[shape] ?? 96} width="120" height="120" fill={`url(#${ids.liquid})`} />
        <rect x="30" y="60" width="16" height="140" fill={`url(#${ids.shine})`} />
      </g>
      <path d={body} fill="none" stroke={`url(#${ids.gold})`} strokeWidth="1" opacity=".7" />

      {/* Etiqueta */}
      <rect x="42" y="128" width="36" height="22" fill="#0A0A0C" opacity=".55" stroke={`url(#${ids.gold})`} strokeWidth=".6" />
      <text x="60" y="143" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="10" fill={`url(#${ids.gold})`}>
        E
      </text>
    </svg>
  );
}
