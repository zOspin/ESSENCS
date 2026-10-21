import { useEffect, useState } from 'react';
import Logo from '../common/Logo.jsx';
import WhatsAppIcon from '../common/WhatsAppIcon.jsx';
import NavigationMenu from './NavigationMenu.jsx';
import { WHATSAPP_GREETING } from '../../config/constants.js';
import { getWhatsAppUrl } from '../../services/whatsappService.js';

export default function Header({ cartCount, onOpenCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bump, setBump] = useState(false);

  // Rebote del contador cada vez que cambia la cantidad.
  useEffect(() => {
    if (cartCount === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 300);
    return () => clearTimeout(t);
  }, [cartCount]);

  return (
    <header className="sticky top-0 z-40 border-b border-gold-line bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8">
        <button
          type="button"
          className="cursor-pointer p-2 text-gold md:hidden"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d={menuOpen ? 'M5 5l14 14M19 5L5 19' : 'M3 7h18M3 12h18M3 17h18'} stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>

        <Logo />

        <div className="hidden md:block">
          <NavigationMenu />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={getWhatsAppUrl(WHATSAPP_GREETING)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escríbenos por WhatsApp"
            className="flex items-center gap-2 border border-gold-line px-3 py-2 text-xs uppercase tracking-luxe text-gold transition-all duration-300 hover:border-gold hover:shadow-glow"
          >
            <WhatsAppIcon />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Bolsa de compras, ${cartCount} artículos`}
            className="relative cursor-pointer p-2 text-gold transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
              <path d="M5 8h14l-1.2 12H6.2L5 8z" />
              <path d="M9 8V6a3 3 0 016 0v2" />
            </svg>
            {cartCount > 0 && (
              <span
                className={`absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold-gradient px-1 text-[10px] font-semibold text-ink ${bump ? 'bump' : ''}`}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fade-in border-t border-gold-line px-4 md:hidden">
          <NavigationMenu vertical onNavigate={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
