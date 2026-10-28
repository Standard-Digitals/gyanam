import { NextResponse } from 'next/server';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { markMistakeReviewed } from '@/lib/data/performance';

export async function POST(req: Request) {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const id = body?.id;
  if (typeof id !== 'string' || !id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  await markMistakeReviewed(user.id, id);
  return NextResponse.json({ ok: true });
}
