import Overlay from '../common/Overlay.jsx';
import CloseButton from '../common/CloseButton.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import PerfumeBottle from '../catalog/PerfumeBottle.jsx';
import OlfactoryPyramid from '../catalog/OlfactoryPyramid.jsx';
import { formatPrice } from '../../utils/formatters.js';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  return (
    <Overlay onClose={onClose} label={product.name}>
      <div className="rise-in relative grid max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-gold-line bg-surface md:grid-cols-2">
        <div className="absolute right-4 top-4 z-10">
          <CloseButton onClick={onClose} />
        </div>

        <div className="flex items-center justify-center bg-[radial-gradient(circle_at_50%_55%,rgba(212,175,55,0.16),transparent_65%)] p-10">
          <PerfumeBottle liquid={product.bottle.liquid} shape={product.bottle.shape} className="h-72 md:h-96" />
        </div>

        <div className="flex flex-col gap-6 border-t border-gold-line p-8 md:border-l md:border-t-0">
          <div className="space-y-2 pr-10">
            <Badge>{product.family}</Badge>
            <h2 className="font-display text-2xl tracking-[0.15em] text-soft">{product.name}</h2>
            <p className="text-sm text-muted">{product.subtitle}</p>
          </div>

          <OlfactoryPyramid pyramid={product.olfactoryPyramid} />

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-gold-line pt-6">
            <span className="font-display text-2xl text-gold-gradient">{formatPrice(product.price)}</span>
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
