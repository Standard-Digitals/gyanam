import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'My Dashboard',
  path: '/dashboard',
  noIndex: true,
});

export default async function DashboardOverviewPage() {
  const user = await getCurrentUserProfile();
  if (!user) return null;

  const [quizAttemptsCount, downloadsCount, ordersCount, enrollmentsCount] = await Promise.all([
    prisma.quizAttempt.count({ where: { userId: user.id } }),
    prisma.downloadLog.count({ where: { userId: user.id } }),
    prisma.order.count({ where: { userId: user.id } }),
    prisma.enrollment.count({ where: { userId: user.id } }),
  ]);

  const stats = [
    { label: 'Quiz Attempts', value: quizAttemptsCount },
    { label: 'Downloads', value: downloadsCount },
    { label: 'Orders', value: ordersCount },
    { label: 'Enrolled Courses', value: enrollmentsCount },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-heading font-black text-2xl text-[#1F1A1C]">Overview</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm">
            <div className="text-3xl font-black text-[#C12223]">{s.value}</div>
            <div className="text-xs text-[#555555] font-semibold mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-2xl border border-[#F3DCDD] shadow-sm">
        <p className="text-sm text-[#555555]">
          Welcome back, <strong className="text-[#1F1A1C]">{user.name || `+91 ${user.phone}`}</strong>! Use the menu on the left to manage your profile, view your quiz history, and check your downloads.
        </p>
      </div>
    </div>
  );
}
