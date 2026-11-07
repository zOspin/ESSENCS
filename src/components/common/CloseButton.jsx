export default function CloseButton({ onClick, label = 'Cerrar' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-10 w-10 cursor-pointer place-items-center bg-surface-2 text-gold-soft transition-[background-color,scale] duration-300 hover:bg-[#26241f] active:scale-90 active:duration-100"
    >
      <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </button>
  );
}
