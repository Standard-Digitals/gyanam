import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/currentUser';

const bodySchema = z.object({
  name: z.string().min(1).optional(),
  targetExam: z.string().min(1).optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }

  const user = await prisma.user.update({ where: { id: session.userId }, data: parsed.data });
  return NextResponse.json({ success: true, user: { name: user.name, targetExam: user.targetExam } });
}
