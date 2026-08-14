import { prisma } from '@/lib/prisma';
import { PageHeader } from '../_components/AdminUI';
import StudentsTable from './StudentsTable';

const PAGE_SIZE = 8;
const FILTER_KEYS = ['all', 'active', 'pending'] as const;

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string; exam?: string; course?: string; from?: string; to?: string }>;
}) {
  const sp = await searchParams;
  const filter = (FILTER_KEYS as readonly string[]).includes(sp.filter ?? '') ? (sp.filter as (typeof FILTER_KEYS)[number]) : 'all';
  const examFilter = sp.exam?.trim() || '';
  const courseFilter = sp.course?.trim() || '';
  const from = sp.from?.trim() || '';
  const to = sp.to?.trim() || '';
  const page = Math.max(1, Number(sp.page) || 1);

  const [paidEnrollments, courseEnrollments, allCourses] = await Promise.all([
    prisma.enrollment.findMany({ where: { paymentType: 'PAID' }, select: { userId: true }, distinct: ['userId'] }),
    courseFilter
      ? prisma.enrollment.findMany({ where: { courseId: courseFilter }, select: { userId: true }, distinct: ['userId'] })
      : Promise.resolve([]),
    prisma.course.findMany({ select: { id: true, title: true }, orderBy: { title: 'asc' } }),
  ]);
  const activeIds = paidEnrollments.map((e) => e.userId);

  const andConditions: {
    id?: { in?: string[]; notIn?: string[] };
    targetExam?: string;
    createdAt?: { gte?: Date; lte?: Date };
  }[] = [];
  if (filter === 'active') andConditions.push({ id: { in: activeIds } });
  if (filter === 'pending') andConditions.push({ id: { notIn: activeIds } });
  if (examFilter) andConditions.push({ targetExam: examFilter });
  if (courseFilter) andConditions.push({ id: { in: courseEnrollments.map((e) => e.userId) } });
  if (from || to) {
    const createdAt: { gte?: Date; lte?: Date } = {};
    if (from) createdAt.gte = new Date(`${from}T00:00:00.000Z`);
    if (to) createdAt.lte = new Date(`${to}T23:59:59.999Z`);
    andConditions.push({ createdAt });
  }
  const where = andConditions.length > 0 ? { AND: andConditions } : {};

  const [total, users, targetExamRows] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.user.findMany({ where: { targetExam: { not: null } }, select: { targetExam: true }, distinct: ['targetExam'] }),
  ]);

  const userIds = users.map((u) => u.id);
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: { in: userIds } },
    orderBy: { enrolledAt: 'desc' },
  });
  const latestEnrollmentByUser = new Map<string, (typeof enrollments)[number]>();
  for (const e of enrollments) {
    if (!latestEnrollmentByUser.has(e.userId)) latestEnrollmentByUser.set(e.userId, e);
  }
  const courseIds = [...new Set(enrollments.map((e) => e.courseId))];
  const courses = await prisma.course.findMany({ where: { id: { in: courseIds } } });
  const courseMap = new Map(courses.map((c) => [c.id, c.title]));
  const activeIdSet = new Set(activeIds);

  const rows = users.map((u) => {
    const latest = latestEnrollmentByUser.get(u.id);
    return {
      id: u.id,
      name: u.name || 'Unnamed',
      email: u.email,
      phone: u.phone,
      targetExam: u.targetExam,
      course: latest ? courseMap.get(latest.courseId) ?? null : null,
      status: (activeIdSet.has(u.id) ? 'active' : 'pending') as 'active' | 'pending',
      joinedAt: u.createdAt.toISOString(),
    };
  });

  const targetExams = targetExamRows.map((r) => r.targetExam!).sort();

  return (
    <div className="space-y-4">
      <PageHeader title="Students" subtitle={`${total.toLocaleString()} total`} />
      <StudentsTable
        rows={rows}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        filter={filter}
        examFilter={examFilter}
        courseFilter={courseFilter}
        from={from}
        to={to}
        targetExams={targetExams}
        allCourses={allCourses}
      />
    </div>
  );
}
