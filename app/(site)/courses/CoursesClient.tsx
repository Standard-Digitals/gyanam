'use client';
import { CoursePage } from '@/features/courses/CoursesPage';
import type { Course } from '@/types';

export default function CoursesClient({ courses }: { courses: Course[] }) {
  return <CoursePage courses={courses} />;
}
