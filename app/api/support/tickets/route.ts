import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  studentName: z.string().min(1),
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  email: z.string().email().optional().or(z.literal('')),
  rollNoOrOrderId: z.string().optional(),
  category: z.string().min(1),
  urgency: z.string().min(1),
  description: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const { email, ...rest } = parsed.data;
  const ticketNumber = 'GY-TK-' + Math.floor(100000 + Math.random() * 900000);

  const ticket = await prisma.supportTicket.create({
    data: { ...rest, email: email || undefined, ticketNumber },
  });

  return NextResponse.json({ success: true, ticketNumber: ticket.ticketNumber });
}
