import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getCurrentUserProfile } from '@/lib/currentUser';

export default async function DashboardCoursesPage() {
  const user = await getCurrentUserProfile();
  if (!user) return null;

  const enrollments = await prisma.enrollment.findMany({ where: { userId: user.id }, orderBy: { enrolledAt: 'desc' } });
  const courseIds = enrollments.map((e) => e.courseId);
  const courses = await prisma.course.findMany({ where: { id: { in: courseIds } } });
  const courseMap = new Map(courses.map((c) => [c.id, c]));

  return (
    <div className="space-y-6">
      <h1 className="font-heading font-black text-2xl text-[#1F1A1C]">My Enrolled Courses ({enrollments.length})</h1>
      {enrollments.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-[#F3DCDD] shadow-sm text-center space-y-3">
          <BookOpen className="w-10 h-10 text-[#C12223] mx-auto" />
          <p className="text-sm text-[#555555]">You haven't enrolled in any batch yet.</p>
          <Link href="/courses" className="inline-block px-5 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {enrollments.map((enrollment) => {
            const course = courseMap.get(enrollment.courseId);
            if (!course) return null;
            return (
              <Link
                key={enrollment.id}
                href={`/courses/${course.slug}`}
                className="bg-white p-4 rounded-2xl border border-[#F3DCDD] shadow-sm flex gap-3 hover:border-[#C12223] transition"
              >
                <img src={course.thumbnail} alt={course.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-[#C12223] uppercase">{course.category}</span>
                  <h4 className="font-bold text-sm text-[#1F1A1C] leading-snug">{course.title}</h4>
                  <p className="text-[10px] text-[#888888] mt-1">Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
