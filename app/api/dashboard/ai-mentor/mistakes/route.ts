import { NextResponse } from 'next/server';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { getSubjectStrength } from '@/lib/data/performance';

// There's no per-question response log in this schema yet (question text, chosen/correct option,
// time per question), so true mistake-type tagging (blind guess, misread, calculation slip, etc.)
// isn't possible — this is the honest substitute: accuracy by subject, weakest first.
export async function GET() {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const subjects = await getSubjectStrength(user.id);
  const weakest = [...subjects].sort((a, b) => a.avgAccuracy - b.avgAccuracy);
  return NextResponse.json({ subjects: weakest });
}
