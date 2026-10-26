'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Target } from 'lucide-react';
import type { MyProgressResult } from '@/lib/data/myProgress';

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}

export function ProgressTab() {
  const [data, setData] = useState<MyProgressResult | null | undefined>(undefined);

  useEffect(() => {
    fetch('/api/dashboard/ai-mentor/progress')
      .then((res) => res.json())
      .then((d) => setData(d.data ?? null));
  }, []);

  if (data === undefined) return <p className="text-xs text-[#888888] p-4">Loading...</p>;

  if (data === null) {
    return (
      <div className="p-6 text-center">
        <Target className="w-7 h-7 text-[#D9B4B5] mx-auto mb-2" />
        <p className="text-xs text-[#888888] max-w-[240px] mx-auto">Enroll in a course to see your progress score and compare with your batch.</p>
        <Link href="/courses" className="inline-block mt-3 px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl">
          Browse Courses
        </Link>
      </div>
    );
  }

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
