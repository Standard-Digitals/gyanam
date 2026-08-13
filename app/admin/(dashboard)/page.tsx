import { prisma } from '@/lib/prisma';
import { isRazorpayConfigured } from '@/lib/razorpay';

export default async function AdminDashboardPage() {
  const [totalLeads, newLeads, totalUsers, totalQuizAttempts, totalDownloads, totalOrders, pendingOrders, openTickets, totalEnrollments, totalPayments] = await Promise.all([
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
  ]);
  const paymentsLive = isRazorpayConfigured();

  const stats = [
    { label: 'Total Leads', value: totalLeads },
    { label: 'New (Unread) Leads', value: newLeads },
    { label: 'Registered Students', value: totalUsers },
    { label: 'Course Enrollments', value: totalEnrollments },
    { label: 'Quiz Attempts', value: totalQuizAttempts },
    { label: 'Resource Downloads', value: totalDownloads },
    { label: 'Total Orders', value: totalOrders },
    { label: 'Orders Pending Dispatch', value: pendingOrders },
    { label: 'Open Support Tickets', value: openTickets },
    { label: 'Successful Payments', value: totalPayments },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">Dashboard</h2>
        <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase ${paymentsLive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
          {paymentsLive ? '● Online Payments: Live' : '● Online Payments: Not Configured (Free enrollment / COD only)'}
        </span>
      </div>
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
