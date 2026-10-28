import { NextResponse } from 'next/server';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { getWeeklyChecklist, toggleWeeklyChecklistItem } from '@/lib/data/aiMentor';

export async function GET() {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  return NextResponse.json(await getWeeklyChecklist(user.id, user.weeklyChecklist));
}

export async function POST(req: Request) {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const index = body?.index;
  if (typeof index !== 'number') return NextResponse.json({ error: 'index is required' }, { status: 400 });

  try {
    const state = await toggleWeeklyChecklistItem(user.id, user.weeklyChecklist, index);
    return NextResponse.json(state);
  } catch {
    return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
  }
}
