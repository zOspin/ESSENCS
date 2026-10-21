import { useState } from 'react';
import Overlay from '../common/Overlay.jsx';
import CloseButton from '../common/CloseButton.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import ProductImage from '../catalog/ProductImage.jsx';
import OlfactoryPyramid from '../catalog/OlfactoryPyramid.jsx';
import { formatPrice, hasPrice } from '../../utils/formatters.js';

const MEDIA_SIZE = 'h-80 md:h-full md:min-h-[28rem]';

// Si el perfume tiene video, se abre reproduciéndolo; se puede alternar con la foto.
function ProductMedia({ product }) {
  const [showVideo, setShowVideo] = useState(Boolean(product.video));

  return (
    <div className="relative">
      {showVideo ? (
        <video
          src={product.video}
          autoPlay
          muted
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
      className={`cursor-pointer border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
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
            {product.brand && <p className="pt-2 text-xs uppercase tracking-luxe text-muted">{product.brand}</p>}
            <h2 className="font-display text-2xl tracking-[0.12em] text-soft">{product.name}</h2>
            {product.subtitle && <p className="text-sm text-muted">{product.subtitle}</p>}
          </div>

          {product.olfactoryPyramid ? (
            <OlfactoryPyramid pyramid={product.olfactoryPyramid} />
          ) : (
            <p className="border border-gold-line bg-ink-2/70 p-4 text-sm leading-relaxed text-muted">
              ¿Quieres conocer sus notas, duración o un perfume parecido? Añádelo a tu bolsa y pregúntanos por
              WhatsApp: te asesoramos sin compromiso.
            </p>
          )}

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-gold-line pt-6">
            {hasPrice(product) ? (
              <span className="font-display text-2xl text-gold-gradient">{formatPrice(product.price)}</span>
            ) : (
              <span className="text-xs uppercase tracking-[0.15em] text-muted">Precio a consultar</span>
            )}
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
