import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  email: z.string().email().optional().or(z.literal('')),
  targetExam: z.string().optional(),
  mode: z.string().optional(),
  center: z.string().optional(),
  message: z.string().optional(),
  source: z.enum(['HERO_QUERY', 'CONTACT_FORM', 'MENTORSHIP']),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const { email, ...rest } = parsed.data;

  const lead = await prisma.lead.create({
    data: { ...rest, email: email || undefined },
  });

  return NextResponse.json({ success: true, refId: `GYN-${lead.id.slice(-6).toUpperCase()}` });
}
