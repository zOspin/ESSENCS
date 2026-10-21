export default function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-block border border-gold-line px-2.5 py-1 text-[10px] uppercase tracking-luxe text-gold ${className}`}
    >
      {children}
    </span>
  );
}
