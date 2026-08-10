import { Suspense } from 'react';
import DailyQuizPage from '@/features/daily-quiz/DailyQuizPage';
import { buildMetadata } from '@/lib/metadata';
import { getAllQuizzes } from '@/lib/data/quizzes';

export const metadata = buildMetadata({
  title: 'Daily Quiz — GYANAM Academy',
  path: 'daily-quiz',
});

export default async function Page() {
  const quizzes = await getAllQuizzes();
  return (
    <Suspense>
      <DailyQuizPage quizzes={quizzes} />
    </Suspense>
  );
}
