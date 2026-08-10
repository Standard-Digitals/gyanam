import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const attempts = await prisma.quizAttempt.findMany({
    orderBy: [{ obtainedMarks: 'desc' }, { timeTakenSec: 'asc' }],
    take: 10,
  });

  const userIds = [...new Set(attempts.map((a) => a.userId))];
  const users = await prisma.user.findMany({ where: { id: { in: userIds } } });
  const userMap = new Map(users.map((u) => [u.id, u]));

  const leaderboard = attempts.map((a, idx) => {
    const user = userMap.get(a.userId);
    const displayName = user?.name || `Aspirant ${user?.phone.slice(-4) ?? ''}`;
    return {
      rank: idx + 1,
      name: displayName,
      obtainedMarks: a.obtainedMarks,
      accuracy: a.accuracy,
      timeTakenSec: a.timeTakenSec,
    };
  });

  return NextResponse.json({ leaderboard });
}
