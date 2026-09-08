import { prisma } from '@/lib/prisma';
import CoursesManager from './CoursesManager';

export default async function AdminCoursesPage() {
  const [courses, mentors] = await Promise.all([
    prisma.course.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.mentor.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true, title: true, image: true } }),
  ]);
  return (
    <CoursesManager
      courses={courses.map((c) => ({
        ...c,
        instructor: c.instructor as { name: string; designation: string; avatar: string },
        syllabusOverview: c.syllabusOverview as { module: string; topics: string[] }[],
      }))}
      mentors={mentors}
    />
  );
}
