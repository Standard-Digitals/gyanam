import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export interface MockTestQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  flagged?: boolean;
}

export interface MockTestWithQuestions {
  id: string;
  title: string;
  examCategory: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  status: string;
  questions: MockTestQuestion[];
}

export const getActiveMockTests = cache(async (): Promise<MockTestWithQuestions[]> => {
  const tests = await prisma.mockTest.findMany({ where: { status: 'ACTIVE' }, orderBy: { createdAt: 'desc' } });
  return tests.map((t) => ({ ...t, questions: t.questions as unknown as MockTestQuestion[] }));
});

export interface MockTestForSubmit {
  id: string;
  totalQuestions: number;
  questions: MockTestQuestion[];
}

export async function getMockTestById(id: string): Promise<MockTestForSubmit | null> {
  const test = await prisma.mockTest.findUnique({ where: { id } });
  if (!test || test.status !== 'ACTIVE') return null;
  return { id: test.id, totalQuestions: test.totalQuestions, questions: test.questions as unknown as MockTestQuestion[] };
}
