import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  academyName: z.string().min(1),
  tagline: z.string().min(1),
  supportEmail: z.string().email(),
  supportPhone: z.string().min(1),
  ogDescription: z.string().min(1),
});

export async function PATCH(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: parsed.data,
    create: { id: 'default', ...parsed.data },
  });
  return NextResponse.json({ success: true, settings });
}
