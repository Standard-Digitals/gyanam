import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/currentUser';
import { getMockTestById } from '@/lib/data/mockTests';

const bodySchema = z.object({
  answers: z.record(z.string(), z.number()),
  timeTakenSec: z.number().int().nonnegative(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Login required to save your mock test score' }, { status: 401 });
  }

  const { id } = await params;
  const mockTest = await getMockTestById(id);
  if (!mockTest) {
    return NextResponse.json({ error: 'Mock test not found' }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const { answers, timeTakenSec } = parsed.data;

  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;

  for (const q of mockTest.questions) {
    const selected = answers[String(q.id)];
    if (selected === undefined) {
      unattemptedCount++;
    } else if (selected === q.correctAnswer) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  }

  const obtainedMarks = Math.max(0, correctCount * 1 - incorrectCount * 0.25);
  const accuracy = correctCount + incorrectCount > 0 ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : 0;

  const attempt = await prisma.mockTestAttempt.create({
    data: {
      userId: user.userId,
      mockTestId: mockTest.id,
      correctCount,
      incorrectCount,
      unattemptedCount,
      obtainedMarks,
      accuracy,
      timeTakenSec,
    },
  });

  return NextResponse.json({
    success: true,
    result: {
      correctCount,
      incorrectCount,
      unattemptedCount,
      obtainedMarks,
      accuracy,
      totalMarks: mockTest.totalQuestions,
      submittedAt: attempt.submittedAt,
    },
  });
}
