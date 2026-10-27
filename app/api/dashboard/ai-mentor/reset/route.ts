import { NextResponse } from 'next/server';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { resetChatConversation } from '@/lib/data/aiMentor';

export async function POST() {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  await resetChatConversation(user.id);
  return NextResponse.json({ ok: true });
}
