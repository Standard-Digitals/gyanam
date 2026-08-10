import { prisma } from '@/lib/prisma';
import LeadsTable from './LeadsTable';

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">Leads Inbox</h2>
      <LeadsTable
        leads={leads.map((l) => ({
          id: l.id,
          fullName: l.fullName,
          phone: l.phone,
          email: l.email,
          targetExam: l.targetExam,
          mode: l.mode,
          source: l.source,
          status: l.status,
          createdAt: l.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
