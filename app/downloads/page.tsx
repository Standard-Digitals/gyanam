import { Suspense } from 'react';
import DownloadsPage from '@/features/downloads/DownloadsPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Free Downloads — GYANAM Academy',
  path: 'downloads',
});

export default function Page() {
  return (
    <Suspense>
      <DownloadsPage />
    </Suspense>
  );
}
