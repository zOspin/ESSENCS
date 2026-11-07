import { triggerAura } from '../../utils/auraEffect.js';

// Botones planos, de esquinas rectas como el resto de la tienda.
// gold: la acción principal (pedir, aplicar). solid: secundaria, un tono sobre el fondo. ghost: solo texto.
const VARIANTS = {
  gold: 'bg-gold-soft text-ink hover:brightness-110',
  solid: 'bg-surface-2 text-soft hover:bg-gold-soft hover:text-ink',
  outline: 'bg-surface-2 text-soft hover:bg-gold-soft hover:text-ink',
  ghost: 'text-soft hover:text-gold-soft',
};

export default function Button({
  variant = 'gold',
  className = '',
  onClick,
  children,
  type = 'button',
  ...props
}) {
  function handleClick(event) {
    triggerAura(event);
    onClick?.(event);
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden px-6 py-3 font-ui text-[15px] font-medium transition-[background-color,color,filter,scale] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] active:duration-100 disabled:pointer-events-none disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
