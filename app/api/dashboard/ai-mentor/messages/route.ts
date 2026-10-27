import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { getChatMessages, sendChatMessage } from '@/lib/data/aiMentor';

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
      chatResetAt: user.chatResetAt,
      pendingExamDateSuggestion: user.pendingExamDateSuggestion,
    },
    parsed.data.text
  );
  return NextResponse.json({ replies, suggestions });
}
