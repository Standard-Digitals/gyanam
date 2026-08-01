import { Suspense } from 'react';
import ContactPage from '@/features/contact/ContactPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Contact Us — GYANAM Academy',
  path: 'contact',
});

export default function Page() {
  return (
    <Suspense>
      <ContactPage />
    </Suspense>
  );
}
