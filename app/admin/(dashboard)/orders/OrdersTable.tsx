'use client';
import { useState } from 'react';

interface Order {
  id: string;
  orderNumber: string;
  fullName: string;
  mobile: string;
  city: string;
  state: string;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

const STATUS_OPTIONS = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_COLORS: Record<string, string> = {
  PLACED: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-gray-100 text-gray-600',
};

export default function OrdersTable({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);

  const handleStatusChange = async (id: string, orderStatus: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, orderStatus } : o)));
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus }),
      });
    } catch (err) {
      console.error('Failed to update order status', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F3DCDD] shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#F3DCDD] text-left text-xs uppercase text-[#888888] font-bold">
            <th className="px-4 py-3">Order #</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">City</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-[#F3DCDD] last:border-0">
              <td className="px-4 py-3 font-black text-[#C12223]">{order.orderNumber}</td>
              <td className="px-4 py-3">
                <p className="font-semibold text-[#1F1A1C]">{order.fullName}</p>
                <p className="text-xs text-[#888888]">{order.mobile}</p>
              </td>
              <td className="px-4 py-3 text-[#555555] text-xs">{order.city}, {order.state}</td>
              <td className="px-4 py-3 font-bold text-[#1F1A1C]">₹{order.grandTotal}</td>
              <td className="px-4 py-3 text-xs text-[#555555] uppercase">{order.paymentMethod} ({order.paymentStatus})</td>
              <td className="px-4 py-3 text-[#888888] text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <select
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border-0 outline-none cursor-pointer ${STATUS_COLORS[order.orderStatus]}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-[#888888] text-sm">
                No orders yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
