import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { getAllCurrentAffairs } from '@/lib/data/currentAffairs';
import { getDailyQuizWidgetQuestions } from '@/lib/data/dailyQuizWidget';
import { getAllFreeResources } from '@/lib/data/resources';
import CurrentAffairsClient from './CurrentAffairsClient';

export const metadata: Metadata = buildMetadata({
  title: 'Daily Current Affairs & Editorial Digest',
  description:
    'Daily current affairs, news analysis, Assam & NE special CA, 5-MCQ live tests, and free monthly PDF booklets for SSC, Banking, UPSC, and State Govt exam aspirants.',
  path: '/current-affairs',
});

export default async function Page() {
  const [items, quizQuestions, resources] = await Promise.all([
    getAllCurrentAffairs(),
    getDailyQuizWidgetQuestions(),
    getAllFreeResources(),
  ]);
  return <CurrentAffairsClient items={items} quizQuestions={quizQuestions} resources={resources} />;
}
