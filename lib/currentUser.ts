import { cache } from 'react';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export const getCurrentUserProfile = cache(async () => {
  const session = await getCurrentUser();
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.userId } });
});
