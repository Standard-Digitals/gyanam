'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Users } from 'lucide-react';
import type { Course } from '@/types';

export function CoursesTab() {
  const [courses, setCourses] = useState<Course[] | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/ai-mentor/courses')
      .then((res) => (res.ok ? res.json() : { courses: [] }))
      .then((d) => setCourses(d.courses ?? []))
      .catch(() => setCourses([]));
  }, []);

  if (courses === null) return <p className="text-xs text-[#888888] p-4">Loading...</p>;

  if (courses.length === 0) {
    return <p className="text-xs text-[#888888] p-4">No courses available right now — check back soon.</p>;
  }

  return (
    <div className="p-4 space-y-3">
      <p className="text-[11px] text-[#888888]">Browse everything we offer, right here — tap a card for full details and enrollment.</p>
      {courses.map((course) => (
        <Link
          key={course.id}
          href={`/courses/${course.slug}`}
          className="flex gap-3 bg-white border border-[#F3DCDD] rounded-2xl p-3 hover:border-[#C12223] transition"
        >
          <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-[#FFF5F5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xs font-bold text-[#1F1A1C] leading-snug line-clamp-2">{course.title}</h3>
              {course.badge && (
                <span className="shrink-0 px-1.5 py-0.5 bg-[#FDEAE9] text-[#C12223] text-[9px] font-black rounded uppercase tracking-wide">{course.badge}</span>
              )}
            </div>
            <p className="text-[10px] text-[#888888] mt-0.5">{course.targetExam}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#1F1A1C]">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {course.rating}
              </span>
              <span className="flex items-center gap-0.5 text-[10px] text-[#888888]">
                <Users className="w-3 h-3" /> {course.studentsEnrolled}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xs font-black text-[#C12223]">₹{course.discountPrice}</span>
              {course.originalPrice > course.discountPrice && (
                <span className="text-[10px] text-[#888888] line-through">₹{course.originalPrice}</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
