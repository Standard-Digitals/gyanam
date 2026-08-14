import { prisma } from '@/lib/prisma';
import { PageHeader, StatusPill } from '../_components/AdminUI';

function toDateInputValue(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const QUICK_RANGES: { label: string; days: number | null }[] = [
  { label: 'Today', days: 0 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'All time', days: null },
];

export default async function AdminEnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; course?: string }>;
}) {
  const sp = await searchParams;
  const from = sp.from?.trim() || '';
  const to = sp.to?.trim() || '';
  const courseId = sp.course?.trim() || '';

  const where: { enrolledAt?: { gte?: Date; lte?: Date }; courseId?: string } = {};
  if (from || to) {
    where.enrolledAt = {};
    if (from) where.enrolledAt.gte = new Date(`${from}T00:00:00.000Z`);
    if (to) where.enrolledAt.lte = new Date(`${to}T23:59:59.999Z`);
  }
  if (courseId) where.courseId = courseId;

  const [enrollments, allCourses] = await Promise.all([
    prisma.enrollment.findMany({ where, orderBy: { enrolledAt: 'desc' } }),
    prisma.course.findMany({ select: { id: true, title: true }, orderBy: { title: 'asc' } }),
  ]);
  const userIds = [...new Set(enrollments.map((e) => e.userId))];
  const enrolledCourseIds = [...new Set(enrollments.map((e) => e.courseId))];
  const [users, courses] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: userIds } } }),
    prisma.course.findMany({ where: { id: { in: enrolledCourseIds } } }),
  ]);
  const userMap = new Map(users.map((u) => [u.id, u]));
  const courseMap = new Map(courses.map((c) => [c.id, c]));
  const isFiltered = Boolean(from || to || courseId);

  const today = new Date();

  return (
    <div className="space-y-4">
      <PageHeader title="Enrollments" subtitle={`${enrollments.length} total${isFiltered ? ' · filtered' : ''}`} />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {QUICK_RANGES.map((r) => {
            const isAllTime = r.days === null;
            const rangeFrom = isAllTime ? '' : toDateInputValue(new Date(today.getTime() - r.days! * 24 * 60 * 60 * 1000));
            const rangeTo = isAllTime ? '' : toDateInputValue(today);
            const isActive = isAllTime ? !from && !to : from === rangeFrom && to === rangeTo;
            const courseQuery = courseId ? `&course=${courseId}` : '';
            const href = isAllTime
              ? `/admin/enrollments${courseId ? `?course=${courseId}` : ''}`
              : `/admin/enrollments?from=${rangeFrom}&to=${rangeTo}${courseQuery}`;
            return (
              <a
                key={r.label}
                href={href}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  isActive
                    ? 'bg-white text-[#1F1A1C] border border-[#F3DCDD] shadow-sm'
                    : 'text-[#8A7A7B] hover:text-[#1F1A1C]'
                }`}
              >
                {r.label}
              </a>
            );
          })}
        </div>

        <form method="get" className="flex items-center gap-2 flex-wrap">
          <select
            name="course"
            defaultValue={courseId}
            className="px-3 py-2 bg-white border border-[#F3DCDD] rounded-xl text-xs font-semibold text-[#1F1A1C] max-w-[200px]"
          >
            <option value="">All courses</option>
            {allCourses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <input
            type="date"
            name="from"
            defaultValue={from}
            className="px-3 py-2 bg-white border border-[#F3DCDD] rounded-xl text-xs font-semibold text-[#1F1A1C]"
          />
          <span className="text-xs text-[#8A7A7B]">to</span>
          <input
            type="date"
            name="to"
            defaultValue={to}
            className="px-3 py-2 bg-white border border-[#F3DCDD] rounded-xl text-xs font-semibold text-[#1F1A1C]"
          />
          <button type="submit" className="px-3.5 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer">
            Filter
          </button>
          {isFiltered && (
            <a href="/admin/enrollments" className="px-3.5 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl">
              Clear
            </a>
          )}
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-[#F3DCDD] shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F3DCDD] text-left text-[11px] uppercase text-[#888888] font-bold font-plexmono tracking-wide">
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => {
              const user = userMap.get(e.userId);
              const course = courseMap.get(e.courseId);
              return (
                <tr key={e.id} className="border-b border-[#F3DCDD] last:border-0 hover:bg-[#FFF9F9] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#1F1A1C]">{user?.name || 'Unnamed'}</p>
                    <p className="text-xs text-[#888888]">{user?.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-[#555555]">{course?.title ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">{e.paymentType}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={e.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-[#888888]">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
            {enrollments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#888888] text-sm">
                  {isFiltered ? 'No enrollments match these filters.' : 'No enrollments yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
