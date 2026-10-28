import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/currentUser';
import { getMockTestById } from '@/lib/data/mockTests';

const bodySchema = z.object({
  answers: z.record(z.string(), z.union([z.number(), z.string()])),
  timeTakenSec: z.number().int().nonnegative(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Login required to save your mock test score' }, { status: 401 });
  }

  const { id } = await params;
  const mockTest = await getMockTestById(id);
  if (!mockTest) {
    return NextResponse.json({ error: 'Mock test not found' }, { status: 404 });
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
  // Per-section correct/incorrect, folded into "My Mistakes" subject-strength alongside quiz
  // attempts (previously that view only ever looked at QuizAttempt, so a student who only ever
  // took mock tests saw no data there at all).
  const sectionStats: Record<string, { correct: number; incorrect: number }> = {};
  const bumpSection = (section: string, field: 'correct' | 'incorrect') => {
    const s = (sectionStats[section] ??= { correct: 0, incorrect: 0 });
    s[field]++;
  };
  const logMistake = (q: (typeof mockTest.questions)[number], selectedAnswer: string | null, wasSkipped: boolean) => {
    mistakes.push({
      userId: user.userId,
      source: 'mock',
      sourceId: mockTest.id,
      subject: q.section ?? mockTest.examCategory,
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

  for (const q of mockTest.questions) {
    const selected = answers[String(q.id)];
    const section = q.section ?? mockTest.examCategory;
    const answered = typeof selected === 'string' ? selected.trim().length > 0 : selected !== undefined;
    if (!answered) {
      unattemptedCount++;
      logMistake(q, null, true);
    } else if (q.type === 'fill_blank') {
      const isCorrect = typeof selected === 'string' && selected.trim().toLowerCase() === (q.correctAnswerText ?? '').trim().toLowerCase();
      if (isCorrect) {
        correctCount++;
        bumpSection(section, 'correct');
      } else {
        incorrectCount++;
        bumpSection(section, 'incorrect');
        logMistake(q, String(selected), false);
      }
    } else if (selected === q.correctAnswer) {
      correctCount++;
      bumpSection(section, 'correct');
    } else {
      incorrectCount++;
      bumpSection(section, 'incorrect');
      logMistake(q, String(selected), false);
    }
  }

  const obtainedMarks = Math.max(0, correctCount * 1 - incorrectCount * 0.25);
  const accuracy = correctCount + incorrectCount > 0 ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : 0;

  const attempt = await prisma.mockTestAttempt.create({
    data: {
      userId: user.userId,
      mockTestId: mockTest.id,
      correctCount,
      incorrectCount,
      unattemptedCount,
      obtainedMarks,
      accuracy,
      timeTakenSec,
      sectionStats: Object.keys(sectionStats).length > 0 ? sectionStats : undefined,
    },
  });

  // Best-effort — the score above is already saved, so a failure here must never surface as a
  // failed submission.
  if (mistakes.length > 0) {
    try {
      await prisma.questionMistake.createMany({ data: mistakes });
    } catch (err) {
      console.error('Failed to log question mistakes for mock test attempt', attempt.id, err);
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
      totalMarks: mockTest.totalQuestions,
      submittedAt: attempt.submittedAt,
    },
  });
}
