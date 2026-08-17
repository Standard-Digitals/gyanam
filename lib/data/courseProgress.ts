import { prisma } from '@/lib/prisma';

export interface CourseProgressSummary {
  total: number;
  completedCount: number;
  percent: number;
  nextTopicId: string | null;
}

export async function getCourseProgressMap(userId: string, courseIds: string[]): Promise<Map<string, CourseProgressSummary>> {
  const result = new Map<string, CourseProgressSummary>();
  if (courseIds.length === 0) return result;

  const chapters = await prisma.chapter.findMany({
    where: { courseId: { in: courseIds } },
    orderBy: { order: 'asc' },
    select: { id: true, courseId: true },
  });
  const chaptersByCourse = new Map<string, string[]>();
  for (const c of chapters) {
    const list = chaptersByCourse.get(c.courseId) ?? [];
    list.push(c.id);
    chaptersByCourse.set(c.courseId, list);
  }

  const chapterIds = chapters.map((c) => c.id);
  const topics = chapterIds.length
    ? await prisma.topic.findMany({ where: { chapterId: { in: chapterIds } }, orderBy: { order: 'asc' }, select: { id: true, chapterId: true } })
    : [];
  const topicsByChapter = new Map<string, string[]>();
  for (const t of topics) {
    const list = topicsByChapter.get(t.chapterId) ?? [];
    list.push(t.id);
    topicsByChapter.set(t.chapterId, list);
  }

  const topicIds = topics.map((t) => t.id);
  const progress = topicIds.length
    ? await prisma.topicProgress.findMany({ where: { userId, topicId: { in: topicIds } }, select: { topicId: true } })
    : [];
  const completedSet = new Set(progress.map((p) => p.topicId));

  for (const courseId of courseIds) {
    const orderedTopicIds = (chaptersByCourse.get(courseId) ?? []).flatMap((chapterId) => topicsByChapter.get(chapterId) ?? []);
    const completedCount = orderedTopicIds.filter((id) => completedSet.has(id)).length;
    const nextTopicId = orderedTopicIds.find((id) => !completedSet.has(id)) ?? null;
    const total = orderedTopicIds.length;
    result.set(courseId, {
      total,
      completedCount,
      percent: total > 0 ? Math.round((completedCount / total) * 100) : 0,
      nextTopicId,
    });
  }

  return result;
}

export async function getCourseProgress(userId: string, courseId: string): Promise<CourseProgressSummary> {
  const map = await getCourseProgressMap(userId, [courseId]);
  return map.get(courseId) ?? { total: 0, completedCount: 0, percent: 0, nextTopicId: null };
}
