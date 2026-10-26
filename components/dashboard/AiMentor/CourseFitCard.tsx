import Link from 'next/link';
import { GraduationCap, CheckCircle2 } from 'lucide-react';

export function CourseFitCard({ course }: { course: { title: string; href: string; reasons: string[] } }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <GraduationCap className="w-4 h-4 text-[#C12223]" />
        <p className="text-[10px] font-black text-[#C12223] uppercase tracking-wide">Suggested by Gyanmitra</p>
      </div>
      <h3 className="font-heading font-black text-base text-[#1F1A1C] mb-2">{course.title}</h3>
      <ul className="space-y-1.5 mb-4">
        {course.reasons.map((r, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-[#555555]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{r}</span>
          </li>
        ))}
      </ul>
      <Link href={course.href} className="inline-block px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl">
        View Course
      </Link>
    </div>
  );
}
