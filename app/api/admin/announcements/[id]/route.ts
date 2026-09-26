import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  badge: z.string().min(1),
  message: z.string().min(1),
  link: z.string().optional(),
  isActive: z.boolean().optional(),
});

const orderSchema = z.object({
  order: z.number().int(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);

  // Reorder-only request (swapping with a neighbor) sends just `order`.
  const orderParsed = orderSchema.safeParse(body);
  if (orderParsed.success && Object.keys(body).length === 1) {
    const banner = await prisma.announcementBanner.update({ where: { id }, data: orderParsed.data });
    return NextResponse.json({ success: true, banner });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const banner = await prisma.announcementBanner.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ success: true, banner });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.announcementBanner.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
