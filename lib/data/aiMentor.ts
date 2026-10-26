import { prisma } from '@/lib/prisma';
import { getCourseProgress } from '@/lib/data/courseProgress';
import { getSubjectStrength } from '@/lib/data/performance';
import { getMyProgress } from '@/lib/data/myProgress';

/**
 * "AI Mentor" (Gyanmitra-style) — in-app only, no OpenAI/WhatsApp/email. Doubts the rules below
 * can't answer are routed to faculty as a SupportTicket; "talk to a counsellor" creates a Lead —
 * both reuse the admin's existing inbox, so nothing new needs to be built there.
 */

const DAY = 86400000;

export interface MentorPlanItem {
  title: string;
  meta: string;
  href: string;
}

export interface MentorBannerInfo {
  title: string;
  body: string;
  href: string;
  daysOpen: number;
}

export interface MentorOverview {
  mode: 'mentor' | 'counsellor';
  firstName: string;
  banner: MentorBannerInfo | null;
  plan: MentorPlanItem[];
  courseSuggestion: { title: string; href: string; reasons: string[] } | null;
}

async function findOverdueTest(userId: string, courseIds: string[]) {
  const since = new Date(Date.now() - 3 * DAY);
  const [quizzes, mockTests, quizAttempts, mockAttempts] = await Promise.all([
    prisma.quiz.findMany({
      where: { createdAt: { lte: since }, OR: [{ courseId: { in: courseIds } }, { courseId: null }] },
      orderBy: { createdAt: 'asc' },
      select: { id: true, title: true, createdAt: true },
    }),
    prisma.mockTest.findMany({
      where: { createdAt: { lte: since }, status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' },
      select: { id: true, title: true, createdAt: true },
    }),
    prisma.quizAttempt.findMany({ where: { userId }, select: { quizId: true } }),
    prisma.mockTestAttempt.findMany({ where: { userId }, select: { mockTestId: true } }),
  ]);
  const attemptedQuizIds = new Set(quizAttempts.map((a) => a.quizId));
  const attemptedMockIds = new Set(mockAttempts.map((a) => a.mockTestId));

  const candidates = [
    ...quizzes.filter((q) => !attemptedQuizIds.has(q.id)).map((q) => ({ id: q.id, title: q.title, createdAt: q.createdAt, kind: 'quiz' as const })),
    ...mockTests.filter((m) => !attemptedMockIds.has(m.id)).map((m) => ({ id: m.id, title: m.title, createdAt: m.createdAt, kind: 'mock' as const })),
  ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  return candidates[0] ?? null;
}

export async function getMentorOverview(userId: string, firstName: string, targetExam: string | null): Promise<MentorOverview> {
  const enrollments = await prisma.enrollment.findMany({ where: { userId, status: 'ACTIVE' }, orderBy: { enrolledAt: 'desc' } });

  if (enrollments.length === 0) {
    // Counsellor mode: no active enrollment yet.
    const course = targetExam
      ? await prisma.course.findFirst({ where: { targetExam: { contains: targetExam, mode: 'insensitive' } } })
      : await prisma.course.findFirst({ orderBy: { studentsEnrolled: 'desc' } });

    return {
      mode: 'counsellor',
      firstName,
      banner: null,
      plan: [],
      courseSuggestion: course
        ? {
            title: course.title,
            href: `/courses/${course.slug}`,
            reasons: [
              targetExam ? `Built for ${targetExam}, which matches what you told us.` : 'One of our most-enrolled batches right now.',
              'Take a free quiz first — it shows which sections need the most support.',
              'A counsellor can confirm batch timing, language and fees for you.',
            ],
          }
        : null,
    };
  }

  const courseIds = enrollments.map((e) => e.courseId);
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const [overdue, dailyQuizDone, primaryCourse] = await Promise.all([
    findOverdueTest(userId, courseIds),
    prisma.quizAttempt.findFirst({ where: { userId, submittedAt: { gte: todayStart } } }),
    prisma.course.findUnique({ where: { id: enrollments[0].courseId }, select: { id: true, title: true, slug: true } }),
  ]);

  const plan: MentorPlanItem[] = [];
  if (!dailyQuizDone) {
    plan.push({ title: 'Daily Current Affairs Quiz', meta: 'Restarts your streak · ~10 min', href: '/daily-quiz' });
  }
  if (primaryCourse) {
    const progress = await getCourseProgress(userId, primaryCourse.id);
    if (progress.nextTopicId) {
      plan.push({
        title: `Continue ${primaryCourse.title}`,
        meta: `${progress.completedCount}/${progress.total} lessons done`,
        href: `/dashboard/courses/${primaryCourse.slug}?topic=${progress.nextTopicId}`,
      });
    }
  }
  if (overdue) {
    plan.push({
      title: overdue.title,
      meta: overdue.kind === 'quiz' ? 'Quiz · open now' : 'Mock test · open now',
      href: overdue.kind === 'quiz' ? '/daily-quiz' : `/dashboard/mock-tests`,
    });
  }

  let banner: MentorBannerInfo | null = null;
  if (overdue) {
    const daysOpen = Math.floor((Date.now() - overdue.createdAt.getTime()) / DAY);
    banner = {
      title: `${overdue.title} has been waiting ${daysOpen} day${daysOpen === 1 ? '' : 's'}`,
      body:
        overdue.kind === 'quiz'
          ? 'A quick 10-minute quiz keeps your recall sharp and your streak alive.'
          : 'Your mock tests give us a baseline for every section, so your plan stops being a guess.',
      href: overdue.kind === 'quiz' ? '/daily-quiz' : '/dashboard/mock-tests',
      daysOpen,
    };
  }

  return { mode: 'mentor', firstName, banner, plan: plan.slice(0, 4), courseSuggestion: null };
}

export interface MentorChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export async function getChatMessages(userId: string, limit = 50): Promise<MentorChatMessage[]> {
  const rows = await prisma.aiMentorMessage.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return rows.reverse().map((r) => ({ id: r.id, role: r.role as 'user' | 'assistant', content: r.content, createdAt: r.createdAt.toISOString() }));
}

const COUNSELLOR_PATTERN = /\b(counsellor|counselor|call me|talk to (a )?(human|person|counsellor|counselor)|speak to someone)\b/i;
const TEST_PATTERN = /\b(practice test|test on demand|give me a test|mock test|quiz (please|now)?)\b/i;
const PLAN_PATTERN = /\b(plan|today|schedule|what should i (do|study))\b/i;
const PROGRESS_PATTERN = /\b(progress|how am i doing|report|rank|improv|percentile|compare)\b/i;
const MISTAKES_PATTERN = /\b(mistake|wrong|weak|negative mark|where am i losing)\b/i;
const REMIND_PATTERN = /\bremind me\b/i;
const GREETING_PATTERN = /^(hi|hello|hey|hola|namaste)\b/i;
const STRATEGY_PATTERN =
  /\b(crack|clear|pass)\b.*\b(exam|test)\b|\bright approach\b|\bhow (should|do|can) i prepare\b|\bpreparation (tips|strategy)\b|\bhow to (crack|clear|pass|prepare)\b|\bstudy (tips|strategy|plan)\b|\bwinning strategy\b/i;

// Two-step onboarding: asked once per student (until they answer), so later advice is specific to
// their exam instead of generic. Exact text is also used to detect "this message is the answer".
const EXAM_NAME_PROMPT = "Happy to guide you! Which exam are you preparing for?";
const EXAM_DATE_PROMPT = "Got it. Roughly when is it (month and year is fine)? I'll tailor the advice to that.";

async function buildStrategyAdvice(userId: string, examName: string, examDate: string | null): Promise<string> {
  const subjects = await getSubjectStrength(userId);
  const weakest = subjects.length ? [...subjects].sort((a, b) => a.avgAccuracy - b.avgAccuracy)[0] : null;

  const lines = [
    `Here's what consistently works for ${examName}${examDate ? ` (${examDate})` : ''}:`,
    '- Daily practice: 30-45 minutes every day beats one long session a week.',
    '- Attempt tests regularly — full mocks and sectional tests build exam temperament, not just knowledge.',
    '- Review every wrong answer after a test — know why you got it wrong, not just that you did.',
    '- Keep a revision schedule — revisit weak topics within a few days of a test, not weeks later.',
    '- Make short notes or flashcards for formulas, dates and facts you keep forgetting.',
  ];
  if (weakest) lines.push(`Right now your weakest subject is ${weakest.subject} (${weakest.avgAccuracy}% accuracy) — start your revision there.`);
  lines.push('Ask me "what\'s my plan today" anytime and I\'ll turn this into a daily checklist.');
  return lines.join('\n');
}

async function findAnyOpenTest(userId: string, courseIds: string[]): Promise<{ kind: 'quiz' | 'mock'; title: string } | null> {
  const [quizzes, mockTests, quizAttempts, mockAttempts] = await Promise.all([
    prisma.quiz.findMany({ where: { OR: [{ courseId: { in: courseIds } }, { courseId: null }] }, orderBy: { createdAt: 'desc' }, select: { id: true, title: true } }),
    prisma.mockTest.findMany({ where: { status: 'ACTIVE' }, orderBy: { createdAt: 'desc' }, select: { id: true, title: true } }),
    prisma.quizAttempt.findMany({ where: { userId }, select: { quizId: true } }),
    prisma.mockTestAttempt.findMany({ where: { userId }, select: { mockTestId: true } }),
  ]);
  const attemptedQuizIds = new Set(quizAttempts.map((a) => a.quizId));
  const attemptedMockIds = new Set(mockAttempts.map((a) => a.mockTestId));
  const openQuiz = quizzes.find((q) => !attemptedQuizIds.has(q.id));
  if (openQuiz) return { kind: 'quiz', title: openQuiz.title };
  const openMock = mockTests.find((m) => !attemptedMockIds.has(m.id));
  if (openMock) return { kind: 'mock', title: openMock.title };
  return null;
}

async function createDoubtTicket(userId: string, name: string, phone: string, email: string | null, text: string): Promise<string> {
  const ticketNumber = 'GY-TK-' + Math.floor(100000 + Math.random() * 900000);
  await prisma.supportTicket.create({
    data: {
      ticketNumber,
      studentName: name,
      phone,
      email: email || undefined,
      rollNoOrOrderId: userId,
      category: 'Doubt (AI Mentor)',
      urgency: 'Normal',
      description: text,
    },
  });
  return ticketNumber;
}

async function createCounsellorLead(name: string, phone: string, email: string | null, targetExam: string | null, note: string): Promise<void> {
  await prisma.lead.create({
    data: {
      fullName: name,
      phone,
      email: email || undefined,
      targetExam: targetExam || undefined,
      message: note,
      source: 'AI_MENTOR_CHAT',
    },
  });
}

/**
 * Rule-based reply — no OpenAI. Each branch pulls the student's real data (course, pending tests,
 * progress, subject accuracy) so answers are specific to them, not generic — the "background" the
 * chat needs to answer well. Returns the assistant's reply text, having already saved both messages.
 */
export async function sendChatMessage(
  user: { id: string; name: string | null; phone: string; email: string | null; targetExam: string | null; examDate: string | null },
  text: string
): Promise<string> {
  const trimmed = text.trim().slice(0, 1000);
  if (!trimmed) throw new Error('Message cannot be empty');

  await prisma.aiMentorMessage.create({ data: { userId: user.id, role: 'user', content: trimmed } });

  const name = user.name || 'there';
  let reply: string;

  // What the assistant asked last — used to tell whether this new message is the answer
  // to the exam-name/exam-date onboarding question, regardless of what it also matches below.
  const lastAssistant = await prisma.aiMentorMessage.findFirst({
    where: { userId: user.id, role: 'assistant' },
    orderBy: { createdAt: 'desc' },
  });

  if (lastAssistant?.content === EXAM_NAME_PROMPT) {
    const examName = trimmed.slice(0, 120);
    await prisma.user.update({ where: { id: user.id }, data: { targetExam: examName } });
    reply = user.examDate ? await buildStrategyAdvice(user.id, examName, user.examDate) : EXAM_DATE_PROMPT;
  } else if (lastAssistant?.content === EXAM_DATE_PROMPT) {
    const examDate = trimmed.slice(0, 60);
    await prisma.user.update({ where: { id: user.id }, data: { examDate } });
    reply = await buildStrategyAdvice(user.id, user.targetExam || 'your exam', examDate);
  } else if (STRATEGY_PATTERN.test(trimmed)) {
    if (!user.targetExam) {
      reply = EXAM_NAME_PROMPT;
    } else if (!user.examDate) {
      reply = EXAM_DATE_PROMPT;
    } else {
      reply = await buildStrategyAdvice(user.id, user.targetExam, user.examDate);
    }
  } else if (COUNSELLOR_PATTERN.test(trimmed)) {
    await createCounsellorLead(name, user.phone, user.email, user.targetExam, `Requested a counsellor call via AI Mentor chat: "${trimmed}"`);
    reply = "I've asked a counsellor to call you. They usually call within one working day.";
  } else if (TEST_PATTERN.test(trimmed)) {
    const enrollments = await prisma.enrollment.findMany({ where: { userId: user.id, status: 'ACTIVE' }, select: { courseId: true } });
    const open = await findAnyOpenTest(user.id, enrollments.map((e) => e.courseId));
    reply = open
      ? `"${open.title}" is open right now — you'll find it under ${open.kind === 'quiz' ? 'Daily Quiz' : 'Mock Tests'} on your dashboard.`
      : "You've attempted everything that's open right now — check back soon, new ones are added often.";
  } else if (PLAN_PATTERN.test(trimmed)) {
    const overview = await getMentorOverview(user.id, name, user.targetExam);
    if (overview.mode === 'counsellor') {
      reply = overview.courseSuggestion
        ? `You're not enrolled in a course yet, so there's no daily plan — but ${overview.courseSuggestion.title} looks like a good fit for you. Check it out on your dashboard.`
        : "You're not enrolled in a course yet — browse courses from your dashboard to get started.";
    } else if (overview.plan.length === 0) {
      reply = "Nothing left on today's plan — nicely done. Check back tomorrow.";
    } else {
      reply = `Today's plan:\n${overview.plan.map((p) => `- ${p.title} (${p.meta})`).join('\n')}`;
    }
  } else if (PROGRESS_PATTERN.test(trimmed)) {
    const data = await getMyProgress(user.id, name);
    reply = data ? data.summary : 'Enroll in a course to start tracking your progress against the rest of your batch.';
  } else if (MISTAKES_PATTERN.test(trimmed)) {
    const subjects = await getSubjectStrength(user.id);
    if (subjects.length === 0) {
      reply = "You haven't attempted any quizzes yet, so there's nothing to review — take a Daily Quiz to get started.";
    } else {
      const weakest = [...subjects].sort((a, b) => a.avgAccuracy - b.avgAccuracy).slice(0, 3);
      reply = `Your weakest subjects: ${weakest.map((s) => `${s.subject} (${s.avgAccuracy}% accuracy)`).join(', ')}. Focus revision there first.`;
    }
  } else if (REMIND_PATTERN.test(trimmed)) {
    reply = "I can't send reminders outside the app yet, but anything overdue will show up at the top of your Overview page — check back there.";
  } else if (GREETING_PATTERN.test(trimmed)) {
    reply = `Hi ${name}! Ask about your plan, your progress, your weak subjects, how to crack your exam, say "give me a practice test", or "talk to a counsellor".`;
  } else {
    const ticketNumber = await createDoubtTicket(user.id, name, user.phone, user.email, trimmed);
    reply = `I've forwarded this to your faculty as ticket ${ticketNumber} — they'll get back to you soon.`;
  }

  await prisma.aiMentorMessage.create({ data: { userId: user.id, role: 'assistant', content: reply } });
  return reply;
}
