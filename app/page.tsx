import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { SITE } from '@/lib/siteConfig';
import { HomePage } from '@/features/home/HomePage';

export const metadata: Metadata = buildMetadata({
  title: SITE.tagline,
  path: '',
});

export default function Page() {
  return <HomePage />;
}
