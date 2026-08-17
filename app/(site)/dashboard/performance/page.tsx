import type { Metadata } from 'next';
import Link from 'next/link';
import { Trophy, TrendingUp, BarChart3 } from 'lucide-react';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { buildMetadata } from '@/lib/metadata';
import { getUserRank, getScoreTrend, getSubjectStrength } from '@/lib/data/performance';

export const metadata: Metadata = buildMetadata({
  title: 'My Performance',
  path: '/dashboard/performance',
  noIndex: true,
});

const SUBJECT_COLORS = ['#C12223', '#127A52', '#B4590A', '#3B5BDB', '#862E9C', '#0B8792'];

function TrendChart({ points }: { points: { date: string; accuracy: number }[] }) {
  const width = 600;
  const height = 160;
  const padX = 12;
  const padY = 16;

  if (points.length < 2) {
    return (
      <div className="h-40 flex items-center justify-center text-center">
        <p className="text-sm text-[#888888]">Take at least two quizzes or mock tests to see your score trend.</p>
      </div>
    );
  }

  const usableWidth = width - padX * 2;
  const usableHeight = height - padY * 2;
  const coords = points.map((p, i) => {
    const x = padX + (i / (points.length - 1)) * usableWidth;
    const y = padY + usableHeight - (p.accuracy / 100) * usableHeight;
    return { x, y };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${height - padY} L ${coords[0].x.toFixed(1)} ${height - padY} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40" preserveAspectRatio="none">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C12223" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#C12223" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#trendFill)" />
      <path d={linePath} fill="none" stroke="#C12223" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r="3.5" fill="#C12223" stroke="white" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

export default async function PerformancePage() {
  const user = await getCurrentUserProfile();
  if (!user) return null;

  const [rankInfo, trend, subjectStrength] = await Promise.all([
    getUserRank(user.id),
    getScoreTrend(user.id),
    getSubjectStrength(user.id),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-heading font-black text-2xl text-[#1F1A1C]">My Performance</h1>

      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-white/10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-plexmono text-[11px] uppercase tracking-wider text-white/60">All-India Rank</p>
            {rankInfo.rank !== null ? (
              <>
                <p className="font-heading font-black text-3xl sm:text-4xl mt-1">{rankInfo.rank.toLocaleString()}</p>
                <p className="text-xs text-white/60 mt-1">out of {rankInfo.totalTestTakers.toLocaleString()} test takers</p>
              </>
            ) : (
              <p className="text-sm text-white/70 mt-2 max-w-sm">
                Take a quiz or mock test to get ranked against other aspirants on the platform.
              </p>
            )}
          </div>
          {rankInfo.percentileTop !== null && (
            <span className="px-3 py-1.5 bg-amber-400 text-red-950 font-black text-[11px] uppercase rounded-full shrink-0">
              Top {rankInfo.percentileTop}%
            </span>
          )}
        </div>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#F3DCDD] shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[#C12223]" />
          <h3 className="font-heading font-black text-sm text-[#1F1A1C]">Score trend</h3>
        </div>
        <TrendChart points={trend} />
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#F3DCDD] shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-[#C12223]" />
          <h3 className="font-heading font-black text-sm text-[#1F1A1C]">Subject-wise strength</h3>
        </div>
        {subjectStrength.length === 0 ? (
          <div className="py-6 text-center">
            <Trophy className="w-8 h-8 text-[#D9B4B5] mx-auto mb-2" />
            <p className="text-sm text-[#888888]">No quiz attempts yet. Take a Daily Quiz to see your subject-wise strength here.</p>
            <Link href="/daily-quiz" className="inline-block mt-3 px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl">
              Take a Quiz
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {subjectStrength.map((s, i) => (
              <div key={s.subject} className="flex items-center gap-3">
                <span className="w-32 sm:w-40 shrink-0 text-xs font-bold text-[#1F1A1C] truncate">{s.subject}</span>
                <div className="flex-1 h-2.5 bg-[#F3DCDD] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${s.avgAccuracy}%`, backgroundColor: SUBJECT_COLORS[i % SUBJECT_COLORS.length] }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-xs font-plexmono font-bold text-[#888888]">{s.avgAccuracy}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
