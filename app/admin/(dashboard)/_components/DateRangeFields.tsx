'use client';

export default function DateRangeFields({
  from,
  to,
  onFromChange,
  onToChange,
}: {
  from: string;
  to: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold text-[#888888] uppercase mb-1">Date range</p>
      <div className="flex items-center gap-1.5">
        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="w-full px-2 py-1.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-lg text-xs font-semibold"
        />
        <span className="text-[10px] text-[#8A7A7B] shrink-0">to</span>
        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="w-full px-2 py-1.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-lg text-xs font-semibold"
        />
      </div>
    </div>
  );
}
