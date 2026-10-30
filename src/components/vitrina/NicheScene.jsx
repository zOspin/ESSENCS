// Lo que se ve dentro de un nicho: pared de piedra, haz de luz, frasco, reflejo y halo en el piso.
// Se usa igual en la vitrina pequeña y en el detalle grande; todo se mide en % del nicho.
export default function NicheScene({ item, priority = false }) {
  return (
    <span className="niche-scene" style={{ '--light': item.light, '--scale': item.scale }} aria-hidden="true">
      <span className="niche-stone" />
      <span className="niche-beam" />
      <span className="niche-lamp" />
      <span className="niche-shelf" />
      <span className="niche-pool" />
      <img
        className="niche-reflection"
        src={item.bottle}
        alt=""
        loading={priority ? 'eager' : 'lazy'}
        draggable="false"
      />
      <img className="niche-bottle" src={item.bottle} alt="" loading={priority ? 'eager' : 'lazy'} draggable="false" />
    </span>
  );
}
