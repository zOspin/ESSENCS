// Opción que se elige y se queda marcada: rellena de dorado cuando está activa, un tono más clara
// que el fondo cuando no. Sin bordes ni brillos.
export default function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`cursor-pointer px-4 py-2.5 text-[15px] transition-[background-color,color,scale] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.96] active:duration-100 ${
        active ? 'bg-gold-soft text-ink' : 'bg-surface-2 text-soft hover:bg-[#26241f] hover:text-gold-soft'
      }`}
    >
      {children}
    </button>
  );
}
