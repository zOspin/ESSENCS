import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import IntroSplash from './components/layout/IntroSplash.jsx';
import Vitrina from './components/vitrina/Vitrina.jsx';
import ControlBar from './components/catalog/ControlBar.jsx';
import ProductGrid from './components/catalog/ProductGrid.jsx';
import CartDrawer from './components/modals/CartDrawer.jsx';
import FilterModal from './components/modals/FilterModal.jsx';
import ProductDetailModal from './components/modals/ProductDetailModal.jsx';
import {
  DEFAULT_FILTERS,
  countActiveFilters,
  filterProducts,
  getCartCount,
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

// La página tiene dos vistas según el hash: el inicio (la vitrina) y la colección
// (#coleccion). Así el botón Atrás del navegador vuelve al inicio.
const STORE_HASHES = ['#coleccion'];

// La intro se salta si el sistema pide menos movimiento.
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  const [hash, setHash] = useState(() => window.location.hash);
  const adminOpen = ADMIN_ENABLED && hash === '#admin';
  const storeOpen = STORE_HASHES.includes(hash);
  const [introOpen, setIntroOpen] = useState(() => !REDUCED_MOTION && window.location.hash !== '#admin');
  const closeIntro = useCallback(() => setIntroOpen(false), []);

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
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Al cambiar de vista se empieza arriba.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [hash]);

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

  const header = <Header cartCount={getCartCount(cart)} onOpenCart={() => setCartOpen(true)} />;

  const modals = (
    <>
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
        <FilterModal filters={filters} onApply={setFilters} onClose={closeFilters} />
      )}
      {selected && <ProductDetailModal product={selected} onClose={closeDetail} onAddToCart={addToCart} />}
      {introOpen && <IntroSplash onDone={closeIntro} />}
    </>
  );

  // Inicio (prototipo): la vitrina de nichos iluminados. Al tocar un frasco se abre su ficha.
  if (!storeOpen) {
    return (
      <div className="flex min-h-svh flex-col">
        {header}
        <main className="relative flex flex-1 flex-col">
          <h1 className="sr-only">
            {BRAND.name} {BRAND.tagline}
          </h1>
          <Vitrina products={products} ready={!introOpen} onAddToCart={addToCart} />
        </main>
        {modals}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {header}

      <main className="flex-1">
        <section id="coleccion" className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl tracking-[0.12em] text-gold-gradient sm:text-5xl">Nuestra Colección</h2>
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
      {modals}
    </div>
  );
}
