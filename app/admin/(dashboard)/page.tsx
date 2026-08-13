import { prisma } from '@/lib/prisma';
import { isRazorpayConfigured } from '@/lib/razorpay';
import {
  Inbox,
  MailOpen,
  Users,
  GraduationCap,
  Brain,
  FolderDown,
  ShoppingBag,
  PackageOpen,
  LifeBuoy,
  CreditCard,
} from 'lucide-react';
import { PageHeader, StatCard } from './_components/AdminUI';

function calcTrend(thisWeek: number, lastWeek: number): { pct: number; note: string } | undefined {
  if (lastWeek === 0) return undefined;
  const pct = Math.round(((thisWeek - lastWeek) / lastWeek) * 1000) / 10;
  return { pct, note: 'vs last week' };
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [
    totalLeads,
    newLeads,
    totalUsers,
    totalQuizAttempts,
    totalDownloads,
    totalOrders,
    pendingOrders,
    openTickets,
    totalEnrollments,
    totalPayments,
    recentLeads,
    recentOrders,
    recentEnrollments,
    leadsThisWeek,
    leadsLastWeek,
    enrollmentsThisWeek,
    enrollmentsLastWeek,
    ordersThisWeek,
    ordersLastWeek,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'NEW' } }),
    prisma.user.count(),
    prisma.quizAttempt.count(),
    prisma.downloadLog.count(),
    prisma.order.count(),
    prisma.order.count({ where: { orderStatus: 'PLACED' } }),
    prisma.supportTicket.count({ where: { status: 'OPEN' } }),
    prisma.enrollment.count(),
    prisma.payment.count({ where: { status: 'PAID' } }),
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, fullName: true, createdAt: true } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, fullName: true, grandTotal: true, createdAt: true } }),
    prisma.enrollment.findMany({ orderBy: { enrolledAt: 'desc' }, take: 5 }),
    prisma.lead.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.lead.count({ where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } }),
    prisma.enrollment.count({ where: { enrolledAt: { gte: sevenDaysAgo } } }),
    prisma.enrollment.count({ where: { enrolledAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } }),
    prisma.order.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.order.count({ where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } }),
  ]);
  const paymentsLive = isRazorpayConfigured();

  const leadsTrend = calcTrend(leadsThisWeek, leadsLastWeek);
  const enrollmentsTrend = calcTrend(enrollmentsThisWeek, enrollmentsLastWeek);
  const ordersTrend = calcTrend(ordersThisWeek, ordersLastWeek);

  const enrollmentUserIds = [...new Set(recentEnrollments.map((e) => e.userId))];
  const enrollmentCourseIds = [...new Set(recentEnrollments.map((e) => e.courseId))];
  const [enrollmentUsers, enrollmentCourses] = await Promise.all([
    enrollmentUserIds.length ? prisma.user.findMany({ where: { id: { in: enrollmentUserIds } }, select: { id: true, name: true } }) : Promise.resolve([]),
    enrollmentCourseIds.length ? prisma.course.findMany({ where: { id: { in: enrollmentCourseIds } }, select: { id: true, title: true } }) : Promise.resolve([]),
  ]);
  const enrollmentUserMap = new Map(enrollmentUsers.map((u) => [u.id, u]));
  const enrollmentCourseMap = new Map(enrollmentCourses.map((c) => [c.id, c]));

  const stats = [
    { label: 'Total Leads', value: totalLeads, icon: Inbox, accent: 'red' as const, trend: leadsTrend },
    { label: 'New (Unread) Leads', value: newLeads, icon: MailOpen, accent: 'amber' as const },
    { label: 'Registered Students', value: totalUsers, icon: Users, accent: 'blue' as const },
    { label: 'Course Enrollments', value: totalEnrollments, icon: GraduationCap, accent: 'emerald' as const, trend: enrollmentsTrend },
    { label: 'Quiz Attempts', value: totalQuizAttempts, icon: Brain, accent: 'violet' as const },
    { label: 'Resource Downloads', value: totalDownloads, icon: FolderDown, accent: 'blue' as const },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, accent: 'red' as const, trend: ordersTrend },
    { label: 'Orders Pending Dispatch', value: pendingOrders, icon: PackageOpen, accent: 'amber' as const },
    { label: 'Open Support Tickets', value: openTickets, icon: LifeBuoy, accent: 'amber' as const },
    { label: 'Successful Payments', value: totalPayments, icon: CreditCard, accent: 'emerald' as const },
  ];

  const activity = [
    ...recentLeads.map((l) => ({
      id: `lead-${l.id}`,
      icon: Inbox,
      text: `New lead — ${l.fullName}`,
      at: l.createdAt,
    })),
    ...recentOrders.map((o) => ({
      id: `order-${o.id}`,
      icon: ShoppingBag,
      text: `Order placed — ${o.fullName} (₹${o.grandTotal.toLocaleString()})`,
      at: o.createdAt,
    })),
    ...recentEnrollments.map((e) => ({
      id: `enr-${e.id}`,
      icon: GraduationCap,
      text: `${enrollmentUserMap.get(e.userId)?.name || 'A student'} enrolled in ${enrollmentCourseMap.get(e.courseId)?.title ?? 'a course'}`,
      at: e.enrolledAt,
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Live overview of leads, students and commerce"
        action={
          <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase ${paymentsLive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {paymentsLive ? '● Online Payments: Live' : '● Online Payments: Not Configured (Free enrollment / COD only)'}
          </span>
        }
      />

      {activity.length > 0 && (
        <div className="rounded-2xl overflow-hidden flex items-center h-[38px] bg-[#3D1113]">
          <span className="shrink-0 h-full flex items-center px-3.5 bg-[#E94C3D] text-white font-plexmono text-[10px] font-bold uppercase tracking-wide">
            Live
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="flex w-max animate-marquee-left [animation-duration:28s]">
              {[...activity, ...activity].map((a, i) => (
                <span key={`${a.id}-${i}`} className="text-[#F6E4E2] text-xs px-5 whitespace-nowrap flex items-center gap-2 shrink-0">
                  {a.text}
                  <span className="w-1 h-1 rounded-full bg-[#F6E4E2]/40" />
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} accent={s.accent} trend={s.trend} />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#F3DCDD] shadow-sm">
        <div className="px-5 py-4 border-b border-[#F3DCDD]">
          <h3 className="font-heading font-bold text-sm text-[#1F1A1C]">Recent Activity</h3>
        </div>
        <div className="divide-y divide-[#F3DCDD]">
          {activity.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF5F5] flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-[#C12223]" strokeWidth={2.25} />
                </div>
                <p className="text-sm text-[#1F1A1C] flex-1 min-w-0 truncate">{a.text}</p>
                <span className="text-[11px] font-plexmono text-[#888888] shrink-0">
                  {a.at.toLocaleDateString()}
                </span>
              </div>
            );
          })}
          {activity.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-[#888888]">No activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
