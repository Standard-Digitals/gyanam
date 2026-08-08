import { createHmac, randomInt } from 'crypto';

export const OTP_TTL_MS = 5 * 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_MS = 30 * 1000;

export function generateOtp(): string {
  return String(randomInt(0, 10000)).padStart(4, '0');
}

export function hashOtp(otp: string, phone: string): string {
  const secret = process.env.OTP_SECRET || process.env.JWT_SECRET || 'dev-otp-secret';
  return createHmac('sha256', secret).update(`${phone}:${otp}`).digest('hex');
}

export function isDevOtpMode(): boolean {
  return process.env.SMS_PROVIDER !== 'msg91' && process.env.SMS_PROVIDER !== '2factor';
}

export async function sendOtpSms(phone: string, otp: string): Promise<void> {
  if (isDevOtpMode()) {
    console.log(`[DEV OTP] Phone +91${phone} -> OTP: ${otp}`);
    return;
  }
  throw new Error('Real SMS provider not configured yet. Set SMS_PROVIDER and provider credentials in .env.local');
}
