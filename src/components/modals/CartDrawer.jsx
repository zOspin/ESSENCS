import Overlay from '../common/Overlay.jsx';
import CloseButton from '../common/CloseButton.jsx';
import Button from '../common/Button.jsx';
import ProductImage from '../catalog/ProductImage.jsx';
import { formatPrice, hasPrice } from '../../utils/formatters.js';
import { getCartTotals } from '../../services/productService.js';

export default function CartDrawer({ items, onClose, onChangeQty, onRemove, onCheckout }) {
  const { subtotal, count, hasUnpriced } = getCartTotals(items);

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
                          <p className="text-[10px] uppercase tracking-[0.15em] text-muted">{product.brand}</p>
                        )}
                        <p className="font-display text-sm tracking-[0.1em] text-soft">{product.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(product.id)}
                        className="cursor-pointer text-[10px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:text-gold"
                      >
                        Quitar
                      </button>
                    </div>
                    {product.subtitle && <p className="text-xs text-muted">{product.subtitle}</p>}
                    <div className="mt-auto flex items-center justify-between pt-2">
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
                      <span className="text-sm text-gold">
                        {hasPrice(product) ? formatPrice(product.price * qty) : 'A consultar'}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-gold-line px-6 py-6 text-sm">
              {subtotal > 0 && (
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-luxe text-muted">Subtotal</span>
                  <span className="font-display text-2xl text-gold-gradient">{formatPrice(subtotal)}</span>
                </div>
              )}
              <p className="text-xs leading-relaxed text-muted">
                {hasUnpriced
                  ? 'Algunos precios y el envío se confirman por WhatsApp.'
                  : 'El envío se coordina por WhatsApp.'}
              </p>
              <Button className="mt-2 w-full" onClick={onCheckout}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 000-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.4.8 3.2.6a2.8 2.8 0 001.8-1.3 2.2 2.2 0 00.2-1.3c-.1-.1-.3-.2-.6-.3z" />
                </svg>
                Pedir por WhatsApp
              </Button>
              <p className="text-center text-[11px] text-muted">
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
