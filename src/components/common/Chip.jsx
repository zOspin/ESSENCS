export default function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`cursor-pointer border px-4 py-2 text-xs font-display uppercase tracking-[0.15em] transition-all duration-300 ${
        active ? 'border-gold bg-gold/10 text-gold shadow-glow' : 'border-gold-line text-soft hover:border-gold hover:text-gold'
      }`}
    >
      {children}
    </button>
  );
}
