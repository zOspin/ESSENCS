import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import PerfumeBottle from './PerfumeBottle.jsx';
import { formatPrice } from '../../utils/formatters.js';
import { triggerAura } from '../../utils/auraEffect.js';

export default function ProductCard({ product, onExplore, onAddToCart }) {
  function handleExplore(event) {
    triggerAura(event);
    onExplore(product);
  }

  return (
    <article className="group flex flex-col border border-gold-line bg-surface transition-all duration-300 hover:border-gold/60 hover:shadow-glow">
      <button
        type="button"
        onClick={handleExplore}
        aria-label={`Explorar pirámide olfativa de ${product.name}`}
        className="relative flex h-72 cursor-pointer items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_60%,rgba(212,175,55,0.12),transparent_65%)]"
      >
        {product.featured && <Badge className="absolute left-4 top-4 bg-ink/60">Destacado</Badge>}
        <PerfumeBottle
          liquid={product.bottle.liquid}
          shape={product.bottle.shape}
          className="h-56 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105"
        />
        <span className="absolute bottom-4 text-[10px] uppercase tracking-luxe text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Explorar pirámide olfativa
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-4 border-t border-gold-line p-6">
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-luxe text-muted">{product.family}</p>
          <h3 className="font-display text-lg tracking-[0.15em] text-soft">{product.name}</h3>
          <p className="text-xs text-muted">{product.subtitle}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-4">
          <span className="font-display text-xl text-gold-gradient">{formatPrice(product.price)}</span>
          <Button variant="outline" className="px-4 py-2.5" onClick={() => onAddToCart(product)}>
            Añadir
          </Button>
        </div>
      </div>
    </article>
  );
}
