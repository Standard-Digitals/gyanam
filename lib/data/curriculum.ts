import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export const getCourseCurriculum = cache(async (courseId: string) => {
  const chapters = await prisma.chapter.findMany({ where: { courseId }, orderBy: { order: 'asc' } });
  const chapterIds = chapters.map((c) => c.id);
  const topics = await prisma.topic.findMany({ where: { chapterId: { in: chapterIds } }, orderBy: { order: 'asc' } });

  return chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    topics: topics
      .filter((t) => t.chapterId === chapter.id)
      .map((t) => ({ id: t.id, title: t.title, videoType: t.videoType, videoUrl: t.videoUrl, duration: t.duration })),
  }));
});
