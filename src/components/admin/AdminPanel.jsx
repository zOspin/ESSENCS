import { useEffect, useMemo, useState } from 'react';
import Button from '../common/Button.jsx';
import Logo from '../common/Logo.jsx';
import ProductImage from '../catalog/ProductImage.jsx';
import ProductForm from './ProductForm.jsx';
import { saveCatalog } from '../../services/catalogAdminService.js';

// Panel para agregar, editar y eliminar perfumes. Escribe en public/catalog.json a través
// de la API local de desarrollo; los cambios llegan a la web publicada al subirlos a GitHub.
export default function AdminPanel({ products, onProductsChange }) {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(undefined); // undefined = cerrado, null = nuevo
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (status?.type !== 'ok') return;
    const t = setTimeout(() => setStatus(null), 2500);
    return () => clearTimeout(t);
  }, [status]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => `${p.brand} ${p.name}`.toLowerCase().includes(q));
  }, [products, query]);

  const missingDescription = products.filter((p) => !p.description).length;

  async function persist(next, message) {
    const previous = products;
    onProductsChange(next);
    try {
      await saveCatalog(next);
      setStatus({ type: 'ok', text: message });
    } catch (err) {
      onProductsChange(previous);
      setStatus({ type: 'error', text: `No se pudo guardar: ${err.message}` });
      throw err;
    }
  }

  async function saveProduct(product) {
    const exists = products.some((p) => p.id === product.id);
    const next = exists ? products.map((p) => (p.id === product.id ? product : p)) : [product, ...products];
    await persist(next, exists ? `«${product.name}» actualizado` : `«${product.name}» agregado`);
    setEditing(undefined);
  }

  function updateField(id, changes, message) {
    persist(
      products.map((p) => (p.id === id ? { ...p, ...changes } : p)),
      message,
    ).catch(() => {});
  }

  function remove(product) {
    if (!window.confirm(`¿Eliminar «${product.name}» del catálogo?`)) return;
    persist(
      products.filter((p) => p.id !== product.id),
      `«${product.name}» eliminado`,
    ).catch(() => {});
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-gold-line bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
          <Logo />
          <a
            href="#"
            className="text-xs uppercase tracking-luxe text-soft transition-colors duration-300 hover:text-gold"
          >
            ← Ver tienda
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl tracking-luxe text-soft">Catálogo</h1>
            <p className="mt-2 text-sm text-muted">
              {products.length} perfumes
              {missingDescription > 0 && ` · ${missingDescription} sin descripción`}
            </p>
          </div>
          <Button onClick={() => setEditing(null)}>+ Agregar perfume</Button>
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por marca o nombre…"
          className="mt-8 w-full border border-gold-line bg-surface px-4 py-3 text-sm text-soft placeholder:text-muted/60 focus:border-gold focus:outline-none"
        />

        <ul className="mt-6 divide-y divide-gold-line border border-gold-line bg-surface">
          {visible.map((product) => (
            <li key={product.id} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
              <ProductImage product={product} className="h-16 w-14 shrink-0" imgClassName="p-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted">
                  {[product.brand, product.gender, product.family].filter(Boolean).join(' · ')}
                </p>
                <p className="truncate font-display tracking-[0.08em] text-soft">{product.name}</p>
                <p className="truncate text-xs text-muted">{product.description || 'Sin descripción'}</p>
              </div>

              <label className="flex items-center gap-2 text-xs text-muted" title="Aparece primero y con la etiqueta Destacado">
                <input
                  type="checkbox"
                  checked={product.featured}
                  onChange={(e) =>
                    updateField(
                      product.id,
                      { featured: e.target.checked },
                      e.target.checked ? `«${product.name}» destacado` : `«${product.name}» ya no está destacado`,
                    )
                  }
                  className="h-4 w-4 accent-gold"
                />
                Destacado
              </label>

              <div className="flex gap-2">
                <RowButton onClick={() => setEditing(product)}>Editar</RowButton>
                <RowButton onClick={() => remove(product)} danger>
                  Eliminar
                </RowButton>
              </div>
            </li>
          ))}
          {visible.length === 0 && <li className="p-8 text-center text-sm text-muted">Sin resultados.</li>}
        </ul>
      </main>

      {status && (
        <div
          role="status"
          className={`fade-in fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border px-5 py-3 text-sm shadow-glow ${
            status.type === 'ok' ? 'border-gold bg-surface text-gold' : 'border-red-400 bg-surface text-red-400'
          }`}
        >
          {status.text}
        </div>
      )}

      {editing !== undefined && (
        <ProductForm product={editing} products={products} onSave={saveProduct} onClose={() => setEditing(undefined)} />
      )}
    </div>
  );
}

function RowButton({ onClick, danger = false, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer border px-3 py-2 text-[10px] uppercase tracking-[0.15em] transition-colors duration-300 ${
        danger
          ? 'border-red-400/30 text-red-300 hover:border-red-400'
          : 'border-gold-line text-soft hover:border-gold hover:text-gold'
      }`}
    >
      {children}
    </button>
  );
}
