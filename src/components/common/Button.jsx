import { triggerAura } from '../../utils/auraEffect.js';

const VARIANTS = {
  gold: 'bg-gold-gradient text-ink hover:shadow-glow',
  outline: 'border border-gold-line text-gold hover:border-gold hover:shadow-glow',
  ghost: 'text-soft hover:text-gold',
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
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-medium uppercase tracking-luxe transition-all duration-300 ease-in-out cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
