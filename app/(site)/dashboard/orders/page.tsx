import { prisma } from '@/lib/prisma';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { Package } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  PLACED: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-gray-100 text-gray-600',
};

export default async function DashboardOrdersPage() {
  const user = await getCurrentUserProfile();
  if (!user) return null;

  const orders = await prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <h1 className="font-heading font-black text-2xl text-[#1F1A1C]">My Orders ({orders.length})</h1>
      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-[#F3DCDD] shadow-sm text-center space-y-2">
          <Package className="w-10 h-10 text-[#C12223] mx-auto" />
          <p className="text-sm text-[#555555]">No orders yet — order free/paid PDFs and books from Study Material to see them here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const items = order.items as { title: string; format: string; quantity: number; unitPrice: number }[];
            return (
              <div key={order.id} className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-sm text-[#1F1A1C]">{order.orderNumber}</p>
                    <p className="text-xs text-[#888888]">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${STATUS_COLORS[order.orderStatus] ?? 'bg-gray-100 text-gray-700'}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className="space-y-1 border-t border-[#F3DCDD] pt-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-[#555555]">
                      <span>{item.title} ({item.format}) x{item.quantity}</span>
                      <span className="font-bold text-[#1F1A1C]">₹{item.unitPrice * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm font-black text-[#C12223] border-t border-[#F3DCDD] pt-3">
                  <span>Total ({order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod})</span>
                  <span>₹{order.grandTotal}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
