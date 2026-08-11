import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  const [totalLeads, newLeads, totalUsers, totalQuizAttempts, totalDownloads, totalOrders, pendingOrders] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'NEW' } }),
    prisma.user.count(),
    prisma.quizAttempt.count(),
    prisma.downloadLog.count(),
    prisma.order.count(),
    prisma.order.count({ where: { orderStatus: 'PLACED' } }),
  ]);

  const stats = [
    { label: 'Total Leads', value: totalLeads },
    { label: 'New (Unread) Leads', value: newLeads },
    { label: 'Registered Students', value: totalUsers },
    { label: 'Quiz Attempts', value: totalQuizAttempts },
    { label: 'Resource Downloads', value: totalDownloads },
    { label: 'Total Orders', value: totalOrders },
    { label: 'Orders Pending Dispatch', value: pendingOrders },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">Dashboard</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm">
            <div className="text-3xl font-black text-[#C12223]">{s.value}</div>
            <div className="text-xs text-[#555555] font-semibold mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
