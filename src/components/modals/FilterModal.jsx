import { useState } from 'react';
import Overlay from '../common/Overlay.jsx';
import CloseButton from '../common/CloseButton.jsx';
import Button from '../common/Button.jsx';
import { FAMILIES, PRICE_RANGE } from '../../config/constants.js';
import { DEFAULT_FILTERS } from '../../services/productService.js';
import { formatPrice } from '../../utils/formatters.js';

// Edita una copia local y solo la aplica al pulsar "Aplicar".
export default function FilterModal({ filters, onApply, onClose }) {
  const [draft, setDraft] = useState(filters);

  function toggleFamily(family) {
    setDraft((d) => ({
      ...d,
      families: d.families.includes(family) ? d.families.filter((f) => f !== family) : [...d.families, family],
    }));
  }

  function setPrice(key, value) {
    const n = Number(value);
    setDraft((d) =>
      key === 'minPrice' ? { ...d, minPrice: Math.min(n, d.maxPrice) } : { ...d, maxPrice: Math.max(n, d.minPrice) },
    );
  }

  return (
    <Overlay onClose={onClose} label="Filtros">
      <div className="rise-in w-full max-w-lg border border-gold-line bg-surface">
        <div className="flex items-center justify-between border-b border-gold-line px-6 py-5">
          <h2 className="font-display text-lg tracking-luxe text-gold">Filtros</h2>
          <CloseButton onClick={onClose} />
        </div>

        <div className="space-y-8 px-6 py-6">
          <fieldset>
            <legend className="mb-4 text-xs uppercase tracking-luxe text-muted">Familia olfativa</legend>
            <div className="flex flex-wrap gap-2">
              {FAMILIES.map((family) => {
                const active = draft.families.includes(family);
                return (
                  <button
                    key={family}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleFamily(family)}
                    className={`cursor-pointer border px-4 py-2 text-xs uppercase tracking-[0.15em] transition-all duration-300 ${
                      active
                        ? 'border-gold bg-gold/10 text-gold shadow-glow'
                        : 'border-gold-line text-soft hover:border-gold hover:text-gold'
                    }`}
                  >
                    {family}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-4 flex w-full justify-between text-xs uppercase tracking-luxe text-muted">
              <span>Rango de precio</span>
            </legend>
            <p className="mb-4 font-display text-gold">
              {formatPrice(draft.minPrice)} — {formatPrice(draft.maxPrice)}
            </p>
            <div className="space-y-3">
              <label className="flex items-center gap-4 text-xs text-muted">
                <span className="w-12">Mín.</span>
                <input
                  type="range"
                  min={PRICE_RANGE.min}
                  max={PRICE_RANGE.max}
                  step="5"
                  value={draft.minPrice}
                  onChange={(e) => setPrice('minPrice', e.target.value)}
                  className="w-full accent-gold"
                />
              </label>
              <label className="flex items-center gap-4 text-xs text-muted">
                <span className="w-12">Máx.</span>
                <input
                  type="range"
                  min={PRICE_RANGE.min}
                  max={PRICE_RANGE.max}
                  step="5"
                  value={draft.maxPrice}
                  onChange={(e) => setPrice('maxPrice', e.target.value)}
                  className="w-full accent-gold"
                />
              </label>
            </div>
          </fieldset>
        </div>

        <div className="flex gap-3 border-t border-gold-line px-6 py-5">
          <Button variant="outline" className="flex-1" onClick={() => setDraft(DEFAULT_FILTERS)}>
            Limpiar
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            Aplicar
          </Button>
        </div>
      </div>
    </Overlay>
  );
}
