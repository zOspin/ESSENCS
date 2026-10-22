import { BRAND } from '../../config/constants.js';

export default function Logo() {
  return (
    <a href="#" className="group flex items-center gap-3" aria-label={`${BRAND.name} ${BRAND.tagline}`}>
      {/* El PNG tiene fondo negro: mix-blend-screen lo funde con el fondo oscuro. */}
      <img
        src={BRAND.isotipo}
        alt=""
        width="44"
        height="44"
        className="h-11 w-11 mix-blend-screen transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]"
      />
      <span className="leading-none">
        <span className="block font-display text-xl tracking-[0.3em] text-gold-gradient">{BRAND.name}</span>
        <span className="mt-1 block text-[9px] font-display uppercase tracking-[0.4em] text-muted">{BRAND.tagline}</span>
      </span>
    </a>
  );
}
