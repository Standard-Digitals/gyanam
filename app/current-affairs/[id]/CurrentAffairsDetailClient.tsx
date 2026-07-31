'use client';
import { CurrentAffairsDetailPage } from '@/features/current-affairs/CurrentAffairsDetailPage';

export default function CurrentAffairsDetailClient({ id }: { id: string }) {
  return <CurrentAffairsDetailPage id={id} />;
}
