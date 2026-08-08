import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { Course } from '@/types';
import type { Course as PrismaCourse } from '@prisma/client';

function mapCourse(c: PrismaCourse): Course {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    category: c.category as Course['category'],
    targetExam: c.targetExam,
    badge: c.badge ?? undefined,
    rating: c.rating,
    reviewsCount: c.reviewsCount,
    studentsEnrolled: c.studentsEnrolled,
    instructor: c.instructor as Course['instructor'],
    duration: c.duration,
    lessonsCount: c.lessonsCount,
    language: c.language as Course['language'],
    originalPrice: c.originalPrice,
    discountPrice: c.discountPrice,
    features: c.features,
    thumbnail: c.thumbnail,
    popular: c.popular,
    syllabusOverview: c.syllabusOverview as Course['syllabusOverview'],
    startDate: c.startDate,
  };
}

export const getAllCourses = cache(async (): Promise<Course[]> => {
  const courses = await prisma.course.findMany({ orderBy: { createdAt: 'asc' } });
  return courses.map(mapCourse);
});

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const course = await prisma.course.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
  });
  return course ? mapCourse(course) : null;
}

export async function getRelatedCourses(excludeId: string, limit = 3): Promise<Course[]> {
  const courses = await prisma.course.findMany({
    where: { id: { not: excludeId } },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });
  return courses.map(mapCourse);
}

export async function getAllCourseSlugs(): Promise<string[]> {
  const courses = await prisma.course.findMany({ select: { slug: true } });
  return courses.map((c) => c.slug);
}
