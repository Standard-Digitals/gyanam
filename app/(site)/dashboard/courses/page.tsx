import Link from 'next/link';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { getCourseProgressMap } from '@/lib/data/courseProgress';

export default async function DashboardCoursesPage() {
  const user = await getCurrentUserProfile();
  if (!user) return null;

  const enrollments = await prisma.enrollment.findMany({ where: { userId: user.id }, orderBy: { enrolledAt: 'desc' } });
  const courseIds = enrollments.map((e) => e.courseId);
  const [courses, progressMap] = await Promise.all([
    prisma.course.findMany({ where: { id: { in: courseIds } } }),
    getCourseProgressMap(user.id, courseIds),
  ]);
  const courseMap = new Map(courses.map((c) => [c.id, c]));

  return (
    <div className="space-y-6">
      <h1 className="font-heading font-black text-2xl text-[#1F1A1C]">My Enrolled Courses ({enrollments.length})</h1>
      {enrollments.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-[#F3DCDD] shadow-sm text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FDEAE9] text-[#C12223] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <p className="text-sm text-[#555555]">You haven&apos;t enrolled in any batch yet.</p>
          <Link href="/courses" className="inline-block px-5 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl hover:bg-[#A81C1D] transition">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map((enrollment) => {
            const course = courseMap.get(enrollment.courseId);
            if (!course) return null;
            const progress = progressMap.get(course.id) ?? { total: 0, completedCount: 0, percent: 0, nextTopicId: null };
            const href = `/dashboard/courses/${course.slug}${progress.nextTopicId ? `?topic=${progress.nextTopicId}` : ''}`;
            return (
              <Link
                key={enrollment.id}
                href={href}
                className="group bg-white rounded-2xl border border-[#F3DCDD] shadow-sm overflow-hidden hover:border-[#C12223] hover:shadow-md transition"
              >
                <div className="h-32 bg-cover bg-center relative" style={{ backgroundImage: `url(${course.thumbnail})` }}>
                  <span className="absolute top-3 left-3 bg-white/95 text-[#C12223] font-plexmono font-bold text-[10px] uppercase px-2.5 py-1 rounded-full">
                    {course.category}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-heading font-black text-sm text-[#1F1A1C] leading-snug line-clamp-2">{course.title}</h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-[#888888]">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {progress.total} {progress.total === 1 ? 'lesson' : 'lessons'}
                    </span>
                    <span>Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  {progress.total > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex-1 h-1.5 bg-[#F3DCDD] rounded-full overflow-hidden">
                        <div className="h-full bg-[#C12223] rounded-full" style={{ width: `${progress.percent}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-[#888888] font-plexmono shrink-0">{progress.percent}%</span>
                    </div>
                  )}
                  <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-[#C12223] group-hover:gap-2.5 transition-all">
                    {progress.completedCount > 0 ? 'Continue learning' : 'Start learning'} <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
