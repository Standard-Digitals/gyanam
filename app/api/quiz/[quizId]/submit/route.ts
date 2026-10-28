import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/currentUser';
import { getQuizById } from '@/lib/data/quizzes';

const bodySchema = z.object({
  answers: z.record(z.string(), z.union([z.number(), z.string()])),
  timeTakenSec: z.number().int().nonnegative(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ quizId: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Login required to save your quiz score' }, { status: 401 });
  }

  const { quizId } = await params;
  const quiz = await getQuizById(quizId);
  if (!quiz) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const { answers, timeTakenSec } = parsed.data;

  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;
  const mistakes: Prisma.QuestionMistakeCreateManyInput[] = [];
  const logMistake = (q: (typeof quiz.questions)[number], selectedAnswer: string | null, wasSkipped: boolean) => {
    mistakes.push({
      userId: user.userId,
      source: 'quiz',
      sourceId: quiz.id,
      subject: quiz.subject,
      questionId: q.id,
      questionText: q.question,
      options: q.options,
      correctAnswer: q.type === 'fill_blank' ? null : q.correctAnswer,
      correctAnswerText: q.correctAnswerText ?? null,
      selectedAnswer,
      wasSkipped,
      explanation: q.explanation,
    });
  };

  for (const q of quiz.questions) {
    const selected = answers[String(q.id)];
    const answered = typeof selected === 'string' ? selected.trim().length > 0 : selected !== undefined;
    if (!answered) {
      unattemptedCount++;
      logMistake(q, null, true);
    } else if (q.type === 'fill_blank') {
      const isCorrect = typeof selected === 'string' && selected.trim().toLowerCase() === (q.correctAnswerText ?? '').trim().toLowerCase();
      if (isCorrect) correctCount++;
      else {
        incorrectCount++;
        logMistake(q, String(selected), false);
      }
    } else if (selected === q.correctAnswer) {
      correctCount++;
    } else {
      incorrectCount++;
      logMistake(q, String(selected), false);
    }
  }

  const obtainedMarks = Math.max(0, correctCount * 1 - incorrectCount * 0.25);
  const accuracy = correctCount + incorrectCount > 0 ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : 0;

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: user.userId,
      quizId: quiz.id,
      correctCount,
      incorrectCount,
      unattemptedCount,
      obtainedMarks,
      accuracy,
      timeTakenSec,
    },
  });

  // Best-effort — the score above is already saved, so a failure here must never surface as a
  // failed submission.
  if (mistakes.length > 0) {
    try {
      await prisma.questionMistake.createMany({ data: mistakes });
    } catch (err) {
      console.error('Failed to log question mistakes for quiz attempt', attempt.id, err);
    }
  }

  return NextResponse.json({
    success: true,
    result: {
      correctCount,
      incorrectCount,
      unattemptedCount,
      obtainedMarks,
      accuracy,
      totalMarks: quiz.totalQuestions,
      submittedAt: attempt.submittedAt,
    },
  });
}
