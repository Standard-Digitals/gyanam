import { prisma } from '@/lib/prisma';
import LeadsTable from './LeadsTable';
import { PageHeader } from '../_components/AdminUI';

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <PageHeader title="Leads Inbox" subtitle={`${leads.length} total`} />
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
