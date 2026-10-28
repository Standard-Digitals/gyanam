'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, XCircle, MinusCircle } from 'lucide-react';

interface SubjectStrength {
  subject: string;
  avgAccuracy: number;
  attemptCount: number;
}

interface RecentMistake {
  id: string;
  subject: string;
  questionText: string;
  options: string[];
  correctAnswer: number | null;
  correctAnswerText: string | null;
  selectedAnswer: string | null;
  wasSkipped: boolean;
  explanation: string;
}

const BAR_COLORS = ['#DC2626', '#C12223', '#B4590A', '#E67700', '#127A52', '#0B8792'];

function answerLabel(m: RecentMistake, value: string | null): string {
  if (value === null) return '—';
  const asIndex = Number(value);
  if (!Number.isNaN(asIndex) && m.options[asIndex] !== undefined) return m.options[asIndex];
  return value;
}

function RecentMistakesList({ mistakes }: { mistakes: RecentMistake[] }) {
  if (mistakes.length === 0) return null;
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-black text-[#888888] uppercase tracking-wide">Recent mistakes, question-by-question</p>
      <div className="space-y-2.5">
        {mistakes.map((m) => (
          <div key={m.id} className="bg-white border border-[#F3DCDD] rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-1.5">
              {m.wasSkipped ? <MinusCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-[#C12223] shrink-0" />}
              <span className="text-[10px] font-black text-[#888888] uppercase tracking-wide">{m.subject}</span>
            </div>
            <p className="text-xs font-bold text-[#1F1A1C]">{m.questionText}</p>
            <p className="text-[11px] text-[#555555]">
              {m.wasSkipped ? 'Skipped' : <>Your answer: <span className="text-[#C12223] font-semibold">{answerLabel(m, m.selectedAnswer)}</span></>}
              {' · '}
              Correct: <span className="text-emerald-700 font-semibold">{m.correctAnswerText ?? answerLabel(m, m.correctAnswer !== null ? String(m.correctAnswer) : null)}</span>
            </p>
            {m.explanation && <p className="text-[11px] text-[#888888]">{m.explanation}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MistakesTab() {
  const [subjects, setSubjects] = useState<SubjectStrength[] | null>(null);
  const [recentMistakes, setRecentMistakes] = useState<RecentMistake[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/ai-mentor/mistakes')
      .then((res) => res.json())
      .then((d) => {
        setSubjects(d.subjects ?? []);
        setRecentMistakes(d.recentMistakes ?? []);
      });
  }, []);

  if (subjects === null) return <p className="text-xs text-[#888888] p-4">Loading...</p>;

  if (subjects.length === 0 && recentMistakes.length === 0) {
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
      {subjects.length > 0 && (
        <>
          <p className="text-[11px] text-[#888888] bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl p-3">Weakest subjects first, by average quiz accuracy.</p>
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
        </>
      )}
      <RecentMistakesList mistakes={recentMistakes} />
    </div>
  );
}
