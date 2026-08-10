import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/currentUser';

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ streak: 0 });
  }

  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: user.userId },
    select: { submittedAt: true },
    orderBy: { submittedAt: 'desc' },
  });

  const dateKeys = new Set(attempts.map((a) => toDateKey(a.submittedAt)));

  let streak = 0;
  const cursor = new Date();
  const todayKey = toDateKey(cursor);
  if (!dateKeys.has(todayKey)) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  while (dateKeys.has(toDateKey(cursor))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return NextResponse.json({ streak });
}
