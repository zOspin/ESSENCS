export default function Select({ id, label, value, options, onChange }) {
  return (
    <label htmlFor={id} className="flex items-center gap-3 text-base text-muted">
      <span className="hidden sm:inline">{label}</span>
      <span className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="cursor-pointer appearance-none bg-surface-2 py-2.5 pl-4 pr-10 text-[15px] text-soft transition-colors duration-300 hover:bg-[#26241f] focus:outline-none focus-visible:outline-1 focus-visible:outline-gold"
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
          className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gold-soft"
        >
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </span>
    </label>
  );
}
