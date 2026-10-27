import { NextResponse } from 'next/server';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { getMentorOverview, normalizeWeeklySchedule } from '@/lib/data/aiMentor';

export async function GET() {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const firstName = (user.name || 'there').split(' ')[0];
  const overview = await getMentorOverview(user.id, firstName, user.targetExam);
  return NextResponse.json({ ...overview, dailyScheduleBlocks: normalizeWeeklySchedule(user.dailyScheduleBlocks) });
}
