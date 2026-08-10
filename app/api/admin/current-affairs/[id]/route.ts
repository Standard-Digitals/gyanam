import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  date: z.string().min(1),
  readTime: z.string().min(1),
  summary: z.string().min(1),
  bullets: z.array(z.string()).default([]),
  impForExams: z.array(z.string()).default([]),
  thumbnail: z.string().optional(),
  fullContent: z.array(z.string()).default([]),
  keyTakeaways: z.array(z.string()).default([]),
  backgroundContext: z.string().optional(),
  sourceName: z.string().optional(),
  author: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const item = await prisma.currentAffairItem.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ success: true, item });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.currentAffairItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
