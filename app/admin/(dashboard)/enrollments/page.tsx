import { prisma } from '@/lib/prisma';
import { PageHeader } from '../_components/AdminUI';
import EnrollmentsManager from './EnrollmentsManager';

export default async function AdminEnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; course?: string; type?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const from = sp.from?.trim() || '';
  const to = sp.to?.trim() || '';
  const courseId = sp.course?.trim() || '';
  const paymentType = sp.type?.trim() || '';
  const status = sp.status?.trim() || '';

  const where: { enrolledAt?: { gte?: Date; lte?: Date }; courseId?: string; paymentType?: string; status?: string } = {};
  if (from || to) {
    where.enrolledAt = {};
    if (from) where.enrolledAt.gte = new Date(`${from}T00:00:00.000Z`);
    if (to) where.enrolledAt.lte = new Date(`${to}T23:59:59.999Z`);
  }
  if (courseId) where.courseId = courseId;
  if (paymentType) where.paymentType = paymentType;
  if (status) where.status = status;

  const [enrollments, allCourses, paymentTypeRows, statusRows] = await Promise.all([
    prisma.enrollment.findMany({ where, orderBy: { enrolledAt: 'desc' } }),
    prisma.course.findMany({ select: { id: true, title: true }, orderBy: { title: 'asc' } }),
    prisma.enrollment.findMany({ distinct: ['paymentType'], select: { paymentType: true } }),
    prisma.enrollment.findMany({ distinct: ['status'], select: { status: true } }),
  ]);
  const userIds = [...new Set(enrollments.map((e) => e.userId))];
  const enrolledCourseIds = [...new Set(enrollments.map((e) => e.courseId))];
  const [users, courses] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: userIds } } }),
    prisma.course.findMany({ where: { id: { in: enrolledCourseIds } } }),
  ]);
  const userMap = new Map(users.map((u) => [u.id, u]));
  const courseMap = new Map(courses.map((c) => [c.id, c]));
  const isFiltered = Boolean(from || to || courseId || paymentType || status);
  const paymentTypeOptions = paymentTypeRows.map((r) => r.paymentType).sort();
  const statusOptions = statusRows.map((r) => r.status).sort();

  const rows = enrollments.map((e) => ({
    id: e.id,
    studentName: userMap.get(e.userId)?.name || 'Unnamed',
    phone: userMap.get(e.userId)?.phone || '',
    courseTitle: courseMap.get(e.courseId)?.title ?? null,
    paymentType: e.paymentType,
    status: e.status,
    enrolledAt: e.enrolledAt.toISOString(),
  }));

  return (
    <div className="space-y-4">
      <PageHeader title="Enrollments" subtitle={`${rows.length} total${isFiltered ? ' · filtered' : ''}`} />
      <EnrollmentsManager
        rows={rows}
        from={from}
        to={to}
        courseId={courseId}
        paymentType={paymentType}
        status={status}
        allCourses={allCourses}
        paymentTypeOptions={paymentTypeOptions}
        statusOptions={statusOptions}
        todayISO={new Date().toISOString().slice(0, 10)}
      />
    </div>
  );
}
