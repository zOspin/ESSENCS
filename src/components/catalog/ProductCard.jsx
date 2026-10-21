import { useState } from 'react';
import Badge from '../common/Badge.jsx';
import HoverVideo from './HoverVideo.jsx';
import Button from '../common/Button.jsx';
import ProductImage from './ProductImage.jsx';
import { triggerAura } from '../../utils/auraEffect.js';

export default function ProductCard({ product, onExplore, onAddToCart }) {
  const [hovered, setHovered] = useState(false);

  function handleExplore(event) {
    triggerAura(event);
    onExplore(product);
  }

  return (
    <article
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
        {product.hoverVideo && <HoverVideo src={product.hoverVideo} active={hovered} />}
        {product.featured && <Badge className="absolute left-4 top-4 bg-ink/80">Destacado</Badge>}
        {(product.video || product.hoverVideo) && (
          <span className="absolute right-4 top-4 flex items-center gap-1.5 bg-ink/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-gold">
            <svg viewBox="0 0 10 10" className="h-2 w-2" fill="currentColor" aria-hidden="true">
              <path d="M2 1l7 4-7 4z" />
            </svg>
            Video
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-2 text-center text-[10px] uppercase tracking-luxe text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Ver detalles
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-4 border-t border-gold-line p-6">
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-luxe text-muted">
            {[product.brand, product.gender].filter(Boolean).join(' · ')}
          </p>
          <h3 className="font-display text-lg tracking-[0.12em] text-soft">{product.name}</h3>
          {product.subtitle && <p className="text-xs text-muted">{product.subtitle}</p>}
        </div>
        {product.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted">{product.description}</p>
        )}
        <div className="mt-auto flex justify-end">
          <Button variant="outline" className="px-4 py-2.5" onClick={() => onAddToCart(product)}>
            Añadir a la bolsa
          </Button>
        </div>
      </div>
    </article>
  );
}
