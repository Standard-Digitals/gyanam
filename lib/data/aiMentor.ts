import { prisma } from '@/lib/prisma';
import { getCourseProgress } from '@/lib/data/courseProgress';
import { getSubjectStrength } from '@/lib/data/performance';
import { getMyProgress, getBasicProgress } from '@/lib/data/myProgress';
import { suggestExamPeriod } from '@/lib/data/examDateSuggestion';
import { classifyUnmatchedMessage, looksLikeAnswerTo, draftDoubtReply, type KnownIntentId } from '@/lib/data/chatIntent';
import {
  EXAM_NAME_PROMPT,
  EXAM_DATE_PROMPT,
  QUALIFICATION_PROMPT,
  MARKS_PROMPT,
  CONFIRM_EXAM_PROMPT,
  EXAM_DATE_CONFIRM_PROMPT,
  OFFER_COURSE_PROMPT,
  BEGINNER_CHECK_PROMPT,
  STUDY_HOURS_PROMPT,
  WEAK_SUBJECT_PROMPT,
  SYLLABUS_PROGRESS_PROMPT,
  READY_FOR_SCHEDULE_PROMPT,
  DETAILED_PLAN_PROMPT,
  READY_FOR_DIAGNOSTIC_PROMPT,
  COURSE_DETAILS_PROMPT,
  COURSE_ACTION_PROMPT,
  PREP_SUGGESTIONS,
  GENERAL_SUGGESTIONS,
} from '@/lib/aiMentorPrompts';

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
  suggestions: string[];
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
  return rows.reverse().map((r) => ({
    id: r.id,
    role: r.role as 'user' | 'assistant',
    content: r.content,
    suggestions: r.suggestions,
    createdAt: r.createdAt.toISOString(),
  }));
}

/** Hides the chat thread so far without deleting it — stamps `chatResetAt`, which every read in
 * this file treats as the start of the visible/resumable conversation from then on. */
export async function resetChatConversation(userId: string): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { chatResetAt: new Date() } });
}

// ---- Intent patterns ----
const COUNSELLOR_PATTERN = /\b(counsellor|counselor|call me|talk to (a )?(human|person|counsellor|counselor)|speak to someone)\b/i;
const TEST_PATTERN = /\b(practice test|test on demand|give me a test|mock test|quiz (please|now)?)\b/i;
// Narrow phrase shapes, not bare "plan"/"today"/"schedule" words — those collide with unrelated
// sentences like "my exam is today" or "who teaches the exam-prep faculty".
const PLAN_PATTERN = /\b(my|today'?s|daily|weekly) (plan|schedule|routine)\b|\bwhat'?s my plan\b|\bwhat should i (do|study)( today)?\b|\bstudy (plan|routine)\b|\bdaily routine\b/i;
const PROGRESS_PATTERN = /\b(progress|how am i doing|report|rank|improv|percentile|compare)\b/i;
const MISTAKES_PATTERN = /\b(mistake|wrong|weak|negative mark|where am i losing)\b/i;
const REMIND_PATTERN = /\bremind me\b/i;
const GREETING_PATTERN = /^(hi|hello|hey|hola|namaste)\b/i;
// Phrase shapes only — dropped the old bare "preparation|prepare|prep" alternative, which matched
// that word anywhere (e.g. hijacked "who teaches the exam-prep faculty?" into this intake flow).
const STRATEGY_PATTERN =
  /\b(crack|clear|pass)\b.*\b(exam|test)\b|\bright approach\b|\bhow (should|do|can) i prepare\b|\bpreparation (tips|strategy)\b|\bhow to (crack|clear|pass|prepare)\b|\bstudy (tips|strategy|plan)\b|\bwinning strategy\b/i;

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

// Separate, strategy-only intake (exam stage, daily hours, weak subject, syllabus coverage) —
// asked only for "how do I crack my exam" / build-a-plan requests, never mixed with the
// qualification/marks intake above, which only matters for a course recommendation or
// counsellor handoff. Both share the same targetExam/examDate questions; User.pendingIntakeFlow
// records which one is in progress so answering those shared questions resumes into the right one.
interface StrategyProfile {
  targetExam: string | null;
  examDate: string | null;
  examStage: string | null;
  studyHoursPerDay: string | null;
  weakSubject: string | null;
  syllabusProgress: string | null;
}

function nextStrategyQuestion(profile: StrategyProfile): string | null {
  if (!profile.targetExam) return EXAM_NAME_PROMPT;
  if (!profile.examDate) return EXAM_DATE_PROMPT;
  if (!profile.examStage) return BEGINNER_CHECK_PROMPT;
  if (!profile.studyHoursPerDay) return STUDY_HOURS_PROMPT;
  if (!profile.weakSubject) return WEAK_SUBJECT_PROMPT;
  if (!profile.syllabusProgress) return SYLLABUS_PROGRESS_PROMPT;
  return null;
}

async function isUserEnrolled(userId: string): Promise<boolean> {
  const enrollment = await prisma.enrollment.findFirst({ where: { userId, status: 'ACTIVE' } });
  return !!enrollment;
}

/** Stamps which intake is in progress — only matters right before asking the shared
 * targetExam/examDate questions, since every later question is flow-specific and unambiguous. */
async function tagPendingFlow(userId: string, nextPrompt: string | null, flow: 'strategy' | 'course'): Promise<void> {
  if (nextPrompt === EXAM_NAME_PROMPT || nextPrompt === EXAM_DATE_PROMPT) {
    await prisma.user.update({ where: { id: userId }, data: { pendingIntakeFlow: flow } });
  }
}

// Each reply carries its own quick-reply chip labels, computed here (not guessed from the
// rendered text on the client) so the chips always match what the bot actually just asked.
const QUALIFICATION_SUGGESTIONS = ['12th Pass', 'Graduate', 'Post-graduate', 'Diploma'];
const MARKS_SUGGESTIONS = ['Below 50%', '50-70%', '70-90%', 'Above 90%'];
const CONFIRM_EXAM_SUGGESTIONS = ['Yes, same exam', "No, it's changed"];
const EXAM_DATE_CONFIRM_SUGGESTIONS = ["Yes, that's about right", 'I have the exact date'];
const OFFER_COURSE_SUGGESTIONS = ['Yes, show me', 'Not now'];
const ENROLL_OR_COUNSELLOR_SUGGESTIONS = ['Enroll now', 'Talk to a counsellor'];
const TALK_TO_COUNSELLOR_SUGGESTIONS = ['Talk to a counsellor'];
const BROWSE_OR_COUNSELLOR_SUGGESTIONS = ['Browse Courses', 'Talk to a counsellor'];
const BEGINNER_CHECK_SUGGESTIONS = ['Just starting out', "I've been preparing a while"];
const STUDY_HOURS_SUGGESTIONS = ['Less than 1 hour', '1-2 hours', '2-4 hours', '4+ hours'];
const WEAK_SUBJECT_SUGGESTIONS = ['Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness', 'Not sure yet'];
const SYLLABUS_PROGRESS_SUGGESTIONS = ['Just starting', 'Less than 25%', '25-50%', '50-75%', 'Almost done'];
const COURSE_DETAILS_SUGGESTIONS = ['Tell me more', 'Not right now'];
const READY_FOR_SCHEDULE_SUGGESTIONS = ['Yes, show me', 'Not now'];
const DETAILED_PLAN_SUGGESTIONS = ['Yes, add detail', 'No, this is enough'];
const READY_FOR_DIAGNOSTIC_SUGGESTIONS = ["Yes, let's go", 'Maybe later'];

/** Chips for a reply that ends by asking one of the fixed intake prompts — keeps every branch
 * that hands off to `nextIntakeQuestion`/`nextStrategyQuestion` from having to know each
 * prompt's chip set itself. */
function suggestionsForPrompt(prompt: string): string[] {
  switch (prompt) {
    case QUALIFICATION_PROMPT:
      return QUALIFICATION_SUGGESTIONS;
    case MARKS_PROMPT:
      return MARKS_SUGGESTIONS;
    case CONFIRM_EXAM_PROMPT:
      return CONFIRM_EXAM_SUGGESTIONS;
    case EXAM_DATE_CONFIRM_PROMPT:
      return EXAM_DATE_CONFIRM_SUGGESTIONS;
    case OFFER_COURSE_PROMPT:
      return OFFER_COURSE_SUGGESTIONS;
    case BEGINNER_CHECK_PROMPT:
      return BEGINNER_CHECK_SUGGESTIONS;
    case STUDY_HOURS_PROMPT:
      return STUDY_HOURS_SUGGESTIONS;
    case WEAK_SUBJECT_PROMPT:
      return WEAK_SUBJECT_SUGGESTIONS;
    case SYLLABUS_PROGRESS_PROMPT:
      return SYLLABUS_PROGRESS_SUGGESTIONS;
    case COURSE_DETAILS_PROMPT:
      return COURSE_DETAILS_SUGGESTIONS;
    case COURSE_ACTION_PROMPT:
      return ENROLL_OR_COUNSELLOR_SUGGESTIONS;
    case READY_FOR_SCHEDULE_PROMPT:
      return READY_FOR_SCHEDULE_SUGGESTIONS;
    case DETAILED_PLAN_PROMPT:
      return DETAILED_PLAN_SUGGESTIONS;
    case READY_FOR_DIAGNOSTIC_PROMPT:
      return READY_FOR_DIAGNOSTIC_SUGGESTIONS;
    default:
      return []; // EXAM_NAME_PROMPT, EXAM_DATE_PROMPT — free text, no chips make sense
  }
}

function defaultSuggestions(hasTargetExam: boolean): string[] {
  return hasTargetExam ? PREP_SUGGESTIONS : GENERAL_SUGGESTIONS;
}

// Human-readable label + the exact chip text that re-triggers each intent's real regex pattern —
// used only when `classifyUnmatchedMessage` recovers a known intent from a message that missed
// every regex pattern itself (a typo, different phrasing, or Hindi/Hinglish). Surfacing it as a
// chip to tap, rather than auto-executing the matched branch, keeps every reply going through the
// same deterministic dispatch path as normal — this never invents a new code path.
const KNOWN_INTENT_CHIP: Record<KnownIntentId, { label: string; chip: string }> = {
  PLAN: { label: "today's study plan", chip: "What's my plan today?" },
  TEST: { label: 'a practice test', chip: 'Give me a practice test' },
  PROGRESS: { label: 'your progress', chip: 'How is my progress?' },
  MISTAKES: { label: 'your weak subjects', chip: 'Where am I losing marks?' },
  COUNSELLOR: { label: 'talking to a counsellor', chip: 'Talk to a counsellor' },
  FACULTY: { label: 'our faculty', chip: 'Who are the faculty?' },
  NEW_BATCH: { label: 'the next batch', chip: 'When does a new batch start?' },
  CENTER: { label: 'our centers', chip: 'Where are your centers?' },
  ENROLL: { label: 'enrolling', chip: 'How do I enroll?' },
  BROWSE_COURSES: { label: 'our courses', chip: 'Show all courses' },
};

interface ReplyWithSuggestions {
  messages: string[];
  suggestions: string[];
}

const NO_COURSE_REPLY: ReplyWithSuggestions = {
  messages: ['I don\'t have a specific course to recommend right now — tap the "Courses" tab above to browse everything we offer.'],
  suggestions: ['Browse Courses'],
};

/** First of two course-reveal turns — just the name and why it fits, then asks before showing
 * price or next steps, instead of dumping the whole pitch in one go. */
async function buildCourseIntro(targetExam: string | null): Promise<ReplyWithSuggestions> {
  const course = await getSuggestedCourse(targetExam);
  if (!course) return NO_COURSE_REPLY;
  return {
    messages: [`Based on what you've told me, ${course.title} looks like a great fit for you.`, COURSE_DETAILS_PROMPT],
    suggestions: COURSE_DETAILS_SUGGESTIONS,
  };
}

/** Second course-reveal turn — price and the actual next step, only once the student asks. */
async function buildCourseDetails(targetExam: string | null): Promise<ReplyWithSuggestions> {
  const course = await getSuggestedCourse(targetExam);
  if (!course) return NO_COURSE_REPLY;
  return {
    messages: [
      `It's one of our premium, expert-led batches — ₹${course.discountPrice} right now (usually ₹${course.originalPrice}).`,
      COURSE_ACTION_PROMPT,
    ],
    suggestions: ENROLL_OR_COUNSELLOR_SUGGESTIONS,
  };
}

/** Shared by the "enroll now" trigger and the COURSE_ACTION_PROMPT answer — same next step
 * either way, so there's one place to keep it consistent. */
async function buildEnrollReply(targetExam: string | null): Promise<ReplyWithSuggestions> {
  const course = await getSuggestedCourse(targetExam);
  return {
    messages: course
      ? [
          `Great choice — let's get you into ${course.title}.`,
          `Open the "My Plan" tab above and tap Enroll Now, or say "talk to a counsellor" and we'll call you to walk you through it instead.`,
        ]
      : ['Tap the "Courses" tab above to see everything we offer and enroll directly from there.'],
    suggestions: TALK_TO_COUNSELLOR_SUGGESTIONS,
  };
}

/** Shared by the "talk to a counsellor" trigger and the COURSE_ACTION_PROMPT answer — forwards
 * whatever profile we have (exam, date, qualification, marks) so the counsellor has context. */
async function buildCounsellorReply(
  user: { phone: string; email: string | null; targetExam: string | null; examDate: string | null; qualification: string | null; marksPercentage: string | null },
  name: string,
  trimmed: string
): Promise<ReplyWithSuggestions> {
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
  return {
    messages: profileBits.length
      ? ["I've asked a counsellor to call you.", "I've passed along what you've told me so you won't have to repeat yourself.", 'They usually call within one working day.']
      : ["I've asked a counsellor to call you.", 'They usually call within one working day.'],
    suggestions: defaultSuggestions(!!user.targetExam),
  };
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
 * who aren't enrolled yet, since at that point we finally have enough to recommend something.
 * Used by the onboarding-form path only; the chat-driven "how do I crack my exam" flow uses
 * `finishStrategyIntake` below instead, which personalizes the schedule from the student's own
 * answers rather than handing everyone the same template. */
async function finishIntake(userId: string, targetExam: string, examDate: string): Promise<ReplyWithSuggestions> {
  const strategy = await buildStrategyAdvice(userId, targetExam, examDate);
  const enrolled = await isUserEnrolled(userId);
  if (enrolled) return { messages: strategy, suggestions: defaultSuggestions(true) };
  // Don't dump the course pitch right after the advice — ask first. A wall of 8 messages in one
  // go reads like a lecture, not a conversation; asking turns it back into a two-way exchange and
  // means the pitch only shows up for someone who actually wants it.
  return { messages: [...strategy, OFFER_COURSE_PROMPT], suggestions: OFFER_COURSE_SUGGESTIONS };
}

/**
 * The personalized plan is revealed across three short turns — summary, then schedule, then a
 * diagnostic nudge plus a course pitch — each ending in a question, instead of landing as one
 * block of 4-5 messages. Mirrors the two-turn course reveal below: a statement or two, then a
 * stop point that needs a tap before the next piece shows up.
 */

/** Turn 1 — names what the plan will be built around, then asks before showing it. */
async function buildPlanIntro(profile: StrategyProfile): Promise<ReplyWithSuggestions> {
  const isBeginner = profile.examStage === 'Just starting out';
  const hasWeakSubject = profile.weakSubject && profile.weakSubject !== 'Not sure yet';
  return {
    messages: [
      `Got it — ${isBeginner ? "since you're just starting out, " : ''}we'll build this around ${
        hasWeakSubject ? profile.weakSubject : 'your weak areas'
      } and the ${profile.studyHoursPerDay ?? 'time'} you have daily.`,
      READY_FOR_SCHEDULE_PROMPT,
    ],
    suggestions: READY_FOR_SCHEDULE_SUGGESTIONS,
  };
}

export interface ScheduleBlock {
  subject: string;
  minutes: number;
  // Only present once `attachTodaysTopics` has run — never stored on the schedule itself.
  topic?: string | null;
}

// Four core subjects most of our exams share, plus a dedicated revision block — a real subject-
// by-subject breakdown instead of a vague "X minutes daily" sentence. The student's self-reported
// weak subject gets a bigger share; the rest split what's left evenly.
const CORE_SUBJECTS = ['Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness'];
const STUDY_MINUTES: Record<string, number> = {
  'Less than 1 hour': 45,
  '1-2 hours': 90,
  '2-4 hours': 180,
  '4+ hours': 240,
};
const roundTo5 = (n: number) => Math.max(5, Math.round(n / 5) * 5);

function buildScheduleBlocks(studyHoursPerDay: string | null, weakSubject: string | null): ScheduleBlock[] {
  const total = (studyHoursPerDay && STUDY_MINUTES[studyHoursPerDay]) || STUDY_MINUTES['1-2 hours'];
  const revisionMinutes = roundTo5(total * 0.2);
  const studyMinutes = total - revisionMinutes;
  const weakIdx = CORE_SUBJECTS.indexOf(weakSubject ?? '');
  const weight = (i: number) => (weakIdx === -1 ? 1 / CORE_SUBJECTS.length : i === weakIdx ? 0.4 : 0.6 / (CORE_SUBJECTS.length - 1));
  const blocks = CORE_SUBJECTS.map((subject, i) => ({ subject, minutes: roundTo5(studyMinutes * weight(i)) }));
  blocks.push({ subject: 'Revision & timed practice', minutes: revisionMinutes });
  return blocks;
}

// Weekday blocks repeat Monday-Saturday (same subjects, same minutes, every one of those days —
// writing them out 6 times over would just be noise); Sunday is a fixed mock-test-plus-rest day
// so the week has a day-wise shape instead of reading like "do this amount every day forever".
export interface WeeklySchedule {
  weekdayBlocks: ScheduleBlock[];
  sundayPlan: string;
}

const SUNDAY_PLAN = "Full-length mock test, then rest and light revision of the week's mistakes.";

/** Reads back whatever is actually stored in the Json column — including the flat ScheduleBlock[]
 * shape saved before this day-wise version existed — and always hands back a valid WeeklySchedule
 * or null, instead of letting an old shape's missing `.weekdayBlocks` crash the page/chat. */
export function normalizeWeeklySchedule(raw: unknown): WeeklySchedule | null {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    return { weekdayBlocks: raw as ScheduleBlock[], sundayPlan: SUNDAY_PLAN };
  }
  const obj = raw as { weekdayBlocks?: unknown; sundayPlan?: unknown };
  if (Array.isArray(obj.weekdayBlocks) && typeof obj.sundayPlan === 'string') {
    return obj as WeeklySchedule;
  }
  return null;
}

function buildWeeklySchedule(studyHoursPerDay: string | null, weakSubject: string | null): WeeklySchedule {
  return { weekdayBlocks: buildScheduleBlocks(studyHoursPerDay, weakSubject), sundayPlan: SUNDAY_PLAN };
}

function formatScheduleMessage(schedule: WeeklySchedule): string {
  const weekday = schedule.weekdayBlocks.map((b) => `${b.minutes} min — ${b.subject}`).join('\n');
  return `Monday – Saturday (daily):\n${weekday}\n\nSunday:\n${schedule.sundayPlan}`;
}

// Fallback when no enrolled/matching course has subject-tagged chapters yet — rotates by day so
// it isn't the same two topics forever, but is still a generic placeholder, not real syllabus data.
// Used as-is for any exam category without its own list below (State PSC, Defence, Assam Govt,
// Teaching Exams, or no exam set yet).
const SUBJECT_TOPICS: Record<string, string[]> = {
  'Quantitative Aptitude': [
    'Number System', 'Simplification', 'Percentage', 'Ratio & Proportion', 'Profit & Loss',
    'Simple & Compound Interest', 'Time & Work', 'Time, Speed & Distance', 'Average',
    'Mixture & Alligation', 'Mensuration', 'Algebra', 'Geometry', 'Trigonometry', 'Data Interpretation',
  ],
  Reasoning: [
    'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Seating Arrangement (Linear)',
    'Seating Arrangement (Circular)', 'Puzzles', 'Syllogism', 'Number Series', 'Alphabet Series',
    'Analogy', 'Classification', 'Ranking & Order', 'Inequality', 'Statement & Conclusion', 'Non-Verbal Reasoning',
  ],
  English: [
    'Reading Comprehension', 'Error Spotting', 'Para Jumbles', 'Cloze Test', 'Fill in the Blanks',
    'Vocabulary', 'Synonyms & Antonyms', 'One Word Substitution', 'Idioms & Phrases',
    'Active-Passive Voice', 'Direct-Indirect Speech', 'Sentence Improvement', 'Phrase Replacement', 'Spelling Correction',
  ],
  'General Awareness': [
    'Current Affairs', 'Static GK', 'Banking Awareness', 'Science GK', 'History & Polity',
    'Geography', 'Economy', 'Important Days', 'Sports GK', 'Awards & Honours', 'Books & Authors',
    'Government Schemes', 'Committees & Commissions', 'Computer Awareness',
  ],
  'Revision & timed practice': ['Review mistakes from recent quizzes', 'One timed mini-test'],
};

// Same 5-key shape as SUBJECT_TOPICS, re-weighted toward what each exam family actually tests
// most — e.g. Banking leans hard on Puzzles/Seating + Banking Awareness, SSC on static GK +
// Mensuration/Geometry, Railway on General Science, UPSC Prelims being structured enough
// differently (GS + CSAT) that "Reasoning"/"English" map onto CSAT's decision-making/comprehension
// instead. Falls back to SUBJECT_TOPICS for any category not listed here (see subjectTopicsFor).
const SUBJECT_TOPICS_BY_CATEGORY: Record<string, Record<string, string[]>> = {
  SSC: {
    'Quantitative Aptitude': [
      'Number System', 'Simplification', 'Percentage', 'Profit & Loss', 'Simple & Compound Interest',
      'Ratio & Proportion', 'Average', 'Time & Work', 'Time, Speed & Distance', 'Mensuration',
      'Geometry', 'Trigonometry', 'Algebra', 'Data Interpretation',
    ],
    Reasoning: [
      'Analogy', 'Classification', 'Coding-Decoding', 'Blood Relations', 'Series (Number/Alphabet)',
      'Non-Verbal Reasoning (Mirror/Water Images)', 'Paper Folding & Cutting', 'Venn Diagrams',
      'Syllogism', 'Direction Sense', 'Word Formation', 'Matrix',
    ],
    English: [
      'Error Spotting', 'Fill in the Blanks', 'Synonyms & Antonyms', 'One Word Substitution',
      'Idioms & Phrases', 'Spelling Correction', 'Sentence Improvement', 'Para Jumbles', 'Cloze Test',
      'Active-Passive Voice', 'Direct-Indirect Speech',
    ],
    'General Awareness': [
      'Static GK', 'Indian History', 'Indian Polity', 'Geography', 'Economy', 'General Science',
      'Current Affairs', 'Important Days', 'Awards & Honours', 'Books & Authors', 'Government Schemes',
    ],
    'Revision & timed practice': ['Review mistakes from recent quizzes', 'One timed sectional mock'],
  },
  Banking: {
    'Quantitative Aptitude': [
      'Simplification & Approximation', 'Number Series', 'Quadratic Equations', 'Data Interpretation (Tables/Bar/Pie)',
      'Ratio & Proportion', 'Percentage', 'Profit & Loss', 'Simple & Compound Interest', 'Average',
      'Time & Work', 'Mensuration',
    ],
    Reasoning: [
      'Puzzles', 'Seating Arrangement (Linear)', 'Seating Arrangement (Circular)', 'Syllogism',
      'Inequality', 'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Data Sufficiency',
      'Input-Output', 'Order & Ranking',
    ],
    English: [
      'Reading Comprehension', 'Cloze Test', 'Error Detection', 'Sentence Rearrangement (Para Jumbles)',
      'Fillers/Double Fillers', 'Phrase Replacement', 'Vocabulary', 'Word Usage',
    ],
    'General Awareness': [
      'Banking Awareness (RBI, Monetary Policy)', 'Banking Terms & Abbreviations', 'Financial Awareness',
      'Current Affairs', 'Static GK', 'Government Schemes (Financial)', 'Important Days', 'Books & Authors',
    ],
    'Revision & timed practice': ['Review mistakes from recent quizzes', 'One timed sectional mock'],
  },
  Railway: {
    'Quantitative Aptitude': [
      'Number System', 'LCM & HCF', 'Percentage', 'Ratio & Proportion', 'Time & Work',
      'Time, Speed & Distance', 'Mensuration', 'Geometry', 'Trigonometry', 'Algebra',
      'Elementary Statistics', 'Data Interpretation',
    ],
    Reasoning: [
      'Analogy', 'Classification', 'Coding-Decoding', 'Mathematical Operations', 'Venn Diagrams',
      'Puzzle & Seating Arrangement', 'Syllogism', 'Statement & Argument', 'Jumbling',
      'Mirror & Water Images', 'Direction Sense',
    ],
    English: [
      'Reading Comprehension', 'Error Spotting', 'Fill in the Blanks', 'Synonyms & Antonyms',
      'Spelling Correction', 'Sentence Improvement',
    ],
    'General Awareness': [
      'General Science (Physics/Chemistry/Biology)', 'Current Affairs', 'Indian History',
      'Indian Geography', 'Indian Polity', 'Environmental Issues', 'Sports', 'Transport & Railways GK',
      'Important Days',
    ],
    'Revision & timed practice': ['Review mistakes from recent quizzes', 'One timed sectional mock'],
  },
  UPSC: {
    // UPSC Prelims is GS + CSAT rather than SSC/Banking-style sectional papers — "Reasoning" and
    // "English" are repurposed as CSAT's decision-making/comprehension components so the 5-block
    // schedule shape still fits without implying a paper split UPSC doesn't actually have.
    'Quantitative Aptitude': [
      'Basic Numeracy', 'Percentage & Ratio', 'Time & Work', 'Time, Speed & Distance', 'Data Interpretation',
      'Probability Basics', 'Mensuration', 'Average & Mixtures',
    ],
    Reasoning: [
      'Logical Reasoning (CSAT)', 'Analytical Reasoning', 'Decision Making', 'Problem Solving',
      'Syllogism', 'Puzzles', 'Statement & Assumption',
    ],
    English: [
      'Reading Comprehension (CSAT)', 'Passage-Based Inference', 'Vocabulary in Context', 'Precis Writing',
    ],
    'General Awareness': [
      'Indian Polity & Governance', 'Indian & World History', 'Geography (Indian & World)', 'Indian Economy',
      'Environment & Ecology', 'Science & Technology', 'Current Affairs', 'Government Schemes & Policy',
      'International Relations', 'Art & Culture',
    ],
    'Revision & timed practice': ['Review mistakes from recent quizzes', 'One timed sectional mock'],
  },
};

/** Falls back to the generic `SUBJECT_TOPICS` for any category without its own tailored list
 * (State PSC, Defence, Assam Govt, Teaching Exams) or when no exam/category is set yet. */
function subjectTopicsFor(targetExam: string | null): Record<string, string[]> {
  const category = matchExamCategory(targetExam);
  return (category && SUBJECT_TOPICS_BY_CATEGORY[category]) || SUBJECT_TOPICS;
}

const dayIndex = () => Math.floor(Date.now() / DAY);

// Matches a course's Chapter (curriculum content admins already enter, e.g. "Module 1:
// Quantitative Aptitude") to one of the schedule's core subjects, so the day-plan can show the
// student's real next topic in that subject instead of a generic placeholder.
const CHAPTER_SUBJECT_KEYWORDS: Record<string, string[]> = {
  'Quantitative Aptitude': ['quant', 'math', 'numerical', 'arithmetic'],
  Reasoning: ['reasoning', 'logical'],
  English: ['english', 'verbal', 'grammar'],
  'General Awareness': ['general awareness', 'general studies', 'gk', 'current affairs', 'static gk', 'awareness'],
};

function matchChapterSubject(chapterTitle: string): string | null {
  const lower = chapterTitle.toLowerCase();
  for (const [subject, keywords] of Object.entries(CHAPTER_SUBJECT_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return subject;
  }
  return null;
}

/** One subject-tagged chapter per subject (first match, in chapter order), with its topics in
 * curriculum order — the shared building block behind both "today's topic" and the full roadmap. */
async function chapterTopicsBySubject(courseId: string): Promise<Map<string, { id: string; title: string }[]>> {
  const chapters = await prisma.chapter.findMany({ where: { courseId }, orderBy: { order: 'asc' }, select: { id: true, title: true } });
  const chapterIdBySubject = new Map<string, string>();
  for (const ch of chapters) {
    const subject = matchChapterSubject(ch.title);
    if (subject && !chapterIdBySubject.has(subject)) chapterIdBySubject.set(subject, ch.id);
  }
  if (chapterIdBySubject.size === 0) return new Map();

  const chapterIds = [...chapterIdBySubject.values()];
  const topics = await prisma.topic.findMany({ where: { chapterId: { in: chapterIds } }, orderBy: { order: 'asc' }, select: { id: true, chapterId: true, title: true } });
  const topicsByChapter = new Map<string, { id: string; title: string }[]>();
  for (const t of topics) {
    const list = topicsByChapter.get(t.chapterId) ?? [];
    list.push({ id: t.id, title: t.title });
    topicsByChapter.set(t.chapterId, list);
  }

  const result = new Map<string, { id: string; title: string }[]>();
  for (const [subject, chapterId] of chapterIdBySubject) {
    result.set(subject, topicsByChapter.get(chapterId) ?? []);
  }
  return result;
}

/** For a real student, the next topic in that subject they haven't completed yet (so it advances
 * with their own progress); for a course being previewed without enrollment, a day-rotated topic
 * from that chapter instead. */
async function topicsFromCourse(courseId: string, userId: string | null): Promise<Map<string, string>> {
  const bySubject = await chapterTopicsBySubject(courseId);
  if (bySubject.size === 0) return new Map();

  const allTopicIds = [...bySubject.values()].flatMap((list) => list.map((t) => t.id));
  let completedIds = new Set<string>();
  if (userId && allTopicIds.length > 0) {
    const progress = await prisma.topicProgress.findMany({ where: { userId, topicId: { in: allTopicIds } }, select: { topicId: true } });
    completedIds = new Set(progress.map((p) => p.topicId));
  }

  const result = new Map<string, string>();
  for (const [subject, list] of bySubject) {
    if (list.length === 0) continue;
    const next = userId ? list.find((t) => !completedIds.has(t.id)) : undefined;
    const pick = next ?? list[dayIndex() % list.length];
    result.set(subject, pick.title);
  }
  return result;
}

/** Full ordered topic list per core subject — the real course curriculum where it has
 * subject-tagged chapters, the exam-category-specific list otherwise (generic if the category has
 * none). Used to lay out the multi-phase roadmap (as opposed to `topicsFromCourse`, which only
 * needs a single "today" pick). */
async function fullTopicSequence(courseId: string | null, targetExam: string | null): Promise<Map<string, string[]>> {
  const bySubject = new Map<string, string[]>();
  if (courseId) {
    const chapterTopics = await chapterTopicsBySubject(courseId);
    for (const [subject, list] of chapterTopics) {
      if (list.length > 0) bySubject.set(subject, list.map((t) => t.title));
    }
  }
  const fallbackTopics = subjectTopicsFor(targetExam);
  for (const subject of CORE_SUBJECTS) {
    if (!bySubject.has(subject)) bySubject.set(subject, fallbackTopics[subject] ?? []);
  }
  return bySubject;
}

/** The student's self-reported `examDate` is free text ("March 2026", "soon", a specific date) —
 * not reliably parseable, so this takes a best-effort stab and otherwise falls back to a generic
 * 90-day window rather than guessing at a specific day. */
function resolveExamWindow(examDate: string | null): { totalDays: number } {
  const DEFAULT_DAYS = 90;
  const MIN_DAYS = 21;
  const MAX_DAYS = 365;
  if (examDate) {
    const parsed = new Date(examDate);
    const now = Date.now();
    if (!isNaN(parsed.getTime()) && parsed.getTime() > now) {
      const days = Math.round((parsed.getTime() - now) / DAY);
      return { totalDays: Math.max(MIN_DAYS, Math.min(MAX_DAYS, days)) };
    }
  }
  return { totalDays: DEFAULT_DAYS };
}

export interface RoadmapPhase {
  label: string;
  dateRangeLabel: string;
  targetNote: string;
  subjects: { subject: string; topics: string[] }[];
}

const fmtRoadmapDate = (d: Date) => d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * DAY);

/** The exam-prep equivalent of a 3-month ChatGPT-style plan, scaled to however long the student
 * actually has: build the basics, finish the syllabus, then mocks and revision — each phase
 * listing which topics (from the student's real course curriculum when available) fall in it. */
export async function buildRoadmap(userId: string, examDate: string | null, targetExam: string | null): Promise<RoadmapPhase[]> {
  const enrollment = await prisma.enrollment.findFirst({ where: { userId, status: 'ACTIVE' }, orderBy: { enrolledAt: 'desc' }, select: { courseId: true } });
  let courseId = enrollment?.courseId ?? null;
  if (!courseId) {
    const category = matchExamCategory(targetExam);
    if (category) {
      const course = await prisma.course.findFirst({ where: { category: { has: category } }, orderBy: { studentsEnrolled: 'desc' }, select: { id: true } });
      courseId = course?.id ?? null;
    }
  }

  const sequence = await fullTopicSequence(courseId, targetExam);
  const { totalDays } = resolveExamWindow(examDate);
  const foundationDays = Math.max(7, Math.round(totalDays * 0.4));
  const syllabusDays = Math.max(7, Math.round(totalDays * 0.4));
  const revisionDays = Math.max(7, totalDays - foundationDays - syllabusDays);

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const phase1End = addDays(start, foundationDays);
  const phase2End = addDays(phase1End, syllabusDays);
  const phase3End = addDays(phase2End, revisionDays);

  const splitHalf = (subject: string, half: 'first' | 'second') => {
    const list = sequence.get(subject) ?? [];
    const mid = Math.ceil(list.length / 2);
    return half === 'first' ? list.slice(0, mid) : list.slice(mid);
  };

  return [
    {
      label: 'Phase 1 — Build your foundation',
      dateRangeLabel: `${fmtRoadmapDate(start)} – ${fmtRoadmapDate(phase1End)}`,
      targetNote: 'Cover the basics, build calculation speed, start timed sectional practice.',
      subjects: CORE_SUBJECTS.map((subject) => ({ subject, topics: splitHalf(subject, 'first') })),
    },
    {
      label: 'Phase 2 — Complete the syllabus',
      dateRangeLabel: `${fmtRoadmapDate(phase1End)} – ${fmtRoadmapDate(phase2End)}`,
      targetNote: 'Finish every topic at least once, keep taking sectional tests.',
      subjects: CORE_SUBJECTS.map((subject) => ({ subject, topics: splitHalf(subject, 'second') })),
    },
    {
      label: 'Phase 3 — Mock tests & final revision',
      dateRangeLabel: `${fmtRoadmapDate(phase2End)} – ${fmtRoadmapDate(phase3End)}`,
      targetNote: 'Full-length mocks, revise mistakes, sharpen speed and accuracy.',
      subjects: CORE_SUBJECTS.map((subject) => ({ subject, topics: ['Full-length mock tests', 'Revise mistakes from Phase 1 & 2', 'Speed and accuracy drills'] })),
    },
  ];
}

const WEEKLY_CHECKLIST_ITEMS = [
  "Practice topic-wise questions for this week's weak subject",
  'Revise static GK and current affairs',
  'Solve previous year question papers',
  'Take at least one mock test',
  'Review your wrong and skipped questions',
  "Revise this week's formulas and notes",
];

export interface WeeklyChecklistItem {
  index: number;
  label: string;
  checked: boolean;
}

export interface WeeklyChecklistState {
  weekStart: string;
  items: WeeklyChecklistItem[];
}

/** Monday of the current week, as a date-only key — a checklist saved against a past week is
 * treated as a fresh/unchecked one instead of carrying stale ticks into the new week. */
function currentWeekStartKey(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  return d.toISOString().slice(0, 10);
}

function checkedIndicesFor(raw: unknown, weekStart: string): Set<number> {
  if (raw && typeof raw === 'object' && 'weekStart' in raw && 'checkedIndices' in raw) {
    const stored = raw as { weekStart: unknown; checkedIndices: unknown };
    if (stored.weekStart === weekStart && Array.isArray(stored.checkedIndices)) {
      return new Set(stored.checkedIndices.filter((n): n is number => typeof n === 'number'));
    }
  }
  return new Set();
}

function toChecklistState(checkedIndices: Set<number>, weekStart: string): WeeklyChecklistState {
  return {
    weekStart,
    items: WEEKLY_CHECKLIST_ITEMS.map((label, index) => ({ index, label, checked: checkedIndices.has(index) })),
  };
}

export function getWeeklyChecklist(raw: unknown): WeeklyChecklistState {
  const weekStart = currentWeekStartKey();
  return toChecklistState(checkedIndicesFor(raw, weekStart), weekStart);
}

export async function toggleWeeklyChecklistItem(userId: string, raw: unknown, index: number): Promise<WeeklyChecklistState> {
  if (index < 0 || index >= WEEKLY_CHECKLIST_ITEMS.length) throw new Error('Invalid checklist index');
  const weekStart = currentWeekStartKey();
  const checkedIndices = checkedIndicesFor(raw, weekStart);
  if (checkedIndices.has(index)) checkedIndices.delete(index);
  else checkedIndices.add(index);
  await prisma.user.update({ where: { id: userId }, data: { weeklyChecklist: { weekStart, checkedIndices: [...checkedIndices] } } });
  return toChecklistState(checkedIndices, weekStart);
}

/** Today's focus topic per schedule subject — from the student's enrolled course's real
 * curriculum when it has subject-tagged chapters, a matching course's curriculum as a preview
 * when they aren't enrolled yet, or the generic rotating fallback otherwise. */
async function getTodaysTopics(userId: string, courseId: string | null, targetExam: string | null): Promise<Map<string, string>> {
  let fromCourse = new Map<string, string>();
  if (courseId) {
    fromCourse = await topicsFromCourse(courseId, userId);
  } else {
    const category = matchExamCategory(targetExam);
    if (category) {
      const course = await prisma.course.findFirst({ where: { category: { has: category } }, orderBy: { studentsEnrolled: 'desc' }, select: { id: true } });
      if (course) fromCourse = await topicsFromCourse(course.id, null);
    }
  }

  const fallbackTopics = subjectTopicsFor(targetExam);
  const result = new Map<string, string>();
  for (const subject of Object.keys(fallbackTopics)) {
    const fallbackList = fallbackTopics[subject];
    const fallback = fallbackList.length ? fallbackList[dayIndex() % fallbackList.length] : undefined;
    const pick = fromCourse.get(subject) ?? fallback;
    if (pick) result.set(subject, pick);
  }
  return result;
}

/** Attaches `getTodaysTopics` to a saved schedule right before it's shown — topics are computed
 * fresh on every read (not stored on the schedule) so they keep advancing with course progress
 * and day rotation instead of freezing at whatever was true when the schedule was first built. */
export async function attachTodaysTopics(schedule: WeeklySchedule, userId: string, targetExam: string | null): Promise<WeeklySchedule> {
  const enrollment = await prisma.enrollment.findFirst({ where: { userId, status: 'ACTIVE' }, orderBy: { enrolledAt: 'desc' }, select: { courseId: true } });
  const topics = await getTodaysTopics(userId, enrollment?.courseId ?? null, targetExam);
  return { ...schedule, weekdayBlocks: schedule.weekdayBlocks.map((b) => ({ ...b, topic: topics.get(b.subject) ?? null })) };
}

/** Expects a schedule already run through `attachTodaysTopics`. */
function formatDetailedScheduleMessage(schedule: WeeklySchedule): string {
  const weekday = schedule.weekdayBlocks
    .map((b) => (b.topic ? `${b.minutes} min — ${b.subject}\n   → Focus: ${b.topic}` : `${b.minutes} min — ${b.subject}`))
    .join('\n');
  return `Monday – Saturday (daily):\n${weekday}\n\nSunday:\n${schedule.sundayPlan}`;
}

/** Turn 2 — the structured weekly schedule (real subjects and minutes, Mon-Sat vs. a Sunday
 * mock-test day — saved so "My Plan" and a later "what's my routine" question show the same one),
 * then asks before offering per-subject detail. */
async function buildSchedule(userId: string, profile: StrategyProfile): Promise<ReplyWithSuggestions> {
  const schedule = buildWeeklySchedule(profile.studyHoursPerDay, profile.weakSubject);
  await prisma.user.update({ where: { id: userId }, data: { dailyScheduleBlocks: schedule as unknown as object } });
  const isBeginner = profile.examStage === 'Just starting out';
  const intro = isBeginner
    ? "Let's begin with a structured routine — we'll ease into full-length tests once the basics feel solid."
    : "Here's a structured routine based on what you've told me.";
  return {
    messages: [`${intro}\n\n${formatScheduleMessage(schedule)}`, DETAILED_PLAN_PROMPT],
    suggestions: DETAILED_PLAN_SUGGESTIONS,
  };
}

/** Turn 3 — nudges to the diagnostic quiz, then a course pitch for students who aren't enrolled
 * yet, asked first rather than dumped alongside it. */
async function buildDiagnosticNudge(userId: string): Promise<ReplyWithSuggestions> {
  await prisma.user.update({ where: { id: userId }, data: { pendingIntakeFlow: null } });
  const enrolled = await isUserEnrolled(userId);
  const nudge = 'Great — take today\'s Daily Quiz to get started, and ask me "what\'s my plan today" anytime after that.';
  if (enrolled) return { messages: [nudge], suggestions: defaultSuggestions(true) };
  return { messages: [nudge, OFFER_COURSE_PROMPT], suggestions: OFFER_COURSE_SUGGESTIONS };
}

/** Entry point into the strategy reveal — called once the intake (exam, date, stage, hours, weak
 * subject, syllabus) is fully answered. Just the first turn; the rest follow as the student taps
 * through READY_FOR_SCHEDULE_PROMPT and READY_FOR_DIAGNOSTIC_PROMPT. */
async function finishStrategyIntake(userId: string, profile: StrategyProfile): Promise<ReplyWithSuggestions> {
  return buildPlanIntro(profile);
}

/**
 * Used when the student picks "Exam Preparation" on first opening the chat and fills the
 * target-exam/exam-date form, instead of the free-text two-step onboarding above. Saves both to
 * the profile and writes the exchange into chat history so it reads naturally in the Chat tab.
 */
export async function completeOnboardingForm(userId: string, targetExam: string, examDate: string): Promise<ReplyWithSuggestions> {
  // This path's own closing line promises "ask me 'what's my plan today' and I'll turn this into
  // a daily checklist" (buildStrategyAdvice, below) — that used to be false here, since only the
  // chat-driven strategy intake ever called buildSchedule. Give this path the same default
  // schedule (using sensible fallbacks, since this quick form never collects study hours/weak
  // subject) so "My Plan" and that promise both actually hold — but only if nothing's saved yet,
  // so re-running this quick form never clobbers a schedule already personalized via chat.
  const existing = await prisma.user.findUnique({ where: { id: userId }, select: { dailyScheduleBlocks: true } });
  await prisma.user.update({
    where: { id: userId },
    data: {
      targetExam,
      examDate,
      ...(existing?.dailyScheduleBlocks ? {} : { dailyScheduleBlocks: buildWeeklySchedule(null, null) as unknown as object }),
    },
  });
  await prisma.aiMentorMessage.create({ data: { userId, role: 'user', content: `I'm preparing for ${targetExam}, around ${examDate}.` } });
  const { messages, suggestions } = await finishIntake(userId, targetExam, examDate);
  for (let i = 0; i < messages.length; i++) {
    await prisma.aiMentorMessage.create({
      data: { userId, role: 'assistant', content: messages[i], suggestions: i === messages.length - 1 ? suggestions : [] },
    });
  }
  return { messages, suggestions };
}

// Quiz/MockTest.examCategory holds one of these admin-facing group names (see
// app/admin/(dashboard)/_components/examCategories.ts), not the specific exam the student typed
// into chat (e.g. "Bank Clerk", "SSC cgl") — this maps free text to the right group by keyword so
// "give me a practice test" doesn't hand back a quiz for a completely different exam.
const EXAM_CATEGORY_KEYWORDS: Record<string, string[]> = {
  SSC: ['ssc'],
  Banking: ['bank', 'ibps', 'sbi', 'rrb po'],
  Railway: ['railway', 'rrb', 'ntpc', 'rpf', 'alp'],
  UPSC: ['upsc', 'civil services'],
  'State PSC': ['state pcs', 'psc'],
  Defence: ['cds', 'nda', 'afcat', 'capf', 'defence'],
  'Assam Govt': ['adre', 'apdcl', 'assam'],
  'Teaching Exams': ['tet', 'ugc net', 'cadre', 'teaching'],
};

function matchExamCategory(targetExam: string | null): string | null {
  if (!targetExam) return null;
  const lower = targetExam.toLowerCase();
  for (const [category, keywords] of Object.entries(EXAM_CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return category;
  }
  return null;
}

/** Exported so the "Test" chat tab can look up the same open test and fetch its full questions,
 * without duplicating this attempted-vs-catalog comparison. Prefers a test tagged for the
 * student's own exam category; falls back to any open one so an uncommon exam name never dead-ends. */
export async function findAnyOpenTest(
  userId: string,
  courseIds: string[],
  targetExam: string | null
): Promise<{ kind: 'quiz' | 'mock'; id: string; title: string } | null> {
  const category = matchExamCategory(targetExam);
  const [quizzes, mockTests, quizAttempts, mockAttempts] = await Promise.all([
    prisma.quiz.findMany({
      where: { OR: [{ courseId: { in: courseIds } }, { courseId: null }] },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, examCategory: true },
    }),
    prisma.mockTest.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, examCategory: true },
    }),
    prisma.quizAttempt.findMany({ where: { userId }, select: { quizId: true } }),
    prisma.mockTestAttempt.findMany({ where: { userId }, select: { mockTestId: true } }),
  ]);
  const attemptedQuizIds = new Set(quizAttempts.map((a) => a.quizId));
  const attemptedMockIds = new Set(mockAttempts.map((a) => a.mockTestId));
  const openQuizzes = quizzes.filter((q) => !attemptedQuizIds.has(q.id));
  const openMocks = mockTests.filter((m) => !attemptedMockIds.has(m.id));

  const matchedQuiz = category ? openQuizzes.find((q) => q.examCategory.includes(category)) : undefined;
  const openQuiz = matchedQuiz ?? openQuizzes[0];
  if (openQuiz) return { kind: 'quiz', id: openQuiz.id, title: openQuiz.title };

  const matchedMock = category ? openMocks.find((m) => m.examCategory === category) : undefined;
  const openMock = matchedMock ?? openMocks[0];
  if (openMock) return { kind: 'mock', id: openMock.id, title: openMock.title };

  return null;
}

async function createDoubtTicket(name: string, phone: string, email: string | null, text: string): Promise<string> {
  const ticketNumber = 'GY-TK-' + Math.floor(100000 + Math.random() * 900000);
  await prisma.supportTicket.create({
    data: {
      ticketNumber,
      studentName: name,
      phone,
      email: email || undefined,
      category: 'Doubt (AI Mentor)',
      urgency: 'Normal',
      description: text,
    },
  });
  return ticketNumber;
}

const COUNSELLOR_LEAD_DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000;

/** Skips creating a new Lead if this student already has one from the AI Mentor chat in the last
 * 24h — "talk to a counsellor" can be tapped/typed repeatedly in one sitting, and without this a
 * single frustrated or button-mashing student can flood the counsellor queue with duplicates of
 * the same request instead of it reading as one clear signal. */
async function createCounsellorLead(name: string, phone: string, email: string | null, targetExam: string | null, note: string): Promise<void> {
  const recent = await prisma.lead.findFirst({
    where: { phone, source: 'AI_MENTOR_CHAT', createdAt: { gt: new Date(Date.now() - COUNSELLOR_LEAD_DEDUPE_WINDOW_MS) } },
  });
  if (recent) {
    // The caller always tells the student "I've passed along what you've told me" regardless of
    // what happens here — so a second, genuinely different request within the window must still
    // reach admin (appended to the existing lead) instead of being silently dropped. Only an
    // exact repeat of the same request (e.g. the student re-tapping the same chip) is skipped,
    // to avoid the lead record growing with true duplicates.
    if (recent.message?.trim() !== note.trim()) {
      await prisma.lead.update({
        where: { id: recent.id },
        data: { message: `${recent.message ?? ''}\n\n[Follow-up] ${note}`.trim() },
      });
    }
    return;
  }

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
 * Mostly rule-based dispatch (regex intent matching against fixed reply builders) — each branch
 * pulls the student's real data (course, pending tests, progress, subject accuracy) so answers
 * are specific to them, not generic. A narrow, best-effort OpenAI backstop (chatIntent.ts) only
 * kicks in where the regex layer is known to be fragile: validating a free-text intake answer
 * actually answers the pending question, recovering a recognizable intent (or just small talk)
 * from a message that matched no pattern, and — for a genuine doubt that still ends up ticketed —
 * drafting an immediate, encouraging first reply (never a source of facts; the ticket is always
 * still created too). OpenAI being unavailable degrades every one of those checks back to the
 * pre-existing regex-only behavior. Returns a short sequence of messages, having already saved
 * all of them (the user's and every reply chunk) to history.
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
    examStage: string | null;
    studyHoursPerDay: string | null;
    weakSubject: string | null;
    syllabusProgress: string | null;
    pendingIntakeFlow: string | null;
    dailyScheduleBlocks: WeeklySchedule | null;
    chatResetAt: Date | null;
    pendingExamDateSuggestion: string | null;
  },
  text: string
): Promise<ReplyWithSuggestions> {
  const trimmed = text.trim().slice(0, 1000);
  if (!trimmed) throw new Error('Message cannot be empty');

  await prisma.aiMentorMessage.create({ data: { userId: user.id, role: 'user', content: trimmed } });

  const name = user.name || 'there';
  let reply: string[];
  let suggestions: string[] = defaultSuggestions(!!user.targetExam);

  // Which intake is in progress — 'course' only when explicitly tagged by the course-guidance
  // paths below; everything else (including unset) resolves into the strategy/plan intake.
  const flow = user.pendingIntakeFlow;
  const resolveNext = (profile: IntakeProfile & StrategyProfile, enrolled: boolean): string | null =>
    flow === 'course' ? nextIntakeQuestion(profile, !enrolled) : nextStrategyQuestion(profile);
  const resolveFinish = async (profile: IntakeProfile & StrategyProfile): Promise<ReplyWithSuggestions> =>
    flow === 'course' ? buildCourseIntro(profile.targetExam) : finishStrategyIntake(user.id, profile);

  // What the assistant asked last — used to tell whether this new message is the answer
  // to the exam-name/exam-date onboarding question, regardless of what it also matches below.
  // Scoped to after the student's last "New Conversation" reset, if any, so a reset student never
  // resumes a question that was actually asked in a conversation they've since cleared.
  const lastAssistant = await prisma.aiMentorMessage.findFirst({
    where: { userId: user.id, role: 'assistant', ...(user.chatResetAt ? { createdAt: { gt: user.chatResetAt } } : {}) },
    orderBy: { createdAt: 'desc' },
  });

  // Recent prior turns (current message excluded — it's passed separately below) for every
  // OpenAI backstop call in this function, so each judges the message in the context of the
  // actual conversation instead of in total isolation. The current user message was already
  // saved to history above, so this fetch's last row is dropped to exclude it.
  const recentForAi = (await getChatMessages(user.id, user.chatResetAt, 9)).slice(0, -1).map((m) => ({ role: m.role, content: m.content }));

  // A clear, different ask — "what's my plan today", "give me a test", "talk to a counsellor" —
  // always gets answered right away instead of being silently swallowed as the literal answer to
  // whatever intake question is still pending (e.g. typing "what's my plan today" while
  // WEAK_SUBJECT_PROMPT was outstanding used to get saved as the weak-subject answer and the
  // student's actual question was never addressed, which read as the chat being stuck). The
  // pending question itself is left unanswered in the DB, so it's asked again next time the
  // student triggers that intake flow. Deliberately NOT extended to every other intent pattern
  // below (PROGRESS/MISTAKES/FACULTY/etc.) — several of those share ordinary words with plausible
  // free-text answers (e.g. MISTAKES_PATTERN's "weak" vs. a genuine "I'm weak in reasoning" answer
  // to WEAK_SUBJECT_PROMPT), so a regex-based interrupt there risks losing a real answer. The
  // OpenAI check just below covers that case instead, since it reasons about meaning, not keywords.
  const interruptsIntake = PLAN_PATTERN.test(trimmed) || TEST_PATTERN.test(trimmed) || COUNSELLOR_PATTERN.test(trimmed);
  let pendingAnswer = interruptsIntake ? null : lastAssistant?.content;

  // Every pending-prompt branch below — free-text intake slots AND the yes/no-style ones (which
  // only guard against an explicit "no"/"skip"/etc. and otherwise assume yes) — used to accept
  // whatever the student typed with no check that it was actually a response to that prompt.
  // Confirmed live: "Reasoning ke puzzles solve karne ka best tarika kya hai?", sent while
  // COURSE_DETAILS_PROMPT ("Want to know the price and what's included?") was pending, didn't
  // match the decline pattern, so it fell into the "yes" branch and got shown real course pricing
  // in reply to an unrelated study question. Best-effort OpenAI sanity check: unavailable or
  // inconclusive just keeps the pre-existing behavior for that prompt (save-as-typed, or
  // assume-yes) exactly as before this existed.
  if (pendingAnswer) {
    const looksValid = await looksLikeAnswerTo(pendingAnswer, trimmed, recentForAi);
    if (!looksValid) pendingAnswer = null;
  }

  if (pendingAnswer === EXAM_NAME_PROMPT) {
    const examName = trimmed.slice(0, 120);
    await prisma.user.update({ where: { id: user.id }, data: { targetExam: examName } });
    const enrolled = await isUserEnrolled(user.id);
    const next = resolveNext({ ...user, targetExam: examName }, enrolled);
    if (next === EXAM_DATE_PROMPT) {
      // Best-effort OpenAI suggestion for when this exam is usually conducted, offered as a
      // confirmable starting point (never asserted as fact) — falls back to asking outright if
      // OPENAI_API_KEY isn't set or the lookup doesn't come back confident.
      const suggestion = await suggestExamPeriod(examName);
      if (suggestion) {
        await prisma.user.update({ where: { id: user.id }, data: { pendingExamDateSuggestion: suggestion } });
        reply = [
          `${examName} exams are typically conducted around ${suggestion} — but this shifts year to year, so go by the official notification if you already have it.`,
          EXAM_DATE_CONFIRM_PROMPT,
        ];
        suggestions = EXAM_DATE_CONFIRM_SUGGESTIONS;
      } else {
        reply = [EXAM_DATE_PROMPT];
        suggestions = [];
      }
    } else if (next) {
      reply = [next];
      suggestions = suggestionsForPrompt(next);
    } else {
      const result = await resolveFinish({ ...user, targetExam: examName });
      reply = result.messages;
      suggestions = result.suggestions;
    }
  } else if (pendingAnswer === EXAM_DATE_CONFIRM_PROMPT) {
    const wantsOwnDate = /^\s*(i have|exact|official|no|different|change|my own)\b/i.test(trimmed);
    if (wantsOwnDate) {
      await prisma.user.update({ where: { id: user.id }, data: { pendingExamDateSuggestion: null } });
      reply = [EXAM_DATE_PROMPT];
      suggestions = [];
    } else {
      const examDate = user.pendingExamDateSuggestion || 'soon';
      await prisma.user.update({ where: { id: user.id }, data: { examDate, pendingExamDateSuggestion: null } });
      const enrolled = await isUserEnrolled(user.id);
      const next = resolveNext({ ...user, examDate }, enrolled);
      if (next) {
        reply = [next];
        suggestions = suggestionsForPrompt(next);
      } else {
        const result = await resolveFinish({ ...user, examDate });
        reply = result.messages;
        suggestions = result.suggestions;
      }
    }
  } else if (pendingAnswer === EXAM_DATE_PROMPT) {
    const examDate = trimmed.slice(0, 60);
    await prisma.user.update({ where: { id: user.id }, data: { examDate } });
    const enrolled = await isUserEnrolled(user.id);
    const next = resolveNext({ ...user, examDate }, enrolled);
    if (next) {
      reply = [next];
      suggestions = suggestionsForPrompt(next);
    } else {
      const result = await resolveFinish({ ...user, examDate });
      reply = result.messages;
      suggestions = result.suggestions;
    }
  } else if (pendingAnswer === QUALIFICATION_PROMPT) {
    const qualification = trimmed.slice(0, 120);
    await prisma.user.update({ where: { id: user.id }, data: { qualification } });
    const next = nextIntakeQuestion({ ...user, qualification }, true);
    if (next) {
      reply = [next];
      suggestions = suggestionsForPrompt(next);
    } else {
      const result = await buildCourseIntro(user.targetExam);
      reply = result.messages;
      suggestions = result.suggestions;
    }
  } else if (pendingAnswer === MARKS_PROMPT) {
    const marksPercentage = trimmed.slice(0, 60);
    await prisma.user.update({ where: { id: user.id }, data: { marksPercentage } });
    const result = await buildCourseIntro(user.targetExam);
    reply = result.messages;
    suggestions = result.suggestions;
  } else if (pendingAnswer === BEGINNER_CHECK_PROMPT) {
    const examStage = trimmed.slice(0, 60);
    await prisma.user.update({ where: { id: user.id }, data: { examStage } });
    const next = nextStrategyQuestion({ ...user, examStage });
    if (next) {
      reply = [next];
      suggestions = suggestionsForPrompt(next);
    } else {
      const result = await finishStrategyIntake(user.id, { ...user, examStage });
      reply = result.messages;
      suggestions = result.suggestions;
    }
  } else if (pendingAnswer === STUDY_HOURS_PROMPT) {
    const studyHoursPerDay = trimmed.slice(0, 40);
    await prisma.user.update({ where: { id: user.id }, data: { studyHoursPerDay } });
    const next = nextStrategyQuestion({ ...user, studyHoursPerDay });
    if (next) {
      reply = [next];
      suggestions = suggestionsForPrompt(next);
    } else {
      const result = await finishStrategyIntake(user.id, { ...user, studyHoursPerDay });
      reply = result.messages;
      suggestions = result.suggestions;
    }
  } else if (pendingAnswer === WEAK_SUBJECT_PROMPT) {
    const weakSubject = trimmed.slice(0, 60);
    await prisma.user.update({ where: { id: user.id }, data: { weakSubject } });
    const next = nextStrategyQuestion({ ...user, weakSubject });
    if (next) {
      reply = [next];
      suggestions = suggestionsForPrompt(next);
    } else {
      const result = await finishStrategyIntake(user.id, { ...user, weakSubject });
      reply = result.messages;
      suggestions = result.suggestions;
    }
  } else if (pendingAnswer === SYLLABUS_PROGRESS_PROMPT) {
    const syllabusProgress = trimmed.slice(0, 40);
    await prisma.user.update({ where: { id: user.id }, data: { syllabusProgress } });
    const result = await finishStrategyIntake(user.id, { ...user, syllabusProgress });
    reply = result.messages;
    suggestions = result.suggestions;
  } else if (pendingAnswer === READY_FOR_SCHEDULE_PROMPT) {
    const declines = /^\s*(no|not now|nah+|nope|skip|later|maybe later)\b/i.test(trimmed);
    if (declines) {
      reply = ['No problem — ask me "what\'s my plan today" whenever you\'re ready to see it.'];
      suggestions = defaultSuggestions(!!user.targetExam);
    } else {
      const result = await buildSchedule(user.id, user);
      reply = result.messages;
      suggestions = result.suggestions;
    }
  } else if (pendingAnswer === DETAILED_PLAN_PROMPT) {
    const declines = /^\s*(no|not now|nah+|nope|skip|that's enough|thats enough)\b/i.test(trimmed);
    if (declines) {
      reply = [READY_FOR_DIAGNOSTIC_PROMPT];
      suggestions = READY_FOR_DIAGNOSTIC_SUGGESTIONS;
    } else if (user.dailyScheduleBlocks) {
      const withTopics = await attachTodaysTopics(user.dailyScheduleBlocks, user.id, user.targetExam);
      reply = [formatDetailedScheduleMessage(withTopics), READY_FOR_DIAGNOSTIC_PROMPT];
      suggestions = READY_FOR_DIAGNOSTIC_SUGGESTIONS;
    } else {
      reply = [READY_FOR_DIAGNOSTIC_PROMPT];
      suggestions = READY_FOR_DIAGNOSTIC_SUGGESTIONS;
    }
  } else if (pendingAnswer === READY_FOR_DIAGNOSTIC_PROMPT) {
    const declines = /^\s*(no|not now|maybe later|later|nah+|nope|skip)\b/i.test(trimmed);
    if (declines) {
      const enrolled = await isUserEnrolled(user.id);
      await prisma.user.update({ where: { id: user.id }, data: { pendingIntakeFlow: null } });
      if (enrolled) {
        reply = ['No worries — the plan\'s saved. Ask me "what\'s my plan today" whenever you\'re ready.'];
        suggestions = defaultSuggestions(true);
      } else {
        reply = ["No worries — the plan's saved.", OFFER_COURSE_PROMPT];
        suggestions = OFFER_COURSE_SUGGESTIONS;
      }
    } else {
      const result = await buildDiagnosticNudge(user.id);
      reply = result.messages;
      suggestions = result.suggestions;
    }
  } else if (pendingAnswer === OFFER_COURSE_PROMPT) {
    const declines = /^\s*(no|not now|nah+|nope|skip|later|maybe later)\b/i.test(trimmed);
    if (declines) {
      reply = ['No problem — ask anytime you\'re ready, or say "talk to a counsellor" if you\'d rather speak to someone.'];
      suggestions = TALK_TO_COUNSELLOR_SUGGESTIONS;
    } else {
      const result = await buildCourseIntro(user.targetExam);
      reply = result.messages;
      suggestions = result.suggestions;
    }
  } else if (pendingAnswer === COURSE_DETAILS_PROMPT) {
    const declines = /^\s*(no|not right now|nah+|nope|skip|later|maybe later)\b/i.test(trimmed);
    if (declines) {
      reply = ['No problem — ask anytime, or say "talk to a counsellor" if you\'d rather speak to someone.'];
      suggestions = TALK_TO_COUNSELLOR_SUGGESTIONS;
    } else {
      const result = await buildCourseDetails(user.targetExam);
      reply = result.messages;
      suggestions = result.suggestions;
    }
  } else if (pendingAnswer === COURSE_ACTION_PROMPT) {
    const wantsCounsellor = /^\s*(talk|counsellor|counselor|call)\b/i.test(trimmed);
    const result = wantsCounsellor ? await buildCounsellorReply(user, name, trimmed) : await buildEnrollReply(user.targetExam);
    reply = result.messages;
    suggestions = result.suggestions;
  } else if (pendingAnswer === CONFIRM_EXAM_PROMPT) {
    const saysDifferent = /^\s*(no|nah+|nope|nahi|different|change|wrong|galat)\b/i.test(trimmed);
    if (saysDifferent) {
      // Clear every exam-specific answer, not just the exam itself — otherwise a switch to a
      // different exam silently reuses the old exam's beginner/hours/weak-subject/syllabus (or
      // qualification/marks) answers instead of asking fresh ones for the new exam.
      await prisma.user.update({
        where: { id: user.id },
        data: {
          targetExam: null,
          examDate: null,
          examStage: null,
          studyHoursPerDay: null,
          weakSubject: null,
          syllabusProgress: null,
          qualification: null,
          marksPercentage: null,
          pendingExamDateSuggestion: null,
        },
      });
      reply = [EXAM_NAME_PROMPT];
      suggestions = [];
    } else {
      const enrolled = await isUserEnrolled(user.id);
      const next = resolveNext(user, enrolled);
      if (next) {
        reply = [next];
        suggestions = suggestionsForPrompt(next);
      } else {
        const result = await resolveFinish(user);
        reply = result.messages;
        suggestions = result.suggestions;
      }
    }
  } else if (!lastAssistant && user.targetExam && (STRATEGY_PATTERN.test(trimmed) || COURSE_GUIDANCE_PATTERN.test(trimmed))) {
    // First message of this conversation thread, and we already have an exam on file from a
    // previous session — confirm it's still right instead of silently assuming or re-asking.
    // Tag which intake this belongs to now, since "yes"/"no" alone won't carry that later.
    await prisma.user.update({
      where: { id: user.id },
      data: { pendingIntakeFlow: STRATEGY_PATTERN.test(trimmed) ? 'strategy' : 'course' },
    });
    reply = [`You mentioned earlier you're preparing for ${user.targetExam}.`, CONFIRM_EXAM_PROMPT];
    suggestions = CONFIRM_EXAM_SUGGESTIONS;
  } else if (STRATEGY_PATTERN.test(trimmed)) {
    const next = nextStrategyQuestion(user);
    await tagPendingFlow(user.id, next, 'strategy');
    if (next) {
      reply = [next];
      suggestions = suggestionsForPrompt(next);
    } else {
      const result = await finishStrategyIntake(user.id, user);
      reply = result.messages;
      suggestions = result.suggestions;
    }
  } else if (COURSE_GUIDANCE_PATTERN.test(trimmed)) {
    const enrolled = await isUserEnrolled(user.id);
    if (enrolled) {
      reply = ["You're already enrolled, so there's no new course to pick.", 'Check the "My Plan" tab above for what to do today.'];
      suggestions = defaultSuggestions(true);
    } else {
      const next = nextIntakeQuestion(user, true);
      await tagPendingFlow(user.id, next, 'course');
      if (next) {
        reply = [next];
        suggestions = suggestionsForPrompt(next);
      } else {
        const result = await buildCourseIntro(user.targetExam);
        reply = result.messages;
        suggestions = result.suggestions;
      }
    }
  } else if (NEW_BATCH_PATTERN.test(trimmed) || LIVE_BATCH_PATTERN.test(trimmed)) {
    const course = await prisma.course.findFirst({ orderBy: { createdAt: 'desc' } });
    reply = course
      ? [`Our newest batch is "${course.title}".`, `It starts ${course.startDate} — you'll find full timings on the Courses page.`]
      : ['No new batches announced right now — check the Courses page, new ones get added often.'];
    suggestions = BROWSE_OR_COUNSELLOR_SUGGESTIONS;
  } else if (FACULTY_PATTERN.test(trimmed)) {
    const mentors = await prisma.mentor.findMany({ orderBy: { rating: 'desc' }, take: 4 });
    reply = mentors.length
      ? ["Here's who's teaching right now:", mentors.map((m) => `${m.name} — ${m.subject} (${m.title})`).join('\n')]
      : ["I don't have faculty details handy right now — the About page has our full team."];
    suggestions = BROWSE_OR_COUNSELLOR_SUGGESTIONS;
  } else if (CENTER_PATTERN.test(trimmed)) {
    reply = ['Our centers: Chandigarh, Guwahati, New Delhi and Assam.', 'Want a counsellor to help you find the nearest one? Just say "talk to a counsellor".'];
    suggestions = TALK_TO_COUNSELLOR_SUGGESTIONS;
  } else if (TEST_SERIES_PATTERN.test(trimmed)) {
    const mock = await prisma.mockTest.findFirst({ orderBy: { createdAt: 'desc' } });
    reply = mock
      ? [`Our latest test series is "${mock.title}".`, "You'll find it under Mock Tests on your dashboard."]
      : ['No new test series right now — check Mock Tests on your dashboard, new ones are added often.'];
    suggestions = ['Give me a practice test', 'Browse Courses'];
  } else if (COUNSELLOR_PATTERN.test(trimmed)) {
    const result = await buildCounsellorReply(user, name, trimmed);
    reply = result.messages;
    suggestions = result.suggestions;
  } else if (BROWSE_COURSES_PATTERN.test(trimmed)) {
    reply = ['Tap the "Courses" tab above — I\'ve listed everything there with pricing and details, so you don\'t have to leave this chat.'];
    suggestions = TALK_TO_COUNSELLOR_SUGGESTIONS;
  } else if (ENROLL_PATTERN.test(trimmed)) {
    const result = await buildEnrollReply(user.targetExam);
    reply = result.messages;
    suggestions = result.suggestions;
  } else if (TEST_PATTERN.test(trimmed)) {
    const enrollments = await prisma.enrollment.findMany({ where: { userId: user.id, status: 'ACTIVE' }, select: { courseId: true } });
    const open = await findAnyOpenTest(user.id, enrollments.map((e) => e.courseId), user.targetExam);
    reply = open
      ? [`"${open.title}" is open right now — tap the "Test" tab above to take it right here.`]
      : ["You've attempted everything that's open right now — check back soon, new ones are added often."];
    suggestions = defaultSuggestions(!!user.targetExam);
  } else if (PLAN_PATTERN.test(trimmed) && user.dailyScheduleBlocks) {
    // Already built a personalized routine earlier — show the same saved routine (with today's
    // specific topic per subject) instead of the generic plan/counsellor logic below, or
    // regenerating it.
    const withTopics = await attachTodaysTopics(user.dailyScheduleBlocks, user.id, user.targetExam);
    reply = ["Here's your daily study routine:", formatDetailedScheduleMessage(withTopics)];
    suggestions = defaultSuggestions(!!user.targetExam);
  } else if (PLAN_PATTERN.test(trimmed)) {
    const overview = await getMentorOverview(user.id, name, user.targetExam);
    if (overview.mode === 'counsellor') {
      const next = nextIntakeQuestion(user, true);
      await tagPendingFlow(user.id, next, 'course');
      if (next) {
        reply = [`You're not enrolled in a course yet, so there's no daily plan to show you — but let's find the right one.`, next];
        suggestions = suggestionsForPrompt(next);
      } else {
        const result = await buildCourseIntro(user.targetExam);
        reply = result.messages;
        suggestions = result.suggestions;
      }
    } else if (overview.plan.length === 0) {
      reply = ['Nothing left on today\'s plan — nicely done. Check back tomorrow.'];
      suggestions = defaultSuggestions(true);
    } else {
      reply = ["Here's today's plan:", overview.plan.map((p) => `- ${p.title} (${p.meta})`).join('\n')];
      suggestions = defaultSuggestions(true);
    }
  } else if (PROGRESS_PATTERN.test(trimmed)) {
    const data = await getMyProgress(user.id, name);
    if (data) {
      reply = ["Here's how you're doing:", data.summary];
      suggestions = defaultSuggestions(true);
    } else {
      const basic = await getBasicProgress(user.id);
      reply = basic
        ? [
            `You've attempted ${basic.totalAttempts} quiz${basic.totalAttempts === 1 ? '' : 'zes'}/mock test${basic.totalAttempts === 1 ? '' : 's'} so far, averaging ${basic.avgAccuracy}% accuracy.`,
            basic.weakestSubject ? `${basic.weakestSubject.subject} looks like your weakest area right now.` : 'Keep attempting a mix of subjects so I can spot patterns.',
            'That\'s the basic picture — for a detailed report compared with your batch, plus a tailored improvement plan, enroll in a course. Check the "My Progress" tab for the full breakdown and an Enroll Now button.',
          ]
        : ['Take a free quiz or mock test first so I have something to show you — then enroll in a course for a detailed report compared with your batch.'];
      suggestions = basic ? ENROLL_OR_COUNSELLOR_SUGGESTIONS : defaultSuggestions(!!user.targetExam);
    }
  } else if (MISTAKES_PATTERN.test(trimmed)) {
    const subjects = await getSubjectStrength(user.id);
    if (subjects.length === 0) {
      reply = ["You haven't attempted any quizzes yet, so there's nothing to review — take a Daily Quiz to get started."];
    } else {
      const weakest = [...subjects].sort((a, b) => a.avgAccuracy - b.avgAccuracy).slice(0, 3);
      reply = [`Your weakest subjects: ${weakest.map((s) => `${s.subject} (${s.avgAccuracy}% accuracy)`).join(', ')}.`, 'Focus revision there first.'];
    }
    suggestions = defaultSuggestions(!!user.targetExam);
  } else if (REMIND_PATTERN.test(trimmed)) {
    reply = ["I can't send reminders outside the app yet, but anything overdue will show up at the top of your Overview page — check back there."];
    suggestions = defaultSuggestions(!!user.targetExam);
  } else if (GREETING_PATTERN.test(trimmed)) {
    reply = lastAssistant ? [`Welcome back, ${name}!`, 'How can I help you today?'] : [`Hi ${name}!`, 'How can I help you today?'];
    suggestions = defaultSuggestions(!!user.targetExam);
  } else {
    // Best-effort OpenAI backstop before escalating to a human — recovers small talk and
    // recognizable-but-differently-phrased intents without creating ticket noise; unavailable or
    // genuinely unclear still falls through to the exact same ticket-creation as before this existed.
    const classification = await classifyUnmatchedMessage(trimmed, recentForAi);
    if (classification.kind === 'small_talk') {
      reply = [`Happy to help, ${name}! Let me know if you need your plan, a test, or anything else.`];
      suggestions = defaultSuggestions(!!user.targetExam);
    } else if (classification.kind === 'known_intent' && classification.intent) {
      const { label, chip } = KNOWN_INTENT_CHIP[classification.intent];
      reply = [`Looks like you're asking about ${label} — tap below and I'll pull that up.`];
      suggestions = [chip];
    } else {
      // Ticket creation stays unconditional — a human safety net regardless of whether the draft
      // reply below comes back. The draft only adds an immediate, encouraging first response
      // instead of leaving the student with nothing until faculty follows up; it's never allowed
      // to state specific facts (see draftDoubtReply's prompt), so it can't substitute for the
      // ticket, only soften the wait.
      const [ticketNumber, drafted] = await Promise.all([
        createDoubtTicket(name, user.phone, user.email, trimmed),
        draftDoubtReply(trimmed, user.targetExam, recentForAi),
      ]);
      reply = drafted
        ? [drafted, `I've also flagged this for your faculty (ticket ${ticketNumber}) in case you need more specific detail.`]
        : ['Got it, let me get that in front of your faculty.', `Forwarded as ticket ${ticketNumber} — they'll get back to you soon.`];
      suggestions = defaultSuggestions(!!user.targetExam);
    }
  }

  for (let i = 0; i < reply.length; i++) {
    await prisma.aiMentorMessage.create({
      data: { userId: user.id, role: 'assistant', content: reply[i], suggestions: i === reply.length - 1 ? suggestions : [] },
    });
  }
  return { messages: reply, suggestions };
}
