import { Suspense } from 'react';
import DailyQuizPage from '@/features/daily-quiz/DailyQuizPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Daily Quiz — GYANAM Academy',
  path: 'daily-quiz',
});

export default function Page() {
  return (
    <Suspense>
      <DailyQuizPage />
    </Suspense>
  );
}
