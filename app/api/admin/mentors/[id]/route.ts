import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  experienceYears: z.number().int().nonnegative(),
  qualification: z.string().min(1),
  exRole: z.string().optional(),
  subject: z.string().min(1),
  selectionsMentored: z.number().int().nonnegative(),
  rating: z.number().min(0).max(5),
  image: z.string().min(1),
  bio: z.string().min(1),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const mentor = await prisma.mentor.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ success: true, mentor });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.mentor.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
