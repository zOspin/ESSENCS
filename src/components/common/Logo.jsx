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
        className="h-11 w-11 mix-blend-screen transition-[scale] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
      />
      <span className="leading-none">
        <span className="block font-display text-xl font-medium tracking-[0.3em] text-gold-soft">{BRAND.name}</span>
        <span className="mt-1 block text-[13px] text-muted">{BRAND.tagline}</span>
      </span>
    </a>
  );
}
