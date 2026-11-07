import { useEffect, useRef, useState } from 'react';
import Overlay from '../common/Overlay.jsx';
import Button from '../common/Button.jsx';
import ProductImage from '../catalog/ProductImage.jsx';
import OlfactoryPyramid from '../catalog/OlfactoryPyramid.jsx';
import { playWithSound, stopVideo } from '../../utils/videoSound.js';

const MEDIA_SIZE = 'h-80 md:h-full md:min-h-[28rem]';

// Si el perfume tiene video, se abre reproduciéndolo con sonido; se puede alternar con la foto.
function ProductMedia({ product }) {
  const [showVideo, setShowVideo] = useState(Boolean(product.video));
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!showVideo || !video) return;
    let alive = true;
    playWithSound(video, () => alive);
    return () => {
      alive = false;
      stopVideo(video, { rewind: false });
    };
  }, [showVideo]);

  return (
    <div className="relative">
      {showVideo ? (
        <video
          ref={videoRef}
          src={product.video}
          loop
          playsInline
          controls
          className={`w-full bg-black object-cover ${MEDIA_SIZE}`}
        />
      ) : (
        <ProductImage product={product} className={MEDIA_SIZE} imgClassName="p-6" />
      )}
      {product.video && (
        <div className="absolute right-4 top-4 flex gap-1">
          <MediaTab active={showVideo} onClick={() => setShowVideo(true)}>
            Video
          </MediaTab>
          <MediaTab active={!showVideo} onClick={() => setShowVideo(false)}>
            Foto
          </MediaTab>
        </div>
      )}
    </div>
  );
}

function MediaTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`cursor-pointer px-3 py-1.5 text-[13px] transition-colors duration-300 ${
        active ? 'bg-gold-soft text-ink' : 'bg-ink/85 text-soft hover:text-gold-soft'
      }`}
    >
      {children}
    </button>
  );
}

export default function ProductDetailModal({ product, onClose, closing, onAddToCart }) {
  return (
    <Overlay onClose={onClose} closing={closing} label={product.name}>
      {/* La flecha queda fuera de la zona con scroll: sigue a la vista al bajar por la ficha. */}
      <div className="rise-in relative w-full max-w-4xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Volver a los perfumes"
          className="absolute left-4 top-4 z-10 flex h-9 cursor-pointer items-center gap-2 bg-ink/90 px-3 text-gold-soft transition-[color,scale] duration-300 hover:text-gold-light active:scale-[0.95] active:duration-100"
        >
          <svg viewBox="0 0 16 12" className="h-3 w-4" aria-hidden="true">
            <path d="M6 1L1 6l5 5M1 6h14" fill="none" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          <span className="hidden text-[15px] sm:inline">Volver</span>
        </button>

        <div className="grid max-h-[90vh] overflow-y-auto bg-surface md:grid-cols-2">
          <ProductMedia product={product} />

          <div className="flex flex-col gap-6 p-8">
            <div className="space-y-2">
              {product.brand && <p className="text-base text-muted">{product.brand}</p>}
              <h2 className="font-display text-4xl font-medium leading-[1.1] tracking-[0.01em] text-gold-soft">{product.name}</h2>
              <p className="text-base text-muted">{[product.family, product.gender].filter(Boolean).join(' · ')}</p>
            </div>

            {product.description && <p className="text-lg leading-relaxed text-soft">{product.description}</p>}

            {product.olfactoryPyramid && <OlfactoryPyramid pyramid={product.olfactoryPyramid} />}

            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 bg-ink-2 p-4">
              <span className="text-[15px] leading-relaxed text-muted">Precio y disponibilidad por WhatsApp</span>
              <Button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
              >
                Añadir a la bolsa
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
