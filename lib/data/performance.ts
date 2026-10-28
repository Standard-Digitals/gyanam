import { prisma } from '@/lib/prisma';
import { generateMistakeTip } from '@/lib/data/chatIntent';

export interface RecentMistake {
  id: string;
  subject: string;
  questionText: string;
  options: string[];
  correctAnswer: number | null;
  correctAnswerText: string | null;
  selectedAnswer: string | null;
  wasSkipped: boolean;
  explanation: string;
  improvementTip: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
}

/** Fills in `improvementTip` for whichever of the given mistakes don't have one yet, in parallel,
 * and persists each one as it's generated — lazily, on read, rather than at quiz/mock submission
 * time, so a slow or failed OpenAI call can never delay a student's score. Best-effort throughout:
 * a mistake that fails to generate a tip is returned as-is (null tip), exactly as before this existed. */
async function withImprovementTips(mistakes: RecentMistake[]): Promise<RecentMistake[]> {
  return Promise.all(
    mistakes.map(async (m) => {
      if (m.improvementTip) return m;
      const correct = m.correctAnswerText ?? (m.correctAnswer !== null ? m.options[m.correctAnswer] : null);
      if (!correct) return m;
      const tip = await generateMistakeTip(m.subject, m.questionText, correct, m.explanation);
      if (!tip) return m;
      prisma.questionMistake.update({ where: { id: m.id }, data: { improvementTip: tip } }).catch(() => {});
      return { ...m, improvementTip: tip };
    })
  );
}

export async function getRecentMistakes(userId: string, limit = 20): Promise<RecentMistake[]> {
  const mistakes = await prisma.questionMistake.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      subject: true,
      questionText: true,
      options: true,
      correctAnswer: true,
      correctAnswerText: true,
      selectedAnswer: true,
      wasSkipped: true,
      explanation: true,
      improvementTip: true,
      reviewedAt: true,
      createdAt: true,
    },
  });
  return withImprovementTips(mistakes);
}

/** Stamps a mistake as seen in the one-by-one review flow, so the next time the student opens it
 * this one doesn't take up a slot that could instead show something they haven't reviewed yet.
 * Silently does nothing if the id doesn't belong to this user (no ownership leak, no error either
 * — the client fires this as a best-effort side-effect while reviewing, not a critical action). */
export async function markMistakeReviewed(userId: string, mistakeId: string): Promise<void> {
  await prisma.questionMistake.updateMany({ where: { id: mistakeId, userId }, data: { reviewedAt: new Date() } });
}

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

/** Folds in both quiz attempts (one subject each) and mock-test attempts (per-section breakdown,
 * via `sectionStats` — null on attempts saved before that field existed, simply skipped) — this
 * used to only ever look at QuizAttempt, so a student who only took mock tests saw no data here. */
export async function getSubjectStrength(userId: string): Promise<SubjectStrength[]> {
  const [quizAttempts, mockAttempts] = await Promise.all([
    prisma.quizAttempt.findMany({ where: { userId }, select: { quizId: true, accuracy: true } }),
    prisma.mockTestAttempt.findMany({ where: { userId }, select: { sectionStats: true } }),
  ]);
  if (quizAttempts.length === 0 && mockAttempts.length === 0) return [];

  const bySubject = new Map<string, number[]>();

  if (quizAttempts.length > 0) {
    const quizIds = [...new Set(quizAttempts.map((a) => a.quizId))];
    const quizzes = await prisma.quiz.findMany({ where: { id: { in: quizIds } }, select: { id: true, subject: true } });
    const subjectMap = new Map(quizzes.map((q) => [q.id, q.subject]));
    for (const a of quizAttempts) {
      const subject = subjectMap.get(a.quizId) ?? 'General';
      const list = bySubject.get(subject) ?? [];
      list.push(a.accuracy);
      bySubject.set(subject, list);
    }
  }

  for (const attempt of mockAttempts) {
    const stats = attempt.sectionStats as Record<string, { correct: number; incorrect: number }> | null;
    if (!stats || typeof stats !== 'object') continue;
    for (const [subject, s] of Object.entries(stats)) {
      if (typeof s?.correct !== 'number' || typeof s?.incorrect !== 'number') continue; // malformed/legacy shape — skip rather than produce NaN
      const total = s.correct + s.incorrect;
      if (total === 0) continue;
      const list = bySubject.get(subject) ?? [];
      list.push(Math.round((s.correct / total) * 100));
      bySubject.set(subject, list);
    }
  }

  return [...bySubject.entries()]
    .map(([subject, accs]) => ({
      subject,
      avgAccuracy: Math.round(accs.reduce((sum, a) => sum + a, 0) / accs.length),
      attemptCount: accs.length,
    }))
    .sort((a, b) => b.avgAccuracy - a.avgAccuracy);
}
