const ROWS = 5;
const COLS = [
  'w-12',   // ID
  'flex-1', // Nombre
  'flex-1', // Email/campo largo
  'w-32',   // Fecha
  'w-20',   // Estado
];

function TableRow() {
  return (
    <div className="flex gap-3 px-3 py-1">
      {COLS.map((w, i) => (
        <div key={i} className={`h-9 bg-[#2a2a2a] rounded animate-pulse ${w}`} />
      ))}
    </div>
  );
}

export default function SkeletonLoader({ variant = 'card', className = '' }) {
  if (variant === 'text') {
    return <div className={`h-4 bg-[#2a2a2a] rounded animate-pulse ${className}`} />;
  }

  if (variant === 'avatar') {
    return <div className={`rounded-full bg-[#2a2a2a] animate-pulse ${className}`} />;
  }

  if (variant === 'table') {
    return (
      <div className={`space-y-2 ${className}`}>
        {/* Cabecera simulada */}
        <div className="flex gap-3 px-3 py-2">
          {COLS.map((w, i) => (
            <div key={i} className={`h-4 bg-[#2a2a2a] rounded animate-pulse opacity-50 ${w}`} />
          ))}
        </div>
        {/* 5 filas */}
        {Array.from({ length: ROWS }).map((_, i) => (
          <TableRow key={i} />
        ))}
      </div>
    );
  }

  // default: card
  return <div className={`rounded-2xl bg-[#2a2a2a] animate-pulse ${className}`} />;
}
