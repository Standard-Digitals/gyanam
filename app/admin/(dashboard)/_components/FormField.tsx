import type { ReactNode } from 'react';

export default function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-[#888888] uppercase tracking-wide">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
