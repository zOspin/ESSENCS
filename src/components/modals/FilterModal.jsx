import { useState } from 'react';
import Overlay from '../common/Overlay.jsx';
import CloseButton from '../common/CloseButton.jsx';
import Button from '../common/Button.jsx';
import Chip from '../common/Chip.jsx';
import { FAMILIES } from '../../config/constants.js';
import { DEFAULT_FILTERS } from '../../services/productService.js';
import { formatPrice } from '../../utils/formatters.js';

// Edita una copia local y solo la aplica al pulsar "Aplicar".
// `priceBounds` es null mientras ningún perfume tenga precio: entonces no se muestra el rango.
export default function FilterModal({ filters, priceBounds, onApply, onClose }) {
  const [draft, setDraft] = useState(filters);
  const step = 10000;
  const lo = priceBounds ? Math.floor(priceBounds.min / step) * step : 0;
  const hi = priceBounds ? Math.ceil(priceBounds.max / step) * step : 0;
  const minValue = draft.minPrice ?? lo;
  const maxValue = draft.maxPrice ?? hi;

  function toggleFamily(family) {
    setDraft((d) => ({
      ...d,
      families: d.families.includes(family) ? d.families.filter((f) => f !== family) : [...d.families, family],
    }));
  }

  // Un extremo en su tope equivale a "sin límite", para no excluir precios nuevos más altos o bajos.
  function setPrice(key, value) {
    const n = Number(value);
    setDraft((d) => {
      if (key === 'minPrice') {
        const v = Math.min(n, d.maxPrice ?? hi);
        return { ...d, minPrice: v <= lo ? null : v };
      }
      const v = Math.max(n, d.minPrice ?? lo);
      return { ...d, maxPrice: v >= hi ? null : v };
    });
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
              {FAMILIES.map((family) => (
                <Chip key={family} active={draft.families.includes(family)} onClick={() => toggleFamily(family)}>
                  {family}
                </Chip>
              ))}
            </div>
          </fieldset>

          {priceBounds && hi > lo && (
            <fieldset>
              <legend className="mb-4 text-xs uppercase tracking-luxe text-muted">Rango de precio</legend>
              <p className="mb-4 font-display text-gold">
                {formatPrice(minValue)} — {formatPrice(maxValue)}
              </p>
              <div className="space-y-3">
                <PriceSlider label="Mín." min={lo} max={hi} step={step} value={minValue} onChange={(v) => setPrice('minPrice', v)} />
                <PriceSlider label="Máx." min={lo} max={hi} step={step} value={maxValue} onChange={(v) => setPrice('maxPrice', v)} />
              </div>
            </fieldset>
          )}
        </div>

        <div className="flex gap-3 border-t border-gold-line px-6 py-5">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setDraft(DEFAULT_FILTERS)}
          >
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

function PriceSlider({ label, min, max, step, value, onChange }) {
  return (
    <label className="flex items-center gap-4 text-xs text-muted">
      <span className="w-12">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full accent-gold"
      />
    </label>
  );
}
