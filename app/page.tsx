import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { SITE } from '@/lib/siteConfig';
import { HomePage } from '@/features/home/HomePage';
import { getAllCourses } from '@/lib/data/courses';

export const metadata: Metadata = buildMetadata({
  title: SITE.tagline,
  path: '',
});

export default async function Page() {
  const courses = await getAllCourses();
  return <HomePage courses={courses} />;
}
