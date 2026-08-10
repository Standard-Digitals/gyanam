import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { getAllCourses } from '@/lib/data/courses';
import CoursesClient from './CoursesClient';

export const metadata: Metadata = buildMetadata({
  title: 'Government Exam Courses',
  description:
    'Explore top-rated courses for SSC CGL, IBPS PO, SBI PO, RRB NTPC, UPSC CSE, Assam ADRE and more. Live classes, mock tests & expert mentorship — all in one platform.',
  path: '/courses',
  keywords: ['SSC CGL 2026', 'IBPS PO coaching', 'UPSC foundation batch', 'Assam ADRE preparation', 'RRB NTPC online course'],
});

export default async function Page() {
  const courses = await getAllCourses();
  return <CoursesClient courses={courses} />;
}
