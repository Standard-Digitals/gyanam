import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { completeOnboardingForm } from '@/lib/data/aiMentor';

const bodySchema = z.object({
  targetExam: z.string().min(1),
  examDate: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }

  const { messages: replies, suggestions } = await completeOnboardingForm(user.id, parsed.data.targetExam, parsed.data.examDate);
  return NextResponse.json({ replies, suggestions });
}
