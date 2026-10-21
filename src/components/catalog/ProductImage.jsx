import PerfumeBottle from './PerfumeBottle.jsx';

// Las fotos del catálogo vienen sobre fondo blanco: se muestran en una "vitrina" clara
// con mix-blend-multiply para que el blanco se funda con ella. Sin foto, se dibuja el frasco.
export default function ProductImage({ product, className = '', imgClassName = '' }) {
  if (!product.image) {
    return (
      <div className={`grid place-items-center bg-[radial-gradient(circle_at_50%_60%,rgba(212,175,55,0.12),transparent_65%)] ${className}`}>
        <PerfumeBottle liquid={product.bottle?.liquid} shape={product.bottle?.shape} className="h-4/5" />
      </div>
    );
  }

  return (
    <div className={`grid place-items-center bg-[radial-gradient(circle_at_50%_45%,#ffffff_0%,#f1eee8_70%,#e4dfd4_100%)] ${className}`}>
      <img
        src={product.image}
        alt={product.brand ? `${product.brand} ${product.name}` : product.name}
        loading="lazy"
        className={`h-full w-full object-contain mix-blend-multiply ${imgClassName}`}
      />
    </div>
  );
}
