import Logo from '../common/Logo.jsx';
import WhatsAppIcon from '../common/WhatsAppIcon.jsx';
import { BRAND, WHATSAPP_GREETING } from '../../config/constants.js';
import { getWhatsAppUrl } from '../../services/whatsappService.js';

export default function Footer() {
  return (
    <footer id="contacto" className="border-t border-gold-line bg-ink-2">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-8 md:grid-cols-2">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-base italic leading-relaxed text-muted">
            Perfumes de diseñador y perfumería árabe.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="font-display text-sm tracking-luxe text-gold">Contacto</h3>
          <a
            href={getWhatsAppUrl(WHATSAPP_GREETING)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-base text-soft transition-colors duration-300 hover:text-gold"
          >
            <WhatsAppIcon className="h-4 w-4 text-gold" />
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
      <p className="border-t border-gold-line py-6 text-center text-[10px] font-display uppercase tracking-luxe text-muted">
        © {new Date().getFullYear()} {BRAND.name} {BRAND.tagline}
      </p>
    </footer>
  );
}
