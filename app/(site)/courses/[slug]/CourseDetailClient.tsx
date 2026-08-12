'use client';
import { CourseDetailPage, type CurriculumChapter } from '@/features/courses/CourseDetailPage';
import type { Course } from '@/types';

interface Props {
  course: Course;
  relatedCourses: Course[];
  curriculum: CurriculumChapter[];
}

export default function CourseDetailClient({ course, relatedCourses, curriculum }: Props) {
  return <CourseDetailPage course={course} relatedCourses={relatedCourses} curriculum={curriculum} />;
}
