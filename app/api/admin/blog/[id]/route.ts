import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  date: z.string().min(1),
  readTime: z.string().min(1),
  author: z.string().min(1),
  excerpt: z.string().min(1),
  imageUrl: z.string().min(1),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const post = await prisma.blogPost.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ success: true, post });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
