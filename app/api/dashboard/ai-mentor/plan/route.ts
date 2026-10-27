import { NextResponse } from 'next/server';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { getMentorOverview, normalizeWeeklySchedule, attachTodaysTopics } from '@/lib/data/aiMentor';

export async function GET() {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const firstName = (user.name || 'there').split(' ')[0];
  const [overview, schedule] = await Promise.all([
    getMentorOverview(user.id, firstName, user.targetExam),
    (async () => {
      const normalized = normalizeWeeklySchedule(user.dailyScheduleBlocks);
      return normalized ? attachTodaysTopics(normalized, user.id, user.targetExam) : null;
    })(),
  ]);
  return NextResponse.json({ ...overview, dailyScheduleBlocks: schedule });
}
