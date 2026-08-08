import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { generateOtp, hashOtp, sendOtpSms, isDevOtpMode, OTP_TTL_MS, OTP_RESEND_COOLDOWN_MS } from '@/lib/otp';

const bodySchema = z.object({
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  purpose: z.enum(['login', 'signup']).default('login'),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const { phone, purpose } = parsed.data;

  const recent = await prisma.otpSession.findFirst({
    where: { phone },
    orderBy: { createdAt: 'desc' },
  });
  if (recent && Date.now() - recent.createdAt.getTime() < OTP_RESEND_COOLDOWN_MS) {
    return NextResponse.json({ error: 'Please wait a few seconds before requesting another OTP' }, { status: 429 });
  }

  const otp = generateOtp();
  await prisma.otpSession.create({
    data: {
      phone,
      otpHash: hashOtp(otp, phone),
      purpose,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  await sendOtpSms(phone, otp);

  return NextResponse.json({
    success: true,
    devMode: isDevOtpMode(),
    ...(isDevOtpMode() ? { devOtp: otp } : {}),
  });
}
