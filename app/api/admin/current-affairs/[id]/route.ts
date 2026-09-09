import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const mcqQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()).min(2),
  correctAnswer: z.number().int().nonnegative(),
  explanation: z.string().min(1),
});

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
  mcqQuestion: mcqQuestionSchema.nullable().optional(),
  syllabusTag: z.string().optional(),
  sourceName: z.string().optional(),
  author: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const { mcqQuestion, ...rest } = parsed.data;
  const item = await prisma.currentAffairItem.update({
    where: { id },
    data: { ...rest, mcqQuestion: mcqQuestion === null ? Prisma.JsonNull : mcqQuestion },
  });
  return NextResponse.json({ success: true, item });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.currentAffairItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
