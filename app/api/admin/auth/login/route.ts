import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createAdminSessionToken, ADMIN_SESSION_COOKIE, getAdminSessionCookieOptions } from '@/lib/adminSession';
import { isHttpsRequest } from '@/lib/isHttps';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const token = await createAdminSessionToken({ adminId: admin.id, email: admin.email, role: admin.role });

  const response = NextResponse.json({ success: true, admin: { email: admin.email, name: admin.name, role: admin.role } });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, getAdminSessionCookieOptions(isHttpsRequest(req)));
  return response;
}
