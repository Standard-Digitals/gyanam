import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/currentUser';

const bodySchema = z.object({
  courseId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'Login required to enroll' }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { courseId } = parsed.data;

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  const enrollment = await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: session.userId, courseId } },
    update: {},
    create: { userId: session.userId, courseId, paymentType: 'FREE' },
  });

  return NextResponse.json({ success: true, enrollment });
}
