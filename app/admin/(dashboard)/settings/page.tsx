import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/adminSession';
import { PageHeader } from '../_components/AdminUI';
import SettingsManager from './SettingsManager';

export default async function AdminSettingsPage() {
  const [siteSettings, notificationPrefs, team, currentAdmin] = await Promise.all([
    prisma.siteSettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } }),
    prisma.notificationPreference.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } }),
    prisma.adminUser.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
    getCurrentAdmin(),
  ]);

  return (
    <div className="space-y-4">
      <PageHeader title="Settings" subtitle="System" />
      <SettingsManager
        siteSettings={{
          academyName: siteSettings.academyName,
          tagline: siteSettings.tagline,
          supportEmail: siteSettings.supportEmail,
          supportPhone: siteSettings.supportPhone,
          ogDescription: siteSettings.ogDescription,
        }}
        notificationPrefs={{
          newEnrollments: notificationPrefs.newEnrollments,
          newLeads: notificationPrefs.newLeads,
          openTickets: notificationPrefs.openTickets,
          pendingOrders: notificationPrefs.pendingOrders,
        }}
        team={team.map((t) => ({ ...t, createdAt: t.createdAt.toISOString() }))}
        currentAdminId={currentAdmin?.adminId ?? null}
      />
    </div>
  );
}
