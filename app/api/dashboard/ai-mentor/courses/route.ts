import { NextResponse } from 'next/server';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { getAllCourses } from '@/lib/data/courses';

export async function GET() {
  const user = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const courses = await getAllCourses();
  return NextResponse.json({ courses });
}
