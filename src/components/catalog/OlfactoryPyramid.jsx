// Las notas salen en el orden en que el perfume se revela en la piel, tras posarse la ficha.
const NOTE_DELAYS_MS = [200, 340, 450];

const TIERS = [
  { key: 'topNotes', label: 'Notas de salida', hint: 'Los primeros minutos', width: 'w-1/2' },
  { key: 'heartNotes', label: 'Notas de corazón', hint: 'Las primeras horas', width: 'w-3/4' },
  { key: 'baseNotes', label: 'Notas de fondo', hint: 'La estela que perdura', width: 'w-full' },
];

export default function OlfactoryPyramid({ pyramid }) {
  const tiers = TIERS.filter((tier) => pyramid[tier.key]?.length > 0);

  return (
    <ol className="flex flex-col items-center gap-3">
      {tiers.map((tier, i) => (
        <li
          key={tier.key}
          className={`note-in ${tier.width} bg-ink-2 px-4 py-4 text-center`}
          style={{ '--d': `${NOTE_DELAYS_MS[i]}ms` }}
        >
          <p className="text-[15px] font-medium text-gold-soft">{tier.label}</p>
          <p className="mt-0.5 text-[13px] text-muted">{tier.hint}</p>
          <p className="mt-2 text-base text-soft">{pyramid[tier.key].join(' · ')}</p>
        </li>
      ))}
    </ol>
  );
}
