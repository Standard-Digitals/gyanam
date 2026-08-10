'use client';
import { Suspense } from 'react';
import { CurrentAffairsPage } from '@/features/current-affairs/CurrentAffairsPage';
import type { CurrentAffairItem, DailyQuizQuestion, FreeResource } from '@/types';

interface Props {
  items: CurrentAffairItem[];
  quizQuestions: DailyQuizQuestion[];
  resources: FreeResource[];
}

export default function CurrentAffairsClient({ items, quizQuestions, resources }: Props) {
  return (
    <Suspense>
      <CurrentAffairsPage items={items} quizQuestions={quizQuestions} resources={resources} />
    </Suspense>
  );
}
