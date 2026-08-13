import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHmac } from 'crypto';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/currentUser';

const bodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: razorpay_order_id } });
  if (!payment || payment.userId !== session.userId) {
    return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Payments are not configured yet' }, { status: 500 });
  }

  const expectedSignature = createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } });
    return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: 'PAID', razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature },
  });

  if (payment.purpose === 'COURSE_ENROLLMENT') {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: payment.userId, courseId: payment.referenceId } },
      update: { paymentType: 'PAID', status: 'ACTIVE' },
      create: { userId: payment.userId, courseId: payment.referenceId, paymentType: 'PAID' },
    });
  } else if (payment.purpose === 'BOOKSTORE_ORDER') {
    await prisma.order.update({
      where: { id: payment.referenceId },
      data: { paymentStatus: 'PAID' },
    });
  }

  return NextResponse.json({ success: true, purpose: payment.purpose, referenceId: payment.referenceId });
}
