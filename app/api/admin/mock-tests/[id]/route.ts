import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const questionSchema = z.object({
  id: z.number(),
  question: z.string().min(1),
  options: z.array(z.string()).min(2),
  correctAnswer: z.number().int().nonnegative(),
  explanation: z.string().min(1),
  flagged: z.boolean().optional().default(false),
});

const bodySchema = z
  .object({
    title: z.string().min(1),
    examCategory: z.string().min(1),
    timeLimitMinutes: z.number().int().positive(),
    status: z.enum(['ACTIVE', 'DRAFT', 'CLOSED']),
    questions: z.array(questionSchema).min(1),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: 'No fields to update' });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const { questions, ...rest } = parsed.data;
  const mockTest = await prisma.mockTest.update({
    where: { id },
    data: {
      ...rest,
      ...(questions ? { questions, totalQuestions: questions.length } : {}),
    },
  });
  return NextResponse.json({ success: true, mockTest });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.mockTest.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
