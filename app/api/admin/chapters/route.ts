import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(1),
  order: z.number().int().default(0),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const chapter = await prisma.chapter.create({ data: parsed.data });
  return NextResponse.json({ success: true, chapter });
}
