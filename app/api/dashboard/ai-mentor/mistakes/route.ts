import { NextResponse } from 'next/server';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { getSubjectStrength, getRecentMistakes } from '@/lib/data/performance';

export async function GET() {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const [subjects, recentMistakes] = await Promise.all([getSubjectStrength(user.id), getRecentMistakes(user.id)]);
  const weakest = [...subjects].sort((a, b) => a.avgAccuracy - b.avgAccuracy);
  // Not-yet-reviewed-in-the-one-by-one-flow subset of the same list — lets that flow show fresh
  // mistakes each time instead of repeating ones the student already went through.
  const unreviewedMistakes = recentMistakes.filter((m) => !m.reviewedAt);
  return NextResponse.json({ subjects: weakest, recentMistakes, unreviewedMistakes });
}
