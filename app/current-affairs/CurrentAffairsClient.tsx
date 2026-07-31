'use client';
import { Suspense } from 'react';
import { CurrentAffairsPage } from '@/features/current-affairs/CurrentAffairsPage';

export default function CurrentAffairsClient() {
  return (
    <Suspense>
      <CurrentAffairsPage />
    </Suspense>
  );
}
