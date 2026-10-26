'use client';
import { useState } from 'react';
import { Sparkles, MessageCircle, GraduationCap } from 'lucide-react';
import { TARGET_EXAM_GROUPS } from '@/lib/targetExams';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function formatMonthInput(value: string): string {
  // value is "YYYY-MM" from <input type="month">
  const [year, month] = value.split('-').map(Number);
  if (!year || !month) return value;
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

interface Props {
  onSkip: () => void;
  onDone: (reply: string) => void;
}

/** Shown once, the very first time a student opens the chat: general queries, or set up exam prep? */
export function OnboardingFlow({ onSkip, onDone }: Props) {
  const [stage, setStage] = useState<'choice' | 'form'>('choice');
  const [targetExam, setTargetExam] = useState('');
  const [examMonth, setExamMonth] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!targetExam || !examMonth) {
      setError('Pick your exam and roughly when it is.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/dashboard/ai-mentor/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetExam, examDate: formatMonthInput(examMonth) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      onDone(data.reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save that — try again');
    } finally {
      setSubmitting(false);
    }
  };

  if (stage === 'choice') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center bg-[#FFF5F5]">
        <Sparkles className="w-9 h-9 text-[#C12223] mb-3" />
        <h2 className="font-heading font-black text-lg text-[#1F1A1C]">Hi! I'm Gyanmitra, your AI mentor</h2>
        <p className="text-xs text-[#888888] mt-1.5 max-w-xs">What brings you here today?</p>
        <div className="flex flex-col gap-3 mt-6 w-full max-w-xs">
          <button
            onClick={() => setStage('form')}
            className="flex items-center gap-3 bg-white border-2 border-[#C12223] rounded-2xl p-4 text-left hover:bg-[#FFF5F5] transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FDEAE9] text-[#C12223] flex items-center justify-center shrink-0">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1F1A1C]">I'm preparing for an exam</p>
              <p className="text-[11px] text-[#888888]">Get a plan, progress tracking and tailored advice</p>
            </div>
          </button>
          <button
            onClick={onSkip}
            className="flex items-center gap-3 bg-white border border-[#F3DCDD] rounded-2xl p-4 text-left hover:border-[#C12223] transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1F1A1C]">Just a general query</p>
              <p className="text-[11px] text-[#888888]">Ask a doubt or anything else</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 bg-[#FFF5F5]">
      <div className="max-w-md mx-auto">
        <h2 className="font-heading font-black text-base text-[#1F1A1C] mb-1">Tell me about your exam</h2>
        <p className="text-xs text-[#888888] mb-5">So your plan, progress and advice are tailored to you — not generic.</p>

        <label className="text-[11px] font-bold text-[#888888] uppercase tracking-wide block mb-1.5">Target Exam</label>
        <div className="space-y-2.5 mb-5">
          {TARGET_EXAM_GROUPS.map(({ group, exams }) => (
            <div key={group} className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase w-20 shrink-0">{group}</span>
              {exams.map((exam) => (
                <button
                  key={exam}
                  type="button"
                  onClick={() => setTargetExam(exam)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                    targetExam === exam ? 'bg-[#C12223] text-white' : 'bg-white border border-[#F3DCDD] text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {exam}
                </button>
              ))}
            </div>
          ))}
        </div>

        <label className="text-[11px] font-bold text-[#888888] uppercase tracking-wide block mb-1.5">Roughly when is it?</label>
        <input
          type="month"
          value={examMonth}
          onChange={(e) => setExamMonth(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white border border-[#F3DCDD] rounded-xl text-sm font-semibold mb-4"
        />

        {error && <p className="text-xs font-semibold text-red-600 mb-3">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={submit}
            disabled={submitting}
            className="px-5 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Saving...' : 'Get my guidance'}
          </button>
          <button onClick={onSkip} className="px-4 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
