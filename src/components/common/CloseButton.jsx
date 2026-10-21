export default function CloseButton({ onClick, label = 'Cerrar' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-9 w-9 cursor-pointer place-items-center border border-gold-line text-gold transition-all duration-300 hover:border-gold hover:shadow-glow"
    >
      <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </button>
  );
}
