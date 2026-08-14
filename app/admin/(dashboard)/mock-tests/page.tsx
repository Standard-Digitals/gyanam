import { prisma } from '@/lib/prisma';
import MockTestsManager from './MockTestsManager';

type MockTestQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  flagged?: boolean;
};

export default async function AdminMockTestsPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [mockTests, attemptStats, attemptsToday, avgScoreAgg] = await Promise.all([
    prisma.mockTest.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.mockTestAttempt.groupBy({ by: ['mockTestId'], _count: { _all: true }, _avg: { accuracy: true } }),
    prisma.mockTestAttempt.count({ where: { submittedAt: { gte: startOfToday } } }),
    prisma.mockTestAttempt.aggregate({ _avg: { accuracy: true } }),
  ]);

  const statsByTest = new Map(
    attemptStats.map((s) => [s.mockTestId, { attempts: s._count._all, avgScore: Math.round(s._avg.accuracy ?? 0) }])
  );

  const liveTests = mockTests.filter((t) => t.status === 'ACTIVE').length;
  const flaggedQuestions = mockTests.reduce(
    (sum, t) => sum + (t.questions as MockTestQuestion[]).filter((q) => q.flagged).length,
    0
  );

  return (
    <MockTestsManager
      mockTests={mockTests.map((t) => ({
        id: t.id,
        title: t.title,
        examCategory: t.examCategory,
        timeLimitMinutes: t.timeLimitMinutes,
        status: t.status,
        questions: t.questions as MockTestQuestion[],
        attempts: statsByTest.get(t.id)?.attempts ?? 0,
        avgScore: statsByTest.get(t.id)?.avgScore ?? 0,
      }))}
      stats={{
        liveTests,
        attemptsToday,
        avgScore: Math.round(avgScoreAgg._avg.accuracy ?? 0),
        flaggedQuestions,
      }}
    />
  );
}
