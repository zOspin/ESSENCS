import ProductCard from './ProductCard.jsx';
import Button from '../common/Button.jsx';

export default function ProductGrid({ products, onExplore, onAddToCart, onResetFilters }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 border border-gold-line py-20 text-center">
        <p className="font-display text-lg tracking-[0.15em] text-soft">Ninguna fragancia coincide</p>
        <p className="text-sm text-muted">Prueba con otra familia olfativa o amplía el rango de precio.</p>
        <Button variant="outline" onClick={onResetFilters}>
          Limpiar filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onExplore={onExplore} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
