import type { LucideIcon } from 'lucide-react';

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">{title}</h2>
        {subtitle && <p className="text-sm text-[#888888] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const ACCENTS: Record<string, { bar: string; chip: string; icon: string }> = {
  red: { bar: 'bg-[#C12223]', chip: 'bg-[#FDEAEA]', icon: 'text-[#C12223]' },
  amber: { bar: 'bg-amber-500', chip: 'bg-amber-50', icon: 'text-amber-600' },
  emerald: { bar: 'bg-emerald-500', chip: 'bg-emerald-50', icon: 'text-emerald-600' },
  blue: { bar: 'bg-blue-500', chip: 'bg-blue-50', icon: 'text-blue-600' },
  violet: { bar: 'bg-violet-500', chip: 'bg-violet-50', icon: 'text-violet-600' },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'red',
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: keyof typeof ACCENTS;
}) {
  const a = ACCENTS[accent] ?? ACCENTS.red;
  return (
    <div className="relative bg-white rounded-2xl border border-[#F3DCDD] shadow-sm overflow-hidden pl-5 pr-4 py-4">
      <span className={`absolute left-0 top-0 bottom-0 w-1 ${a.bar}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-plexmono text-2xl font-bold text-[#1F1A1C] tabular-nums">{value}</div>
          <div className="text-[11px] text-[#888888] font-semibold mt-1 uppercase tracking-wide leading-tight">{label}</div>
        </div>
        <div className={`shrink-0 w-9 h-9 rounded-xl ${a.chip} flex items-center justify-center`}>
          <Icon size={18} className={a.icon} strokeWidth={2.25} />
        </div>
      </div>
    </div>
  );
}

const STATUS_TONES: Record<string, string> = {
  NEW: 'bg-amber-50 text-amber-700 before:bg-amber-500',
  OPEN: 'bg-amber-50 text-amber-700 before:bg-amber-500',
  CREATED: 'bg-amber-50 text-amber-700 before:bg-amber-500',
  PLACED: 'bg-amber-50 text-amber-700 before:bg-amber-500',
  PENDING: 'bg-amber-50 text-amber-700 before:bg-amber-500',
  CONTACTED: 'bg-blue-50 text-blue-700 before:bg-blue-500',
  PROCESSING: 'bg-blue-50 text-blue-700 before:bg-blue-500',
  SHIPPED: 'bg-blue-50 text-blue-700 before:bg-blue-500',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 before:bg-blue-500',
  CONVERTED: 'bg-emerald-50 text-emerald-700 before:bg-emerald-500',
  PAID: 'bg-emerald-50 text-emerald-700 before:bg-emerald-500',
  DELIVERED: 'bg-emerald-50 text-emerald-700 before:bg-emerald-500',
  RESOLVED: 'bg-emerald-50 text-emerald-700 before:bg-emerald-500',
  ACTIVE: 'bg-emerald-50 text-emerald-700 before:bg-emerald-500',
  CLOSED: 'bg-gray-100 text-gray-600 before:bg-gray-400',
  CANCELLED: 'bg-red-50 text-red-700 before:bg-red-500',
  FAILED: 'bg-red-50 text-red-700 before:bg-red-500',
};

export function StatusPill({ status }: { status: string }) {
  const tone = STATUS_TONES[status] ?? 'bg-gray-100 text-gray-600 before:bg-gray-400';
  return (
    <span
      className={`relative inline-flex items-center gap-1.5 pl-4 pr-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full ${tone}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
