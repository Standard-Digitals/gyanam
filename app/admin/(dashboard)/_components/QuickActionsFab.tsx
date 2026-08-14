'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { QUICK_ACTIONS } from './navConfig';

export default function QuickActionsFab() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-end gap-2.5">
      <div className="flex flex-col items-end gap-2">
        {open &&
          QUICK_ACTIONS.map((q) => {
            const Icon = q.icon;
            return (
              <Link
                key={q.href}
                href={q.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 bg-white border border-[#F0E1E0] rounded-xl pl-3.5 pr-2 py-2 shadow-lg"
              >
                <span className="text-xs font-bold text-[#1F1A1C] whitespace-nowrap">{q.label}</span>
                <span className="w-7 h-7 rounded-lg bg-[#FDEAE9] text-[#C12223] flex items-center justify-center shrink-0">
                  <Icon size={14} strokeWidth={2.25} />
                </span>
              </Link>
            );
          })}
      </div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-[54px] h-[54px] rounded-2xl bg-gradient-to-br from-[#E94C3D] to-[#C12223] flex items-center justify-center text-white shadow-xl transition-transform ${open ? 'rotate-45' : ''}`}
      >
        <Plus size={22} strokeWidth={2.4} />
      </button>
    </div>
  );
}
