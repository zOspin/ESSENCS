import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NicheScene from './NicheScene.jsx';
import VitrinaDetail from './VitrinaDetail.jsx';
import { VITRINA, VITRINA_HASH } from '../../config/vitrina.js';

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

  return (
    <section className={`vitrina ${ready && items.length ? 'is-on' : ''}`} aria-label="Vitrina de perfumes">
      <div className="vitrina-head">
        <p className="vitrina-eyebrow">ESSENCS · Alta perfumería</p>
        <h2 className="vitrina-title">
          La <em>selección</em> de la casa
        </h2>
        <p className="vitrina-lead">Toca un frasco para descubrir su historia.</p>
      </div>

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
              <span className="niche-brand">{item.brand}</span>
              <span className="niche-name">{item.name}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="vitrina-foot">
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
          getReturnRect={() => nicheRefs.current[current.id]?.getBoundingClientRect() ?? null}
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
