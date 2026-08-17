import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/currentUser';

const bodySchema = z.object({ completed: z.boolean() });

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 });
  }

  const { id: topicId } = await params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const topic = await prisma.topic.findUnique({ where: { id: topicId } });
  if (!topic) {
    return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
  }
  const chapter = await prisma.chapter.findUnique({ where: { id: topic.chapterId } });
  if (!chapter) {
    return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.userId, courseId: chapter.courseId } },
  });
  if (!enrollment) {
    return NextResponse.json({ error: 'You are not enrolled in this course' }, { status: 403 });
  }

  if (parsed.data.completed) {
    await prisma.topicProgress.upsert({
      where: { userId_topicId: { userId: session.userId, topicId } },
      update: {},
      create: { userId: session.userId, topicId },
    });
  } else {
    await prisma.topicProgress.deleteMany({ where: { userId: session.userId, topicId } });
  }

  return NextResponse.json({ success: true });
}
