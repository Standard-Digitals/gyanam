import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  targetExam: z.string().min(1),
  badge: z.string().optional(),
  rating: z.number().min(0).max(5),
  reviewsCount: z.number().int().nonnegative(),
  studentsEnrolled: z.number().int().nonnegative(),
  instructor: z.object({ name: z.string(), designation: z.string(), avatar: z.string() }),
  duration: z.string().min(1),
  lessonsCount: z.number().int().nonnegative(),
  language: z.string().min(1),
  originalPrice: z.number().int().nonnegative(),
  discountPrice: z.number().int().nonnegative(),
  features: z.array(z.string()).default([]),
  thumbnail: z.string().min(1),
  popular: z.boolean().default(false),
  syllabusOverview: z.array(z.object({ module: z.string(), topics: z.array(z.string()) })).default([]),
  startDate: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const course = await prisma.course.create({ data: parsed.data });
  return NextResponse.json({ success: true, course });
}
