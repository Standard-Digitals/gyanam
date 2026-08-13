import Link from 'next/link';
import {
  LayoutDashboard,
  Inbox,
  GraduationCap,
  LifeBuoy,
  ShoppingBag,
  CreditCard,
  BookOpen,
  Users,
  Newspaper,
  Brain,
  FolderDown,
  FileText,
  HelpCircle,
  Search,
} from 'lucide-react';
import { getCurrentAdmin } from '@/lib/adminSession';
import AdminLogoutButton from './AdminLogoutButton';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Learning Ops',
    items: [
      { href: '/admin/leads', label: 'Leads Inbox', icon: Inbox },
      { href: '/admin/enrollments', label: 'Enrollments', icon: GraduationCap },
      { href: '/admin/tickets', label: 'Support Tickets', icon: LifeBuoy },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
      { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/courses', label: 'Courses', icon: BookOpen },
      { href: '/admin/mentors', label: 'Mentors', icon: Users },
      { href: '/admin/current-affairs', label: 'Current Affairs', icon: Newspaper },
      { href: '/admin/quizzes', label: 'Daily Quiz', icon: Brain },
      { href: '/admin/resources', label: 'Resources', icon: FolderDown },
      { href: '/admin/blog', label: 'Blog', icon: FileText },
      { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
    ],
  },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  const initial = admin?.email?.[0]?.toUpperCase() ?? 'A';

  return (
    <div className="min-h-screen bg-[#FFF5F5] flex">
      <aside className="w-64 shrink-0 bg-gradient-to-b from-[#4A0F11] via-[#33090B] to-[#1C0405] flex flex-col justify-between max-h-screen sticky top-0 overflow-y-auto">
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
          <div className="hidden sm:flex items-center gap-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl px-3 py-2 w-full max-w-xs">
            <Search size={15} className="text-[#B0989A] shrink-0" />
            <span className="text-xs text-[#B0989A]">Search students, orders, tickets…</span>
          </div>
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
