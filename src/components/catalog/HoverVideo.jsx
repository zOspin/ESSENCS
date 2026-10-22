import { useEffect, useRef, useState } from 'react';
import { playWithSound, stopVideo } from '../../utils/videoSound.js';

// Video con sonido que aparece sobre la foto mientras `active` es true (mouse encima de la tarjeta
// en computador, tarjeta en el centro de la pantalla en el celular).
// El archivo no se descarga hasta la primera vez que se activa, para no cargar videos que nadie mira.
export default function HoverVideo({ src, active }) {
  const videoRef = useRef(null);
  const [requested, setRequested] = useState(false);
  const [playing, setPlaying] = useState(false);
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
      stopVideo(video);
      setPlaying(false);
      return;
    }
    playWithSound(video, () => activeRef.current);
  }, [active, requested]);

  if (!requested) return null;

  return (
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
  );
}
