import type { Metadata } from 'next';
import Link from 'next/link';
import { Target, Sparkles, TrendingUp } from 'lucide-react';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { buildMetadata } from '@/lib/metadata';
import { getMyProgress, PROGRESS_PARAMS } from '@/lib/data/myProgress';

export const metadata: Metadata = buildMetadata({
  title: 'My Progress',
  path: '/dashboard/my-progress',
  noIndex: true,
});

function ScoreRing({ value }: { value: number | null }) {
  const size = 128;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = clamp(value ?? 0);
  const offset = c - (pct / 100) * c;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F3DCDD" strokeWidth={stroke} />
        {value !== null && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#C12223"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading font-black text-3xl text-[#1F1A1C]">{value ?? '—'}</span>
        <span className="text-[10px] text-[#888888]">out of 100</span>
      </div>
    </div>
  );
}

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}

function ParamBar({ label, help, you, courseMedian, topQuartileMedian }: { label: string; help: string; you: number | null; courseMedian: number | null; topQuartileMedian: number | null }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <span className="font-bold text-sm text-[#1F1A1C]">{label}</span>
          <span className="text-[11px] text-[#888888]"> · {help}</span>
        </div>
        <span className="font-plexmono text-xs font-bold text-[#1F1A1C] shrink-0">{you ?? '—'}</span>
      </div>
      <div className="relative h-2.5 bg-[#F3DCDD] rounded-full mt-1.5 overflow-hidden">
        <div className="h-full bg-[#C12223] rounded-full" style={{ width: `${clamp(you ?? 0)}%` }} />
        {courseMedian !== null && (
          <div className="absolute top-0 bottom-0 w-[2px] bg-[#1F1A1C]/50" style={{ left: `${clamp(courseMedian)}%` }} title={`Course median: ${courseMedian}`} />
        )}
        {topQuartileMedian !== null && (
          <div className="absolute top-0 bottom-0 w-[2px] bg-emerald-600" style={{ left: `${clamp(topQuartileMedian)}%` }} title={`Top 25%: ${topQuartileMedian}`} />
        )}
      </div>
    </div>
  );
}

export default async function MyProgressPage() {
  const user = await getCurrentUserProfile();
  if (!user) return null;

  const firstName = (user.name || 'there').split(' ')[0];
  const data = await getMyProgress(user.id, firstName);

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading font-black text-2xl text-[#1F1A1C]">My Progress</h1>
        <div className="bg-white p-8 rounded-2xl border border-[#F3DCDD] shadow-sm text-center">
          <Target className="w-8 h-8 text-[#D9B4B5] mx-auto mb-2" />
          <p className="text-sm text-[#888888] max-w-sm mx-auto">
            Enroll in a course to see your progress score, compare study habits with your course, and get suggestions based on what top performers do differently.
          </p>
          <Link href="/courses" className="inline-block mt-4 px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  const { courseName, cohortSize, me, cmp, suggestions, summary, weekly, recentAttempts } = data;
  const maxWeekDays = 7;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl text-[#1F1A1C]">My Progress</h1>
        <p className="text-xs text-[#888888] mt-0.5">
          {courseName}
          {cohortSize > 0 ? ` · compared with ${cohortSize} student${cohortSize === 1 ? '' : 's'} in your course` : ''}
        </p>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#F3DCDD] shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <ScoreRing value={me.overall} />
        <div className="space-y-2 text-center sm:text-left">
          {cmp.courseMedianOverall !== null && (
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-[11px]">
              <span className="font-plexmono uppercase tracking-wider text-[#888888]">Course median: <strong className="text-[#1F1A1C]">{cmp.courseMedianOverall}</strong></span>
              {cmp.overallPercentile !== null && (
                <span className="font-plexmono uppercase tracking-wider text-[#888888]">You rank ahead of <strong className="text-[#1F1A1C]">{cmp.overallPercentile}%</strong></span>
              )}
            </div>
          )}
          <p className="flex items-start gap-2 text-sm text-[#555555] bg-[#FFF5F5] px-3.5 py-3 rounded-xl border border-[#F3DCDD]">
            <Sparkles className="w-4 h-4 text-[#C12223] shrink-0 mt-0.5" />
            <span>{summary}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-black text-sm text-[#1F1A1C]">Five parameters</h3>
            <div className="flex items-center gap-3 text-[10px] font-bold text-[#888888]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#C12223]" /> You</span>
              <span className="flex items-center gap-1"><span className="w-[2px] h-2.5 bg-[#1F1A1C]/50" /> Median</span>
              <span className="flex items-center gap-1"><span className="w-[2px] h-2.5 bg-emerald-600" /> Top 25%</span>
            </div>
          </div>
          {PROGRESS_PARAMS.map((p) => {
            const row = cmp.params.find((x) => x.key === p.key)!;
            return <ParamBar key={p.key} label={row.label} help={row.help} you={row.you} courseMedian={row.courseMedian} topQuartileMedian={row.topQuartileMedian} />;
          })}
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-4">
          <h3 className="font-heading font-black text-sm text-[#1F1A1C]">What top students in your course do differently</h3>
          {suggestions.length === 0 ? (
            <p className="text-sm text-[#888888]">Not enough data from your course yet to compare — check back after a few more students take some tests.</p>
          ) : (
            <ol className="space-y-3">
              {suggestions.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-[#FFF5F5] border border-[#F3DCDD] text-[#C12223] text-[10px] font-black flex items-center justify-center mt-0.5">{i + 1}</span>
                  <div>
                    <p className="font-bold text-sm text-[#1F1A1C]">{s.title}</p>
                    <p className="text-xs text-[#555555] mt-0.5">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#F3DCDD] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#C12223]" />
            <h3 className="font-heading font-black text-sm text-[#1F1A1C]">Your last 4 weeks</h3>
          </div>
          <div className="flex items-end justify-between gap-3 h-28">
            {weekly.map((w) => (
              <div key={w.weekLabel} className="flex-1 flex flex-col items-center justify-end gap-1.5">
                <span className="text-[10px] font-plexmono font-bold text-[#888888]">{w.activeDays}/{maxWeekDays}d</span>
                <div
                  className={`w-full rounded-t-md ${w.weekLabel === 'This week' ? 'bg-[#C12223]' : 'bg-[#E8A0A1]'}`}
                  style={{ height: `${Math.max(6, (w.activeDays / maxWeekDays) * 80)}px` }}
                />
                <span className="text-[10px] text-[#888888]">{w.weekLabel}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#F3DCDD] shadow-sm">
          <h3 className="font-heading font-black text-sm text-[#1F1A1C] mb-4">Recent test scores</h3>
          {recentAttempts.length === 0 ? (
            <p className="text-sm text-[#888888]">No quiz or mock test attempts yet.</p>
          ) : (
            <div className="space-y-2.5">
              {recentAttempts.map((a) => (
                <div key={a.date} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-[11px] font-bold text-[#888888]">
                    {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                  <div className="flex-1 h-2.5 bg-[#F3DCDD] rounded-full overflow-hidden">
                    <div className="h-full bg-[#C12223] rounded-full" style={{ width: `${a.accuracy}%` }} />
                  </div>
                  <span className="w-10 shrink-0 text-right text-xs font-plexmono font-bold text-[#1F1A1C]">{a.accuracy}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
