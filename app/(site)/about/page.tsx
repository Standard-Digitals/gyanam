import { Suspense } from 'react';
import AboutPage from '@/features/about/AboutPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'About Us — GYANAM is a platform to help you find government jobs',
  path: 'about',
});

export default function Page() {
  return (
    <Suspense>
      <AboutPage />
    </Suspense>
  );
}
