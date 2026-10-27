import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { DailyQuizQuestion } from '@/types';

/**
 * The "Daily 5-MCQ Live Test" widget draws its questions from the practice MCQ admins attach to
 * each Current Affairs article (CurrentAffairsManager's "Include a practice MCQ" field) — not
 * from the old `DailyQuizQuestion` table, which has no admin UI and only ever held its one-time
 * seed data, so anything admins actually added there never reached the public site.
 */
export const getDailyQuizWidgetQuestions = cache(async (): Promise<DailyQuizQuestion[]> => {
  const items = await prisma.currentAffairItem.findMany({
    orderBy: { createdAt: 'desc' },
    take: 30,
    select: { mcqQuestion: true, impForExams: true, category: true },
  });

  const withMcq = items.filter((item) => item.mcqQuestion) as Array<{
    mcqQuestion: { question: string; options: string[]; correctAnswer: number; explanation: string };
    impForExams: string[];
    category: string;
  }>;

  return withMcq.slice(0, 5).map((item, idx) => ({
    id: idx + 1,
    question: item.mcqQuestion.question,
    options: item.mcqQuestion.options,
    correctAnswer: item.mcqQuestion.correctAnswer,
    explanation: item.mcqQuestion.explanation,
    examTag: item.impForExams[0] ?? item.category,
  }));
});
