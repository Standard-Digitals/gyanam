import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CurriculumManager from './CurriculumManager';

export default async function AdminCourseCurriculumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) notFound();

  const chapters = await prisma.chapter.findMany({ where: { courseId: id }, orderBy: { order: 'asc' } });
  const chapterIds = chapters.map((c) => c.id);
  const topics = await prisma.topic.findMany({ where: { chapterId: { in: chapterIds } }, orderBy: { order: 'asc' } });

  const chaptersWithTopics = chapters.map((chapter) => ({
    ...chapter,
    topics: topics.filter((t) => t.chapterId === chapter.id),
  }));

  return <CurriculumManager courseId={id} courseTitle={course.title} chapters={chaptersWithTopics} />;
}
