import { prisma } from '@/lib/prisma';

const STATUS_COLORS: Record<string, string> = {
  CREATED: 'bg-amber-100 text-amber-800',
  PAID: 'bg-emerald-100 text-emerald-800',
  FAILED: 'bg-red-100 text-red-800',
};

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  const userIds = [...new Set(payments.map((p) => p.userId))];
  const users = await prisma.user.findMany({ where: { id: { in: userIds } } });
  const userMap = new Map(users.map((u) => [u.id, u]));

  return (
    <div className="space-y-6">
      <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">Payments</h2>
      <div className="bg-white rounded-2xl border border-[#F3DCDD] shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F3DCDD] text-left text-xs uppercase text-[#888888] font-bold">
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
                <tr key={p.id} className="border-b border-[#F3DCDD] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#1F1A1C]">{user?.name || 'Unnamed'}</p>
                    <p className="text-xs text-[#888888]">{user?.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#555555]">{p.purpose.replace('_', ' ')}</td>
                  <td className="px-4 py-3 font-bold text-[#1F1A1C]">₹{(p.amount / 100).toLocaleString()}</td>
                  <td className="px-4 py-3 text-[10px] text-[#888888] font-mono">{p.razorpayOrderId}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${STATUS_COLORS[p.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {p.status}
                    </span>
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
