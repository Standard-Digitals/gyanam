import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { Suspense } from 'react';
import { StudyMaterialPage } from '@/features/study-saterial/StudyMaterialPage';
import { getAllFreeResources } from '@/lib/data/resources';

export const metadata: Metadata = buildMetadata({
  title: 'Free Study Material, Notes & PYQ Papers',
  path: '/study-material',
});

export default async function Page() {
  const resources = await getAllFreeResources();
  return (
    <Suspense>
      <StudyMaterialPage resources={resources} />
    </Suspense>
  );
}
