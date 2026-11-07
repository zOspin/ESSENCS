import { useCallback, useEffect, useRef, useState } from 'react';

// Igual a --exit-ms en animations.css.
const EXIT_MS = 220;
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Cierra con animación de salida: marca `closing` y, cuando la salida termina, llama a `onGone`
// (que desmonta). Un segundo cierre durante la salida no hace nada.
export function useExit(onGone) {
  const [closing, setClosing] = useState(false);
  const timer = useRef(0);

  const close = useCallback(() => {
    if (timer.current) return;
    setClosing(true);
    timer.current = setTimeout(
      () => {
        timer.current = 0;
        setClosing(false);
        onGone();
      },
      REDUCED ? 0 : EXIT_MS,
    );
  }, [onGone]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return [closing, close];
}
