import { prisma } from '@/lib/prisma';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { Download } from 'lucide-react';
import CourseMaterials from './CourseMaterials';

export default async function DashboardDownloadsPage() {
  const user = await getCurrentUserProfile();
  if (!user) return null;

  const [downloadLogs, enrollments] = await Promise.all([
    prisma.downloadLog.findMany({ where: { userId: user.id }, orderBy: { downloadedAt: 'desc' }, take: 50 }),
    prisma.enrollment.findMany({ where: { userId: user.id }, select: { courseId: true } }),
  ]);

  const resourceIds = [...new Set(downloadLogs.map((d) => d.resourceId))];
  const historyResources = await prisma.freeResource.findMany({
    where: { id: { in: resourceIds } },
    select: { id: true, title: true, type: true, category: true },
  });
  const resourceMap = new Map(historyResources.map((r) => [r.id, r]));

  const courseIds = enrollments.map((e) => e.courseId);
  const courses = courseIds.length ? await prisma.course.findMany({ where: { id: { in: courseIds } }, select: { category: true } }) : [];
  const courseCategories = [...new Set(courses.map((c) => c.category))];

  const courseMaterials = courseCategories.length
    ? await prisma.freeResource.findMany({
        where: { category: { in: courseCategories } },
        orderBy: { downloadsCount: 'desc' },
        take: 6,
        select: { id: true, title: true, type: true, category: true, fileSize: true, price: true },
      })
    : [];

  return (
    <div className="space-y-8">
      {courseCategories.length > 0 && (
        <div>
          <h1 className="font-heading font-black text-2xl text-[#1F1A1C] mb-1">Materials for Your Courses</h1>
          <p className="text-sm text-[#888888] mb-4">Study material matched to your enrolled batch categories.</p>
          <CourseMaterials resources={courseMaterials} />
        </div>
      )}

      <div>
        <h2 className="font-heading font-black text-xl text-[#1F1A1C] mb-4">Download History ({downloadLogs.length})</h2>
        {downloadLogs.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-[#F3DCDD] shadow-sm text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#FDEAE9] text-[#C12223] flex items-center justify-center mx-auto">
              <Download className="w-6 h-6" />
            </div>
            <p className="text-sm text-[#555555]">No downloads yet — download free PDFs from Study Material to see them here.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {downloadLogs.map((log) => {
              const resource = resourceMap.get(log.resourceId);
              return (
                <div key={log.id} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#F3DCDD] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#FDEAE9] text-[#C12223] flex items-center justify-center shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {resource?.type && (
                        <span className="font-plexmono text-[9px] font-bold uppercase text-[#C12223] bg-[#FDEAE9] px-2 py-0.5 rounded-full shrink-0">
                          {resource.type}
                        </span>
                      )}
                      {resource?.category && <span className="text-[10px] text-[#888888] truncate">{resource.category}</span>}
                    </div>
                    <p className="text-sm font-bold text-[#1F1A1C] truncate mt-1">{resource?.title ?? 'Resource'}</p>
                  </div>
                  <span className="text-[11px] text-[#888888] font-plexmono shrink-0">
                    {new Date(log.downloadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
