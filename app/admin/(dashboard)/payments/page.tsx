import { prisma } from '@/lib/prisma';
import { PageHeader, StatusPill } from '../_components/AdminUI';

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  const userIds = [...new Set(payments.map((p) => p.userId))];
  const users = await prisma.user.findMany({ where: { id: { in: userIds } } });
  const userMap = new Map(users.map((u) => [u.id, u]));

  return (
    <div className="space-y-6">
      <PageHeader title="Payments" subtitle={`${payments.length} transaction${payments.length === 1 ? '' : 's'}`} />
      <div className="bg-white rounded-2xl border border-[#F3DCDD] shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F3DCDD] text-left text-[11px] uppercase text-[#888888] font-bold font-plexmono tracking-wide">
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Razorpay Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const user = userMap.get(p.userId);
              return (
                <tr key={p.id} className="border-b border-[#F3DCDD] last:border-0 hover:bg-[#FFF9F9] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#1F1A1C]">{user?.name || 'Unnamed'}</p>
                    <p className="text-xs text-[#888888]">{user?.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#555555]">{p.purpose.replace('_', ' ')}</td>
                  <td className="px-4 py-3 font-bold text-[#1F1A1C] font-plexmono">₹{(p.amount / 100).toLocaleString()}</td>
                  <td className="px-4 py-3 text-[10px] text-[#888888] font-plexmono">{p.razorpayOrderId}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-[#888888]">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#888888] text-sm">No payments yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
