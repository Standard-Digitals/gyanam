import { prisma } from '@/lib/prisma';
import QuizzesManager from './QuizzesManager';

export default async function AdminQuizzesPage() {
  const quizzes = await prisma.quiz.findMany({ orderBy: { createdAt: 'desc' } });
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
        questions: q.questions as { id: number; question: string; options: string[]; correctAnswer: number; explanation: string }[],
      }))}
    />
  );
}
