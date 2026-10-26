'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Target } from 'lucide-react';
import type { MyProgressResult, BasicProgressResult } from '@/lib/data/myProgress';
import type { SuggestedCourse } from '@/lib/data/aiMentor';

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}

interface ProgressResponse {
  kind: 'full' | 'basic' | 'none';
  data: MyProgressResult | BasicProgressResult | null;
  courseSuggestion?: SuggestedCourse | null;
}

export function ProgressTab({ onBrowseCourses }: { onBrowseCourses?: () => void }) {
  const [resp, setResp] = useState<ProgressResponse | undefined>(undefined);

  useEffect(() => {
    fetch('/api/dashboard/ai-mentor/progress')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => setResp(d && d.kind ? d : { kind: 'none', data: null }))
      .catch(() => setResp({ kind: 'none', data: null }));
  }, []);

  if (resp === undefined) return <p className="text-xs text-[#888888] p-4">Loading...</p>;

  if (resp.kind !== 'full' && resp.kind !== 'basic') {
    return (
      <div className="p-6 text-center">
        <Target className="w-7 h-7 text-[#D9B4B5] mx-auto mb-2" />
        <p className="text-xs text-[#888888] max-w-[240px] mx-auto">Take a free quiz or mock test to start seeing your progress here.</p>
        {onBrowseCourses ? (
          <button onClick={onBrowseCourses} className="inline-block mt-3 px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer">
            Browse Courses
          </button>
        ) : (
          <Link href="/courses" className="inline-block mt-3 px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl">
            Browse Courses
          </Link>
        )}
      </div>
    );
  }

  if (resp.kind === 'basic' && resp.data) {
    const basic = resp.data as BasicProgressResult;
    const course = resp.courseSuggestion;
    return (
      <div className="p-4 space-y-4">
        <div className="bg-white border border-[#F3DCDD] rounded-2xl p-4">
          <p className="text-[10px] font-black text-[#888888] uppercase tracking-wide mb-2">Basic progress · free attempts</p>
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-14 h-14 rounded-full border-4 border-[#F3DCDD] flex items-center justify-center">
              <span className="font-heading font-black text-base text-[#1F1A1C]">{basic.avgAccuracy}%</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#1F1A1C]">{basic.totalAttempts} attempt{basic.totalAttempts === 1 ? '' : 's'} so far</p>
              {basic.weakestSubject && <p className="text-[11px] text-[#888888] mt-0.5">Weakest: {basic.weakestSubject.subject} ({basic.weakestSubject.avgAccuracy}%)</p>}
              {basic.bestSubject && basic.bestSubject.subject !== basic.weakestSubject?.subject && (
                <p className="text-[11px] text-[#888888]">Strongest: {basic.bestSubject.subject} ({basic.bestSubject.avgAccuracy}%)</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl p-3.5">
          <p className="flex items-start gap-2 text-xs text-[#555555]">
            <Sparkles className="w-3.5 h-3.5 text-[#C12223] shrink-0 mt-0.5" />
            <span>This is the basic picture. Enroll in a course for a detailed report — compared with your batch, with a tailored improvement plan.</span>
          </p>
          {course && (
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-[#1F1A1C] truncate">{course.title}</p>
              <Link href={course.href} className="shrink-0 px-3 py-1.5 bg-[#C12223] text-white font-bold text-[11px] rounded-lg">
                Enroll Now
              </Link>
            </div>
          )}
        </div>

        {onBrowseCourses && (
          <button onClick={onBrowseCourses} className="w-full text-center text-xs font-bold text-[#C12223] py-2 cursor-pointer">
            See all courses →
          </button>
        )}
      </div>
    );
  }

  if (!resp.data) {
    return (
      <div className="p-6 text-center">
        <Target className="w-7 h-7 text-[#D9B4B5] mx-auto mb-2" />
        <p className="text-xs text-[#888888] max-w-[240px] mx-auto">Couldn't load your progress — try again.</p>
      </div>
    );
  }

  const data = resp.data as MyProgressResult;
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4 bg-white border border-[#F3DCDD] rounded-2xl p-4">
        <div className="shrink-0 w-16 h-16 rounded-full border-4 border-[#F3DCDD] flex items-center justify-center relative">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: `conic-gradient(#C12223 ${clamp(data.me.overall ?? 0) * 3.6}deg, transparent 0deg)`, mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))' } as React.CSSProperties}
          />
          <span className="font-heading font-black text-lg text-[#1F1A1C]">{data.me.overall ?? '—'}</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#1F1A1C]">{data.courseName}</p>
          {data.cmp.courseMedianOverall !== null && (
            <p className="text-[11px] text-[#888888] mt-0.5">
              Course median {data.cmp.courseMedianOverall}
              {data.cmp.overallPercentile !== null && ` · ahead of ${data.cmp.overallPercentile}%`}
            </p>
          )}
        </div>
      </div>

      <p className="flex items-start gap-2 text-xs text-[#555555] bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl p-3">
        <Sparkles className="w-3.5 h-3.5 text-[#C12223] shrink-0 mt-0.5" />
        <span>{data.summary}</span>
      </p>

      {data.suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-black text-[#888888] uppercase tracking-wide">What top students do differently</p>
          {data.suggestions.slice(0, 3).map((s, i) => (
            <div key={i} className="bg-white border border-[#F3DCDD] rounded-xl p-3">
              <p className="text-xs font-bold text-[#1F1A1C]">{s.title}</p>
              <p className="text-[11px] text-[#555555] mt-0.5">{s.text}</p>
            </div>
          ))}
        </div>
      )}

      <Link href="/dashboard/my-progress" className="block text-center text-xs font-bold text-[#C12223] py-2">
        Open full My Progress page →
      </Link>
    </div>
  );
}
