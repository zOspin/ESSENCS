import { useEffect, useRef, useState } from 'react';
import Badge from '../common/Badge.jsx';
import HoverVideo from './HoverVideo.jsx';
import Button from '../common/Button.jsx';
import ProductImage from './ProductImage.jsx';
import { triggerAura } from '../../utils/auraEffect.js';

// Tarjeta sin marco: la foto sobre su papel claro y, debajo, la marca, el nombre, la familia y la
// descripción, sobre el fondo de la página. `feature` la convierte en una pieza ancha (foto grande a un
// lado, texto completo al otro) que corta la cuadrícula; `flip` pone la foto a la derecha.
export default function ProductCard({ product, onExplore, onAddToCart, feature = false, flip = false }) {
  const [hovered, setHovered] = useState(false);
  const centered = useCenteredOnTouch(product.hoverVideo);

  function handleExplore(event) {
    triggerAura(event);
    onExplore(product);
  }

  const meta = [product.family, product.gender].filter(Boolean).join(' · ');

  return (
    <article
      ref={centered.ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-reveal
      className={`group flex flex-col ${
        feature ? 'sm:col-span-2 lg:col-span-3 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-10' : ''
      }`}
    >
      <button
        type="button"
        onClick={handleExplore}
        aria-label={`Ver detalles de ${product.name}`}
        className={`relative cursor-pointer overflow-hidden ${feature ? `lg:col-span-7 ${flip ? 'lg:order-2' : ''}` : ''}`}
      >
        <ProductImage
          product={product}
          className={feature ? 'h-80 sm:h-[26rem] lg:h-[34rem]' : 'h-80'}
          imgClassName="p-6 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />
        {product.hoverVideo && (
          <HoverVideo
            src={product.hoverVideo}
            poster={`/assets/videos/posters/${product.hoverVideo.split('/').pop().replace('.mp4', '.jpg')}`}
            active={hovered || centered.active}
          />
        )}
        {product.featured && <Badge className="absolute left-0 top-0">Destacado</Badge>}
      </button>

      <div className={`flex flex-1 flex-col pt-5 ${feature ? 'lg:col-span-5 lg:pt-0' : ''}`}>
        {product.brand && <p className="text-[15px] text-muted">{product.brand}</p>}
        <h3
          className={`mt-1 font-display font-medium tracking-[0.01em] text-gold-soft ${
            feature ? 'text-[1.75rem] leading-tight sm:text-4xl' : 'text-[1.4rem] leading-snug'
          }`}
        >
          <button
            type="button"
            onClick={handleExplore}
            className="cursor-pointer text-left transition-colors duration-300 hover:text-gold-light"
          >
            {product.name}
          </button>
        </h3>
        {meta && <p className="mt-1 text-[15px] text-muted">{meta}</p>}
        {product.description &&
          (feature ? (
            <p className="mt-5 max-w-prose text-lg leading-relaxed text-soft">{product.description}</p>
          ) : (
            <ExpandableText text={product.description} />
          ))}
        {feature && <NoteLine product={product} />}
        <div className="mt-6 flex items-center gap-5">
          <Button variant={feature ? 'gold' : 'solid'} onClick={() => onAddToCart(product)}>
            Añadir a la bolsa
          </Button>
          <button
            type="button"
            onClick={handleExplore}
            className="link-underline cursor-pointer text-[15px] text-gold-soft"
          >
            Ver detalles
          </button>
        </div>
      </div>
    </article>
  );
}

// En la pieza ancha: las notas de salida, corazón y fondo en una línea cada una.
function NoteLine({ product }) {
  const p = product.olfactoryPyramid;
  if (!p) return null;
  const rows = [
    ['Salida', p.topNotes],
    ['Corazón', p.heartNotes],
    ['Fondo', p.baseNotes],
  ].filter(([, n]) => n?.length);
  return (
    <dl className="mt-6 space-y-2 text-base">
      {rows.map(([label, notes]) => (
        <div key={label} className="flex gap-4">
          <dt className="w-20 shrink-0 text-muted">{label}</dt>
          <dd className="text-soft">{notes.join(', ')}</dd>
        </div>
      ))}
    </dl>
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
    <div className="mt-3">
      <p className={`text-base leading-relaxed text-soft/85 ${open ? '' : 'line-clamp-2'}`}>{text}</p>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="mt-1.5 cursor-pointer text-[15px] text-muted transition-colors duration-300 hover:text-gold-soft"
      >
        {open ? 'Ver menos' : 'Ver más'}
      </button>
    </div>
  );
}
