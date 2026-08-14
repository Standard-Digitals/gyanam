import { prisma } from '@/lib/prisma';
import Link from 'next/link';
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
import { EnrollmentTrendChart, CategoryBarChart, Leaderboard } from './_components/Charts';
import QuickActionsFab from './_components/QuickActionsFab';
import { QUICK_ACTIONS } from './_components/navConfig';

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
    trendEnrollments,
    courseEnrollCounts,
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
    prisma.enrollment.findMany({ where: { enrolledAt: { gte: fourteenDaysAgo } }, select: { enrolledAt: true, paymentType: true } }),
    prisma.enrollment.groupBy({ by: ['courseId'], _count: { _all: true } }),
  ]);
  const paymentsLive = isRazorpayConfigured();

  const rankedCourseIds = courseEnrollCounts
    .sort((a, b) => b._count._all - a._count._all)
    .slice(0, 5)
    .map((c) => c.courseId);
  const rankedCourses = rankedCourseIds.length
    ? await prisma.course.findMany({ where: { id: { in: rankedCourseIds } }, select: { id: true, title: true, category: true, instructor: true } })
    : [];
  const allCategoryCourseIds = courseEnrollCounts.map((c) => c.courseId);
  const categoryCourses = allCategoryCourseIds.length
    ? await prisma.course.findMany({ where: { id: { in: allCategoryCourseIds } }, select: { id: true, category: true } })
    : [];
  const categoryByCourseId = new Map(categoryCourses.map((c) => [c.id, c.category]));
  const enrollCountByCourseId = new Map(courseEnrollCounts.map((c) => [c.courseId, c._count._all]));

  const leadsTrend = calcTrend(leadsThisWeek, leadsLastWeek);
  const enrollmentsTrend = calcTrend(enrollmentsThisWeek, enrollmentsLastWeek);
  const ordersTrend = calcTrend(ordersThisWeek, ordersLastWeek);

  const categoryTotals = new Map<string, number>();
  for (const [courseId, count] of enrollCountByCourseId) {
    const category = categoryByCourseId.get(courseId) ?? 'Other';
    categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + count);
  }
  const totalCategorized = [...categoryTotals.values()].reduce((sum, v) => sum + v, 0);
  const categoryData = [...categoryTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, count]) => ({ label, pct: totalCategorized ? Math.round((count / totalCategorized) * 1000) / 10 : 0 }));

  const rankedCourseMap = new Map(rankedCourses.map((c) => [c.id, c]));
  const maxRankedCount = Math.max(1, ...rankedCourseIds.map((id) => enrollCountByCourseId.get(id) ?? 0));
  const leaderboardItems = rankedCourseIds
    .map((id) => {
      const course = rankedCourseMap.get(id);
      if (!course) return null;
      const count = enrollCountByCourseId.get(id) ?? 0;
      const instructor = course.instructor as { name: string } | null;
      return {
        id: course.id,
        title: course.title,
        meta: `${course.category} · ${instructor?.name ?? 'Faculty'}`,
        value: count.toLocaleString(),
        pct: Math.round((count / maxRankedCount) * 100),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const trendBuckets = new Map<string, { paid: number; free: number }>();
  for (let i = 0; i < 14; i++) {
    const d = new Date(fourteenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
    trendBuckets.set(d.toISOString().slice(0, 10), { paid: 0, free: 0 });
  }
  for (const e of trendEnrollments) {
    const key = e.enrolledAt.toISOString().slice(0, 10);
    const bucket = trendBuckets.get(key);
    if (!bucket) continue;
    if (e.paymentType === 'PAID') bucket.paid += 1;
    else bucket.free += 1;
  }
  const trendData = [...trendBuckets.entries()].map(([dateStr, counts]) => ({
    label: new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    ...counts,
  }));

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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((q) => {
          const Icon = q.icon;
          return (
            <Link
              key={q.href}
              href={q.href}
              className="bg-white border border-[#F3DCDD] rounded-2xl p-4 flex flex-col gap-5 hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: q.bg }}>
                <Icon size={16} strokeWidth={2.25} />
              </span>
              <span>
                <span className="block text-[12.5px] font-bold text-[#1F1A1C] leading-tight">{q.label}</span>
                <span className="block text-[10px] font-plexmono text-[#8A7A7B] mt-0.5">{q.sub}</span>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} accent={s.accent} trend={s.trend} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-4">
        <div className="bg-white rounded-2xl border border-[#F3DCDD] shadow-sm p-5">
          <div className="mb-4">
            <h3 className="font-heading font-bold text-sm text-[#1F1A1C]">Enrollment trend</h3>
            <p className="text-[11px] text-[#8A7A7B] mt-0.5">New enrollments, last 14 days</p>
          </div>
          <div className="flex gap-4 mb-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8A7A7B]">
              <span className="w-2 h-2 rounded-sm bg-[#C12223]" /> Paid enrollments
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8A7A7B]">
              <span className="w-2 h-2 rounded-sm bg-[#F1C4C3]" /> Free enrollments
            </span>
          </div>
          <EnrollmentTrendChart data={trendData} />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#F3DCDD] shadow-sm p-5">
          <div className="mb-4">
            <h3 className="font-heading font-bold text-sm text-[#1F1A1C]">Enrollments by exam category</h3>
            <p className="text-[11px] text-[#8A7A7B] mt-0.5">Share of all enrollments</p>
          </div>
          <CategoryBarChart data={categoryData} />
        </div>

        <div className="bg-white rounded-2xl border border-[#F3DCDD] shadow-sm p-5">
          <div className="mb-4">
            <h3 className="font-heading font-bold text-sm text-[#1F1A1C]">Top performing courses</h3>
            <p className="text-[11px] text-[#8A7A7B] mt-0.5">By active enrollment</p>
          </div>
          <Leaderboard items={leaderboardItems} />
        </div>
      </div>

      <QuickActionsFab />
    </div>
  );
}
