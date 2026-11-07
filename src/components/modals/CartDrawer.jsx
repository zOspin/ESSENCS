import Overlay from '../common/Overlay.jsx';
import CloseButton from '../common/CloseButton.jsx';
import Button from '../common/Button.jsx';
import WhatsAppIcon from '../common/WhatsAppIcon.jsx';
import ProductImage from '../catalog/ProductImage.jsx';
import { getCartCount } from '../../services/productService.js';

export default function CartDrawer({ items, onClose, closing, onChangeQty, onRemove, onCheckout }) {
  const count = getCartCount(items);

  return (
    <Overlay onClose={onClose} closing={closing} align="right" label="Bolsa de compras">
      <aside className="slide-in-right flex h-full w-full max-w-md flex-col bg-surface">
        <div className="flex items-center justify-between px-6 pb-4 pt-6">
          <h2 className="font-display text-3xl text-soft">
            Tu bolsa <span className="font-ui text-base text-muted tabular-nums">({count})</span>
          </h2>
          <CloseButton onClick={onClose} />
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="font-display text-2xl text-soft">Tu bolsa está vacía</p>
            <Button variant="solid" onClick={onClose}>
              Descubrir la colección
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto px-6">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 bg-surface-2 p-3">
                  <ProductImage
                    product={product}
                    className="h-24 w-20 shrink-0"
                    imgClassName="p-1"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {product.brand && (
                          <p className="text-[13px] text-muted">{product.brand}</p>
                        )}
                        <p className="font-display text-xl font-medium leading-tight text-gold-soft">{product.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(product.id)}
                        aria-label={`Quitar ${product.name} de la bolsa`}
                        title="Quitar"
                        className="-m-1 cursor-pointer p-1 text-muted transition-colors duration-300 hover:text-gold-soft"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-auto flex items-center pt-2">
                      <div className="flex items-center bg-ink">
                        <QtyButton label="Restar uno" onClick={() => onChangeQty(product.id, qty - 1)}>
                          −
                        </QtyButton>
                        <span className="w-8 text-center text-base tabular-nums" aria-live="polite">
                          {qty}
                        </span>
                        <QtyButton label="Sumar uno" onClick={() => onChangeQty(product.id, qty + 1)}>
                          +
                        </QtyButton>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-3 px-6 py-6 text-sm">
              <p className="text-base leading-relaxed text-soft">
                Envíanos tu pedido y te confirmamos por WhatsApp precio, disponibilidad y envío.
              </p>
              <Button className="mt-2 w-full" onClick={onCheckout}>
                <WhatsAppIcon />
                Pedir por WhatsApp
              </Button>
              <p className="text-center text-[15px] text-muted">
                Se abrirá WhatsApp con tu pedido listo para enviar.
              </p>
            </div>
          </>
        )}
      </aside>
    </Overlay>
  );
}

function QtyButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="h-9 w-9 cursor-pointer text-lg text-gold-soft transition-[background-color,scale] duration-300 hover:bg-surface active:scale-90 active:duration-100"
    >
      {children}
    </button>
  );
}
