'use client';
import { CourseDetailPage, type CurriculumChapter } from '@/features/courses/CourseDetailPage';
import type { Course } from '@/types';

interface Props {
  course: Course;
  relatedCourses: Course[];
  curriculum: CurriculumChapter[];
  isEnrolled: boolean;
}

export default function CourseDetailClient({ course, relatedCourses, curriculum, isEnrolled }: Props) {
  return <CourseDetailPage course={course} relatedCourses={relatedCourses} curriculum={curriculum} isEnrolled={isEnrolled} />;
}
