import { NextResponse } from 'next/server';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { getMyProgress, getBasicProgress } from '@/lib/data/myProgress';
import { getSuggestedCourse } from '@/lib/data/aiMentor';

export async function GET() {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const firstName = (user.name || 'there').split(' ')[0];
  const data = await getMyProgress(user.id, firstName);
  if (data) return NextResponse.json({ kind: 'full', data });

  const basic = await getBasicProgress(user.id, user.targetExam);
  const courseSuggestion = await getSuggestedCourse(user.targetExam);
  return NextResponse.json({ kind: basic ? 'basic' : 'none', data: basic, courseSuggestion });
}
