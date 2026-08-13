import { prisma } from '@/lib/prisma';
import TicketsTable from './TicketsTable';
import { PageHeader } from '../_components/AdminUI';

export default async function AdminTicketsPage() {
  const tickets = await prisma.supportTicket.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <PageHeader title="Support Tickets" subtitle={`${tickets.length} total`} />
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
