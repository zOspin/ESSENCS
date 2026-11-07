import { useEffect, useState } from 'react';
import Logo from '../common/Logo.jsx';
import WhatsAppIcon from '../common/WhatsAppIcon.jsx';
import { WHATSAPP_GREETING } from '../../config/constants.js';
import { getWhatsAppUrl } from '../../services/whatsappService.js';

// Encabezado sin menú de secciones: el logo vuelve al inicio.
export default function Header({ cartCount, onOpenCart }) {
  const [bump, setBump] = useState(false);

  // Rebote del contador cada vez que cambia la cantidad.
  useEffect(() => {
    if (cartCount === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 300);
    return () => clearTimeout(t);
  }, [cartCount]);

  return (
    <header className="sticky top-0 z-40 bg-ink">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Logo />

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={getWhatsAppUrl(WHATSAPP_GREETING)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escríbenos por WhatsApp"
            className="p-2 text-gold-soft transition-[color,scale] duration-300 hover:text-gold-light active:scale-[0.92] active:duration-100"
          >
            <WhatsAppIcon className="h-7 w-7" />
          </a>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Bolsa de compras, ${cartCount} artículos`}
            className="relative cursor-pointer p-2 text-gold-soft transition-[color,scale] duration-300 hover:text-gold-light active:scale-[0.92] active:duration-100"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
              <path d="M5 8h14l-1.2 12H6.2L5 8z" />
              <path d="M9 8V6a3 3 0 016 0v2" />
            </svg>
            {cartCount > 0 && (
              <span
                className={`absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold-soft px-1 text-[13px] font-semibold text-ink ${bump ? 'bump' : ''}`}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
