import Link from 'next/link';
import { getCurrentAdmin } from '@/lib/adminSession';
import AdminLogoutButton from './AdminLogoutButton';
import CommandPalette from './_components/CommandPalette';
import { NAV_GROUPS } from './_components/navConfig';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  const initial = admin?.email?.[0]?.toUpperCase() ?? 'A';

  return (
    <div className="min-h-screen bg-[#FFF5F5] flex">
      <aside className="w-64 shrink-0 bg-gradient-to-b from-[#3D1113] to-[#2A0C0D] flex flex-col justify-between max-h-screen sticky top-0 overflow-y-auto">
        <div className="p-5">
          <div className="flex items-center gap-2.5 mb-8 px-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EF4444] to-[#C12223] flex items-center justify-center font-heading font-black text-white text-sm shrink-0">
              G
            </div>
            <div className="min-w-0">
              <p className="font-heading font-black text-white text-sm leading-tight truncate">GYANM</p>
              <p className="text-[10px] font-plexmono uppercase tracking-wider text-white/40 leading-tight">Control Room</p>
            </div>
          </div>

          <nav className="space-y-5">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="px-3 mb-1.5 text-[10px] font-plexmono uppercase tracking-widest text-white/35 font-semibold">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group relative flex items-center gap-2.5 pl-3 pr-3 py-2 rounded-xl text-sm font-semibold text-white/65 hover:bg-white/10 hover:text-white transition"
                      >
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-full bg-[#FF6B6B] opacity-0 group-hover:opacity-60 transition-opacity" />
                        <Icon size={16} strokeWidth={2.25} className="shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initial}
            </div>
            {admin && <p className="text-xs text-white/55 truncate">{admin.email}</p>}
          </div>
          <AdminLogoutButton />
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#F3DCDD] px-8 py-3.5 flex items-center justify-between gap-4">
          <CommandPalette />
          <div className="flex items-center gap-3 ml-auto">
            <div className="w-8 h-8 rounded-full bg-[#FDEAEA] flex items-center justify-center text-[#C12223] text-xs font-black shrink-0">
              {initial}
            </div>
          </div>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
