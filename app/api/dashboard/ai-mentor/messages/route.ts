import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { getChatMessages, sendChatMessage } from '@/lib/data/aiMentor';

export async function GET() {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  const messages = await getChatMessages(user.id);
  return NextResponse.json({ messages });
}

const bodySchema = z.object({ text: z.string().min(1).max(1000) });

export async function POST(req: NextRequest) {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }

  const reply = await sendChatMessage(
    { id: user.id, name: user.name, phone: user.phone, email: user.email, targetExam: user.targetExam, examDate: user.examDate },
    parsed.data.text
  );
  return NextResponse.json({ reply });
}
