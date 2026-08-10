'use client';
import { CurrentAffairsDetailPage } from '@/features/current-affairs/CurrentAffairsDetailPage';
import type { CurrentAffairItem } from '@/types';

interface Props {
  article: CurrentAffairItem;
  otherArticles: CurrentAffairItem[];
}

export default function CurrentAffairsDetailClient({ article, otherArticles }: Props) {
  return <CurrentAffairsDetailPage article={article} otherArticles={otherArticles} />;
}
