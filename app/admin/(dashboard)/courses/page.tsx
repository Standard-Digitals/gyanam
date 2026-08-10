import { prisma } from '@/lib/prisma';
import CoursesManager from './CoursesManager';

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <CoursesManager
      courses={courses.map((c) => ({
        ...c,
        instructor: c.instructor as { name: string; designation: string; avatar: string },
        syllabusOverview: c.syllabusOverview as { module: string; topics: string[] }[],
      }))}
    />
  );
}
