import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  newEnrollments: z.boolean(),
  newLeads: z.boolean(),
  openTickets: z.boolean(),
  pendingOrders: z.boolean(),
});

export async function PATCH(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const prefs = await prisma.notificationPreference.upsert({
    where: { id: 'default' },
    update: parsed.data,
    create: { id: 'default', ...parsed.data },
  });
  return NextResponse.json({ success: true, prefs });
}
