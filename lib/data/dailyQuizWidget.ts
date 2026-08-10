import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { DailyQuizQuestion } from '@/types';

export const getDailyQuizWidgetQuestions = cache(async (): Promise<DailyQuizQuestion[]> => {
  return prisma.dailyQuizQuestion.findMany({ orderBy: { id: 'asc' } });
});
