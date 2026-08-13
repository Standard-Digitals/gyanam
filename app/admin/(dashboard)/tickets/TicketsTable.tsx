'use client';
import { useState } from 'react';

interface Ticket {
  id: string;
  ticketNumber: string;
  studentName: string;
  phone: string;
  category: string;
  urgency: string;
  description: string;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-[#FBF0DF] text-[#B4590A]',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-[#E7F5EE] text-[#127A52]',
  CLOSED: 'bg-[#F3EBEA] text-[#8A7A7B]',
};

const STATUS_DOTS: Record<string, string> = {
  OPEN: 'bg-[#B4590A]',
  IN_PROGRESS: 'bg-blue-500',
  RESOLVED: 'bg-[#127A52]',
  CLOSED: 'bg-[#B7A9A9]',
};

const URGENCY_COLORS: Record<string, string> = {
  Low: 'text-gray-500',
  Normal: 'text-blue-600',
  High: 'text-amber-600',
  Urgent: 'text-red-600',
};

export default function TicketsTable({ tickets: initialTickets }: { tickets: Ticket[] }) {
  const [tickets, setTickets] = useState(initialTickets);

  const handleStatusChange = async (id: string, status: string) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await fetch(`/api/admin/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error('Failed to update ticket status', err);
    }
  };

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="relative bg-white p-4 pl-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-2 overflow-hidden hover:shadow-md transition-shadow">
          <span className={`absolute left-0 top-0 bottom-0 w-1 ${STATUS_DOTS[ticket.status] ?? 'bg-gray-300'}`} />
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-[#C12223] text-sm font-plexmono">{ticket.ticketNumber}</span>
                <span className={`text-[10px] font-black uppercase ${URGENCY_COLORS[ticket.urgency] ?? 'text-gray-500'}`}>{ticket.urgency}</span>
              </div>
              <p className="font-bold text-sm text-[#1F1A1C] mt-0.5">{ticket.studentName} · {ticket.phone}</p>
              <p className="text-xs text-[#888888]">{ticket.category} · {new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
            <span className="relative inline-block shrink-0">
              <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none ${STATUS_DOTS[ticket.status] ?? 'bg-gray-400'}`} />
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                className={`pl-6 pr-2.5 py-1 rounded-lg text-xs font-bold border-0 outline-none cursor-pointer ${STATUS_COLORS[ticket.status]}`}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </span>
          </div>
          <p className="text-xs text-[#555555] bg-[#FFF5F5] p-3 rounded-xl border border-[#F3DCDD]">{ticket.description}</p>
        </div>
      ))}
      {tickets.length === 0 && (
        <div className="bg-white p-8 rounded-2xl border border-[#F3DCDD] shadow-sm text-center text-sm text-[#888888]">
          No support tickets yet.
        </div>
      )}
    </div>
  );
}
