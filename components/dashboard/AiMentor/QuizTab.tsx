'use client';
import { useEffect, useRef, useState } from 'react';
import { ClipboardList } from 'lucide-react';

interface Question {
  id: number;
  type?: 'mcq' | 'fill_blank';
  question: string;
  options: string[];
  correctAnswer: number;
  correctAnswerText?: string;
}

interface OpenTest {
  kind: 'quiz' | 'mock';
  id: string;
  title: string;
  timeLimitMinutes: number;
  questions: Question[];
  submitUrl: string;
}

interface SubmitResult {
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  obtainedMarks: number;
  accuracy: number;
  totalMarks: number;
}

/**
 * Takes the student's one open quiz/mock test right inside the chat — one question per screen,
 * no timer bar or question palette (kept deliberately simple for a narrow chat panel). Submits
 * through the same route the full dashboard test-taker uses, so the resulting QuizAttempt/
 * MockTestAttempt row — and everything that reads it (streak, leaderboard, My Progress, My
 * Mistakes) — is identical to an attempt taken there.
 */
export function QuizTab() {
  const [test, setTest] = useState<OpenTest | null | undefined>(undefined);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [textInput, setTextInput] = useState('');
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    fetch('/api/dashboard/ai-mentor/open-test')
      .then((res) => (res.ok ? res.json() : { kind: null }))
      .then((data) => {
        setTest(data.kind ? data : null);
        startedAt.current = Date.now();
      })
      .catch(() => setTest(null));
  }, []);

  useEffect(() => {
    setTextInput('');
  }, [index]);

  if (test === undefined) return <p className="text-xs text-[#888888] p-4">Loading...</p>;

  if (test === null) {
    return (
      <div className="p-6 text-center">
        <ClipboardList className="w-7 h-7 text-[#D9B4B5] mx-auto mb-2" />
        <p className="text-xs text-[#888888] max-w-[240px] mx-auto">
          You've attempted everything that's open right now — check back soon, new ones are added often.
        </p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="p-4 space-y-4">
        <div className="bg-white border border-[#F3DCDD] rounded-2xl p-5 text-center">
          <p className="text-[10px] font-black text-[#888888] uppercase tracking-wide mb-1 truncate">{test.title}</p>
          <p className="font-heading font-black text-3xl text-[#1F1A1C]">{result.accuracy}%</p>
          <p className="text-xs text-[#888888] mt-0.5">accuracy</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white border border-[#F3DCDD] rounded-xl p-2.5">
            <p className="text-sm font-black text-emerald-600">{result.correctCount}</p>
            <p className="text-[10px] text-[#888888]">Correct</p>
          </div>
          <div className="bg-white border border-[#F3DCDD] rounded-xl p-2.5">
            <p className="text-sm font-black text-red-600">{result.incorrectCount}</p>
            <p className="text-[10px] text-[#888888]">Wrong</p>
          </div>
          <div className="bg-white border border-[#F3DCDD] rounded-xl p-2.5">
            <p className="text-sm font-black text-[#1F1A1C]">{result.obtainedMarks}</p>
            <p className="text-[10px] text-[#888888]">Marks</p>
          </div>
        </div>
        <a
          href={test.kind === 'quiz' ? '/daily-quiz' : '/dashboard/mock-tests'}
          className="block text-center px-4 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl"
        >
          Want more practice? Open the full Test Center
        </a>
      </div>
    );
  }

  const q = test.questions[index];
  const isLast = index === test.questions.length - 1;
  const isFillBlank = q.type === 'fill_blank';
  const currentAnswer = answers[q.id];

  const submit = async (finalAnswers: Record<number, number | string>) => {
    setSubmitting(true);
    setError(null);
    try {
      const timeTakenSec = Math.max(0, Math.round((Date.now() - startedAt.current) / 1000));
      const res = await fetch(test.submitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers, timeTakenSec }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not submit');
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit — try again');
    } finally {
      setSubmitting(false);
    }
  };

  const goNext = () => {
    const updated = isFillBlank && textInput.trim() ? { ...answers, [q.id]: textInput.trim() } : answers;
    if (updated !== answers) setAnswers(updated);
    if (isLast) {
      submit(updated);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const skip = () => {
    if (isLast) {
      submit(answers);
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-black text-[#C12223] uppercase tracking-wide truncate">{test.title}</p>
        <p className="text-[10px] font-bold text-[#888888] shrink-0">
          Question {index + 1} of {test.questions.length}
        </p>
      </div>

      <div className="bg-white border border-[#F3DCDD] rounded-2xl p-4">
        <p className="text-sm font-bold text-[#1F1A1C] leading-snug mb-3">{q.question}</p>

        {isFillBlank ? (
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your answer..."
            className="w-full px-3.5 py-2.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold outline-none focus:border-[#C12223]"
          />
        ) : (
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: i }))}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  currentAnswer === i ? 'bg-[#FDEAE9] border-[#C12223] text-[#C12223]' : 'bg-white border-[#F3DCDD] text-[#1F1A1C] hover:border-[#C12223]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-[11px] font-semibold text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={skip}
          disabled={submitting}
          className="px-4 py-2.5 bg-gray-100 text-gray-600 font-bold text-xs rounded-xl disabled:opacity-40 cursor-pointer"
        >
          Skip
        </button>
        <button
          onClick={goNext}
          disabled={submitting || (isFillBlank ? !textInput.trim() : currentAnswer === undefined)}
          className="flex-1 px-4 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl disabled:opacity-40 cursor-pointer"
        >
          {submitting ? 'Submitting...' : isLast ? 'Submit Test' : 'Next Question'}
        </button>
      </div>
    </div>
  );
}
