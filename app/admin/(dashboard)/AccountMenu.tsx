'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronsUpDown, User, LogOut } from 'lucide-react';
import { ADMIN_ROLE_LABELS } from './_components/AdminUI';

export default function AccountMenu({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initial = (name || email)[0]?.toUpperCase() ?? 'A';
  const roleLabel = ADMIN_ROLE_LABELS[role] ?? role;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowProfile(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {initial}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-xs font-semibold text-white truncate">{name || email}</p>
          <p className="text-[10px] text-white/45 truncate">{roleLabel}</p>
        </div>
        <ChevronsUpDown size={14} className="text-white/40 shrink-0" />
      </button>

      {open && (
        <div className="absolute bottom-[calc(100%+6px)] left-0 right-0 bg-white border border-[#F3DCDD] rounded-xl shadow-2xl overflow-hidden z-30">
          {showProfile ? (
            <div className="p-3 space-y-1 border-b border-gray-100">
              <p className="text-[10px] font-bold text-[#888888] uppercase">My Profile</p>
              <p className="text-sm font-bold text-[#1F1A1C]">{name || 'Unnamed'}</p>
              <p className="text-xs text-[#888888]">{email}</p>
              <p className="text-xs text-[#C12223] font-semibold">{roleLabel}</p>
            </div>
          ) : (
            <button
              onClick={() => setShowProfile(true)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-[#1F1A1C] hover:bg-[#FBF6F4] text-left cursor-pointer"
            >
              <User size={15} strokeWidth={2.25} />
              My Profile
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 text-left cursor-pointer"
          >
            <LogOut size={15} strokeWidth={2.25} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
