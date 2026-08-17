import { prisma } from '@/lib/prisma';

export interface RankInfo {
  rank: number | null;
  totalTestTakers: number;
  percentileTop: number | null;
}

export async function getUserRank(userId: string): Promise<RankInfo> {
  const [quizSums, mockSums] = await Promise.all([
    prisma.quizAttempt.groupBy({ by: ['userId'], _sum: { obtainedMarks: true } }),
    prisma.mockTestAttempt.groupBy({ by: ['userId'], _sum: { obtainedMarks: true } }),
  ]);

  const totals = new Map<string, number>();
  for (const q of quizSums) totals.set(q.userId, (totals.get(q.userId) ?? 0) + (q._sum.obtainedMarks ?? 0));
  for (const m of mockSums) totals.set(m.userId, (totals.get(m.userId) ?? 0) + (m._sum.obtainedMarks ?? 0));

  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  const index = sorted.findIndex(([uid]) => uid === userId);
  const totalTestTakers = sorted.length;

  if (index === -1) {
    return { rank: null, totalTestTakers, percentileTop: null };
  }
  const rank = index + 1;
  const percentileTop = totalTestTakers > 0 ? Math.max(1, Math.round((rank / totalTestTakers) * 100)) : null;
  return { rank, totalTestTakers, percentileTop };
}

export interface TrendPoint {
  date: string;
  accuracy: number;
}

export async function getScoreTrend(userId: string, limit = 10): Promise<TrendPoint[]> {
  const [quizAttempts, mockAttempts] = await Promise.all([
    prisma.quizAttempt.findMany({ where: { userId }, orderBy: { submittedAt: 'asc' }, select: { accuracy: true, submittedAt: true } }),
    prisma.mockTestAttempt.findMany({ where: { userId }, orderBy: { submittedAt: 'asc' }, select: { accuracy: true, submittedAt: true } }),
  ]);

  return [...quizAttempts, ...mockAttempts]
    .sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime())
    .slice(-limit)
    .map((a) => ({ date: a.submittedAt.toISOString(), accuracy: a.accuracy }));
}

export interface SubjectStrength {
  subject: string;
  avgAccuracy: number;
  attemptCount: number;
}

export async function getSubjectStrength(userId: string): Promise<SubjectStrength[]> {
  const attempts = await prisma.quizAttempt.findMany({ where: { userId }, select: { quizId: true, accuracy: true } });
  if (attempts.length === 0) return [];

  const quizIds = [...new Set(attempts.map((a) => a.quizId))];
  const quizzes = await prisma.quiz.findMany({ where: { id: { in: quizIds } }, select: { id: true, subject: true } });
  const subjectMap = new Map(quizzes.map((q) => [q.id, q.subject]));

  const bySubject = new Map<string, number[]>();
  for (const a of attempts) {
    const subject = subjectMap.get(a.quizId) ?? 'General';
    const list = bySubject.get(subject) ?? [];
    list.push(a.accuracy);
    bySubject.set(subject, list);
  }

  return [...bySubject.entries()]
    .map(([subject, accs]) => ({
      subject,
      avgAccuracy: Math.round(accs.reduce((sum, a) => sum + a, 0) / accs.length),
      attemptCount: accs.length,
    }))
    .sort((a, b) => b.avgAccuracy - a.avgAccuracy);
}
