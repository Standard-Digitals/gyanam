import Link from 'next/link';
import { Lock, GraduationCap, ArrowUpRight, Flame } from 'lucide-react';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { getQuizStreak, getDashboardNotifications } from '@/lib/data/dashboardAlerts';
import { Avatar } from '@/components/dashboard/Avatar';
import { DashboardNotificationBell } from '@/components/dashboard/DashboardNotificationBell';
import { SidebarNav, BottomNav } from '@/components/dashboard/DashboardNav';

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

  const [{ streak }, notifications] = await Promise.all([
    getQuizStreak(user.id),
    getDashboardNotifications(user.id),
  ]);

  const firstName = (user.name || `+91 ${user.phone}`).split(' ')[0];

  return (
    <div className="min-h-[70vh] bg-[#FFF5F5]">
      <div className="mx-auto max-w-[1180px] lg:grid lg:grid-cols-[240px_1fr] lg:gap-8 lg:px-6 lg:py-8">
        <aside className="hidden lg:flex flex-col shrink-0">
          <div className="flex items-center gap-2.5 px-2 pb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EF4444] to-[#C12223] flex items-center justify-center font-heading font-black text-white text-sm shrink-0">
              G
            </div>
            <div className="min-w-0">
              <p className="font-heading font-black text-sm text-[#1F1A1C] leading-tight truncate">Gyanam</p>
              <p className="text-[10px] font-plexmono uppercase tracking-wider text-[#8A7A7B] leading-tight">My Dashboard</p>
            </div>
          </div>
          <SidebarNav />
          <div className="mt-6 bg-white border border-[#F3DCDD] rounded-2xl p-4">
            <GraduationCap className="w-5 h-5 text-[#C12223] mb-2" />
            <p className="text-xs font-bold text-[#1F1A1C] leading-snug">Explore more courses</p>
            <p className="text-[11px] text-[#888888] mt-1 mb-3">Find your next batch from our full catalog.</p>
            <Link
              href="/courses"
              className="flex items-center justify-center gap-1.5 w-full px-3 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl"
            >
              Browse courses <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex flex-col">
          <header className="flex items-center justify-between gap-3 px-4 pt-5 sm:px-6 lg:px-0 lg:pt-0">
            <div className="min-w-0">
              <p className="font-heading font-black text-lg sm:text-xl text-[#1F1A1C] truncate">Hi, {firstName} 👋</p>
              {user.targetExam && <p className="text-[11px] text-[#888888] mt-0.5 truncate">Target: {user.targetExam}</p>}
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {streak > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#F3DCDD] rounded-xl" title={`${streak}-day quiz streak`}>
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span className="font-plexmono text-xs font-black text-[#1F1A1C]">{streak}</span>
                </div>
              )}
              <DashboardNotificationBell items={notifications} />
              <Avatar name={user.name} phone={user.phone} size={36} />
            </div>
          </header>

          <main className="px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:px-0 lg:pb-8 min-w-0 flex-1">{children}</main>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
