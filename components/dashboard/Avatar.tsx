const PALETTE = ['#C12223', '#127A52', '#3B5BDB', '#B4590A', '#862E9C', '#0B8792'];

function colorFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function Avatar({ name, phone, size = 44 }: { name: string | null; phone: string; size?: number }) {
  const label = (name?.trim()?.[0] || phone.slice(-1) || '?').toUpperCase();
  const bg = colorFor(name || phone);
  return (
    <div
      className="flex items-center justify-center rounded-2xl font-heading font-black text-white shrink-0"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.4 }}
    >
      {label}
    </div>
  );
}
