'use client';
import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { StatusPill } from '../_components/AdminUI';
import FilterPopover from '../_components/FilterPopover';
import FilterSelect from '../_components/FilterSelect';
import DateRangeFields from '../_components/DateRangeFields';
import { downloadCsv } from '../_components/exportCsv';

interface Payment {
  id: string;
  studentName: string;
  studentPhone: string;
  purpose: string;
  amount: number;
  razorpayOrderId: string;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ['CREATED', 'PAID', 'FAILED'];
const PURPOSE_OPTIONS = ['COURSE_ENROLLMENT', 'BOOKSTORE_ORDER'];

export default function PaymentsManager({ payments }: { payments: Payment[] }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const activeCount = (statusFilter ? 1 : 0) + (purposeFilter ? 1 : 0) + (dateFrom || dateTo ? 1 : 0);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (statusFilter && p.status !== statusFilter) return false;
      if (purposeFilter && p.purpose !== purposeFilter) return false;
      const day = p.createdAt.slice(0, 10);
      if (dateFrom && day < dateFrom) return false;
      if (dateTo && day > dateTo) return false;
      return true;
    });
  }, [payments, statusFilter, purposeFilter, dateFrom, dateTo]);

  const clearFilters = () => {
    setStatusFilter('');
    setPurposeFilter('');
    setDateFrom('');
    setDateTo('');
  };

  const handleExport = () => {
    downloadCsv(
      'payments.csv',
      ['Student', 'Phone', 'Purpose', 'Amount', 'Razorpay Order', 'Status', 'Date'],
      filteredPayments.map((p) => [
        p.studentName, p.studentPhone, p.purpose.replace('_', ' '), (p.amount / 100).toFixed(2), p.razorpayOrderId, p.status, new Date(p.createdAt).toLocaleDateString(),
      ])
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <FilterPopover activeCount={activeCount} onClear={clearFilters}>
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[{ label: 'All statuses', value: '' }, ...STATUS_OPTIONS.map((s) => ({ label: s, value: s }))]}
          />
          <FilterSelect
            label="Purpose"
            value={purposeFilter}
            onChange={setPurposeFilter}
            options={[{ label: 'All purposes', value: '' }, ...PURPOSE_OPTIONS.map((s) => ({ label: s.replace('_', ' '), value: s }))]}
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
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Razorpay Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => (
              <tr key={p.id} className="border-b border-[#F3DCDD] last:border-0 hover:bg-[#FFF9F9] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[#1F1A1C]">{p.studentName}</p>
                  <p className="text-xs text-[#888888]">{p.studentPhone}</p>
                </td>
                <td className="px-4 py-3 text-xs text-[#555555]">{p.purpose.replace('_', ' ')}</td>
                <td className="px-4 py-3 font-bold text-[#1F1A1C] font-plexmono">₹{(p.amount / 100).toLocaleString()}</td>
                <td className="px-4 py-3 text-[10px] text-[#888888] font-plexmono">{p.razorpayOrderId}</td>
                <td className="px-4 py-3">
                  <StatusPill status={p.status} />
                </td>
                <td className="px-4 py-3 text-xs text-[#888888]">{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#888888] text-sm">
                  {activeCount > 0 ? 'No payments match these filters.' : 'No payments yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
