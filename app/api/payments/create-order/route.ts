import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/currentUser';
import { getRazorpayClient, isRazorpayConfigured } from '@/lib/razorpay';

const bodySchema = z.object({
  purpose: z.literal('COURSE_ENROLLMENT'),
  referenceId: z.string().min(1), // courseId
});

export async function POST(req: NextRequest) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: 'Online payments are not live yet. Please try again soon.' }, { status: 503 });
  }

  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { purpose, referenceId } = parsed.data;

  const course = await prisma.course.findUnique({ where: { id: referenceId } });
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.userId, courseId: referenceId } },
  });
  if (existing) {
    return NextResponse.json({ error: 'You are already enrolled in this course' }, { status: 400 });
  }

  const amountPaise = course.discountPrice * 100;
  const razorpay = getRazorpayClient();
  const razorpayOrder = await razorpay.orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt: `course_${referenceId}_${Date.now()}`,
  });

  await prisma.payment.create({
    data: {
      razorpayOrderId: razorpayOrder.id,
      amount: amountPaise,
      purpose,
      referenceId,
      userId: session.userId,
    },
  });

  return NextResponse.json({
    razorpayOrderId: razorpayOrder.id,
    amount: amountPaise,
    currency: 'INR',
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}
