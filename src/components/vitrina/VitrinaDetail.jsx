import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import NicheScene from './NicheScene.jsx';
import Button from '../common/Button.jsx';
import WhatsAppIcon from '../common/WhatsAppIcon.jsx';
import { getWhatsAppUrl } from '../../services/whatsappService.js';
import { BRAND } from '../../config/constants.js';

const EASE = 'cubic-bezier(0.7, 0, 0.2, 1)';
const OPEN_MS = 800;
const CLOSE_MS = 650;
const REDUCED = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Dónde queda el nicho grande: mitad derecha en computador, parte de arriba en el celular.
function targetRect() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w >= 900) return { left: w * 0.5, top: 24, width: w * 0.5 - 24, height: h - 48 };
  return { left: 0, top: 0, width: w, height: Math.round(h * 0.58) };
}

const toFrame = (r) => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });

const TIERS = [
  ['topNotes', 'Salida'],
  ['heartNotes', 'Corazón'],
  ['baseNotes', 'Fondo'],
];

// El nombre con la última palabra en cursiva, como "Le Male Le *Parfum*".
function StyledName({ name }) {
  const words = name.split(' ');
  if (words.length === 1) return <em>{name}</em>;
  return (
    <>
      {words.slice(0, -1).join(' ')} <em>{words.at(-1)}</em>
    </>
  );
}

export default function VitrinaDetail({
  item,
  index,
  total,
  origin,
  closing,
  getReturnRect,
  onClose,
  onClosed,
  onPrev,
  onNext,
  onAddToCart,
}) {
  const rootRef = useRef(null);
  const frameRef = useRef(null);
  const [rect, setRect] = useState(targetRect);
  const [added, setAdded] = useState(false);

  // Entrada: el nicho crece desde su lugar en la vitrina hasta su puesto final.
  useLayoutEffect(() => {
    const frame = frameRef.current;
    const root = rootRef.current;
    if (REDUCED()) return;
    root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350, easing: 'ease-out' });
    if (origin) {
      frame.animate([toFrame(origin), toFrame(targetRect())], { duration: OPEN_MS, easing: EASE });
    } else {
      frame.animate([{ opacity: 0, transform: 'scale(0.94)' }, { opacity: 1, transform: 'scale(1)' }], {
        duration: 600,
        easing: EASE,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Salida: vuelve a encogerse hasta el nicho de la vitrina.
  useEffect(() => {
    if (!closing) return;
    const back = getReturnRect();
    if (REDUCED() || !back) {
      onClosed();
      return;
    }
    rootRef.current.scrollTo({ top: 0 });
    rootRef.current.classList.add('is-closing');
    const anim = frameRef.current.animate([toFrame(targetRect()), toFrame(back)], {
      duration: CLOSE_MS,
      easing: EASE,
      fill: 'forwards',
    });
    rootRef.current.animate([{ backgroundColor: 'rgba(5,5,6,1)' }, { backgroundColor: 'rgba(5,5,6,0)' }], {
      duration: CLOSE_MS,
      easing: 'ease-in',
      fill: 'forwards',
    });
    anim.onfinish = onClosed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing]);

  useEffect(() => {
    const onResize = () => setRect(targetRect());
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onNext, onPrev]);

  // Al pasar a otro perfume, la ficha vuelve arriba.
  useEffect(() => {
    setAdded(false);
    rootRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [item.id]);

  const askUrl = getWhatsAppUrl(`Hola ${BRAND.name}, quiero información sobre ${item.brand} ${item.name}.`);
  const notes = TIERS.filter(([key]) => item.olfactoryPyramid?.[key]?.length);

  return (
    <div
      ref={rootRef}
      className="vitrina-detail"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.brand} ${item.name}`}
      style={{ '--light': item.light, '--frame-h': `${rect.height}px` }}
    >
      <div ref={frameRef} className="detail-frame" style={toFrame(rect)}>
        <div key={item.id} className="detail-swap">
          <NicheScene item={item} priority />
        </div>
      </div>

      <div className="detail-panel">
        <div className="detail-top">
          <button type="button" className="detail-back" onClick={onClose}>
            <span aria-hidden="true">←</span> Vitrina
          </button>
          <span className="detail-count">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        <div key={item.id} className="detail-body">
          <p className="detail-eyebrow">
            {item.brand}
            {item.family && <span> · {item.family}</span>}
            {item.gender && <span> · {item.gender}</span>}
          </p>
          <h2 className="detail-name">
            <StyledName name={item.name} />
          </h2>
          {item.subtitle && <p className="detail-sub">{item.subtitle}</p>}
          {item.description && <p className="detail-desc">{item.description}</p>}

          {notes.length > 0 && (
            <dl className="detail-notes">
              {notes.map(([key, label]) => (
                <div key={key}>
                  <dt>{label}</dt>
                  <dd>{item.olfactoryPyramid[key].join(' · ')}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="detail-actions">
            <Button
              onClick={() => {
                onAddToCart(item);
                setAdded(true);
              }}
            >
              {added ? 'Añadido a la bolsa ✓' : 'Añadir a la bolsa'}
            </Button>
            <a href={askUrl} target="_blank" rel="noopener noreferrer" className="detail-ask">
              <WhatsAppIcon /> Preguntar
            </a>
          </div>
          <p className="detail-note">Precio y disponibilidad por WhatsApp.</p>
        </div>

        <div className="detail-nav">
          <button type="button" onClick={onPrev} aria-label="Perfume anterior">
            ←
          </button>
          <button type="button" onClick={onNext} aria-label="Perfume siguiente">
            →
          </button>
        </div>
      </div>
    </div>
  );
}
