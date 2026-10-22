import { useEffect, useMemo, useState } from 'react';
import { BRAND } from '../../config/constants.js';

// Duración total de la intro (debe coincidir con los tiempos de animations.css).
const INTRO_MS = 4200;
const EXIT_MS = 800;
const PARTICLES = 40;

// Intro al abrir la página: polvo dorado, una línea de luz que se abre en el logo,
// un destello que lo recorre y el telón que se desvanece. Un clic o tecla la salta.
export default function IntroSplash({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLES }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: `${1 + Math.random() * 3}px`,
        delay: `${Math.random() * 1.8}s`,
        duration: `${3 + Math.random() * 3}s`,
        drift: `${(Math.random() - 0.5) * 120}px`,
      })),
    [],
  );

  useEffect(() => {
    const exit = setTimeout(() => setLeaving(true), INTRO_MS - EXIT_MS);
    const done = setTimeout(onDone, INTRO_MS);
    const skip = () => {
      clearTimeout(exit);
      clearTimeout(done);
      setLeaving(true);
      setTimeout(onDone, EXIT_MS);
    };
    window.addEventListener('keydown', skip, { once: true });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(exit);
      clearTimeout(done);
      window.removeEventListener('keydown', skip);
      document.body.style.overflow = prevOverflow;
    };
  }, [onDone]);

  const skipNow = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onDone, EXIT_MS);
  };

  return (
    <div
      className={`intro fixed inset-0 z-[100] grid cursor-pointer place-items-center overflow-hidden bg-ink ${leaving ? 'intro-leave' : ''}`}
      onClick={skipNow}
      aria-hidden="true"
    >
      <div className="intro-aura pointer-events-none absolute inset-0" />

      {particles.map((p) => (
        <span
          key={p.id}
          className="intro-dust"
          style={{ left: p.left, width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.duration, '--drift': p.drift }}
        />
      ))}

      <div className="relative grid place-items-center">
        <div className="intro-burst pointer-events-none absolute h-[120%] w-[120%] rounded-full" />
        <div className="intro-logo relative">
          <img
            src={BRAND.logoTransparent}
            alt=""
            width="720"
            height="720"
            className="h-auto max-h-[65svh] w-[min(90vw,34rem)] object-contain"
          />
          <div className="intro-shine pointer-events-none absolute inset-0" style={{ '--logo': `url(${BRAND.logoTransparent})` }} />
        </div>
        <div className="intro-line pointer-events-none absolute h-px w-[min(90vw,40rem)]" />
      </div>
    </div>
  );
}
