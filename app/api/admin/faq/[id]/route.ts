import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  category: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  linkUrl: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const faq = await prisma.fAQItem.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ success: true, faq });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.fAQItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
