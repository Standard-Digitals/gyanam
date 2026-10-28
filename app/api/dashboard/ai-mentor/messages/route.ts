import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { getChatMessages, sendChatMessage, normalizeWeeklySchedule } from '@/lib/data/aiMentor';

const RATE_LIMIT_WINDOW_MS = 10_000;
const RATE_LIMIT_MAX_MESSAGES = 6;

export async function GET() {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  const messages = await getChatMessages(user.id, user.chatResetAt);
  // Server truth, not a client-only flag that resets on reopen — drives the persistent
  // "Set up my exam preparation" button and which suggestion chips to show.
  return NextResponse.json({ messages, needsExamSetup: !user.targetExam });
}

const bodySchema = z.object({ text: z.string().min(1).max(1000) });

export async function POST(req: NextRequest) {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }

  // Basic abuse/cost guard — this dispatcher can trigger OpenAI calls and create support
  // tickets/leads, so a burst of rapid messages (bot, mis-click spam, or a frustrated student
  // holding Enter) shouldn't be free to repeat either.
  const recentCount = await prisma.aiMentorMessage.count({
    where: { userId: user.id, role: 'user', createdAt: { gt: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) } },
  });
  if (recentCount >= RATE_LIMIT_MAX_MESSAGES) {
    return NextResponse.json({ error: "You're sending messages a bit fast — give it a few seconds." }, { status: 429 });
  }

  const { messages: replies, suggestions } = await sendChatMessage(
    {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      targetExam: user.targetExam,
      examDate: user.examDate,
      qualification: user.qualification,
      marksPercentage: user.marksPercentage,
      examStage: user.examStage,
      studyHoursPerDay: user.studyHoursPerDay,
      weakSubject: user.weakSubject,
      syllabusProgress: user.syllabusProgress,
      pendingIntakeFlow: user.pendingIntakeFlow,
      dailyScheduleBlocks: normalizeWeeklySchedule(user.dailyScheduleBlocks),
      chatResetAt: user.chatResetAt,
      pendingExamDateSuggestion: user.pendingExamDateSuggestion,
      pendingQuestion: user.pendingQuestion,
    },
    parsed.data.text
  );
  return NextResponse.json({ replies, suggestions });
}
