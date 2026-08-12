import { prisma } from '@/lib/prisma';

export default async function AdminEnrollmentsPage() {
  const enrollments = await prisma.enrollment.findMany({ orderBy: { enrolledAt: 'desc' } });
  const userIds = [...new Set(enrollments.map((e) => e.userId))];
  const courseIds = [...new Set(enrollments.map((e) => e.courseId))];
  const [users, courses] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: userIds } } }),
    prisma.course.findMany({ where: { id: { in: courseIds } } }),
  ]);
  const userMap = new Map(users.map((u) => [u.id, u]));
  const courseMap = new Map(courses.map((c) => [c.id, c]));

  return (
    <div className="space-y-6">
      <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">Enrollments ({enrollments.length})</h2>
      <div className="bg-white rounded-2xl border border-[#F3DCDD] shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F3DCDD] text-left text-xs uppercase text-[#888888] font-bold">
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
                <tr key={e.id} className="border-b border-[#F3DCDD] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#1F1A1C]">{user?.name || 'Unnamed'}</p>
                    <p className="text-xs text-[#888888]">{user?.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-[#555555]">{course?.title ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">{e.paymentType}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#555555]">{e.status}</td>
                  <td className="px-4 py-3 text-xs text-[#888888]">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
            {enrollments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#888888] text-sm">No enrollments yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
