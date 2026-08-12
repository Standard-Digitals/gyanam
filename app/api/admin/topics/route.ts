import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  chapterId: z.string().min(1),
  title: z.string().min(1),
  order: z.number().int().default(0),
  videoType: z.enum(['youtube', 'upload']),
  videoUrl: z.string().optional(),
  duration: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const topic = await prisma.topic.create({ data: parsed.data });
  return NextResponse.json({ success: true, topic });
}
