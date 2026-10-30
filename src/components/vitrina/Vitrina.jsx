import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NicheScene from './NicheScene.jsx';
import VitrinaDetail from './VitrinaDetail.jsx';
import { VITRINA, VITRINA_HASH } from '../../config/vitrina.js';

// Dónde estará el nicho cuando el escenario termine de volver a su tamaño normal
// (mientras el detalle está abierto, la vitrina de fondo está ampliada).
function unzoomedRect(el, stage) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (!stage) return r;
  const m = new DOMMatrixReadOnly(getComputedStyle(stage).transform);
  const k = m.a || 1;
  if (Math.abs(k - 1) < 0.001) return r;
  const s = stage.getBoundingClientRect();
  const cx = s.left + s.width / 2;
  const cy = s.top + s.height / 2;
  return {
    left: cx + (r.left - cx) / k,
    top: cy + (r.top - cy) / k,
    width: r.width / k,
    height: r.height / k,
  };
}

// Celulares y equipos con pocos núcleos reciben una versión más liviana de los efectos.
const LITE =
  typeof navigator !== 'undefined' && ((navigator.hardwareConcurrency ?? 8) <= 2 || (navigator.deviceMemory ?? 8) <= 2);

const idFromHash = () => (window.location.hash.startsWith(VITRINA_HASH) ? window.location.hash.slice(VITRINA_HASH.length) : null);

// Inicio en forma de vitrina: una fila de nichos de piedra, cada uno con su luz y su frasco.
// Al tocar uno, el nicho "se acerca" y ocupa la pantalla con la ficha del perfume.
export default function Vitrina({ products, ready, onAddToCart }) {
  const items = useMemo(
    () =>
      VITRINA.map((v) => {
        const product = products.find((p) => p.id === v.id);
        return product ? { ...product, ...v } : null;
      }).filter(Boolean),
    [products],
  );

  const rowRef = useRef(null);
  const stageRef = useRef(null);
  const nicheRefs = useRef({});
  const pushedRef = useRef(false);
  const [active, setActive] = useState(0);
  const [openId, setOpenId] = useState(idFromHash);
  const [detail, setDetail] = useState(null); // { id, origin }
  const [closing, setClosing] = useState(false);

  // El hash manda: #perfume-<id> abre el detalle; sin él, se cierra (también con el botón Atrás).
  useEffect(() => {
    const onHash = () => setOpenId(idFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (!items.length) return;
    if (openId && items.some((i) => i.id === openId)) {
      setClosing(false);
      setDetail((d) => (d?.id === openId ? d : { id: openId, origin: d?.origin ?? null }));
    } else if (detail) {
      setClosing(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId, items]);

  // En el celular la fila se desliza de lado: el nicho del centro queda encendido.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.index));
        });
      },
      { root: row, threshold: 0.6 },
    );
    row.querySelectorAll('.niche').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items.length]);

  // Profundidad: la vitrina se inclina un poco hacia donde está el mouse (solo computador).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !window.matchMedia('(hover: hover) and (min-width: 768px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let raf = 0;
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.06;
      pos.y += (target.y - pos.y) * 0.06;
      stage.style.setProperty('--px', pos.x.toFixed(4));
      stage.style.setProperty('--py', pos.y.toFixed(4));
      raf = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      target.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const open = useCallback((item) => {
    const el = nicheRefs.current[item.id];
    setDetail({ id: item.id, origin: el ? el.getBoundingClientRect() : null });
    pushedRef.current = true;
    window.location.hash = `${VITRINA_HASH}${item.id}`;
  }, []);

  const close = useCallback(() => {
    if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setOpenId(null);
    }
  }, []);

  // Cambiar de perfume dentro del detalle no agrega pasos al historial.
  const go = useCallback(
    (step) => {
      const i = items.findIndex((x) => x.id === openId);
      const next = items[(i + step + items.length) % items.length];
      window.history.replaceState(null, '', `${VITRINA_HASH}${next.id}`);
      setOpenId(next.id);
      setDetail({ id: next.id, origin: null });
    },
    [items, openId],
  );

  const scrollTo = (i) => {
    nicheRefs.current[items[i].id]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const current = detail && items.find((i) => i.id === detail.id);

  const zoomed = Boolean(detail) && !closing;

  return (
    <section
      className={`vitrina ${ready && items.length ? 'is-on' : ''} ${zoomed ? 'is-zoomed' : ''} ${LITE ? 'is-lite' : ''}`}
      aria-label="Vitrina de perfumes"
    >
      <div className="vitrina-inner vitrina-head">
        <div>
          <p className="vitrina-eyebrow fade-up" style={{ '--fd': '0.1s' }}>
            ESSENCS · Alta perfumería
          </p>
          <h2 className="vitrina-title">
            {['La', 'selección', 'de', 'la', 'casa'].map((word, w) => (
              <span key={w}>
                {w > 0 && ' '}
                <span className="reveal-line">
                  <span style={{ '--w': w }} className={w === 1 ? 'gold-shimmer' : undefined}>
                    {word}
                  </span>
                </span>
              </span>
            ))}
          </h2>
          <p className="vitrina-lead fade-up" style={{ '--fd': '0.55s' }}>
            Toca un frasco para descubrir su historia.
          </p>
        </div>
        <p className="vitrina-meta fade-up" style={{ '--fd': '0.7s' }}>
          <b>{String(items.length).padStart(2, '0')}</b>
          fragancias en vitrina
        </p>
      </div>

      <div className="vitrina-inner vitrina-stage-wrap">
        <div className="vitrina-stage" ref={stageRef}>
          <div className="vitrina-row" ref={rowRef}>
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                data-index={i}
                ref={(el) => (nicheRefs.current[item.id] = el)}
                className={`niche ${active === i ? 'is-active' : ''} ${detail?.id === item.id ? 'is-open' : ''}`}
                style={{ '--i': i }}
                onClick={() => open(item)}
                aria-label={`Ver ${item.brand} ${item.name}`}
              >
                <NicheScene item={item} priority={i < 3} />
                <span className="niche-caption">
                  <span>
                    <span className="niche-brand">{item.brand}</span>
                  </span>
                  <span>
                    <span className="niche-name">{item.name}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="vitrina-inner vitrina-foot fade-up" style={{ '--fd': '1.4s' }}>
        <p className="vitrina-hint">Pasa el cursor para encender cada nicho</p>
        <div className="vitrina-dots" role="tablist" aria-label="Perfumes de la vitrina">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={item.name}
              className={active === i ? 'is-active' : ''}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
        <a href="#coleccion" className="vitrina-all">
          Ver todo el catálogo <span aria-hidden="true">→</span>
        </a>
      </div>

      {current && (
        <VitrinaDetail
          item={current}
          index={items.indexOf(current)}
          total={items.length}
          origin={detail.origin}
          closing={closing}
          getReturnRect={() => unzoomedRect(nicheRefs.current[current.id], stageRef.current)}
          onClose={close}
          onClosed={() => {
            setDetail(null);
            setClosing(false);
          }}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
          onAddToCart={onAddToCart}
        />
      )}
    </section>
  );
}
