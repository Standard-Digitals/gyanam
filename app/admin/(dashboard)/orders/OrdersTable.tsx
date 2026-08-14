'use client';
import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import FilterPopover from '../_components/FilterPopover';
import FilterSelect from '../_components/FilterSelect';
import DateRangeFields from '../_components/DateRangeFields';
import { downloadCsv } from '../_components/exportCsv';

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
const PAYMENT_STATUS_OPTIONS = ['PENDING', 'PAID'];

const STATUS_COLORS: Record<string, string> = {
  PLACED: 'bg-[#FBF0DF] text-[#B4590A]',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-[#E7F5EE] text-[#127A52]',
  CANCELLED: 'bg-[#F3EBEA] text-[#8A7A7B]',
};

const STATUS_DOTS: Record<string, string> = {
  PLACED: 'bg-[#B4590A]',
  CONFIRMED: 'bg-blue-500',
  SHIPPED: 'bg-purple-500',
  DELIVERED: 'bg-[#127A52]',
  CANCELLED: 'bg-[#B7A9A9]',
};

export default function OrdersTable({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const activeCount = (statusFilter ? 1 : 0) + (paymentStatusFilter ? 1 : 0) + (dateFrom || dateTo ? 1 : 0);

  const paymentStatusOptions = useMemo(() => {
    const seen = new Set(orders.map((o) => o.paymentStatus));
    return PAYMENT_STATUS_OPTIONS.filter((s) => seen.has(s));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter && o.orderStatus !== statusFilter) return false;
      if (paymentStatusFilter && o.paymentStatus !== paymentStatusFilter) return false;
      const day = o.createdAt.slice(0, 10);
      if (dateFrom && day < dateFrom) return false;
      if (dateTo && day > dateTo) return false;
      return true;
    });
  }, [orders, statusFilter, paymentStatusFilter, dateFrom, dateTo]);

  const clearFilters = () => {
    setStatusFilter('');
    setPaymentStatusFilter('');
    setDateFrom('');
    setDateTo('');
  };

  const handleExport = () => {
    downloadCsv(
      'orders.csv',
      ['Order #', 'Customer', 'Phone', 'City', 'State', 'Amount', 'Payment Method', 'Payment Status', 'Order Status', 'Date'],
      filteredOrders.map((o) => [
        o.orderNumber, o.fullName, o.mobile, o.city, o.state, o.grandTotal, o.paymentMethod, o.paymentStatus, o.orderStatus, new Date(o.createdAt).toLocaleDateString(),
      ])
    );
  };

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
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <FilterPopover activeCount={activeCount} onClear={clearFilters}>
          <FilterSelect
            label="Order Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[{ label: 'All statuses', value: '' }, ...STATUS_OPTIONS.map((s) => ({ label: s, value: s }))]}
          />
          <FilterSelect
            label="Payment Status"
            value={paymentStatusFilter}
            onChange={setPaymentStatusFilter}
            options={[{ label: 'All payment statuses', value: '' }, ...paymentStatusOptions.map((s) => ({ label: s, value: s }))]}
          />
          <DateRangeFields from={dateFrom} to={dateTo} onFromChange={setDateFrom} onToChange={setDateTo} />
        </FilterPopover>
        <button onClick={handleExport} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#F3DCDD] rounded-xl text-xs font-bold text-[#1F1A1C] cursor-pointer">
          <Download size={13} strokeWidth={2.25} />
          Export
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#F3DCDD] shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F3DCDD] text-left text-[11px] uppercase text-[#888888] font-bold font-plexmono tracking-wide">
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
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-[#F3DCDD] last:border-0 hover:bg-[#FFF9F9] transition-colors">
                <td className="px-4 py-3 font-black text-[#C12223] font-plexmono text-xs">{order.orderNumber}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-[#1F1A1C]">{order.fullName}</p>
                  <p className="text-xs text-[#888888]">{order.mobile}</p>
                </td>
                <td className="px-4 py-3 text-[#555555] text-xs">{order.city}, {order.state}</td>
                <td className="px-4 py-3 font-bold text-[#1F1A1C] font-plexmono">₹{order.grandTotal}</td>
                <td className="px-4 py-3 text-xs text-[#555555] uppercase">{order.paymentMethod} ({order.paymentStatus})</td>
                <td className="px-4 py-3 text-[#888888] text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className="relative inline-block">
                    <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none ${STATUS_DOTS[order.orderStatus] ?? 'bg-gray-400'}`} />
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`pl-6 pr-2.5 py-1 rounded-lg text-xs font-bold border-0 outline-none cursor-pointer ${STATUS_COLORS[order.orderStatus]}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </span>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#888888] text-sm">
                  {activeCount > 0 ? 'No orders match these filters.' : 'No orders yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
