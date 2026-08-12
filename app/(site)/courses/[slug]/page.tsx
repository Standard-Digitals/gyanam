import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCourseBySlug, getRelatedCourses, getAllCourseSlugs } from '@/lib/data/courses';
import { getCourseCurriculum } from '@/lib/data/curriculum';
import { buildMetadata } from '@/lib/metadata';
import CourseDetailClient from './CourseDetailClient';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    return buildMetadata({ title: 'Course Not Found', noIndex: true });
  }

  return buildMetadata({
    title: course.title,
    description: `Join ${course.title} — ${course.duration}, ${course.lessonsCount} lessons in ${course.language}. Taught by ${course.instructor.name} (${course.instructor.designation}). Enroll now at ₹${course.discountPrice}.`,
    path: `/courses/${course.slug}`,
    image: course.thumbnail,
    keywords: [course.title, course.targetExam, course.category, course.instructor.name],
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();
  const relatedCourses = await getRelatedCourses(course.id);
  const curriculum = await getCourseCurriculum(course.id);
  return <CourseDetailClient course={course} relatedCourses={relatedCourses} curriculum={curriculum} />;
}
