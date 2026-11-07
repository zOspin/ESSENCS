import { useEffect, useRef } from 'react';

// Marca con `data-in` cada `[data-reveal]` del contenedor la primera vez que entra en pantalla
// (la animación está en animations.css; cada elemento trae su propio retraso en `--d`).
export function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute('data-in', '');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    root.querySelectorAll('[data-reveal]:not([data-in])').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return ref;
}
