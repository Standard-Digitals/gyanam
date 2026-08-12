import { Suspense } from 'react';
import HelpdeskFAQPage from '@/features/faq/HelpdeskFAQPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Helpdesk & FAQ — GYANM Academy',
  path: 'faq',
});

export default function Page() {
  return (
    <Suspense>
      <HelpdeskFAQPage />
    </Suspense>
  );
}
