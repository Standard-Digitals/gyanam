import { NextResponse } from 'next/server';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { getMyProgress } from '@/lib/data/myProgress';

export async function GET() {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const firstName = (user.name || 'there').split(' ')[0];
  const data = await getMyProgress(user.id, firstName);
  return NextResponse.json({ data });
}
