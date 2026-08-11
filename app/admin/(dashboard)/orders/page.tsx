import { prisma } from '@/lib/prisma';
import OrdersTable from './OrdersTable';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">Orders</h2>
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
