import { useEffect, useRef, useState } from 'react';

// Video con sonido que aparece sobre la foto mientras `active` es true (mouse encima de la tarjeta).
// El archivo no se descarga hasta la primera vez que se activa, para no cargar videos que nadie mira.
//
// Los navegadores bloquean el sonido hasta que la persona interactúa con la página (un clic o
// un toque; pasar el mouse no cuenta). Si eso pasa, el video sigue en silencio y se muestra un
// botón para activar el sonido; desde ese clic, los siguientes videos ya suenan solos.
export default function HoverVideo({ src, active }) {
  const videoRef = useRef(null);
  const [requested, setRequested] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  // Valor actual de `active` para las promesas de play(), que resuelven más tarde.
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (active) setRequested(true);
  }, [active]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!active) {
      video.pause();
      video.currentTime = 0;
      setPlaying(false);
      return;
    }
    video.muted = false;
    video.play().then(
      () => setBlocked(false),
      () => {
        // Sin permiso para sonar: se reproduce en silencio y se ofrece el botón.
        if (!activeRef.current) return;
        video.muted = true;
        setBlocked(true);
        video.play().catch(() => {});
      },
    );
  }, [active, requested]);

  function enableSound(event) {
    // Evita que el clic abra el detalle del perfume.
    event.stopPropagation();
    const video = videoRef.current;
    video.muted = false;
    video.play().catch(() => {});
    setBlocked(false);
  }

  if (!requested) return null;

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onPlaying={() => setPlaying(true)}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          playing ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {active && playing && blocked && (
        <span
          role="button"
          tabIndex={0}
          onClick={enableSound}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && enableSound(e)}
          className="fade-in absolute bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-2 border border-gold bg-ink/85 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-gold shadow-glow"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
            <path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11" />
          </svg>
          Activar sonido
        </span>
      )}
    </>
  );
}
