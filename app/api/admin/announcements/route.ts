import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  badge: z.string().min(1),
  message: z.string().min(1),
  link: z.string().optional(),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const banners = await prisma.announcementBanner.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ banners });
}

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const maxOrder = await prisma.announcementBanner.aggregate({ _max: { order: true } });
  const banner = await prisma.announcementBanner.create({
    data: { ...parsed.data, order: (maxOrder._max.order ?? -1) + 1 },
  });
  return NextResponse.json({ success: true, banner });
}
