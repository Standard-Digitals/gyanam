'use client';
import { CourseDetailPage } from '@/features/courses/CourseDetailPage';
import type { Course } from '@/types';

export default function CourseDetailClient({ course, relatedCourses }: { course: Course; relatedCourses: Course[] }) {
  return <CourseDetailPage course={course} relatedCourses={relatedCourses} />;
}
