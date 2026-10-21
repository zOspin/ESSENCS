import { useEffect } from 'react';

// Fondo oscuro compartido por drawers y modales: cierra con Escape o clic fuera
// y bloquea el scroll de la página mientras está abierto.
export default function Overlay({ onClose, align = 'center', label, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const placement = align === 'right' ? 'justify-end' : 'items-center justify-center p-4';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className={`fade-in fixed inset-0 z-50 flex bg-black/70 backdrop-blur-sm ${placement}`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      {children}
    </div>
  );
}
