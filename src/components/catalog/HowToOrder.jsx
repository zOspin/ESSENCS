import { useReveal } from '../../utils/useReveal.js';
import WhatsAppIcon from '../common/WhatsAppIcon.jsx';
import { WHATSAPP_GREETING } from '../../config/constants.js';
import { getWhatsAppUrl } from '../../services/whatsappService.js';

// Cómo se compra aquí, en tres verbos: no hay pago en la web, el pedido se cierra por WhatsApp.
const STEPS = [
  { verb: 'Elige', text: 'Recorre la colección o empieza por una nota que te guste.' },
  { verb: 'Añade', text: 'Suma a la bolsa los perfumes que quieras y cuántos de cada uno.' },
  { verb: 'Escribe', text: 'Envía el pedido por WhatsApp y te respondemos por el chat para acordar el resto.' },
];

export default function HowToOrder() {
  const ref = useReveal();

  return (
    <section ref={ref} aria-labelledby="como-pedir" className="bg-ink-2">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-8 lg:py-32">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="como-pedir" className="font-display text-5xl font-medium tracking-[0.01em] text-soft sm:text-6xl">
            Cómo pedir
          </h2>
          <a
            href={getWhatsAppUrl(WHATSAPP_GREETING)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 self-start bg-gold-soft px-6 py-3.5 text-[15px] font-medium text-ink transition-[filter,scale] duration-300 hover:brightness-110 active:scale-[0.97] active:duration-100 lg:self-auto"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Escríbenos por WhatsApp
          </a>
        </div>

        <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {STEPS.map(({ verb, text }, i) => (
            <li key={verb} data-reveal style={{ '--d': `${[0, 110, 190][i]}ms` }}>
              <p className="font-display text-[clamp(2.6rem,5vw,4.75rem)] font-medium leading-none tracking-[0.01em] text-gold-soft">
                {verb}
              </p>
              <p className="mt-5 max-w-xs text-lg leading-relaxed text-soft">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
