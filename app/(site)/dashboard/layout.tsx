import Link from 'next/link';
import { Lock, LayoutDashboard, User, BookOpen, Trophy, Download, Package } from 'lucide-react';
import { getCurrentUserProfile } from '@/lib/currentUser';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'My Profile', icon: User },
  { href: '/dashboard/courses', label: 'My Courses', icon: BookOpen },
  { href: '/dashboard/orders', label: 'My Orders', icon: Package },
  { href: '/dashboard/quiz-history', label: 'Quiz History', icon: Trophy },
  { href: '/dashboard/downloads', label: 'Download History', icon: Download },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUserProfile();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FFF5F5] px-4">
        <div className="text-center space-y-3 bg-white p-10 rounded-3xl border border-[#F3DCDD] shadow-sm max-w-sm">
          <Lock className="w-10 h-10 text-[#C12223] mx-auto" />
          <h1 className="font-heading font-black text-xl text-[#1F1A1C]">Login Required</h1>
          <p className="text-sm text-[#555555]">Please login from the Student Portal menu in the header to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-[#FFF5F5] flex flex-col sm:flex-row">
      <aside className="sm:w-60 shrink-0 bg-white border-b sm:border-b-0 sm:border-r border-[#F3DCDD] p-5">
        <div className="mb-5">
          <p className="font-heading font-black text-sm text-[#1F1A1C]">{user.name || `+91 ${user.phone}`}</p>
          <p className="text-xs text-[#888888]">{user.targetExam || 'Student Dashboard'}</p>
        </div>
        <nav className="flex sm:flex-col gap-1 overflow-x-auto sm:overflow-visible">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#555555] hover:bg-[#FFF5F5] hover:text-[#C12223] transition whitespace-nowrap"
              >
                <Icon className="w-4 h-4 text-[#C12223] shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-6 sm:p-8">{children}</main>
    </div>
  );
}
