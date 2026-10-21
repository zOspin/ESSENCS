import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import ControlBar from './components/catalog/ControlBar.jsx';
import ProductGrid from './components/catalog/ProductGrid.jsx';
import CartDrawer from './components/modals/CartDrawer.jsx';
import FilterModal from './components/modals/FilterModal.jsx';
import ProductDetailModal from './components/modals/ProductDetailModal.jsx';
import {
  DEFAULT_FILTERS,
  countActiveFilters,
  filterProducts,
  getCartTotals,
  getProducts,
  sortProducts,
} from './services/productService.js';
import { BRAND } from './config/constants.js';

export default function App() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState('featured');
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const visible = useMemo(
    () => sortProducts(filterProducts(products, filters), sortBy),
    [products, filters, sortBy],
  );

  const addToCart = useCallback((product) => {
    setCart((items) => {
      const existing = items.find((i) => i.product.id === product.id);
      return existing
        ? items.map((i) => (i === existing ? { ...i, qty: i.qty + 1 } : i))
        : [...items, { product, qty: 1 }];
    });
  }, []);

  const changeQty = useCallback((id, qty) => {
    setCart((items) =>
      qty <= 0 ? items.filter((i) => i.product.id !== id) : items.map((i) => (i.product.id === id ? { ...i, qty } : i)),
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((items) => items.filter((i) => i.product.id !== id));
  }, []);

  const closeCart = useCallback(() => setCartOpen(false), []);
  const closeFilters = useCallback(() => setFiltersOpen(false), []);
  const closeDetail = useCallback(() => setSelected(null), []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header cartCount={getCartTotals(cart).count} onOpenCart={() => setCartOpen(true)} />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-gold-line">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.18),transparent_60%)]" />
          <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
            <img
              src={BRAND.logo}
              alt={`${BRAND.name} ${BRAND.tagline}`}
              width="720"
              height="720"
              className="fade-in mx-auto w-56 mix-blend-screen sm:w-72"
            />
            <h1 className="mt-8 font-display text-4xl leading-tight tracking-[0.12em] text-gold-gradient sm:text-6xl">
              El arte invisible de la presencia
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted">
              Fragancias de autor compuestas con materias primas excepcionales y maceradas en pequeñas series.
            </p>
            <a
              href="#coleccion"
              className="mt-10 inline-block border border-gold-line px-8 py-3 text-xs uppercase tracking-luxe text-gold transition-all duration-300 hover:border-gold hover:shadow-glow"
            >
              Descubrir la colección
            </a>
          </div>
        </section>

        <section id="coleccion" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-8">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl tracking-luxe text-soft sm:text-3xl">La Colección</h2>
            <div className="mx-auto mt-4 h-px w-16 bg-gold-gradient" />
          </div>

          <ControlBar
            resultCount={visible.length}
            activeFilters={countActiveFilters(filters)}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onOpenFilters={() => setFiltersOpen(true)}
          />

          <div className="mt-8">
            <ProductGrid
              products={visible}
              onExplore={setSelected}
              onAddToCart={addToCart}
              onResetFilters={() => setFilters(DEFAULT_FILTERS)}
            />
          </div>
        </section>
      </main>

      <Footer />

      {cartOpen && (
        <CartDrawer items={cart} onClose={closeCart} onChangeQty={changeQty} onRemove={removeFromCart} />
      )}
      {filtersOpen && <FilterModal filters={filters} onApply={setFilters} onClose={closeFilters} />}
      {selected && <ProductDetailModal product={selected} onClose={closeDetail} onAddToCart={addToCart} />}
    </div>
  );
}
