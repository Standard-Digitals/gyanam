import { prisma } from '@/lib/prisma';
import TicketsTable from './TicketsTable';

export default async function AdminTicketsPage() {
  const tickets = await prisma.supportTicket.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">Support Tickets</h2>
      <TicketsTable
        tickets={tickets.map((t) => ({
          id: t.id,
          ticketNumber: t.ticketNumber,
          studentName: t.studentName,
          phone: t.phone,
          category: t.category,
          urgency: t.urgency,
          description: t.description,
          status: t.status,
          createdAt: t.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
