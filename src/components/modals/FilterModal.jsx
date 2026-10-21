import { useState } from 'react';
import Overlay from '../common/Overlay.jsx';
import CloseButton from '../common/CloseButton.jsx';
import Button from '../common/Button.jsx';
import Chip from '../common/Chip.jsx';
import { FAMILIES } from '../../config/constants.js';
import { DEFAULT_FILTERS } from '../../services/productService.js';

// Edita una copia local y solo la aplica al pulsar "Aplicar".
export default function FilterModal({ filters, onApply, onClose }) {
  const [draft, setDraft] = useState(filters);

  function toggleFamily(family) {
    setDraft((d) => ({
      ...d,
      families: d.families.includes(family) ? d.families.filter((f) => f !== family) : [...d.families, family],
    }));
  }

  return (
    <Overlay onClose={onClose} label="Filtros">
      <div className="rise-in w-full max-w-lg border border-gold-line bg-surface">
        <div className="flex items-center justify-between border-b border-gold-line px-6 py-5">
          <h2 className="font-display text-lg tracking-luxe text-gold">Filtros</h2>
          <CloseButton onClick={onClose} />
        </div>

        <div className="px-6 py-6">
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
