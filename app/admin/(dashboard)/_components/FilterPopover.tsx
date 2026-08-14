'use client';
import { useState } from 'react';
import { Filter as FilterIcon, ChevronDown } from 'lucide-react';

export default function FilterPopover({
  activeCount,
  onClear,
  children,
}: {
  activeCount: number;
  onClear: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#F3DCDD] rounded-xl text-xs font-bold text-[#1F1A1C] cursor-pointer"
      >
        <FilterIcon size={13} strokeWidth={2.25} />
        Filters{activeCount > 0 ? ` (${activeCount})` : ''}
        <ChevronDown size={13} strokeWidth={2.25} className="text-[#8A7A7B]" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-[calc(100%+6px)] right-0 w-64 bg-white border border-[#F3DCDD] rounded-xl shadow-lg z-20 p-3 space-y-3">
            {children}
            <div className="flex gap-2 pt-1">
              <button onClick={() => setOpen(false)} className="flex-1 px-3 py-1.5 bg-[#C12223] text-white font-bold text-xs rounded-lg cursor-pointer">
                Done
              </button>
              {activeCount > 0 && (
                <button
                  onClick={() => {
                    onClear();
                    setOpen(false);
                  }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
