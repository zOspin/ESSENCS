import Select from '../common/Select.jsx';
import { SORT_OPTIONS } from '../../config/constants.js';

export default function ControlBar({ resultCount, activeFilters, sortBy, onSortChange, onOpenFilters }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-y border-gold-line py-4">
      <button
        type="button"
        onClick={onOpenFilters}
        className="flex cursor-pointer items-center gap-3 border border-gold-line px-4 py-2.5 text-xs uppercase tracking-luxe text-soft transition-all duration-300 hover:border-gold hover:text-gold hover:shadow-glow"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <path d="M2 4h12M4 8h8M6 12h4" />
        </svg>
        Filtros
        {activeFilters > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold-gradient px-1 text-[10px] font-semibold text-ink">
            {activeFilters}
          </span>
        )}
      </button>

      <p className="order-last w-full text-xs uppercase tracking-luxe text-muted sm:order-none sm:w-auto" aria-live="polite">
        {resultCount} {resultCount === 1 ? 'fragancia' : 'fragancias'}
      </p>

      <Select id="sort" label="Ordenar" value={sortBy} options={SORT_OPTIONS} onChange={onSortChange} />
    </div>
  );
}
