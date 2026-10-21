const TIERS = [
  { key: 'topNotes', label: 'Notas de salida', hint: 'Los primeros minutos', width: 'w-1/2' },
  { key: 'heartNotes', label: 'Notas de corazón', hint: 'Las primeras horas', width: 'w-3/4' },
  { key: 'baseNotes', label: 'Notas de fondo', hint: 'La estela que perdura', width: 'w-full' },
];

export default function OlfactoryPyramid({ pyramid }) {
  return (
    <ol className="flex flex-col items-center gap-3">
      {TIERS.map((tier, i) => (
        <li
          key={tier.key}
          className={`rise-in ${tier.width} border border-gold-line bg-ink-2/70 px-4 py-4 text-center`}
          style={{ animationDelay: `${i * 90}ms` }}
        >
          <p className="font-display text-xs tracking-luxe text-gold">{tier.label}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted">{tier.hint}</p>
          <p className="mt-2 text-sm text-soft">{pyramid[tier.key].join(' · ')}</p>
        </li>
      ))}
    </ol>
  );
}
