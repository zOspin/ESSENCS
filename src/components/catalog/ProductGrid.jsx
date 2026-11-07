import { useEffect, useRef } from 'react';
import ProductCard from './ProductCard.jsx';
import Button from '../common/Button.jsx';

// Retraso de cada tarjeta dentro de una misma tanda (las que entran juntas en pantalla):
// huecos que se acortan, para que la fila llegue como una ola y no como una fila de espera.
const WAVE_MS = [0, 90, 160, 210, 250, 280];

// Piezas anchas que cortan la cuadrícula: la primera abre la colección y otra, con la foto al otro
// lado, la parte en dos. Solo cuando hay perfumes suficientes para que sigan siendo una pausa.
const FEATURES = { 0: false, 10: true };
const MIN_FOR_FEATURES = 8;

export default function ProductGrid({ products, onExplore, onAddToCart, onResetFilters }) {
  const gridRef = useRef(null);

  // Cada tarjeta aparece la primera vez que entra en pantalla, y nunca más.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const io = new IntersectionObserver(
      (entries) => {
        const batch = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target)
          .sort((a, b) => a.offsetTop - b.offsetTop || a.offsetLeft - b.offsetLeft);
        batch.forEach((el, i) => {
          el.style.setProperty('--d', `${WAVE_MS[Math.min(i, WAVE_MS.length - 1)]}ms`);
          el.setAttribute('data-in', '');
          io.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    grid.querySelectorAll('[data-reveal]:not([data-in])').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="fade-up flex flex-col items-center gap-5 bg-ink-2 px-6 py-24 text-center">
        <p className="font-display text-3xl text-soft">Ningún perfume coincide</p>
        <p className="text-base text-muted">Prueba con otra nota, otra familia o para otra persona.</p>
        <Button variant="outline" onClick={onResetFilters}>
          Limpiar filtros
        </Button>
      </div>
    );
  }

  return (
    // items-start: al desplegar "Ver más" solo crece esa tarjeta, no toda la fila.
    <div ref={gridRef} className="grid items-start gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-20">
      {products.map((product, i) => {
        const feature = products.length >= MIN_FOR_FEATURES && i in FEATURES;
        return (
          <ProductCard
            key={product.id}
            product={product}
            feature={feature}
            flip={feature && FEATURES[i]}
            onExplore={onExplore}
            onAddToCart={onAddToCart}
          />
        );
      })}
    </div>
  );
}
