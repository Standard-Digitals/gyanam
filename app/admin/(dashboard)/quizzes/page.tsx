import { prisma } from '@/lib/prisma';
import QuizzesManager from './QuizzesManager';

export default async function AdminQuizzesPage() {
  const [quizzes, courses] = await Promise.all([
    prisma.quiz.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.course.findMany({ select: { id: true, title: true }, orderBy: { title: 'asc' } }),
  ]);
  return (
    <QuizzesManager
      quizzes={quizzes.map((q) => ({
        id: q.id,
        title: q.title,
        subject: q.subject,
        examCategory: q.examCategory,
        date: q.date,
        timeLimitMinutes: q.timeLimitMinutes,
        difficulty: q.difficulty,
        thumbnail: q.thumbnail,
        courseId: q.courseId,
        questions: q.questions as { id: number; question: string; options: string[]; correctAnswer: number; explanation: string }[],
      }))}
      courses={courses}
    />
  );
}
