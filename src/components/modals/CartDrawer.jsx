import Overlay from '../common/Overlay.jsx';
import CloseButton from '../common/CloseButton.jsx';
import Button from '../common/Button.jsx';
import WhatsAppIcon from '../common/WhatsAppIcon.jsx';
import ProductImage from '../catalog/ProductImage.jsx';
import { getCartCount } from '../../services/productService.js';

export default function CartDrawer({ items, onClose, onChangeQty, onRemove, onCheckout }) {
  const count = getCartCount(items);

  return (
    <Overlay onClose={onClose} align="right" label="Bolsa de compras">
      <aside className="slide-in-right flex h-full w-full max-w-md flex-col border-l border-gold-line bg-surface">
        <div className="flex items-center justify-between border-b border-gold-line px-6 py-5">
          <h2 className="font-display text-lg tracking-luxe text-gold">
            Tu bolsa <span className="text-sm text-muted">({count})</span>
          </h2>
          <CloseButton onClick={onClose} />
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="font-display tracking-[0.15em] text-soft">Tu bolsa está vacía</p>
            <Button variant="outline" onClick={onClose}>
              Descubrir la colección
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-gold-line overflow-y-auto px-6">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <ProductImage
                    product={product}
                    className="h-24 w-20 shrink-0 border border-gold-line"
                    imgClassName="p-1"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {product.brand && (
                          <p className="text-[10px] font-display uppercase tracking-[0.15em] text-muted">{product.brand}</p>
                        )}
                        <p className="font-display text-base tracking-[0.08em] text-gold-gradient">{product.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(product.id)}
                        aria-label={`Quitar ${product.name} de la bolsa`}
                        title="Quitar"
                        className="-m-1 cursor-pointer p-1 text-muted transition-colors duration-300 hover:text-gold"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-auto flex items-center pt-2">
                      <div className="flex items-center border border-gold-line">
                        <QtyButton label="Restar uno" onClick={() => onChangeQty(product.id, qty - 1)}>
                          −
                        </QtyButton>
                        <span className="w-8 text-center text-sm" aria-live="polite">
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

            <div className="space-y-3 border-t border-gold-line px-6 py-6 text-sm">
              <p className="text-base leading-relaxed text-muted">
                Envíanos tu pedido y te confirmamos por WhatsApp precio, disponibilidad y envío.
              </p>
              <Button className="mt-2 w-full" onClick={onCheckout}>
                <WhatsAppIcon />
                Pedir por WhatsApp
              </Button>
              <p className="text-center text-sm italic text-muted">
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
      className="h-8 w-8 cursor-pointer text-gold transition-colors duration-300 hover:bg-gold/10"
    >
      {children}
    </button>
  );
}
