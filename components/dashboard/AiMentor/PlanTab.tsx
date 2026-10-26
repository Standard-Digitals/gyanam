'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight, GraduationCap, CheckCircle2 } from 'lucide-react';
import type { MentorOverview } from '@/lib/data/aiMentor';

export function PlanTab({ onTalkToCounsellor, onBrowseCourses }: { onTalkToCounsellor?: () => void; onBrowseCourses?: () => void }) {
  const [data, setData] = useState<MentorOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/ai-mentor/plan')
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-xs text-[#888888] p-4">Loading...</p>;
  if (!data) return <p className="text-xs text-[#888888] p-4">Couldn't load your plan — try again.</p>;

  if (data.mode === 'counsellor') {
    return (
      <div className="p-4 space-y-4">
        {data.courseSuggestion ? (
          <div className="bg-white p-4 rounded-2xl border border-[#F3DCDD]">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-[#C12223]" />
              <p className="text-[10px] font-black text-[#C12223] uppercase tracking-wide">Suggested by Gyanmitra · Premium batch</p>
            </div>
            <h3 className="font-heading font-black text-sm text-[#1F1A1C] mb-1">{data.courseSuggestion.title}</h3>
            <p className="text-xs mb-2">
              <span className="font-black text-[#C12223]">₹{data.courseSuggestion.discountPrice}</span>{' '}
              {data.courseSuggestion.originalPrice > data.courseSuggestion.discountPrice && (
                <span className="text-[#888888] line-through">₹{data.courseSuggestion.originalPrice}</span>
              )}
            </p>
            <ul className="space-y-1.5 mb-3">
              {data.courseSuggestion.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#555555]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              <Link href={data.courseSuggestion.href} className="inline-block px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl">
                Enroll Now
              </Link>
              {onTalkToCounsellor && (
                <button
                  onClick={onTalkToCounsellor}
                  className="inline-block px-4 py-2 bg-[#FDEAE9] text-[#C12223] font-bold text-xs rounded-xl cursor-pointer"
                >
                  Talk to a Counsellor
                </button>
              )}
            </div>
          </div>
        ) : onBrowseCourses ? (
          <div className="space-y-2">
            <p className="text-xs text-[#888888]">You're not enrolled in a course yet.</p>
            <button onClick={onBrowseCourses} className="px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer">
              Browse Courses
            </button>
          </div>
        ) : (
          <p className="text-xs text-[#888888]">You're not enrolled in a course yet — browse courses to get started.</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {data.banner && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5">
          <p className="text-[10px] font-black text-amber-700 uppercase tracking-wide">Waiting for you</p>
          <p className="text-sm font-bold text-[#1F1A1C] mt-0.5">{data.banner.title}</p>
          <p className="text-xs text-[#555555] mt-0.5">{data.banner.body}</p>
        </div>
      )}
      {data.plan.length === 0 ? (
        <p className="text-xs text-[#888888]">Nothing left for today — nicely done.</p>
      ) : (
        <div className="space-y-2">
          {data.plan.map((item, i) => (
            <Link key={i} href={item.href} className="flex items-center gap-3 bg-white border border-[#F3DCDD] rounded-xl p-3 hover:border-[#C12223] transition">
              <div className="w-7 h-7 rounded-lg bg-[#FDEAE9] text-[#C12223] flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#1F1A1C] truncate">{item.title}</p>
                <p className="text-[11px] text-[#888888]">{item.meta}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C12223] shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
