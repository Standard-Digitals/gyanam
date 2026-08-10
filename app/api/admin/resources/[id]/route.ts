import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1),
  category: z.string().min(1),
  fileSize: z.string().min(1),
  rating: z.number().min(0).max(5),
  description: z.string().min(1),
  targetExams: z.array(z.string()).default([]),
  isHot: z.boolean().default(false),
  inStock: z.boolean().default(true),
  price: z.number().optional(),
  originalPrice: z.number().optional(),
  author: z.string().optional(),
  badge: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const resource = await prisma.freeResource.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ success: true, resource });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.freeResource.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
