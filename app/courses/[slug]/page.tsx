import type { Metadata } from 'next';
import { COURSES_DATA } from '@/data/mockData';
import { buildMetadata } from '@/lib/metadata';
import CourseDetailClient from './CourseDetailClient';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return COURSES_DATA.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = COURSES_DATA.find((c) => c.slug === slug);

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
  return <CourseDetailClient slug={slug} />;
}
