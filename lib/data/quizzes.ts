import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizWithQuestions {
  id: string;
  title: string;
  subject: string;
  examCategory: string;
  date: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  totalMarks: number;
  difficulty: string;
  questions: QuizQuestion[];
  attemptsCount: number;
  avgScore: number;
}

export const getAllQuizzes = cache(async (): Promise<QuizWithQuestions[]> => {
  const [quizzes, stats] = await Promise.all([
    prisma.quiz.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.quizAttempt.groupBy({ by: ['quizId'], _count: { _all: true }, _avg: { obtainedMarks: true } }),
  ]);
  const statsMap = new Map(stats.map((s) => [s.quizId, s]));

  return quizzes.map((q) => {
    const stat = statsMap.get(q.id);
    return {
      ...q,
      questions: q.questions as unknown as QuizQuestion[],
      attemptsCount: stat?._count._all ?? 0,
      avgScore: stat?._avg.obtainedMarks ?? 0,
    };
  });
});

export interface QuizForSubmit {
  id: string;
  totalQuestions: number;
  questions: QuizQuestion[];
}

export async function getQuizById(id: string): Promise<QuizForSubmit | null> {
  const quiz = await prisma.quiz.findUnique({ where: { id } });
  if (!quiz) return null;
  return { id: quiz.id, totalQuestions: quiz.totalQuestions, questions: quiz.questions as unknown as QuizQuestion[] };
}

export async function getQuizzesBySubject(subject: string): Promise<QuizWithQuestions[]> {
  const quizzes = await prisma.quiz.findMany({ where: { subject }, orderBy: { createdAt: 'desc' } });
  return quizzes.map((q) => ({
    ...q,
    questions: q.questions as unknown as QuizQuestion[],
    attemptsCount: 0,
    avgScore: 0,
  }));
}

export async function getQuizzesByCourseId(courseId: string): Promise<QuizWithQuestions[]> {
  const quizzes = await prisma.quiz.findMany({ where: { courseId }, orderBy: { createdAt: 'asc' } });
  return quizzes.map((q) => ({
    ...q,
    questions: q.questions as unknown as QuizQuestion[],
    attemptsCount: 0,
    avgScore: 0,
  }));
}
