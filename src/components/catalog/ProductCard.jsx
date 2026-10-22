import { useEffect, useRef, useState } from 'react';
import Badge from '../common/Badge.jsx';
import HoverVideo from './HoverVideo.jsx';
import Button from '../common/Button.jsx';
import ProductImage from './ProductImage.jsx';
import { triggerAura } from '../../utils/auraEffect.js';

export default function ProductCard({ product, onExplore, onAddToCart }) {
  const [hovered, setHovered] = useState(false);
  const centered = useCenteredOnTouch(product.hoverVideo);

  function handleExplore(event) {
    triggerAura(event);
    onExplore(product);
  }

  return (
    <article
      ref={centered.ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col border border-gold-line bg-surface transition-all duration-300 hover:border-gold/60 hover:shadow-glow"
    >
      <button
        type="button"
        onClick={handleExplore}
        aria-label={`Ver detalles de ${product.name}`}
        className="relative cursor-pointer overflow-hidden"
      >
        <ProductImage
          product={product}
          className="h-72"
          imgClassName="p-4 transition-transform duration-300 group-hover:scale-105"
        />
        {product.hoverVideo && <HoverVideo src={product.hoverVideo} active={hovered || centered.active} />}
        {product.featured && <Badge className="absolute left-4 top-4 bg-ink/80">Destacado</Badge>}
        <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-2 text-center text-[10px] font-display uppercase tracking-luxe text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Ver detalles
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-4 border-t border-gold-line p-6">
        <h3 className="font-display text-xl tracking-[0.1em] text-gold-gradient">{product.name}</h3>
        {product.description && <ExpandableText text={product.description} />}
        <div className="mt-auto flex justify-end">
          <Button variant="outline" className="px-4 py-2.5" onClick={() => onAddToCart(product)}>
            Añadir a la bolsa
          </Button>
        </div>
      </div>
    </article>
  );
}

// En pantallas táctiles no hay mouse encima: el video se activa cuando la tarjeta pasa por la
// franja central de la pantalla al hacer scroll.
const TOUCH = window.matchMedia('(hover: none)').matches;

function useCenteredOnTouch(enabled) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!TOUCH || !enabled || !ref.current) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: '-45% 0px -45% 0px',
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled]);

  return { ref, active };
}

// Descripción recortada a dos líneas; "Ver más" la despliega completa en la misma tarjeta.
function ExpandableText({ text }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <p className={`text-base leading-relaxed text-muted ${open ? '' : 'line-clamp-2'}`}>{text}</p>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="mt-2 cursor-pointer text-[11px] font-display uppercase tracking-[0.2em] text-gold transition-colors duration-300 hover:text-gold-light"
      >
        {open ? 'Ver menos' : 'Ver más'}
      </button>
    </div>
  );
}
