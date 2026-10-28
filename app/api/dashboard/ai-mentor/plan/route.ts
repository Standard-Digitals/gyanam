import { NextResponse } from 'next/server';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { getMentorOverview, normalizeWeeklySchedule, attachTodaysTopics, buildRoadmap } from '@/lib/data/aiMentor';

export async function GET() {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const firstName = (user.name || 'there').split(' ')[0];
  const normalized = normalizeWeeklySchedule(user.dailyScheduleBlocks);
  const [overview, schedule, roadmap] = await Promise.all([
    getMentorOverview(user.id, firstName, user.targetExam),
    normalized ? attachTodaysTopics(normalized, user.id, user.targetExam) : Promise.resolve(null),
    normalized ? buildRoadmap(user.id, user.examDate, user.targetExam) : Promise.resolve(null),
  ]);
  return NextResponse.json({ ...overview, dailyScheduleBlocks: schedule, roadmap });
}
