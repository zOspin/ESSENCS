export default function Select({ id, label, value, options, onChange }) {
  return (
    <label htmlFor={id} className="flex items-center gap-3 text-xs font-display uppercase tracking-luxe text-muted">
      <span className="hidden sm:inline">{label}</span>
      <span className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none cursor-pointer border border-gold-line bg-surface py-2.5 pl-4 pr-10 text-xs font-display uppercase tracking-luxe text-soft transition-colors duration-300 hover:border-gold focus:border-gold focus:outline-none"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gold"
        >
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </span>
    </label>
  );
}
