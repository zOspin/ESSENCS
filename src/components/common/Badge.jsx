export default function Badge({ children, className = '' }) {
  return (
    <span className={`inline-block bg-ink px-3 py-1.5 text-[13px] text-gold-soft ${className}`}>{children}</span>
  );
}
