'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

interface SubjectStrength {
  subject: string;
  avgAccuracy: number;
  attemptCount: number;
}

const BAR_COLORS = ['#DC2626', '#C12223', '#B4590A', '#E67700', '#127A52', '#0B8792'];

export function MistakesTab() {
  const [subjects, setSubjects] = useState<SubjectStrength[] | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/ai-mentor/mistakes')
      .then((res) => res.json())
      .then((d) => setSubjects(d.subjects ?? []));
  }, []);

  if (subjects === null) return <p className="text-xs text-[#888888] p-4">Loading...</p>;

  if (subjects.length === 0) {
    return (
      <div className="p-6 text-center">
        <Trophy className="w-7 h-7 text-[#D9B4B5] mx-auto mb-2" />
        <p className="text-xs text-[#888888] max-w-[240px] mx-auto">No quiz attempts yet — take a Daily Quiz to see your weak subjects here.</p>
        <Link href="/daily-quiz" className="inline-block mt-3 px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl">
          Take a Quiz
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <p className="text-[11px] text-[#888888] bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl p-3">
        Weakest subjects first, by average quiz accuracy. Question-by-question mistake analysis isn't tracked yet — this is the closest honest picture we have.
      </p>
      <div className="space-y-3">
        {subjects.map((s, i) => (
          <div key={s.subject}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-[#1F1A1C]">{s.subject}</span>
              <span className="font-plexmono font-bold text-[#888888]">{s.avgAccuracy}% · {s.attemptCount} attempt{s.attemptCount === 1 ? '' : 's'}</span>
            </div>
            <div className="h-2 bg-[#F3DCDD] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${s.avgAccuracy}%`, backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
