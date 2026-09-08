import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { questionSchema } from '@/lib/validation/question';

const bodySchema = z.object({
  title: z.string().min(1),
  subject: z.string().min(1),
  examCategory: z.array(z.string()).min(1),
  date: z.string().min(1),
  timeLimitMinutes: z.number().int().positive(),
  difficulty: z.string().min(1),
  thumbnail: z.string().optional(),
  courseId: z.string().nullable().optional(),
  sections: z.array(z.string()).default([]),
  questions: z.array(questionSchema).min(1),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const { questions, ...rest } = parsed.data;
  const quiz = await prisma.quiz.update({
    where: { id },
    data: { ...rest, totalQuestions: questions.length, totalMarks: questions.length, questions },
  });
  return NextResponse.json({ success: true, quiz });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.quiz.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
