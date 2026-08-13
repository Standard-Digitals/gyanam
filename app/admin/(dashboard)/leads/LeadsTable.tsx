'use client';
import { useState } from 'react';

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
          {leads.map((lead) => (
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
          {leads.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-[#888888] text-sm">
                No leads yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
