'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Inbox, LifeBuoy, PackageOpen, GraduationCap, type LucideIcon } from 'lucide-react';

export interface NotificationItem {
  id: string;
  icon: 'lead' | 'ticket' | 'order' | 'enrollment';
  text: string;
  href: string;
}

const ICONS: Record<NotificationItem['icon'], LucideIcon> = {
  lead: Inbox,
  ticket: LifeBuoy,
  order: PackageOpen,
  enrollment: GraduationCap,
};

export default function NotificationBell({ items }: { items: NotificationItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 rounded-xl bg-white border border-[#F0E1E0] flex items-center justify-center text-[#1F1A1C] hover:border-[#C12223] transition"
      >
        <Bell size={16} strokeWidth={2.25} />
        {items.length > 0 && (
          <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-[#E94C3D] border border-white" />
        )}
      </button>

      {open && (
        <div className="absolute top-[calc(100%+10px)] right-0 w-80 bg-white border border-[#F0E1E0] rounded-2xl shadow-2xl z-[60] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F0E1E0]">
            <b className="text-sm font-black text-[#1F1A1C]">Notifications</b>
            {items.length > 0 && <span className="font-plexmono text-[10px] font-bold text-[#C12223]">{items.length} new</span>}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {items.map((n) => {
              const Icon = ICONS[n.icon];
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    setOpen(false);
                    router.push(n.href);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 border-b border-[#F7EBEA] last:border-0 text-left hover:bg-[#FBF6F4]"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#FBF0DF] text-[#B4590A] flex items-center justify-center shrink-0">
                    <Icon size={14} strokeWidth={2.25} />
                  </span>
                  <span className="text-xs text-[#1F1A1C] leading-snug">{n.text}</span>
                </button>
              );
            })}
            {items.length === 0 && (
              <p className="text-center text-xs text-[#8A7A7B] py-8">You're all caught up.</p>
            )}
          </div>
          <button
            onClick={() => {
              setOpen(false);
              router.push('/admin');
            }}
            className="w-full text-center text-[11.5px] font-bold text-[#C12223] border-t border-[#F0E1E0] py-2.5 hover:bg-[#FBF6F4]"
          >
            View all activity
          </button>
        </div>
      )}
    </div>
  );
}
