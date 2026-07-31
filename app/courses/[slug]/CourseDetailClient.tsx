'use client';
import { CourseDetailPage } from '@/features/courses/CourseDetailPage';

export default function CourseDetailClient({ slug }: { slug: string }) {
  return <CourseDetailPage courseSlug={slug} />;
}
