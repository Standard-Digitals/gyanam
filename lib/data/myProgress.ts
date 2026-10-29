import { prisma } from '@/lib/prisma';
import { getSubjectStrength } from '@/lib/data/performance';
import { matchExamCategory } from '@/lib/data/examCategories';

/**
 * "My Progress" — a study-habit score for the logged-in student, compared with everyone else
 * enrolled in the same course. Inspired by the Gyanmitra add-on design, but built only on data
 * this app actually tracks today:
 *   - QuizAttempt / MockTestAttempt: accuracy, timeTakenSec, submittedAt (no per-question detail)
 *   - TopicProgress: which lecture topics a student has completed, and when
 * There is no per-question response log and no "test assigned/opened" event separate from when
 * a Quiz/MockTest was created, so this intentionally leaves out mistake-type analysis and a true
 * "revision habit" metric — adding those needs schema changes first.
 */

const DAY = 86400000;

export const PROGRESS_PARAMS = [
  { key: 'consistency', label: 'Study consistency', weight: 30, help: 'Days you were active in the last 14' },
  { key: 'testDiscipline', label: 'Test discipline', weight: 20, help: 'Quizzes/mock tests started within 2 days of being added' },
  { key: 'accuracy', label: 'Accuracy', weight: 30, help: 'Average accuracy, last 5 attempts' },
  { key: 'timeUsage', label: 'Time usage', weight: 10, help: 'Share of the allotted time used, last 5 attempts' },
  { key: 'coverage', label: 'Syllabus coverage', weight: 10, help: 'Topics completed in this course' },
] as const;

type ParamKey = (typeof PROGRESS_PARAMS)[number]['key'];
type Scores = Record<ParamKey, number | null>;

interface AttemptRow {
  userId: string;
  accuracy: number;
  timeTakenSec: number;
  submittedAt: Date;
  timeLimitMinutes: number;
}

interface RawMetrics {
  activeDays14: number;
  testsLast14: number;
  testsPerWeek: number;
  avgScorePct: number | null;
  avgStartDelayDays: number | null;
  eligibleTests: number;
  onTimeTests: number;
  topicsTouched: number;
  topicsTotal: number;
}

export interface StudentProgress {
  userId: string;
  scores: Scores;
  overall: number | null;
  raw: RawMetrics;
}

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const round = (n: number) => Math.round(n);
const median = (arr: (number | null | undefined)[]): number | null => {
  const a = arr.filter((x): x is number => x !== null && x !== undefined && Number.isFinite(x)).sort((x, y) => x - y);
  if (!a.length) return null;
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
};
const percentileRank = (value: number | null, arr: (number | null)[]): number | null => {
  const a = arr.filter((x): x is number => x !== null && Number.isFinite(x));
  if (!a.length || value === null || !Number.isFinite(value)) return null;
  const below = a.filter((x) => x < value).length;
  const equal = a.filter((x) => x === value).length;
  return Math.round(((below + equal / 2) / a.length) * 100);
};
const dayKey = (d: Date) => d.toISOString().slice(0, 10);

function weightedOverall(scores: Scores): number | null {
  let sum = 0;
  let wsum = 0;
  for (const p of PROGRESS_PARAMS) {
    const v = scores[p.key];
    if (v === null || v === undefined) continue;
    sum += v * p.weight;
    wsum += p.weight;
  }
  return wsum ? round(sum / wsum) : null;
}

/** Pure: compute one student's metrics from their raw rows (already filtered to this student). */
function computeStudentMetrics(
  userId: string,
  attempts: AttemptRow[],
  topicCompletions: Date[],
  testCatalog: { createdAt: Date }[],
  courseTopicCount: number,
  now: Date
): StudentProgress {
  const nowMs = now.getTime();
  const activeDaySet = new Set<string>([...attempts.map((a) => dayKey(a.submittedAt)), ...topicCompletions.map(dayKey)]);
  const activeDays14 = [...activeDaySet].filter((d) => nowMs - new Date(d).getTime() <= 14 * DAY).length;
  const consistency = clamp(round((activeDays14 / 14) * 100));

  const testsLast14 = attempts.filter((a) => nowMs - a.submittedAt.getTime() <= 14 * DAY).length;
  const testsPerWeek = Math.round((testsLast14 / 2) * 10) / 10;

  const recent5 = [...attempts].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()).slice(0, 5);
  const accuracy = recent5.length ? round(recent5.reduce((s, a) => s + a.accuracy, 0) / recent5.length) : null;

  const utilizations = recent5
    .filter((a) => a.timeLimitMinutes > 0)
    .map((a) => clamp(round((a.timeTakenSec / (a.timeLimitMinutes * 60)) * 100), 0, 150));
  const timeUsage = utilizations.length ? clamp(round(utilizations.reduce((s, v) => s + v, 0) / utilizations.length), 0, 100) : null;

  // Test discipline: of tests added 2-30 days ago, share the student's first attempt (on ANY test,
  // used as a proxy since attempts aren't linked back to a specific catalog row's add date here)
  // started within 2 days of that test appearing.
  const eligible = testCatalog.filter((t) => nowMs - t.createdAt.getTime() >= 2 * DAY && nowMs - t.createdAt.getTime() <= 30 * DAY);
  const attemptDays = attempts.map((a) => a.submittedAt.getTime()).sort((a, b) => a - b);
  const delays: number[] = [];
  let onTime = 0;
  for (const t of eligible) {
    const firstAfter = attemptDays.find((ms) => ms >= t.createdAt.getTime());
    if (firstAfter !== undefined) {
      const delayDays = (firstAfter - t.createdAt.getTime()) / DAY;
      delays.push(delayDays);
      if (delayDays <= 2) onTime += 1;
    }
  }
  const testDiscipline = eligible.length ? round((onTime / eligible.length) * 100) : null;
  const avgStartDelayDays = delays.length ? Math.round((delays.reduce((s, d) => s + d, 0) / delays.length) * 10) / 10 : null;

  // Each TopicProgress row is already unique per (userId, topicId), and the caller has already
  // scoped topicCompletions to this course's topics, so the count is simply how many rows exist.
  const topicsTouched = topicCompletions.length;
  const coverage = courseTopicCount ? clamp(round((Math.min(topicsTouched, courseTopicCount) / courseTopicCount) * 100)) : null;

  const scores: Scores = { consistency, testDiscipline, accuracy, timeUsage, coverage };

  const avgScorePct = accuracy; // accuracy IS the scored-% for this dataset

  return {
    userId,
    scores,
    overall: weightedOverall(scores),
    raw: {
      activeDays14,
      testsLast14,
      testsPerWeek,
      avgScorePct,
      avgStartDelayDays,
      eligibleTests: eligible.length,
      onTimeTests: onTime,
      topicsTouched,
      topicsTotal: courseTopicCount,
    },
  };
}

export interface CohortComparison {
  cohortSize: number;
  overallPercentile: number | null;
  courseMedianOverall: number | null;
  params: {
    key: ParamKey;
    label: string;
    help: string;
    you: number | null;
    courseMedian: number | null;
    topQuartileMedian: number | null;
  }[];
}

function compareWithCohort(me: StudentProgress, cohort: StudentProgress[]): CohortComparison {
  const others = cohort.filter((c) => c.userId !== me.userId);
  const byAccuracy = [...others].filter((c) => c.raw.avgScorePct !== null).sort((a, b) => (b.raw.avgScorePct ?? 0) - (a.raw.avgScorePct ?? 0));
  const topN = Math.max(1, Math.round(byAccuracy.length * 0.25));
  const top = byAccuracy.slice(0, topN);

  const params = PROGRESS_PARAMS.map((p) => ({
    key: p.key,
    label: p.label,
    help: p.help,
    you: me.scores[p.key],
    courseMedian: median(others.map((c) => c.scores[p.key])),
    topQuartileMedian: median(top.map((c) => c.scores[p.key])),
  }));

  return {
    cohortSize: others.length,
    overallPercentile: percentileRank(me.overall, others.map((c) => c.overall)),
    courseMedianOverall: median(others.map((c) => c.overall)),
    params,
  };
}

export interface ProgressSuggestion {
  title: string;
  text: string;
}

function suggestionsFromCohort(me: StudentProgress, others: StudentProgress[], courseName: string): ProgressSuggestion[] {
  const gap = (you: number | null, top: number | null) => (you === null || top === null || top === 0 ? 0 : (top - you) / top);
  const topLabel = `The top 25% in ${courseName}`;
  const byAccuracy = [...others].filter((c) => c.raw.avgScorePct !== null).sort((a, b) => (b.raw.avgScorePct ?? 0) - (a.raw.avgScorePct ?? 0));
  const top = byAccuracy.slice(0, Math.max(1, Math.round(byAccuracy.length * 0.25)));
  const topMedian = (f: (s: StudentProgress) => number | null) => median(top.map(f));

  const out: { impact: number; s: ProgressSuggestion }[] = [];

  const topConsistency = topMedian((s) => s.raw.activeDays14);
  if (topConsistency !== null && gap(me.raw.activeDays14, topConsistency) > 0.2) {
    out.push({
      impact: gap(me.raw.activeDays14, topConsistency),
      s: {
        title: 'Study on more days, even briefly',
        text: `${topLabel} were active on ${Math.round(topConsistency)} of the last 14 days; you were active on ${me.raw.activeDays14}. A short session on busy days keeps your recall alive.`,
      },
    });
  }

  const topTestsPerWeek = topMedian((s) => s.raw.testsPerWeek);
  if (topTestsPerWeek && gap(me.raw.testsPerWeek, topTestsPerWeek) > 0.25) {
    out.push({
      impact: gap(me.raw.testsPerWeek, topTestsPerWeek) + 0.1,
      s: {
        title: 'Take more quizzes and mock tests',
        text: `${topLabel} take about ${topTestsPerWeek} scored attempts a week; you are at ${me.raw.testsPerWeek}.`,
      },
    });
  }

  const topDelay = topMedian((s) => s.raw.avgStartDelayDays);
  if (me.raw.avgStartDelayDays !== null && topDelay !== null && me.raw.avgStartDelayDays - topDelay >= 1) {
    out.push({
      impact: Math.min(1, (me.raw.avgStartDelayDays - topDelay) / 3),
      s: {
        title: 'Attempt new tests sooner',
        text: `${topLabel} start a new quiz/mock within about ${Math.round(topDelay)} day${Math.round(topDelay) === 1 ? '' : 's'} of it appearing; you take ${me.raw.avgStartDelayDays} days. Taking it fresh gives more useful feedback.`,
      },
    });
  }

  const topAccuracy = topMedian((s) => s.raw.avgScorePct);
  if (me.raw.avgScorePct !== null && topAccuracy !== null && gap(me.raw.avgScorePct, topAccuracy) > 0.15) {
    out.push({
      impact: gap(me.raw.avgScorePct, topAccuracy) * 1.2,
      s: {
        title: 'Close the accuracy gap',
        text: `Your average accuracy over your last attempts is ${me.raw.avgScorePct}%; the top 25% in ${courseName} average ${topAccuracy}%. Review explanations on every wrong answer before moving on.`,
      },
    });
  }

  if (me.raw.topicsTotal > 0) {
    const coveragePct = me.scores.coverage;
    const topCoverage = topMedian((s) => s.scores.coverage);
    if (coveragePct !== null && topCoverage !== null && gap(coveragePct, topCoverage) > 0.2) {
      out.push({
        impact: gap(coveragePct, topCoverage) * 0.8,
        s: {
          title: 'Catch up on course lectures',
          text: `You have completed ${me.raw.topicsTouched} of ${me.raw.topicsTotal} topics in this course; the top 25% have covered about ${topCoverage}%.`,
        },
      });
    }
  }

  if (!out.length) {
    out.push({
      impact: 0,
      s: {
        title: 'Keep your routine',
        text: 'You are matching or beating the top group on every habit tracked here. Keep it up and push your attempt count up slightly.',
      },
    });
  }

  return out.sort((a, b) => b.impact - a.impact).slice(0, 4).map((x) => x.s);
}

export function templateSummary(firstName: string, me: StudentProgress, cmp: CohortComparison, courseName: string): string {
  const rel = cmp.params.filter((p) => p.you !== null && p.courseMedian !== null).map((p) => ({ ...p, diff: (p.you as number) - (p.courseMedian as number) }));
  const strong = rel.filter((p) => p.diff >= 5).sort((a, b) => b.diff - a.diff)[0];
  const weak = rel.filter((p) => p.diff <= -5).sort((a, b) => a.diff - b.diff)[0];
  const parts: string[] = [];
  parts.push(
    `${firstName}, your progress score is ${me.overall ?? '—'} out of 100${cmp.courseMedianOverall !== null ? `, against a course median of ${cmp.courseMedianOverall}` : ''}.`
  );
  if (strong) parts.push(`You are ahead of the course on ${strong.label.toLowerCase()} (${strong.you} against ${strong.courseMedian}).`);
  if (weak) parts.push(`The biggest gap is ${weak.label.toLowerCase()}: ${weak.you} against a course median of ${weak.courseMedian}.`);
  if (me.raw.avgScorePct !== null) parts.push(`Your average accuracy over recent attempts is ${me.raw.avgScorePct}%.`);
  return parts.join(' ');
}

export interface WeeklyActivity {
  weekLabel: string;
  activeDays: number;
}

function weeklyActivity(attempts: AttemptRow[], topicCompletions: Date[], now: Date): WeeklyActivity[] {
  const weeks: WeeklyActivity[] = [];
  for (let w = 3; w >= 0; w--) {
    const end = now.getTime() - w * 7 * DAY;
    const start = end - 7 * DAY;
    const days = new Set<string>();
    for (const a of attempts) if (a.submittedAt.getTime() > start && a.submittedAt.getTime() <= end) days.add(dayKey(a.submittedAt));
    for (const d of topicCompletions) if (d.getTime() > start && d.getTime() <= end) days.add(dayKey(d));
    weeks.push({ weekLabel: w === 0 ? 'This week' : `${w} wk${w > 1 ? 's' : ''} ago`, activeDays: days.size });
  }
  return weeks;
}

export interface MyProgressResult {
  courseName: string;
  cohortSize: number;
  me: StudentProgress;
  cmp: CohortComparison;
  suggestions: ProgressSuggestion[];
  summary: string;
  weekly: WeeklyActivity[];
  recentAttempts: { date: string; accuracy: number }[];
}

/**
 * Lightweight stand-in for students who aren't enrolled in any course yet but have taken a free
 * quiz or mock test — just their own numbers, no cohort comparison (that needs a shared course).
 * Shown as a teaser with the full report gated behind enrollment, instead of the flat "enroll to
 * see anything" message `getMyProgress` gives for a `null` result.
 */
export interface BasicProgressResult {
  totalAttempts: number;
  avgAccuracy: number;
  recentAttempts: { date: string; accuracy: number }[];
  bestSubject: { subject: string; avgAccuracy: number } | null;
  weakestSubject: { subject: string; avgAccuracy: number } | null;
}

export async function getBasicProgress(userId: string, targetExam: string | null = null): Promise<BasicProgressResult | null> {
  const [quizAttempts, mockAttempts] = await Promise.all([
    prisma.quizAttempt.findMany({ where: { userId }, select: { accuracy: true, submittedAt: true } }),
    prisma.mockTestAttempt.findMany({ where: { userId }, select: { accuracy: true, submittedAt: true } }),
  ]);
  const all = [...quizAttempts, ...mockAttempts];
  if (all.length === 0) return null;

  const avgAccuracy = Math.round(all.reduce((sum, a) => sum + a.accuracy, 0) / all.length);
  const recentAttempts = all
    .sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime())
    .slice(-5)
    .map((a) => ({ date: a.submittedAt.toISOString(), accuracy: a.accuracy }));

  // targetExam-scoped (CEO feedback: switching exams kept showing stale best/weakest-subject data
  // from a previous, unrelated exam's attempts) — overall accuracy/recent-attempts above stay
  // unscoped, since "how am I doing overall" is still meaningful across everything attempted.
  const subjects = await getSubjectStrength(userId, targetExam);
  const sorted = [...subjects].sort((a, b) => b.avgAccuracy - a.avgAccuracy);

  return {
    totalAttempts: all.length,
    avgAccuracy,
    recentAttempts,
    bestSubject: sorted[0] ? { subject: sorted[0].subject, avgAccuracy: sorted[0].avgAccuracy } : null,
    weakestSubject: sorted.length ? { subject: sorted[sorted.length - 1].subject, avgAccuracy: sorted[sorted.length - 1].avgAccuracy } : null,
  };
}

/** `targetExam`, when it resolves to a known category, only returns this student's progress if
 * their active enrollment's course is actually for that exam — otherwise treated the same as "not
 * enrolled" (null), so a leftover enrollment from a different exam (CEO feedback: selected CDS in
 * chat, strategy advice still quoted an old, unrelated enrollment's "22/100" score) doesn't get
 * presented as this exam's progress. Unmatched/no exam given: unfiltered, same as before this
 * param existed. */
export async function getMyProgress(userId: string, firstName: string, targetExam: string | null = null): Promise<MyProgressResult | null> {
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId, status: 'ACTIVE' },
    orderBy: { enrolledAt: 'desc' },
  });
  if (!enrollment) return null;

  const course = await prisma.course.findUnique({ where: { id: enrollment.courseId } });
  if (!course) return null;

  const category = matchExamCategory(targetExam);
  if (category && !course.category.includes(category)) return null;

  const [cohortEnrollments, chapters] = await Promise.all([
    prisma.enrollment.findMany({ where: { courseId: course.id, status: 'ACTIVE' }, select: { userId: true } }),
    prisma.chapter.findMany({ where: { courseId: course.id }, select: { id: true } }),
  ]);
  const cohortUserIds = [...new Set(cohortEnrollments.map((e) => e.userId))];
  const chapterIds = chapters.map((c) => c.id);
  const topics = chapterIds.length ? await prisma.topic.findMany({ where: { chapterId: { in: chapterIds } }, select: { id: true } }) : [];
  const topicIds = new Set(topics.map((t) => t.id));

  const now = new Date();
  const catalogSince = new Date(now.getTime() - 32 * DAY); // eligibility window below only looks 2-30 days back
  const [quizAttempts, mockAttempts, topicProgress, quizzes, mockTests, recentQuizzes, recentMockTests] = await Promise.all([
    prisma.quizAttempt.findMany({
      where: { userId: { in: cohortUserIds } },
      select: { userId: true, quizId: true, accuracy: true, timeTakenSec: true, submittedAt: true },
    }),
    prisma.mockTestAttempt.findMany({
      where: { userId: { in: cohortUserIds } },
      select: { userId: true, mockTestId: true, accuracy: true, timeTakenSec: true, submittedAt: true },
    }),
    prisma.topicProgress.findMany({
      where: { userId: { in: cohortUserIds }, topicId: { in: [...topicIds] } },
      select: { userId: true, completedAt: true },
    }),
    // Lightweight lookup maps for time limits — attempts can reference tests of any age.
    prisma.quiz.findMany({ select: { id: true, timeLimitMinutes: true } }),
    prisma.mockTest.findMany({ select: { id: true, timeLimitMinutes: true } }),
    // Separate, date-bounded fetch for the test-discipline eligibility window.
    prisma.quiz.findMany({ where: { createdAt: { gte: catalogSince } }, select: { createdAt: true } }),
    prisma.mockTest.findMany({ where: { createdAt: { gte: catalogSince } }, select: { createdAt: true } }),
  ]);

  const quizTimeLimit = new Map(quizzes.map((q) => [q.id, q.timeLimitMinutes]));
  const mockTimeLimit = new Map(mockTests.map((m) => [m.id, m.timeLimitMinutes]));
  const testCatalog = [...recentQuizzes, ...recentMockTests];

  const attemptsByUser = new Map<string, AttemptRow[]>();
  const pushAttempt = (row: AttemptRow) => {
    if (!attemptsByUser.has(row.userId)) attemptsByUser.set(row.userId, []);
    attemptsByUser.get(row.userId)!.push(row);
  };
  for (const a of quizAttempts) {
    pushAttempt({ userId: a.userId, accuracy: a.accuracy, timeTakenSec: a.timeTakenSec, submittedAt: a.submittedAt, timeLimitMinutes: quizTimeLimit.get(a.quizId) ?? 0 });
  }
  for (const a of mockAttempts) {
    pushAttempt({ userId: a.userId, accuracy: a.accuracy, timeTakenSec: a.timeTakenSec, submittedAt: a.submittedAt, timeLimitMinutes: mockTimeLimit.get(a.mockTestId) ?? 0 });
  }
  const topicsByUser = new Map<string, Date[]>();
  for (const t of topicProgress) {
    if (!topicsByUser.has(t.userId)) topicsByUser.set(t.userId, []);
    topicsByUser.get(t.userId)!.push(t.completedAt);
  }

  const cohort = cohortUserIds.map((uid) =>
    computeStudentMetrics(uid, attemptsByUser.get(uid) ?? [], topicsByUser.get(uid) ?? [], testCatalog, topicIds.size, now)
  );
  const me = cohort.find((c) => c.userId === userId) ?? computeStudentMetrics(userId, [], [], testCatalog, topicIds.size, now);

  const cmp = compareWithCohort(me, cohort);
  const others = cohort.filter((c) => c.userId !== userId);
  const suggestions = suggestionsFromCohort(me, others, course.title);
  const summary = templateSummary(firstName, me, cmp, course.title);
  const weekly = weeklyActivity(attemptsByUser.get(userId) ?? [], topicsByUser.get(userId) ?? [], now);

  const myAttempts = (attemptsByUser.get(userId) ?? []).sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()).slice(0, 5);
  const recentAttempts = myAttempts.reverse().map((a) => ({ date: a.submittedAt.toISOString(), accuracy: a.accuracy }));

  return {
    courseName: course.title,
    cohortSize: others.length,
    me,
    cmp,
    suggestions,
    summary,
    weekly,
    recentAttempts,
  };
}
