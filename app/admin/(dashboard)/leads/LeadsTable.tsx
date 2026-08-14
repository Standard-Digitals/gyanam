'use client';
import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import FilterPopover from '../_components/FilterPopover';
import FilterSelect from '../_components/FilterSelect';
import DateRangeFields from '../_components/DateRangeFields';
import { downloadCsv } from '../_components/exportCsv';

interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  targetExam: string | null;
  mode: string | null;
  source: string;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'CONVERTED', 'CLOSED'];
const SOURCE_OPTIONS = ['HERO_QUERY', 'CONTACT_FORM', 'MENTORSHIP'];

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-[#FBF0DF] text-[#B4590A]',
  CONTACTED: 'bg-blue-100 text-blue-800',
  CONVERTED: 'bg-[#E7F5EE] text-[#127A52]',
  CLOSED: 'bg-[#F3EBEA] text-[#8A7A7B]',
};

const STATUS_DOTS: Record<string, string> = {
  NEW: 'bg-[#B4590A]',
  CONTACTED: 'bg-blue-500',
  CONVERTED: 'bg-[#127A52]',
  CLOSED: 'bg-[#B7A9A9]',
};

export default function LeadsTable({ leads: initialLeads }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const activeCount = (statusFilter ? 1 : 0) + (sourceFilter ? 1 : 0) + (dateFrom || dateTo ? 1 : 0);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter && l.status !== statusFilter) return false;
      if (sourceFilter && l.source !== sourceFilter) return false;
      const day = l.createdAt.slice(0, 10);
      if (dateFrom && day < dateFrom) return false;
      if (dateTo && day > dateTo) return false;
      return true;
    });
  }, [leads, statusFilter, sourceFilter, dateFrom, dateTo]);

  const clearFilters = () => {
    setStatusFilter('');
    setSourceFilter('');
    setDateFrom('');
    setDateTo('');
  };

  const handleExport = () => {
    downloadCsv(
      'leads.csv',
      ['Name', 'Phone', 'Email', 'Exam', 'Source', 'Status', 'Date'],
      filteredLeads.map((l) => [l.fullName, l.phone, l.email ?? '', l.targetExam ?? '', l.source, l.status, new Date(l.createdAt).toLocaleDateString()])
    );
  };

  const handleStatusChange = async (id: string, status: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error('Failed to update lead status', err);
    }
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
            label="Source"
            value={sourceFilter}
            onChange={setSourceFilter}
            options={[{ label: 'All sources', value: '' }, ...SOURCE_OPTIONS.map((s) => ({ label: s.replace('_', ' '), value: s }))]}
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Exam</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="border-b border-[#F3DCDD] last:border-0 hover:bg-[#FFF9F9] transition-colors">
                <td className="px-4 py-3 font-semibold text-[#1F1A1C]">{lead.fullName}</td>
                <td className="px-4 py-3 text-[#555555]">{lead.phone}</td>
                <td className="px-4 py-3 text-[#555555]">{lead.targetExam || '—'}</td>
                <td className="px-4 py-3 text-[#555555] text-xs">{lead.source.replace('_', ' ')}</td>
                <td className="px-4 py-3 text-[#888888] text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className="relative inline-block">
                    <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none ${STATUS_DOTS[lead.status] ?? 'bg-gray-400'}`} />
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`pl-6 pr-2.5 py-1 rounded-lg text-xs font-bold border-0 outline-none cursor-pointer ${STATUS_COLORS[lead.status]}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </span>
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#888888] text-sm">
                  {activeCount > 0 ? 'No leads match these filters.' : 'No leads yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
