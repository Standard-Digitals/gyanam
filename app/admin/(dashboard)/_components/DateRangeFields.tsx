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
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold text-[#888888] uppercase">Date range</p>
      <div>
        <span className="text-[10px] text-[#8A7A7B]">From</span>
        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="w-full min-w-0 px-2 py-1.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-lg text-xs font-semibold"
        />
      </div>
      <div>
        <span className="text-[10px] text-[#8A7A7B]">To</span>
        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="w-full min-w-0 px-2 py-1.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-lg text-xs font-semibold"
        />
      </div>
    </div>
  );
}
