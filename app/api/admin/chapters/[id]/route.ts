import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  title: z.string().min(1),
  order: z.number().int().default(0),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const chapter = await prisma.chapter.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ success: true, chapter });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.topic.deleteMany({ where: { chapterId: id } });
  await prisma.chapter.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
