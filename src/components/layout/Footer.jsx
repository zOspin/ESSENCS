import WhatsAppIcon from '../common/WhatsAppIcon.jsx';
import { BRAND, WHATSAPP_GREETING } from '../../config/constants.js';
import { getWhatsAppUrl } from '../../services/whatsappService.js';

// Cierre de la página: el nombre vuelve a todo lo ancho, con el contacto encima.
export default function Footer() {
  return (
    <footer id="contacto" className="overflow-hidden bg-ink">
      <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl text-soft sm:text-4xl">¿No sabes cuál elegir?</h2>
            <p className="mt-3 max-w-md text-lg leading-relaxed text-soft">
              Cuéntanos qué te gusta oler y te ayudamos a escoger.
            </p>
          </div>
          <a
            href={getWhatsAppUrl(WHATSAPP_GREETING)}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline inline-flex items-center gap-3 self-start text-xl text-gold-soft md:self-auto"
          >
            <WhatsAppIcon className="h-6 w-6" />
            Escríbenos por WhatsApp
          </a>
        </div>

        <p
          aria-hidden="true"
          className="mt-20 select-none text-center font-display text-[15vw] font-medium leading-[0.9] tracking-[0.01em] text-gold-soft xl:text-[12.5rem]"
        >
          {BRAND.name}
        </p>

        <div className="flex flex-col gap-2 py-8 text-[15px] text-muted sm:flex-row sm:justify-between">
          <p>Perfumes de diseñador y perfumería árabe.</p>
          <p>
            © {new Date().getFullYear()} {BRAND.name} {BRAND.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
