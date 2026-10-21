import { BRAND } from '../../config/constants.js';

export default function Logo() {
  return (
    <a href="#" className="group flex items-center gap-3" aria-label={`${BRAND.name} ${BRAND.tagline}`}>
      <svg viewBox="0 0 48 48" className="h-10 w-10 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]" aria-hidden="true">
        <defs>
          <linearGradient id="logo-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFF0B3" />
            <stop offset=".5" stopColor="#D4AF37" />
            <stop offset="1" stopColor="#8C6211" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill="none" stroke="url(#logo-gold)" strokeWidth="1" />
        <circle cx="24" cy="24" r="18.5" fill="none" stroke="url(#logo-gold)" strokeWidth="0.5" opacity=".6" />
        <text x="24" y="31.5" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="21" fill="url(#logo-gold)">
          E
        </text>
      </svg>
      <span className="leading-none">
        <span className="block font-display text-xl tracking-[0.3em] text-gold-gradient">{BRAND.name}</span>
        <span className="mt-1 block text-[9px] uppercase tracking-[0.4em] text-muted">{BRAND.tagline}</span>
      </span>
    </a>
  );
}
