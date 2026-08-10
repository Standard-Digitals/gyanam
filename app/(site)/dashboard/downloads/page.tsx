import { prisma } from '@/lib/prisma';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { Download } from 'lucide-react';

export default async function DashboardDownloadsPage() {
  const user = await getCurrentUserProfile();
  if (!user) return null;

  const downloadLogs = await prisma.downloadLog.findMany({
    where: { userId: user.id },
    orderBy: { downloadedAt: 'desc' },
    take: 50,
  });
  const resourceIds = [...new Set(downloadLogs.map((d) => d.resourceId))];
  const resources = await prisma.freeResource.findMany({ where: { id: { in: resourceIds } }, select: { id: true, title: true } });
  const resourceTitleMap = new Map(resources.map((r) => [r.id, r.title]));

  return (
    <div className="space-y-6">
      <h1 className="font-heading font-black text-2xl text-[#1F1A1C]">Download History ({downloadLogs.length})</h1>
      {downloadLogs.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-[#F3DCDD] shadow-sm text-center space-y-2">
          <Download className="w-10 h-10 text-[#C12223] mx-auto" />
          <p className="text-sm text-[#555555]">No downloads yet — download free PDFs from Study Material to see them here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {downloadLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#F3DCDD] shadow-sm text-sm">
              <p className="font-bold text-[#1F1A1C]">{resourceTitleMap.get(log.resourceId) ?? 'Resource'}</p>
              <p className="text-xs text-[#888888]">{new Date(log.downloadedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
