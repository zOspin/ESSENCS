import { useEffect, useRef, useState } from 'react';
import Overlay from '../common/Overlay.jsx';
import CloseButton from '../common/CloseButton.jsx';
import Badge from '../common/Badge.jsx';
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
        <div className="absolute left-4 top-4 flex gap-1">
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
      className={`cursor-pointer border px-3 py-1.5 text-[10px] font-display uppercase tracking-[0.2em] transition-colors duration-300 ${
        active ? 'border-gold bg-ink/90 text-gold' : 'border-gold-line bg-ink/70 text-soft hover:text-gold'
      }`}
    >
      {children}
    </button>
  );
}

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  return (
    <Overlay onClose={onClose} label={product.name}>
      <div className="rise-in relative grid max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-gold-line bg-surface md:grid-cols-2">
        <div className="absolute right-4 top-4 z-10">
          <CloseButton onClick={onClose} />
        </div>

        <ProductMedia product={product} />

        <div className="flex flex-col gap-6 border-t border-gold-line p-8 md:border-l md:border-t-0">
          <div className="space-y-2 pr-10">
            <div className="flex flex-wrap gap-2">
              {product.family && <Badge>{product.family}</Badge>}
              {product.gender && <Badge>{product.gender}</Badge>}
            </div>
            {product.brand && <p className="pt-2 text-xs font-display uppercase tracking-luxe text-muted">{product.brand}</p>}
            <h2 className="font-display text-3xl tracking-[0.1em] text-gold-gradient">{product.name}</h2>
          </div>

          {product.description && <p className="text-lg leading-relaxed text-soft">{product.description}</p>}

          {product.olfactoryPyramid && <OlfactoryPyramid pyramid={product.olfactoryPyramid} />}

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-gold-line pt-6">
            <span className="text-sm leading-relaxed text-muted">Precio y disponibilidad por WhatsApp</span>
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
    </Overlay>
  );
}
