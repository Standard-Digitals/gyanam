import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['super', 'editor', 'course_manager']),
});

function generateTempPassword(): string {
  return crypto.randomBytes(9).toString('base64url');
}

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const existing = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: 'An admin with this email already exists' }, { status: 409 });
  }
  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 10);
  const admin = await prisma.adminUser.create({
    data: { ...parsed.data, passwordHash },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json({ success: true, admin, tempPassword });
}
