import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import CurrentAffairsClient from './CurrentAffairsClient';

export const metadata: Metadata = buildMetadata({
  title: 'Daily Current Affairs & Editorial Digest',
  description:
    'Daily current affairs, news analysis, Assam & NE special CA, 5-MCQ live tests, and free monthly PDF booklets for SSC, Banking, UPSC, and State Govt exam aspirants.',
  path: '/current-affairs',
});

export default function Page() {
  return <CurrentAffairsClient />;
}
