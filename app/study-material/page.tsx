import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { Suspense } from 'react';
import { StudyMaterialPage } from '@/features/study-saterial/StudyMaterialPage';

export const metadata: Metadata = buildMetadata({
  title: 'Free Study Material, Notes & PYQ Papers',
  path: '/study-material',
});

export default function Page() {
  return (
    <Suspense>
      <StudyMaterialPage />
    </Suspense>
  );
}
