import { prisma } from '@/lib/prisma';
import { getCourseProgress } from '@/lib/data/courseProgress';
import { getSubjectStrength } from '@/lib/data/performance';
import { getMyProgress, getBasicProgress } from '@/lib/data/myProgress';
import { EXAM_NAME_PROMPT, EXAM_DATE_PROMPT, QUALIFICATION_PROMPT, MARKS_PROMPT } from '@/lib/aiMentorPrompts';

/**
 * "AI Mentor" (Gyanmitra-style) — in-app only, no OpenAI/WhatsApp/email. Doubts the rules below
 * can't answer are routed to faculty as a SupportTicket; "talk to a counsellor" creates a Lead —
 * both reuse the admin's existing inbox, so nothing new needs to be built there.
 *
 * Every reply is a `string[]` of short, separate messages instead of one long paragraph — the
 * caller (ChatWidget) sends them one at a time with a short pause between, so it reads like a
 * person typing back rather than a wall of text.
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

export interface SuggestedCourse {
  title: string;
  slug: string;
  href: string;
  originalPrice: number;
  discountPrice: number;
  reasons: string[];
}

export interface MentorOverview {
  mode: 'mentor' | 'counsellor';
  firstName: string;
  banner: MentorBannerInfo | null;
  plan: MentorPlanItem[];
  courseSuggestion: SuggestedCourse | null;
}

/** Used both for the "My Plan" counsellor view and chat replies that push a non-enrolled user
 * toward a specific course — kept in one place so the suggestion is always the same course. */
export async function getSuggestedCourse(targetExam: string | null): Promise<SuggestedCourse | null> {
  const course = targetExam
    ? await prisma.course.findFirst({ where: { targetExam: { contains: targetExam, mode: 'insensitive' } } })
    : await prisma.course.findFirst({ orderBy: { studentsEnrolled: 'desc' } });
  if (!course) return null;
  return {
    title: course.title,
    slug: course.slug,
    href: `/courses/${course.slug}`,
    originalPrice: course.originalPrice,
    discountPrice: course.discountPrice,
    reasons: [
      targetExam ? `Built for ${targetExam}, which matches what you told us.` : 'One of our most-enrolled batches right now.',
      'Take a free quiz first — it shows which sections need the most support.',
      'A counsellor can confirm batch timing, language and fees for you.',
    ],
  };
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
    return {
      mode: 'counsellor',
      firstName,
      banner: null,
      plan: [],
      courseSuggestion: await getSuggestedCourse(targetExam),
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

/** `after` is the student's `chatResetAt` (if they've tapped "New Conversation") — messages from
 * before that point stay in the database but are hidden from the chat view. */
export async function getChatMessages(userId: string, after: Date | null, limit = 50): Promise<MentorChatMessage[]> {
  const rows = await prisma.aiMentorMessage.findMany({
    where: after ? { userId, createdAt: { gt: after } } : { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return rows.reverse().map((r) => ({ id: r.id, role: r.role as 'user' | 'assistant', content: r.content, createdAt: r.createdAt.toISOString() }));
}

/** Hides the chat thread so far without deleting it — stamps `chatResetAt`, which every read in
 * this file treats as the start of the visible/resumable conversation from then on. */
export async function resetChatConversation(userId: string): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { chatResetAt: new Date() } });
}

// ---- Intent patterns ----
const COUNSELLOR_PATTERN = /\b(counsellor|counselor|call me|talk to (a )?(human|person|counsellor|counselor)|speak to someone)\b/i;
const TEST_PATTERN = /\b(practice test|test on demand|give me a test|mock test|quiz (please|now)?)\b/i;
const PLAN_PATTERN = /\b(plan|today|schedule|what should i (do|study))\b/i;
const PROGRESS_PATTERN = /\b(progress|how am i doing|report|rank|improv|percentile|compare)\b/i;
const MISTAKES_PATTERN = /\b(mistake|wrong|weak|negative mark|where am i losing)\b/i;
const REMIND_PATTERN = /\bremind me\b/i;
const GREETING_PATTERN = /^(hi|hello|hey|hola|namaste)\b/i;
const STRATEGY_PATTERN =
  /\b(crack|clear|pass)\b.*\b(exam|test)\b|\bright approach\b|\bhow (should|do|can) i prepare\b|\bpreparation (tips|strategy)\b|\bhow to (crack|clear|pass|prepare)\b|\bstudy (tips|strategy|plan)\b|\bwinning strategy\b|\b(preparation|prepare|prep)\b/i;

// General, institute-info questions — mainly for visitors who haven't set up exam prep.
const NEW_BATCH_PATTERN = /\b(new|next|upcoming)\b.*\bbatch(es)?\b|\bbatch(es)?\b.*\b(start|begin|open)\b/i;
const FACULTY_PATTERN = /\b(faculty|teacher|instructor|mentor)s?\b|\bwho (teaches|teach|is teaching|are teaching)\b/i;
const CENTER_PATTERN = /\b(center|centre)s?\b|\blocation(s)?\b|\bbranch(es)?\b|\bwhere.*(located|office|based)\b/i;
const TEST_SERIES_PATTERN = /\btest series\b/i;
const LIVE_BATCH_PATTERN = /\blive\b.*\b(batch(es)?|class(es)?)\b/i;
const ENROLL_PATTERN = /\benroll(ment|ing|ed)?\b|\bsign up\b|\bjoin (this|the)?\s?(course|batch)\b|\bhow (do|can) i (buy|purchase|pay)\b/i;
const BROWSE_COURSES_PATTERN = /\b(browse|see|show|view|explore|which|what) (all )?courses\b|\bcourse(s)? (list|catalog|catalogue)\b|\ball (your |the )?courses\b/i;
const COURSE_GUIDANCE_PATTERN =
  /\b(course|batch)s?\b.*\b(chahiye|chaiye|chaahiye|need|want|suggest|recommend)\b|\bwhich course\b|\bsuggest (me |a )?course\b|\brecommend (me |a )?course\b|\bguide me\b|\bneed guidance\b|\bcareer guidance\b|\bi (don't|dont) know (what|which)\b|\bwhat course should i\b|\bhelp me (choose|decide|pick)\b/i;

// Counselling-style intake: asked once per student (until answered), so advice and the eventual
// course recommendation are specific to them instead of generic. Exact text is also used to
// detect "this message is the answer to the question I just asked" across turns. targetExam/
// examDate are asked of everyone; qualification/marksPercentage only matter for a course
// recommendation, so they're skipped for students who are already enrolled. Prompt text lives in
// a separate module so ChatWidget can import it too (to decide which quick-reply chips to show)
// without pulling this server-only file into the client bundle.

interface IntakeProfile {
  targetExam: string | null;
  examDate: string | null;
  qualification: string | null;
  marksPercentage: string | null;
}

function nextIntakeQuestion(profile: IntakeProfile, needsQualification: boolean): string | null {
  if (!profile.targetExam) return EXAM_NAME_PROMPT;
  if (!profile.examDate) return EXAM_DATE_PROMPT;
  if (!needsQualification) return null;
  if (!profile.qualification) return QUALIFICATION_PROMPT;
  if (!profile.marksPercentage) return MARKS_PROMPT;
  return null;
}

async function isUserEnrolled(userId: string): Promise<boolean> {
  const enrollment = await prisma.enrollment.findFirst({ where: { userId, status: 'ACTIVE' } });
  return !!enrollment;
}

/** A specific, premium-framed course pitch with clear next steps — used once the intake has
 * enough to recommend something, whether that's reached via chat or the onboarding form. */
async function buildCourseRecommendation(targetExam: string | null): Promise<string[]> {
  const course = await getSuggestedCourse(targetExam);
  if (!course) {
    return ['I don\'t have a specific course to recommend right now — tap the "Courses" tab above to browse everything we offer.'];
  }
  return [
    `Based on what you've told me, ${course.title} looks like the right fit for you.`,
    `It's one of our premium, expert-led batches — ₹${course.discountPrice} right now (usually ₹${course.originalPrice}).`,
    'Open the "My Plan" tab above for Enroll Now and Talk to a Counsellor buttons, or just say "enroll now" or "talk to a counsellor" here — I\'ll pass along what you\'ve told me so you won\'t have to repeat yourself.',
  ];
}

/**
 * Daily schedule, tests-per-day, current progress and a goal — broken into a short sequence of
 * messages instead of one bulleted dump, so it reads like someone actually talking it through.
 */
async function buildStrategyAdvice(userId: string, examName: string, examDate: string | null): Promise<string[]> {
  const [subjects, progress] = await Promise.all([getSubjectStrength(userId), getMyProgress(userId, 'you')]);
  const weakest = subjects.length ? [...subjects].sort((a, b) => a.avgAccuracy - b.avgAccuracy)[0] : null;

  const msgs: string[] = [];
  msgs.push(`Great, let's build you a plan for ${examName}${examDate ? ` — targeting ${examDate}` : ''}.`);
  msgs.push('Daily schedule: 2 practice tests (one sectional, one full-length on alternate days) + 30-45 minutes of focused revision, every single day. Consistency beats one long weekend session.');

  if (weakest) {
    msgs.push(`Looking at your quizzes so far, ${weakest.subject} is your weakest area (${weakest.avgAccuracy}% accuracy) — start today's revision there.`);
  } else {
    msgs.push("You haven't taken a quiz yet — do one today so I can tell you exactly which subject needs the most work.");
  }

  if (progress) {
    msgs.push(`Your current progress score is ${progress.me.overall ?? '—'}/100${progress.cmp.courseMedianOverall !== null ? `, against a course median of ${progress.cmp.courseMedianOverall}` : ''}. Check the My Progress tab anytime for the full breakdown.`);
  }

  msgs.push('Set yourself a goal: 75%+ accuracy and at least 10 full tests attempted before your exam. Review every wrong answer — that review is where the real improvement happens, not the test itself.');
  msgs.push('Ask me "what\'s my plan today" anytime and I\'ll turn this into a daily checklist.');
  return msgs;
}

/** Terminal step of the intake — strategy advice for everyone, plus a course pitch for students
 * who aren't enrolled yet, since at that point we finally have enough to recommend something. */
async function finishIntake(userId: string, targetExam: string, examDate: string): Promise<string[]> {
  const strategy = await buildStrategyAdvice(userId, targetExam, examDate);
  const enrolled = await isUserEnrolled(userId);
  if (enrolled) return strategy;
  return [...strategy, ...(await buildCourseRecommendation(targetExam))];
}

/**
 * Used when the student picks "Exam Preparation" on first opening the chat and fills the
 * target-exam/exam-date form, instead of the free-text two-step onboarding above. Saves both to
 * the profile and writes the exchange into chat history so it reads naturally in the Chat tab.
 */
export async function completeOnboardingForm(userId: string, targetExam: string, examDate: string): Promise<string[]> {
  await prisma.user.update({ where: { id: userId }, data: { targetExam, examDate } });
  await prisma.aiMentorMessage.create({ data: { userId, role: 'user', content: `I'm preparing for ${targetExam}, around ${examDate}.` } });
  const replies = await finishIntake(userId, targetExam, examDate);
  for (const content of replies) {
    await prisma.aiMentorMessage.create({ data: { userId, role: 'assistant', content } });
  }
  return replies;
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
 * chat needs to answer well. Returns a short sequence of messages, having already saved all of
 * them (the user's and every reply chunk) to history.
 */
export async function sendChatMessage(
  user: {
    id: string;
    name: string | null;
    phone: string;
    email: string | null;
    targetExam: string | null;
    examDate: string | null;
    qualification: string | null;
    marksPercentage: string | null;
    chatResetAt: Date | null;
  },
  text: string
): Promise<string[]> {
  const trimmed = text.trim().slice(0, 1000);
  if (!trimmed) throw new Error('Message cannot be empty');

  await prisma.aiMentorMessage.create({ data: { userId: user.id, role: 'user', content: trimmed } });

  const name = user.name || 'there';
  let reply: string[];

  // What the assistant asked last — used to tell whether this new message is the answer
  // to the exam-name/exam-date onboarding question, regardless of what it also matches below.
  // Scoped to after the student's last "New Conversation" reset, if any, so a reset student never
  // resumes a question that was actually asked in a conversation they've since cleared.
  const lastAssistant = await prisma.aiMentorMessage.findFirst({
    where: { userId: user.id, role: 'assistant', ...(user.chatResetAt ? { createdAt: { gt: user.chatResetAt } } : {}) },
    orderBy: { createdAt: 'desc' },
  });

  if (lastAssistant?.content === EXAM_NAME_PROMPT) {
    const examName = trimmed.slice(0, 120);
    await prisma.user.update({ where: { id: user.id }, data: { targetExam: examName } });
    const enrolled = await isUserEnrolled(user.id);
    const next = nextIntakeQuestion({ ...user, targetExam: examName }, !enrolled);
    reply = next ? [next] : await finishIntake(user.id, examName, user.examDate || '');
  } else if (lastAssistant?.content === EXAM_DATE_PROMPT) {
    const examDate = trimmed.slice(0, 60);
    await prisma.user.update({ where: { id: user.id }, data: { examDate } });
    const enrolled = await isUserEnrolled(user.id);
    const next = nextIntakeQuestion({ ...user, examDate }, !enrolled);
    reply = next ? [next] : await finishIntake(user.id, user.targetExam || 'your exam', examDate);
  } else if (lastAssistant?.content === QUALIFICATION_PROMPT) {
    const qualification = trimmed.slice(0, 120);
    await prisma.user.update({ where: { id: user.id }, data: { qualification } });
    const next = nextIntakeQuestion({ ...user, qualification }, true);
    reply = next ? [next] : await finishIntake(user.id, user.targetExam || 'your exam', user.examDate || '');
  } else if (lastAssistant?.content === MARKS_PROMPT) {
    const marksPercentage = trimmed.slice(0, 60);
    await prisma.user.update({ where: { id: user.id }, data: { marksPercentage } });
    reply = await finishIntake(user.id, user.targetExam || 'your exam', user.examDate || '');
  } else if (STRATEGY_PATTERN.test(trimmed)) {
    const enrolled = await isUserEnrolled(user.id);
    const next = nextIntakeQuestion(user, !enrolled);
    reply = next ? [next] : await finishIntake(user.id, user.targetExam || 'your exam', user.examDate || '');
  } else if (COURSE_GUIDANCE_PATTERN.test(trimmed)) {
    const enrolled = await isUserEnrolled(user.id);
    if (enrolled) {
      reply = ["You're already enrolled, so there's no new course to pick.", 'Check the "My Plan" tab above for what to do today.'];
    } else {
      const next = nextIntakeQuestion(user, true);
      reply = next ? [next] : await buildCourseRecommendation(user.targetExam);
    }
  } else if (NEW_BATCH_PATTERN.test(trimmed) || LIVE_BATCH_PATTERN.test(trimmed)) {
    const course = await prisma.course.findFirst({ orderBy: { createdAt: 'desc' } });
    reply = course
      ? [`Our newest batch is "${course.title}".`, `It starts ${course.startDate} — you'll find full timings on the Courses page.`]
      : ['No new batches announced right now — check the Courses page, new ones get added often.'];
  } else if (FACULTY_PATTERN.test(trimmed)) {
    const mentors = await prisma.mentor.findMany({ orderBy: { rating: 'desc' }, take: 4 });
    reply = mentors.length
      ? ["Here's who's teaching right now:", mentors.map((m) => `${m.name} — ${m.subject} (${m.title})`).join('\n')]
      : ["I don't have faculty details handy right now — the About page has our full team."];
  } else if (CENTER_PATTERN.test(trimmed)) {
    reply = ['Our centers: Chandigarh, Guwahati, New Delhi and Assam.', 'Want a counsellor to help you find the nearest one? Just say "talk to a counsellor".'];
  } else if (TEST_SERIES_PATTERN.test(trimmed)) {
    const mock = await prisma.mockTest.findFirst({ orderBy: { createdAt: 'desc' } });
    reply = mock
      ? [`Our latest test series is "${mock.title}".`, "You'll find it under Mock Tests on your dashboard."]
      : ['No new test series right now — check Mock Tests on your dashboard, new ones are added often.'];
  } else if (COUNSELLOR_PATTERN.test(trimmed)) {
    const profileBits = [
      user.targetExam ? `Target exam: ${user.targetExam}` : null,
      user.examDate ? `Exam date: ${user.examDate}` : null,
      user.qualification ? `Qualification: ${user.qualification}` : null,
      user.marksPercentage ? `Marks: ${user.marksPercentage}` : null,
    ].filter(Boolean);
    const note = profileBits.length
      ? `Requested a counsellor call via AI Mentor chat. Profile — ${profileBits.join(' | ')}. Message: "${trimmed}"`
      : `Requested a counsellor call via AI Mentor chat: "${trimmed}"`;
    await createCounsellorLead(name, user.phone, user.email, user.targetExam, note);
    reply = profileBits.length
      ? ["I've asked a counsellor to call you.", "I've passed along what you've told me so you won't have to repeat yourself.", 'They usually call within one working day.']
      : ["I've asked a counsellor to call you.", 'They usually call within one working day.'];
  } else if (BROWSE_COURSES_PATTERN.test(trimmed)) {
    reply = ['Tap the "Courses" tab above — I\'ve listed everything there with pricing and details, so you don\'t have to leave this chat.'];
  } else if (ENROLL_PATTERN.test(trimmed)) {
    const course = await getSuggestedCourse(user.targetExam);
    reply = course
      ? [
          `Great choice — let's get you into ${course.title}.`,
          `Open the "My Plan" tab above and tap Enroll Now, or say "talk to a counsellor" and we'll call you to walk you through it instead.`,
        ]
      : ['Tap the "Courses" tab above to see everything we offer and enroll directly from there.'];
  } else if (TEST_PATTERN.test(trimmed)) {
    const enrollments = await prisma.enrollment.findMany({ where: { userId: user.id, status: 'ACTIVE' }, select: { courseId: true } });
    const open = await findAnyOpenTest(user.id, enrollments.map((e) => e.courseId));
    reply = open
      ? [`"${open.title}" is open right now — you'll find it under ${open.kind === 'quiz' ? 'Daily Quiz' : 'Mock Tests'} on your dashboard.`]
      : ["You've attempted everything that's open right now — check back soon, new ones are added often."];
  } else if (PLAN_PATTERN.test(trimmed)) {
    const overview = await getMentorOverview(user.id, name, user.targetExam);
    if (overview.mode === 'counsellor') {
      const next = nextIntakeQuestion(user, true);
      reply = next
        ? [`You're not enrolled in a course yet, so there's no daily plan to show you — but let's find the right one.`, next]
        : await buildCourseRecommendation(user.targetExam);
    } else if (overview.plan.length === 0) {
      reply = ['Nothing left on today\'s plan — nicely done. Check back tomorrow.'];
    } else {
      reply = ["Here's today's plan:", overview.plan.map((p) => `- ${p.title} (${p.meta})`).join('\n')];
    }
  } else if (PROGRESS_PATTERN.test(trimmed)) {
    const data = await getMyProgress(user.id, name);
    if (data) {
      reply = ["Here's how you're doing:", data.summary];
    } else {
      const basic = await getBasicProgress(user.id);
      reply = basic
        ? [
            `You've attempted ${basic.totalAttempts} quiz${basic.totalAttempts === 1 ? '' : 'zes'}/mock test${basic.totalAttempts === 1 ? '' : 's'} so far, averaging ${basic.avgAccuracy}% accuracy.`,
            basic.weakestSubject ? `${basic.weakestSubject.subject} looks like your weakest area right now.` : 'Keep attempting a mix of subjects so I can spot patterns.',
            'That\'s the basic picture — for a detailed report compared with your batch, plus a tailored improvement plan, enroll in a course. Check the "My Progress" tab for the full breakdown and an Enroll Now button.',
          ]
        : ['Take a free quiz or mock test first so I have something to show you — then enroll in a course for a detailed report compared with your batch.'];
    }
  } else if (MISTAKES_PATTERN.test(trimmed)) {
    const subjects = await getSubjectStrength(user.id);
    if (subjects.length === 0) {
      reply = ["You haven't attempted any quizzes yet, so there's nothing to review — take a Daily Quiz to get started."];
    } else {
      const weakest = [...subjects].sort((a, b) => a.avgAccuracy - b.avgAccuracy).slice(0, 3);
      reply = [`Your weakest subjects: ${weakest.map((s) => `${s.subject} (${s.avgAccuracy}% accuracy)`).join(', ')}.`, 'Focus revision there first.'];
    }
  } else if (REMIND_PATTERN.test(trimmed)) {
    reply = ["I can't send reminders outside the app yet, but anything overdue will show up at the top of your Overview page — check back there."];
  } else if (GREETING_PATTERN.test(trimmed)) {
    reply = lastAssistant ? [`Welcome back, ${name}!`, 'How can I help you today?'] : [`Hi ${name}!`, 'How can I help you today?'];
  } else {
    const ticketNumber = await createDoubtTicket(user.id, name, user.phone, user.email, trimmed);
    reply = ['Got it, let me get that in front of your faculty.', `Forwarded as ticket ${ticketNumber} — they'll get back to you soon.`];
  }

  for (const content of reply) {
    await prisma.aiMentorMessage.create({ data: { userId: user.id, role: 'assistant', content } });
  }
  return reply;
}
