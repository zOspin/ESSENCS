import { useEffect, useRef } from 'react';

// Portada de la colección: el título grande a la izquierda y, a la derecha, un perfume en video,
// mucho más grande que en las tarjetas, cortado por el borde derecho de la pantalla.
// Debajo del texto, el buscador por notas: el cliente empieza por un olor que le gusta.
const HERO_ID = 'bharara-king';
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function CollectionHero({ products, total, notes, note, onNote, onExplore }) {
  const hero = products.find((p) => p.id === HERO_ID && p.video);
  const videoRef = useRef(null);

  // Con movimiento reducido el video queda en su primera imagen.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (REDUCED) v.pause();
    else v.play().catch(() => {});
  }, [hero]);

  return (
    // id `coleccion`: el navegador salta al elemento del hash; así la vista empieza en la portada.
    <section id="coleccion" className="relative overflow-hidden">
      {/* En el celular: título, video y notas, en ese orden. En computador: título y notas a la
          izquierda, el video ocupando las dos filas a la derecha. */}
      <div className="mx-auto grid max-w-7xl content-center gap-y-10 px-4 pb-16 pt-10 sm:px-8 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-12 lg:gap-x-10 lg:gap-y-12 lg:pb-24">
        <div className="lg:col-span-5 lg:row-start-1 lg:self-end">
          {/* El título sube desde detrás de su propia línea; pb deja sitio a la "ó" y las colas. */}
          <h1 className="font-display text-[clamp(2.5rem,5vw,5.25rem)] font-medium leading-[1.02] tracking-[0.01em] text-gold-soft">
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="line-reveal">Nuestra</span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="line-reveal" style={{ animationDelay: '90ms' }}>
                colección
              </span>
            </span>
          </h1>
          <p className="fade-up mt-8 max-w-md text-lg leading-relaxed text-soft" style={{ '--d': '250ms' }}>
            Perfumes de diseñador y perfumería árabe. Escoge el tuyo y pídelo por WhatsApp.
          </p>
        </div>

        {hero && (
          // Se sale por la derecha hasta el borde de la pantalla: el frasco manda en la portada.
          <figure className="relative -mx-4 sm:-mx-8 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:ml-0 lg:-mr-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:self-center">
            <button
              type="button"
              onClick={() => onExplore(hero)}
              aria-label={`Ver detalles de ${hero.brand} ${hero.name}`}
              className="shutter group block w-full cursor-pointer overflow-hidden"
            >
              <video
                ref={videoRef}
                src={hero.video}
                poster={`/assets/videos/posters/${hero.id}.jpg`}
                muted
                loop
                playsInline
                autoPlay={!REDUCED}
                preload="auto"
                aria-hidden="true"
                className="shutter-media aspect-[4/3] w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] lg:aspect-[16/11]"
              />
            </button>
            <figcaption className="fade-up mt-4 flex items-baseline justify-between gap-4 px-4 text-base sm:px-8 lg:pl-0" style={{ '--d': '700ms' }}>
              <span>
                <span className="text-muted">{hero.brand} </span>
                <span className="font-display text-xl text-gold-soft">{hero.name}</span>
              </span>
              <button
                type="button"
                onClick={() => onExplore(hero)}
                className="link-underline cursor-pointer text-gold-soft"
              >
                Ver el perfume
              </button>
            </figcaption>
          </figure>
        )}

        <div className="lg:col-span-5 lg:row-start-2 lg:self-start">
          <NoteFinder notes={notes} note={note} onNote={onNote} total={total} />
        </div>

      </div>
    </section>
  );
}

export function scrollToGrid() {
  document.getElementById('perfumes')?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
}

// Las notas más comunes del catálogo, cada una con cuántos perfumes la llevan.
function NoteFinder({ notes, note, onNote, total }) {
  if (notes.length === 0) return null;

  return (
    <div className="fade-up" style={{ '--d': '400ms' }}>
      <h2 className="font-display text-2xl text-soft">Empieza por una nota</h2>
      <p className="mt-2 text-base text-muted">Elige un olor que te guste y te mostramos los perfumes que lo llevan.</p>
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Notas olfativas">
        {notes.map(({ name, count }) => {
          const active = note === name;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={active}
              onClick={() => onNote(active ? null : name)}
              className={`cursor-pointer px-4 py-2.5 text-[15px] transition-[background-color,color,scale] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.96] active:duration-100 ${
                active ? 'bg-gold-soft text-ink' : 'bg-surface-2 text-soft hover:bg-[#26241f] hover:text-gold-soft'
              }`}
            >
              {name}
              <span className={`ml-2 tabular-nums ${active ? 'text-ink/60' : 'text-muted'}`}>{count}</span>
            </button>
          );
        })}
      </div>
      {/* Botón y no enlace: cambiar el hash sacaría al cliente de la colección. */}
      <button
        type="button"
        onClick={scrollToGrid}
        className="link-underline mt-6 inline-block cursor-pointer text-base text-gold-soft"
      >
        {note ? `Ver ${total === 1 ? 'el perfume' : `los ${total} perfumes`} con ${note.toLowerCase()}` : `Ver los ${total} perfumes`}
      </button>
    </div>
  );
}
