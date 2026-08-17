import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { getCourseCurriculum } from '@/lib/data/curriculum';
import { getQuizzesByCourseId } from '@/lib/data/quizzes';
import CoursePlayer from './CoursePlayer';

export default async function CoursePlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ topic?: string }>;
}) {
  const user = await getCurrentUserProfile();
  if (!user) return null;

  const { slug } = await params;
  const sp = await searchParams;

  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
  });
  if (!enrollment) redirect(`/courses/${slug}`);

  const [chapters, courseQuizzes] = await Promise.all([
    getCourseCurriculum(course.id),
    getQuizzesByCourseId(course.id),
  ]);
  const flatTopics = chapters.flatMap((c) => c.topics);

  const topicIds = flatTopics.map((t) => t.id);
  const progressRows = topicIds.length
    ? await prisma.topicProgress.findMany({ where: { userId: user.id, topicId: { in: topicIds } }, select: { topicId: true } })
    : [];
  const completedTopicIds = progressRows.map((p) => p.topicId);
  const completedSet = new Set(completedTopicIds);

  const requestedTopicId = sp.topic;
  const initialTopicId =
    (requestedTopicId && flatTopics.some((t) => t.id === requestedTopicId) ? requestedTopicId : null) ??
    flatTopics.find((t) => !completedSet.has(t.id))?.id ??
    flatTopics[0]?.id ??
    null;

  return (
    <CoursePlayer
      course={{ title: course.title, slug: course.slug }}
      chapters={chapters}
      completedTopicIds={completedTopicIds}
      initialTopicId={initialTopicId}
      quizzes={courseQuizzes.map((q) => ({
        id: q.id,
        title: q.title,
        examCategory: q.examCategory,
        totalQuestions: q.totalQuestions,
        timeLimitMinutes: q.timeLimitMinutes,
        difficulty: q.difficulty,
        questions: q.questions,
      }))}
    />
  );
}
