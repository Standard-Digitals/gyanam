import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  Trophy,
  Download,
  Package,
  ArrowUpRight,
  FileQuestion,
  FolderDown,
  ClipboardList,
  ClipboardCheck,
  Target,
  Flame,
  Newspaper,
  type LucideIcon,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { buildMetadata } from '@/lib/metadata';
import { getQuizStreak } from '@/lib/data/dashboardAlerts';

export const metadata: Metadata = buildMetadata({
  title: 'My Dashboard',
  path: '/dashboard',
  noIndex: true,
});

function timeAgo(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default async function DashboardOverviewPage() {
  const user = await getCurrentUserProfile();
  if (!user) return null;

  const [
    quizAttemptsCount,
    downloadsCount,
    ordersCount,
    enrollmentsCount,
    mockTestAttemptsCount,
    latestEnrollment,
    recentQuizAttempt,
    recentOrder,
    recentDownload,
    quizAccuracies,
    mockTestAccuracies,
    trendingNews,
    { streak, last7Days },
  ] = await Promise.all([
    prisma.quizAttempt.count({ where: { userId: user.id } }),
    prisma.downloadLog.count({ where: { userId: user.id } }),
    prisma.order.count({ where: { userId: user.id } }),
    prisma.enrollment.count({ where: { userId: user.id } }),
    prisma.mockTestAttempt.count({ where: { userId: user.id } }),
    prisma.enrollment.findFirst({ where: { userId: user.id }, orderBy: { enrolledAt: 'desc' } }),
    prisma.quizAttempt.findFirst({ where: { userId: user.id }, orderBy: { submittedAt: 'desc' } }),
    prisma.order.findFirst({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } }),
    prisma.downloadLog.findFirst({ where: { userId: user.id }, orderBy: { downloadedAt: 'desc' } }),
    prisma.quizAttempt.findMany({ where: { userId: user.id }, select: { accuracy: true } }),
    prisma.mockTestAttempt.findMany({ where: { userId: user.id }, select: { accuracy: true } }),
    prisma.currentAffairItem.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
    getQuizStreak(user.id),
  ]);

  const latestCourse = latestEnrollment
    ? await prisma.course.findUnique({ where: { id: latestEnrollment.courseId }, select: { title: true, slug: true } })
    : null;

  const allAccuracies = [...quizAccuracies, ...mockTestAccuracies].map((a) => a.accuracy);
  const avgScore = allAccuracies.length > 0 ? Math.round(allAccuracies.reduce((sum, a) => sum + a, 0) / allAccuracies.length) : null;

  const activity: { icon: LucideIcon; label: string; sub: string; date: Date; href: string }[] = [];

  if (recentQuizAttempt) {
    const quiz = await prisma.quiz.findUnique({ where: { id: recentQuizAttempt.quizId }, select: { title: true } });
    activity.push({
      icon: Trophy,
      label: quiz?.title ?? 'Quiz attempt',
      sub: `${recentQuizAttempt.obtainedMarks} marks · ${recentQuizAttempt.accuracy}% accuracy`,
      date: recentQuizAttempt.submittedAt,
      href: '/dashboard/quiz-history',
    });
  }
  if (recentDownload) {
    const resource = await prisma.freeResource.findUnique({ where: { id: recentDownload.resourceId }, select: { title: true } });
    activity.push({
      icon: Download,
      label: resource?.title ?? 'Resource downloaded',
      sub: 'Downloaded',
      date: recentDownload.downloadedAt,
      href: '/dashboard/downloads',
    });
  }
  if (recentOrder) {
    activity.push({
      icon: Package,
      label: `Order ${recentOrder.orderNumber}`,
      sub: recentOrder.orderStatus,
      date: recentOrder.createdAt,
      href: '/dashboard/orders',
    });
  }
  activity.sort((a, b) => b.date.getTime() - a.date.getTime());

  const snapshotStats: { label: string; value: string | number; icon: LucideIcon }[] = [
    { label: 'Enrolled Courses', value: enrollmentsCount, icon: BookOpen },
    { label: 'Quiz Attempts', value: quizAttemptsCount, icon: Trophy },
    { label: 'Mock Tests Taken', value: mockTestAttemptsCount, icon: ClipboardCheck },
    { label: 'Avg. Score', value: avgScore !== null ? `${avgScore}%` : '—', icon: Target },
  ];

  const quickLinks = [
    { href: '/courses', label: 'Browse Courses', icon: BookOpen, bg: 'linear-gradient(135deg,#12A150,#0C7A3D)' },
    { href: '/daily-quiz', label: 'Daily Quiz', icon: FileQuestion, bg: 'linear-gradient(135deg,#F59F00,#E67700)' },
    { href: '/study-material', label: 'Study Material', icon: ClipboardList, bg: 'linear-gradient(135deg,#4C6EF5,#3B5BDB)' },
    { href: '/downloads', label: 'Free Downloads', icon: FolderDown, bg: 'linear-gradient(135deg,#AE3EC9,#862E9C)' },
  ];

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayDow = new Date().getUTCDay();

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white bg-gradient-to-br from-[#7A1516] via-[#C12223] to-[#E94C3D]">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <p className="font-plexmono text-[11px] uppercase tracking-wider text-white/70 relative">Continue learning</p>
        <h1 className="font-heading font-black text-2xl sm:text-3xl mt-1 relative">{user.name || `+91 ${user.phone}`}</h1>
        <p className="text-sm text-white/80 mt-2 max-w-md relative">
          {user.targetExam ? `Preparing for ${user.targetExam}. ` : 'Set your target exam in Profile to personalize your prep. '}
          Track your courses, quizzes and downloads all in one place.
        </p>
        {latestCourse && (
          <Link
            href={`/courses/${latestCourse.slug}`}
            className="inline-flex items-center gap-2 mt-5 relative bg-white text-[#C12223] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-white/90 transition"
          >
            Continue {latestCourse.title} <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="font-heading font-black text-sm text-[#1F1A1C] mb-3">Your snapshot</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {snapshotStats.map((s) => (
                <div key={s.label} className="relative overflow-hidden bg-white p-4 rounded-2xl border border-[#F3DCDD] shadow-sm">
                  <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-[#C12223]" />
                  <s.icon className="w-4 h-4 text-[#C12223] mb-2" />
                  <div className="font-plexmono text-2xl font-black text-[#1F1A1C]">{s.value}</div>
                  <div className="text-[11px] text-[#888888] font-semibold mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading font-black text-sm text-[#1F1A1C] mb-3">Recent activity</h3>
            {activity.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-[#F3DCDD] shadow-sm text-center">
                <p className="text-sm text-[#555555]">
                  Nothing here yet — take a quiz, download a resource, or place an order to see it show up here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {activity.slice(0, 5).map((a, i) => (
                  <Link
                    key={i}
                    href={a.href}
                    className="flex items-center gap-3 bg-white border border-[#F3DCDD] rounded-2xl p-3.5 hover:border-[#C12223] transition"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#FDEAE9] text-[#C12223] flex items-center justify-center shrink-0">
                      <a.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#1F1A1C] truncate">{a.label}</p>
                      <p className="text-[11px] text-[#888888]">{a.sub}</p>
                    </div>
                    <span className="text-[10px] text-[#888888] font-plexmono shrink-0">{timeAgo(a.date)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-[#F3DCDD] shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="font-plexmono text-lg font-black text-[#1F1A1C]">{streak}</span>
              <span className="text-[11px] text-[#888888] font-semibold">day streak</span>
            </div>
            <div className="flex items-center gap-1.5">
              {last7Days.map((active, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full aspect-square rounded-lg ${active ? 'bg-[#C12223]' : 'bg-[#F3DCDD]'}`} />
                  <span className={`text-[9px] font-bold ${i === 6 ? 'text-[#C12223]' : 'text-[#B0989A]'}`}>{dayLabels[(todayDow - 6 + i + 700) % 7]}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#888888] mt-2.5">Days you attempted a Daily Quiz this week.</p>
          </div>

          <div>
            <h3 className="font-heading font-black text-sm text-[#1F1A1C] mb-3">Quick actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((q) => (
                <Link
                  key={q.href}
                  href={q.href}
                  className="flex flex-col items-start gap-3 bg-white border border-[#F3DCDD] rounded-2xl p-4 hover:border-[#C12223] hover:shadow-md transition"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: q.bg }}>
                    <q.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#1F1A1C] leading-tight">{q.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-black text-sm text-[#1F1A1C]">Trending in Current Affairs</h3>
              <Link href="/current-affairs" className="text-[11px] font-bold text-[#C12223]">See all</Link>
            </div>
            {trendingNews.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-[#F3DCDD] shadow-sm text-center">
                <p className="text-xs text-[#888888]">No articles yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {trendingNews.map((n) => (
                  <Link
                    key={n.id}
                    href={`/current-affairs/${n.slug ?? n.id}`}
                    className="flex items-start gap-3 bg-white border border-[#F3DCDD] rounded-2xl p-3 hover:border-[#C12223] transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FDEAE9] text-[#C12223] flex items-center justify-center shrink-0">
                      <Newspaper className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-[#C12223] uppercase">{n.category}</p>
                      <p className="text-xs font-bold text-[#1F1A1C] leading-snug line-clamp-2">{n.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
