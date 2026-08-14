export function EnrollmentTrendChart({ data }: { data: { label: string; paid: number; free: number }[] }) {
  const w = 620;
  const h = 200;
  const pad = 24;
  const days = data.length;
  const max = Math.max(1, ...data.map((d) => d.paid), ...data.map((d) => d.free)) * 1.15;
  const x = (i: number) => pad + i * ((w - pad * 2) / Math.max(1, days - 1));
  const y = (v: number) => h - pad - (v / max) * (h - pad * 1.4);
  const pathFor = (key: 'paid' | 'free') =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d[key]).toFixed(1)}`).join(' ');
  const areaFor = (key: 'paid' | 'free') => `${pathFor(key)} L ${x(days - 1).toFixed(1)} ${h - pad} L ${x(0).toFixed(1)} ${h - pad} Z`;

  const gridLines = Array.from({ length: 4 }, (_, g) => pad + g * ((h - pad * 1.4) / 3));
  const labelIdxs = [0, Math.floor((days - 1) / 3), Math.floor(((days - 1) * 2) / 3), days - 1].filter((v, i, arr) => arr.indexOf(v) === i);

  const hasData = data.some((d) => d.paid > 0 || d.free > 0);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[200px]">
      {gridLines.map((gy, i) => (
        <line key={i} x1={pad} y1={gy} x2={w - pad} y2={gy} stroke="#F0E1E0" strokeWidth={1} />
      ))}
      {hasData && (
        <>
          <path d={areaFor('free')} fill="#F1C4C3" opacity={0.35} />
          <path d={pathFor('free')} fill="none" stroke="#EFB2B0" strokeWidth={2} />
          <path d={areaFor('paid')} fill="url(#enrollGradient)" opacity={0.5} />
          <path d={pathFor('paid')} fill="none" stroke="#C12223" strokeWidth={2.5} />
        </>
      )}
      {labelIdxs.map((i) => (
        <text key={i} x={x(i)} y={h - 4} className="fill-[#B7A9A9]" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9 }}>
          {data[i]?.label}
        </text>
      ))}
      <defs>
        <linearGradient id="enrollGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E94C3D" stopOpacity={0.45} />
          <stop offset="100%" stopColor="#E94C3D" stopOpacity={0} />
        </linearGradient>
      </defs>
      {!hasData && (
        <text x={w / 2} y={h / 2} textAnchor="middle" className="fill-[#B7A9A9]" style={{ fontSize: 12 }}>
          No enrollments in this window yet
        </text>
      )}
    </svg>
  );
}

const BAR_COLORS = ['#C12223', '#E94C3D', '#EE8480', '#F3AEA9', '#F6C7C3', '#F0E1E0'];

export function CategoryBarChart({ data }: { data: { label: string; pct: number }[] }) {
  if (data.length === 0) {
    return <p className="text-center text-sm text-[#8A7A7B] py-16">No enrollments yet.</p>;
  }
  const w = 620;
  const h = 190;
  const pad = 30;
  const bw = Math.min(64, (w - pad * 2) / data.length - 12);
  const gap = data.length > 1 ? (w - pad * 2 - bw * data.length) / (data.length - 1) : 0;
  const maxPct = Math.max(...data.map((d) => d.pct), 1);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[190px]">
      {data.map((d, i) => {
        const bh = (d.pct / maxPct) * (h - pad * 2);
        const bx = pad + i * (bw + gap);
        const by = h - pad - bh;
        return (
          <g key={d.label}>
            <rect x={bx} y={by} width={bw} height={Math.max(bh, 2)} rx={8} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            <text x={bx + bw / 2} y={by - 8} textAnchor="middle" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, fontWeight: 600 }} className="fill-[#1F1A1C]">
              {d.pct}%
            </text>
            <text x={bx + bw / 2} y={h - 8} textAnchor="middle" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9 }} className="fill-[#B7A9A9]">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Leaderboard({
  items,
}: {
  items: { id: string; title: string; meta: string; value: string; pct: number }[];
}) {
  if (items.length === 0) {
    return <p className="text-center text-sm text-[#8A7A7B] py-8">No enrollments yet.</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={item.id} className="flex items-center gap-3">
          <span className="font-plexmono text-[11px] text-[#B7A9A9] w-4 shrink-0">0{i + 1}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-bold text-[#1F1A1C] truncate">{item.title}</p>
            <p className="text-[10.5px] text-[#8A7A7B] truncate">{item.meta}</p>
          </div>
          <div className="w-16 h-[5px] bg-[#FBF6F4] rounded-full overflow-hidden shrink-0">
            <div className="h-full bg-gradient-to-r from-[#E94C3D] to-[#C12223] rounded-full" style={{ width: `${item.pct}%` }} />
          </div>
          <span className="font-plexmono text-[11px] font-semibold w-9 text-right shrink-0">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
