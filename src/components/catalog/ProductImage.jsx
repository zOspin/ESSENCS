import PerfumeBottle from './PerfumeBottle.jsx';

// Las fotos del catálogo vienen sobre fondo blanco: se muestran sobre un papel claro y plano
// con mix-blend-multiply para que el blanco se funda con ella. Sin foto, se dibuja el frasco.
export default function ProductImage({ product, className = '', imgClassName = '' }) {
  if (!product.image) {
    return (
      <div className={`grid place-items-center bg-surface ${className}`}>
        <PerfumeBottle liquid={product.bottle?.liquid} shape={product.bottle?.shape} className="h-4/5" />
      </div>
    );
  }

  return (
    <div className={`grid place-items-center bg-[#efebe3] ${className}`}>
      <img
        src={product.image}
        alt={product.brand ? `${product.brand} ${product.name}` : product.name}
        loading="lazy"
        className={`h-full w-full object-contain mix-blend-multiply ${imgClassName}`}
      />
    </div>
  );
}
