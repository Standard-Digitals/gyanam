import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/adminSession';

const bodySchema = z.object({
  role: z.enum(['super', 'editor', 'course_manager']),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const admin = await prisma.adminUser.update({
    where: { id },
    data: { role: parsed.data.role },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json({ success: true, admin });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const currentAdmin = await getCurrentAdmin();
  if (currentAdmin?.adminId === id) {
    return NextResponse.json({ error: 'You cannot remove your own account' }, { status: 400 });
  }
  const totalAdmins = await prisma.adminUser.count();
  if (totalAdmins <= 1) {
    return NextResponse.json({ error: 'Cannot remove the last remaining admin' }, { status: 400 });
  }
  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
