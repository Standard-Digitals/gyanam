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

const bodySchema = z.object({
  title: z.string().min(1),
  examCategory: z.string().min(1),
  timeLimitMinutes: z.number().int().positive(),
  status: z.enum(['ACTIVE', 'DRAFT', 'CLOSED']).default('ACTIVE'),
  questions: z.array(questionSchema).min(1),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const { questions, ...rest } = parsed.data;
  const mockTest = await prisma.mockTest.create({
    data: {
      ...rest,
      totalQuestions: questions.length,
      questions,
    },
  });
  return NextResponse.json({ success: true, mockTest });
}
