import { prisma } from '@/lib/prisma';
import { PageHeader } from '../_components/AdminUI';
import PaymentsManager from './PaymentsManager';

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  const userIds = [...new Set(payments.map((p) => p.userId))];
  const users = await prisma.user.findMany({ where: { id: { in: userIds } } });
  const userMap = new Map(users.map((u) => [u.id, u]));

  return (
    <div className="space-y-6">
      <PageHeader title="Payments" subtitle={`${payments.length} transaction${payments.length === 1 ? '' : 's'}`} />
      <PaymentsManager
        payments={payments.map((p) => ({
          id: p.id,
          studentName: userMap.get(p.userId)?.name || 'Unnamed',
          studentPhone: userMap.get(p.userId)?.phone || '',
          purpose: p.purpose,
          amount: p.amount,
          razorpayOrderId: p.razorpayOrderId,
          status: p.status,
          createdAt: p.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
