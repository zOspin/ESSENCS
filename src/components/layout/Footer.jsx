import Logo from '../common/Logo.jsx';
import { BRAND } from '../../config/constants.js';

export default function Footer() {
  return (
    <footer id="contacto" className="border-t border-gold-line bg-ink-2">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-8 md:grid-cols-3">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Fragancias de autor compuestas con materias primas excepcionales.
          </p>
        </div>
        <div id="maison" className="space-y-3">
          <h3 className="font-display text-sm tracking-luxe text-gold">La Maison</h3>
          <p className="text-sm leading-relaxed text-muted">
            Cada creación nace en pequeñas series, macerada durante semanas antes de llegar a su frasco.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="font-display text-sm tracking-luxe text-gold">Contacto</h3>
          <p className="text-sm text-muted">{BRAND.email}</p>
          <p className="text-sm text-muted">Atención personalizada de lunes a sábado</p>
        </div>
      </div>
      <p className="border-t border-gold-line py-6 text-center text-[10px] uppercase tracking-luxe text-muted">
        © {new Date().getFullYear()} {BRAND.name} {BRAND.tagline}
      </p>
    </footer>
  );
}
