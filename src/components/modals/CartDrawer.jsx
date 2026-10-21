import Overlay from '../common/Overlay.jsx';
import CloseButton from '../common/CloseButton.jsx';
import Button from '../common/Button.jsx';
import PerfumeBottle from '../catalog/PerfumeBottle.jsx';
import { formatPrice } from '../../utils/formatters.js';
import { getCartTotals } from '../../services/productService.js';
import { SHIPPING } from '../../config/constants.js';

export default function CartDrawer({ items, onClose, onChangeQty, onRemove }) {
  const { subtotal, shipping, total, count } = getCartTotals(items);
  const missingForFree = SHIPPING.freeFrom - subtotal;

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
                  <div className="grid h-24 w-20 shrink-0 place-items-center border border-gold-line bg-ink-2">
                    <PerfumeBottle liquid={product.bottle.liquid} shape={product.bottle.shape} className="h-20" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-sm tracking-[0.12em] text-soft">{product.name}</p>
                      <button
                        type="button"
                        onClick={() => onRemove(product.id)}
                        className="cursor-pointer text-[10px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:text-gold"
                      >
                        Quitar
                      </button>
                    </div>
                    <p className="text-xs text-muted">{product.subtitle}</p>
                    <div className="mt-auto flex items-center justify-between">
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
                      <span className="text-sm text-gold">{formatPrice(product.price * qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-gold-line px-6 py-6 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row label="Envío" value={shipping === 0 ? 'Cortesía' : formatPrice(shipping)} />
              {missingForFree > 0 && (
                <p className="text-xs text-muted">Te faltan {formatPrice(missingForFree)} para el envío de cortesía.</p>
              )}
              <div className="flex items-baseline justify-between border-t border-gold-line pt-4">
                <span className="text-xs uppercase tracking-luxe text-muted">Total</span>
                <span className="font-display text-2xl text-gold-gradient">{formatPrice(total)}</span>
              </div>
              <Button className="mt-2 w-full">Finalizar compra</Button>
            </div>
          </>
        )}
      </aside>
    </Overlay>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-muted">
      <span>{label}</span>
      <span className="text-soft">{value}</span>
    </div>
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
