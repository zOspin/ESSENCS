import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
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
  getPriceBounds,
  getProducts,
  sortProducts,
} from './services/productService.js';
import { buildOrderMessage, getWhatsAppUrl } from './services/whatsappService.js';
import { loadCart, saveCart } from './utils/cartStorage.js';
import { BRAND } from './config/constants.js';

// El panel de administración solo existe con `npm run dev`; en la web publicada no se incluye.
const ADMIN_ENABLED = import.meta.env.DEV;
// Import dinámico condicionado: el build de producción elimina el panel por completo.
const AdminPanel = ADMIN_ENABLED ? lazy(() => import('./components/admin/AdminPanel.jsx')) : null;
const isAdminHash = () => ADMIN_ENABLED && window.location.hash === '#admin';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [gender, setGender] = useState(null);
  const [sortBy, setSortBy] = useState('featured');
  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [selected, setSelected] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(isAdminHash);

  useEffect(() => {
    getProducts()
      .then((list) => {
        setProducts(list);
        setCart(loadCart(list));
        setCartLoaded(true);
      })
      .catch((err) => setLoadError(err.message));
  }, []);

  useEffect(() => {
    if (!ADMIN_ENABLED) return;
    const onHash = () => setAdminOpen(isAdminHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Si el catálogo cambia (p. ej. un precio editado), la bolsa usa los datos nuevos
  // y suelta los perfumes que ya no existen.
  useEffect(() => {
    setCart((items) =>
      items
        .map((i) => ({ ...i, product: products.find((p) => p.id === i.product.id) }))
        .filter((i) => i.product),
    );
  }, [products]);

  // No guardar hasta haber leído la bolsa guardada, o se borraría con la bolsa vacía inicial.
  useEffect(() => {
    if (cartLoaded) saveCart(cart);
  }, [cart, cartLoaded]);

  const checkout = useCallback(() => {
    window.open(getWhatsAppUrl(buildOrderMessage(cart)), '_blank', 'noopener');
  }, [cart]);

  const visible = useMemo(
    () => sortProducts(filterProducts(products, filters, gender), sortBy),
    [products, filters, gender, sortBy],
  );
  const priceBounds = useMemo(() => getPriceBounds(products), [products]);

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

  if (adminOpen) {
    return (
      <Suspense fallback={null}>
        <AdminPanel products={products} onProductsChange={setProducts} />
      </Suspense>
    );
  }

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
              Perfumes de diseñador y perfumería árabe, seleccionados para ti. Elige tus favoritos y te atendemos
              personalmente por WhatsApp.
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
            gender={gender}
            onGenderChange={setGender}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onOpenFilters={() => setFiltersOpen(true)}
          />

          <div className="mt-8">
            {loadError ? (
              <p className="border border-gold-line py-20 text-center text-sm text-muted">
                No pudimos cargar el catálogo. Recarga la página o escríbenos por WhatsApp.
              </p>
            ) : (
              <ProductGrid
                products={visible}
                onExplore={setSelected}
                onAddToCart={addToCart}
                onResetFilters={() => {
                  setFilters(DEFAULT_FILTERS);
                  setGender(null);
                }}
              />
            )}
          </div>
        </section>
      </main>

      <Footer />

      {cartOpen && (
        <CartDrawer
          items={cart}
          onClose={closeCart}
          onChangeQty={changeQty}
          onRemove={removeFromCart}
          onCheckout={checkout}
        />
      )}
      {filtersOpen && (
        <FilterModal filters={filters} priceBounds={priceBounds} onApply={setFilters} onClose={closeFilters} />
      )}
      {selected && <ProductDetailModal product={selected} onClose={closeDetail} onAddToCart={addToCart} />}

      {ADMIN_ENABLED && (
        <a
          href="#admin"
          className="fixed bottom-4 left-4 z-30 border border-gold-line bg-ink/90 px-4 py-2 text-[10px] uppercase tracking-luxe text-gold transition-all duration-300 hover:border-gold hover:shadow-glow"
        >
          Administrar catálogo
        </a>
      )}
    </div>
  );
}
