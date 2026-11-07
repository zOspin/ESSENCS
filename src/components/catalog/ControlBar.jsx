import Select from '../common/Select.jsx';
import Chip from '../common/Chip.jsx';
import { GENDERS, SORT_OPTIONS } from '../../config/constants.js';

// Una sola franja, un tono más clara que la página: para quién a la izquierda; filtros, orden y
// cuántos perfumes hay a la derecha. La nota elegida arriba aparece aquí para poder quitarla.
export default function ControlBar({
  resultCount,
  activeFilters,
  gender,
  onGenderChange,
  note,
  onClearNote,
  sortBy,
  onSortChange,
  onOpenFilters,
}) {
  return (
    <div className="flex flex-col gap-4 bg-ink-2 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Para quién">
        <Chip active={gender === null} onClick={() => onGenderChange(null)}>
          Todos
        </Chip>
        {GENDERS.map((g) => (
          <Chip key={g} active={gender === g} onClick={() => onGenderChange(g)}>
            {g}
          </Chip>
        ))}
        {note && (
          <button
            type="button"
            onClick={onClearNote}
            aria-label={`Quitar la nota ${note}`}
            className="ml-1 inline-flex cursor-pointer items-center gap-2 bg-gold-soft px-4 py-2.5 text-[15px] text-ink transition-[filter,scale] duration-300 hover:brightness-110 active:scale-[0.96] active:duration-100"
          >
            Con {note.toLowerCase()}
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <p className="text-base text-muted tabular-nums" aria-live="polite">
          {resultCount} {resultCount === 1 ? 'perfume' : 'perfumes'}
        </p>
        <button
          type="button"
          onClick={onOpenFilters}
          className="flex cursor-pointer items-center gap-2.5 bg-surface-2 px-4 py-2.5 text-[15px] text-soft transition-[background-color,color,scale] duration-300 hover:bg-[#26241f] hover:text-gold-soft active:scale-[0.97] active:duration-100"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-gold-soft" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
            <path d="M2 4h12M4 8h8M6 12h4" />
          </svg>
          Familias
          {activeFilters > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold-soft px-1 text-[13px] font-medium text-ink">
              {activeFilters}
            </span>
          )}
        </button>
        <Select id="sort" label="Ordenar por" value={sortBy} options={SORT_OPTIONS} onChange={onSortChange} />
      </div>
    </div>
  );
}
