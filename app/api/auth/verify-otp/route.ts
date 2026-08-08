import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashOtp, OTP_MAX_ATTEMPTS } from '@/lib/otp';
import { createSessionToken, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from '@/lib/session';

const bodySchema = z.object({
  phone: z.string().regex(/^\d{10}$/),
  otp: z.string().length(4),
  purpose: z.enum(['login', 'signup']).default('login'),
  name: z.string().optional(),
  targetExam: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const { phone, otp, purpose, name, targetExam } = parsed.data;

  const session = await prisma.otpSession.findFirst({
    where: { phone, purpose, verified: false },
    orderBy: { createdAt: 'desc' },
  });

  if (!session) {
    return NextResponse.json({ error: 'No active OTP request found. Please request a new OTP.' }, { status: 400 });
  }
  if (session.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
  }
  if (session.attempts >= OTP_MAX_ATTEMPTS) {
    return NextResponse.json({ error: 'Too many incorrect attempts. Please request a new OTP.' }, { status: 429 });
  }

  if (session.otpHash !== hashOtp(otp, phone)) {
    await prisma.otpSession.update({ where: { id: session.id }, data: { attempts: { increment: 1 } } });
    return NextResponse.json({ error: 'Incorrect OTP' }, { status: 400 });
  }

  await prisma.otpSession.update({ where: { id: session.id }, data: { verified: true } });

  const user = await prisma.user.upsert({
    where: { phone },
    update: { ...(name ? { name } : {}), ...(targetExam ? { targetExam } : {}) },
    create: { phone, name, targetExam },
  });

  const token = await createSessionToken({ userId: user.id, phone: user.phone });

  const response = NextResponse.json({
    success: true,
    user: { id: user.id, phone: user.phone, name: user.name, targetExam: user.targetExam },
  });
  response.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return response;
}
