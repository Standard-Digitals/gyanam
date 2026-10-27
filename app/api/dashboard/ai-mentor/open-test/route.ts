import { NextResponse } from 'next/server';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { prisma } from '@/lib/prisma';
import { findAnyOpenTest } from '@/lib/data/aiMentor';

/**
 * Backs the chat's "Test" tab — finds the same open quiz/mock test `findAnyOpenTest` already
 * surfaces in chat replies, and hands back its full question set so the tab can run it in place.
 * Submission still goes through the existing /api/quiz/[id]/submit or /api/mock-tests/[id]/submit
 * routes (submitUrl below), so scoring, QuizAttempt/MockTestAttempt rows, streak and leaderboard
 * all stay identical to an attempt taken on the dashboard — nothing new to keep in sync.
 */
export async function GET() {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const enrollments = await prisma.enrollment.findMany({ where: { userId: user.id, status: 'ACTIVE' }, select: { courseId: true } });
  const open = await findAnyOpenTest(user.id, enrollments.map((e) => e.courseId));
  if (!open) return NextResponse.json({ kind: null });

  if (open.kind === 'quiz') {
    const quiz = await prisma.quiz.findUnique({
      where: { id: open.id },
      select: { id: true, title: true, timeLimitMinutes: true, questions: true },
    });
    if (!quiz) return NextResponse.json({ kind: null });
    return NextResponse.json({
      kind: 'quiz',
      id: quiz.id,
      title: quiz.title,
      timeLimitMinutes: quiz.timeLimitMinutes,
      questions: quiz.questions,
      submitUrl: `/api/quiz/${quiz.id}/submit`,
    });
  }

  const mock = await prisma.mockTest.findUnique({
    where: { id: open.id },
    select: { id: true, title: true, timeLimitMinutes: true, questions: true },
  });
  if (!mock) return NextResponse.json({ kind: null });
  return NextResponse.json({
    kind: 'mock',
    id: mock.id,
    title: mock.title,
    timeLimitMinutes: mock.timeLimitMinutes,
    questions: mock.questions,
    submitUrl: `/api/mock-tests/${mock.id}/submit`,
  });
}
