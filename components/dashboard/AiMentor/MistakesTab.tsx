'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, XCircle, MinusCircle, ChevronLeft, ChevronRight, X, Lightbulb, PartyPopper } from 'lucide-react';

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
  improvementTip: string | null;
  reviewedAt: string | null;
}

const BAR_COLORS = ['#DC2626', '#C12223', '#B4590A', '#E67700', '#127A52', '#0B8792'];

function answerLabel(m: RecentMistake, value: string | null): string {
  if (value === null) return '—';
  const asIndex = Number(value);
  if (!Number.isNaN(asIndex) && m.options[asIndex] !== undefined) return m.options[asIndex];
  return value;
}

function RecentMistakesList({ mistakes, onReview }: { mistakes: RecentMistake[]; onReview: () => void }) {
  if (mistakes.length === 0) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-black text-[#888888] uppercase tracking-wide">Recent mistakes, question-by-question</p>
        <button onClick={onReview} className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-white bg-[#C12223] px-2.5 py-1.5 rounded-lg cursor-pointer whitespace-nowrap">
          Review one by one <ChevronRight className="w-3 h-3" />
        </button>
      </div>
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

/** Guided, one-at-a-time walkthrough of the same mistakes the list above shows — CEO feedback:
 * tapping "review your wrong and skipped questions" dumped the whole list at once; it should
 * explain each mistake in turn with a Next button, like actually sitting down and going through
 * them one by one — and each one should say how to avoid it next time, not just why it was wrong.
 * `mistakes` here is already the not-yet-reviewed subset (see MistakesTab) — each card marks
 * itself reviewed as soon as it's shown, so next time this flow opens, already-seen ones don't
 * take up a slot a genuinely new mistake could fill instead. */
function OneByOneReview({ mistakes, onExit }: { mistakes: RecentMistake[]; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const m = mistakes[index];
  const isLast = index === mistakes.length - 1;

  useEffect(() => {
    if (!m) return;
    fetch('/api/dashboard/ai-mentor/mistakes/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: m.id }),
    }).catch(() => {});
    // Only when the shown mistake's id actually changes — not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m?.id]);

  if (!m) {
    return (
      <div className="p-6 text-center">
        <PartyPopper className="w-7 h-7 text-[#C12223] mx-auto mb-2" />
        <p className="text-sm font-bold text-[#1F1A1C]">You're all caught up!</p>
        <p className="text-xs text-[#888888] mt-1 max-w-[240px] mx-auto">No new mistakes to review right now — come back after your next quiz or mock test.</p>
        <button onClick={onExit} className="inline-block mt-3 px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer">
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-black text-[#888888] uppercase tracking-wide">
          Mistake {index + 1} of {mistakes.length}
        </p>
        <button onClick={onExit} className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-[#888888] cursor-pointer">
          <X className="w-3.5 h-3.5" /> Exit review
        </button>
      </div>
      <div className="h-1.5 bg-[#F3DCDD] rounded-full overflow-hidden">
        <div className="h-full bg-[#C12223] rounded-full transition-all" style={{ width: `${((index + 1) / mistakes.length) * 100}%` }} />
      </div>
      <div className="bg-white border border-[#F3DCDD] rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-1.5">
          {m.wasSkipped ? <MinusCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-[#C12223] shrink-0" />}
          <span className="text-[10px] font-black text-[#888888] uppercase tracking-wide">{m.subject}</span>
        </div>
        <p className="text-sm font-bold text-[#1F1A1C] leading-snug">{m.questionText}</p>
        <div className="space-y-1.5 text-xs">
          <p>
            {m.wasSkipped ? (
              <span className="font-semibold text-amber-700">You skipped this one</span>
            ) : (
              <>
                Your answer: <span className="font-semibold text-[#C12223]">{answerLabel(m, m.selectedAnswer)}</span>
              </>
            )}
          </p>
          <p>
            Correct answer:{' '}
            <span className="font-semibold text-emerald-700">{m.correctAnswerText ?? answerLabel(m, m.correctAnswer !== null ? String(m.correctAnswer) : null)}</span>
          </p>
        </div>
        {m.explanation && (
          <div className="bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl p-3">
            <p className="text-[10px] font-black text-[#C12223] uppercase tracking-wide mb-1">Why</p>
            <p className="text-xs text-[#555555] leading-snug">{m.explanation}</p>
          </div>
        )}
        {m.improvementTip && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wide mb-1 flex items-center gap-1">
              <Lightbulb className="w-3 h-3" /> Next time
            </p>
            <p className="text-xs text-emerald-900 leading-snug">{m.improvementTip}</p>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="flex items-center gap-1 px-4 py-2.5 bg-gray-100 text-gray-600 font-bold text-xs rounded-xl disabled:opacity-40 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Prev
        </button>
        {isLast ? (
          <button onClick={onExit} className="flex-1 px-4 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer">
            Done — back to list
          </button>
        ) : (
          <button onClick={() => setIndex((i) => i + 1)} className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer">
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function MistakesTab({ startInReview }: { startInReview?: boolean } = {}) {
  const [subjects, setSubjects] = useState<SubjectStrength[] | null>(null);
  const [recentMistakes, setRecentMistakes] = useState<RecentMistake[]>([]);
  const [unreviewedMistakes, setUnreviewedMistakes] = useState<RecentMistake[]>([]);
  const [reviewing, setReviewing] = useState(!!startInReview);

  useEffect(() => {
    fetch('/api/dashboard/ai-mentor/mistakes')
      .then((res) => res.json())
      .then((d) => {
        setSubjects(d.subjects ?? []);
        setRecentMistakes(d.recentMistakes ?? []);
        setUnreviewedMistakes(d.unreviewedMistakes ?? []);
      });
  }, []);

  if (subjects === null) return <p className="text-xs text-[#888888] p-4">Loading...</p>;

  if (subjects.length === 0 && recentMistakes.length === 0) {
    return (
      <div className="p-6 text-center">
        <Trophy className="w-7 h-7 text-[#D9B4B5] mx-auto mb-2" />
        <p className="text-xs text-[#888888] max-w-[240px] mx-auto">No quiz or mock test attempts yet — take one to see your weak subjects here.</p>
        <Link href="/daily-quiz" className="inline-block mt-3 px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl">
          Take a Quiz
        </Link>
      </div>
    );
  }

  if (reviewing) {
    // A fixed snapshot of what was unreviewed when this session started — each card marks itself
    // reviewed server-side as it's shown (so it won't reappear *next* session), but the list here
    // stays stable for the duration of this one so Prev/Next don't jump around mid-session.
    return (
      <div className="p-4">
        <OneByOneReview mistakes={unreviewedMistakes} onExit={() => setReviewing(false)} />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {subjects.length > 0 && (
        <>
          <p className="text-[11px] text-[#888888] bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl p-3">Weakest subjects first, by average accuracy across quizzes and mock tests.</p>
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
      <RecentMistakesList mistakes={recentMistakes} onReview={() => setReviewing(true)} />
    </div>
  );
}
