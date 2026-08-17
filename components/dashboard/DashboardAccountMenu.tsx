'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import { Avatar } from './Avatar';

export function DashboardAccountMenu({ name, phone }: { name: string | null; phone: string }) {
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="block cursor-pointer">
        <Avatar name={name} phone={phone} size={36} />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+10px)] right-0 w-56 bg-white border border-[#F3DCDD] rounded-2xl shadow-2xl z-[60] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#F0E1E0]">
            <p className="text-sm font-bold text-[#1F1A1C] truncate">{name || 'Student'}</p>
            <p className="text-xs text-[#888888] truncate">+91 {phone}</p>
          </div>
          <Link
            href="/dashboard/profile"
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#1F1A1C] hover:bg-[#FBF6F4] text-left cursor-pointer"
          >
            <User size={15} strokeWidth={2.25} />
            My Profile
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 text-left cursor-pointer"
          >
            <LogOut size={15} strokeWidth={2.25} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
