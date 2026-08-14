import { prisma } from '@/lib/prisma';
import OrdersTable from './OrdersTable';
import { PageHeader } from '../_components/AdminUI';

type OrderItem = { resourceId: string; title: string; format: string; quantity: number; unitPrice: number };

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });

  const mappedOrders = orders.map((o) => {
    const items = o.items as OrderItem[];
    return {
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
      products: items.map((i) => i.title),
      productsLabel: items.map((i) => (i.quantity > 1 ? `${i.title} (x${i.quantity})` : i.title)).join(', '),
    };
  });

  const productOptions = [...new Set(mappedOrders.flatMap((o) => o.products))].sort();

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" subtitle={`${orders.length} total`} />
      <OrdersTable orders={mappedOrders} productOptions={productOptions} />
    </div>
  );
}
