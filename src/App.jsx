import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import IntroSplash from './components/layout/IntroSplash.jsx';
import HomeBackdrop from './components/layout/HomeBackdrop.jsx';
import ControlBar from './components/catalog/ControlBar.jsx';
import CollectionHero, { scrollToGrid } from './components/catalog/CollectionHero.jsx';
import HowToOrder from './components/catalog/HowToOrder.jsx';
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
  getTopNotes,
  sortProducts,
} from './services/productService.js';
import { buildOrderMessage, getWhatsAppUrl } from './services/whatsappService.js';
import { loadCart, saveCart } from './utils/cartStorage.js';
import { useExit } from './utils/useExit.js';
import { BRAND } from './config/constants.js';

// El panel de administración solo existe con `npm run dev`; en la web publicada no se incluye.
const ADMIN_ENABLED = import.meta.env.DEV;
// Import dinámico condicionado: el build de producción elimina el panel por completo.
const AdminPanel = ADMIN_ENABLED ? lazy(() => import('./components/admin/AdminPanel.jsx')) : null;

// La página tiene dos vistas según el hash: el inicio (logo y botón) y la colección
// (#coleccion). Así el botón Atrás del navegador vuelve al inicio.
const STORE_HASHES = ['#coleccion'];

// La intro se salta si el sistema pide menos movimiento.
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function App() {
  const [products, setProducts] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [gender, setGender] = useState(null);
  const [note, setNote] = useState(null);
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
    () => sortProducts(filterProducts(products, filters, gender, note), sortBy),
    [products, filters, gender, note, sortBy],
  );
  const topNotes = useMemo(() => getTopNotes(products, 10), [products]);
  // Al elegir una nota en la portada, la página baja a los perfumes que la llevan.
  const pickNote = useCallback((name) => {
    setNote(name);
    if (name) requestAnimationFrame(scrollToGrid);
  }, []);

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

  // Bolsa, filtros y ficha se cierran con su animación de salida antes de desmontarse.
  const [cartClosing, closeCart] = useExit(useCallback(() => setCartOpen(false), []));
  const [filtersClosing, closeFilters] = useExit(useCallback(() => setFiltersOpen(false), []));
  const [detailClosing, exitDetail] = useExit(useCallback(() => setSelected(null), []));
  // Abrir un perfume agrega un paso al historial: el botón Atrás (o la flecha de la ficha)
  // cierra la ficha y deja al cliente en la colección, donde estaba.
  // El navegador, al volver, recoloca la página por su cuenta (y la manda casi arriba):
  // la posición se guarda al abrir y se restaura exacta al cerrar.
  const detailScroll = useRef(null);
  const openDetail = useCallback((product) => {
    detailScroll.current = window.scrollY;
    window.history.pushState({ detail: product.id }, '');
    setSelected(product);
  }, []);
  // Con el paso en el historial, se retrocede y el popstate hace la salida; sin él, se sale ya.
  const closeDetail = useCallback(() => {
    if (window.history.state?.detail) window.history.back();
    else exitDetail();
  }, [exitDetail]);
  const onPopRef = useRef(null);
  onPopRef.current = () => {
    if (selected) exitDetail();
  };

  useLayoutEffect(() => {
    if (selected || detailScroll.current === null) return;
    const top = detailScroll.current;
    detailScroll.current = null;
    window.scrollTo({ top, behavior: 'instant' });
    // El navegador puede recolocar la página justo después del Atrás: se corrige una vez más.
    requestAnimationFrame(() => window.scrollTo({ top, behavior: 'instant' }));
  }, [selected]);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    // Tras recargar con la ficha abierta, ese paso ya no tiene ficha que cerrar.
    if (window.history.state?.detail) window.history.replaceState(null, '');
    const onPop = () => onPopRef.current();
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

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
          closing={cartClosing}
          onChangeQty={changeQty}
          onRemove={removeFromCart}
          onCheckout={checkout}
        />
      )}
      {filtersOpen && (
        <FilterModal filters={filters} onApply={setFilters} onClose={closeFilters} closing={filtersClosing} />
      )}
      {selected && (
        <ProductDetailModal product={selected} onClose={closeDetail} closing={detailClosing} onAddToCart={addToCart} />
      )}
      {introOpen && <IntroSplash onDone={closeIntro} />}
    </>
  );

  // Inicio: una sola pantalla con el logo grande sobre el fondo de paneles dorados y el botón
  // al catálogo; no hay nada más al hacer scroll.
  if (!storeOpen) {
    return (
      <div className="flex h-svh flex-col overflow-hidden">
        {header}
        {/* La entrada del inicio espera a que la intro se retire (ver animations.css). */}
        <main
          className={`relative flex flex-1 flex-col items-center justify-center gap-10 px-4 pb-10 ${introOpen ? '' : 'home-ready'}`}
        >
          <HomeBackdrop />
          <h1 className="sr-only">
            {BRAND.name} {BRAND.tagline}
          </h1>
          <div className="home-logo relative">
            <img
              src={BRAND.logoTransparent}
              alt={`${BRAND.name} ${BRAND.tagline}`}
              width="720"
              height="720"
              className="relative h-auto max-h-[60svh] w-[min(90vw,34rem)] object-contain"
            />
            <div
              className="logo-shine pointer-events-none absolute inset-0"
              style={{ '--logo': `url(${BRAND.logoTransparent})` }}
            />
          </div>
          {/* Botón "joya": dorado metálico dentro de un segundo marco fino con rombos a los lados. */}
          <a href="#coleccion" className="catalog-cta home-cta group relative inline-block p-[7px]">
            <span className="catalog-cta-face relative flex items-center gap-4 overflow-hidden px-7 py-4 font-display text-[15px] font-bold tracking-[0.22em] text-ink sm:px-10 sm:text-lg sm:tracking-[0.26em]">
              <span className="catalog-cta-shine pointer-events-none absolute inset-0" aria-hidden="true" />
              <span className="relative whitespace-nowrap">Explorar perfumes</span>
              {/* La flecha avanza al pasar el mouse: invita a seguir. */}
              <svg
                viewBox="0 0 22 12"
                aria-hidden="true"
                className="relative h-3 w-[22px] shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
              >
                <path d="M0 6h20M15 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
          </a>
        </main>
        {modals}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {header}

      <main className="flex-1">
        <CollectionHero
          products={products}
          total={visible.length}
          notes={topNotes}
          note={note}
          onNote={pickNote}
          onExplore={openDetail}
        />

        {/* `perfumes` es donde bajan la portada y las notas. */}
        <section aria-label="Perfumes" className="mx-auto max-w-7xl px-4 pb-32 sm:px-8">
          <div id="perfumes" className="fade-up scroll-mt-24" style={{ '--d': '500ms' }}>
            <ControlBar
              resultCount={visible.length}
              activeFilters={countActiveFilters(filters)}
              gender={gender}
              onGenderChange={setGender}
              note={note}
              onClearNote={() => setNote(null)}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onOpenFilters={() => setFiltersOpen(true)}
            />
          </div>

          <div className="mt-12">
            {loadError ? (
              <p className="bg-ink-2 py-20 text-center text-base text-soft">
                No pudimos cargar el catálogo. Recarga la página o escríbenos por WhatsApp.
              </p>
            ) : (
              <ProductGrid
                products={visible}
                onExplore={openDetail}
                onAddToCart={addToCart}
                onResetFilters={() => {
                  setFilters(DEFAULT_FILTERS);
                  setGender(null);
                  setNote(null);
                }}
              />
            )}
          </div>
        </section>

        <HowToOrder />
      </main>

      <Footer />
      {modals}
    </div>
  );
}
