import { prisma } from '@/lib/prisma';
import OrdersTable from './OrdersTable';
import { PageHeader } from '../_components/AdminUI';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" subtitle={`${orders.length} total`} />
      <OrdersTable
        orders={orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          fullName: o.fullName,
          mobile: o.mobile,
          city: o.city,
          state: o.state,
          grandTotal: o.grandTotal,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          orderStatus: o.orderStatus,
          createdAt: o.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
