'use client';
import { useState } from 'react';
import {
  Sparkles, MessageCircle, GraduationCap, ArrowLeft, Award, Building2, Train, Shield, MapPin, BookOpen, type LucideIcon,
} from 'lucide-react';
import { TARGET_EXAM_GROUPS } from '@/lib/targetExams';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const GROUP_ICONS: Record<string, LucideIcon> = {
  SSC: Award,
  Banking: Building2,
  Railway: Train,
  UPSC: GraduationCap,
  Defence: Shield,
  'Assam Govt': MapPin,
  'Teaching Exams': BookOpen,
};

function formatMonthInput(value: string): string {
  // value is "YYYY-MM" from <input type="month">
  const [year, month] = value.split('-').map(Number);
  if (!year || !month) return value;
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

type Stage = 'choice' | 'group' | 'exam' | 'date';
const FORM_STAGES: Stage[] = ['group', 'exam', 'date'];

interface Props {
  onSkip: () => void;
  onDone: (reply: string) => void;
}

function StepHeader({ stage, onBack }: { stage: Stage; onBack: () => void }) {
  const stepNum = FORM_STAGES.indexOf(stage) + 1;
  return (
    <div className="flex items-center gap-3 mb-5">
      <button onClick={onBack} className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-white border border-[#F3DCDD] hover:border-[#C12223] cursor-pointer">
        <ArrowLeft className="w-4 h-4 text-[#1F1A1C]" />
      </button>
      <div className="flex-1">
        <div className="flex items-center gap-1">
          {FORM_STAGES.map((s, i) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${i < stepNum ? 'bg-[#C12223]' : 'bg-[#F3DCDD]'}`} />
          ))}
        </div>
        <p className="text-[10px] font-bold text-[#888888] uppercase tracking-wide mt-1.5">Step {stepNum} of {FORM_STAGES.length}</p>
      </div>
    </div>
  );
}

/** Shown once, the very first time a student opens the chat: general queries, or set up exam prep? */
export function OnboardingFlow({ onSkip, onDone }: Props) {
  const [stage, setStage] = useState<Stage>('choice');
  const [group, setGroup] = useState<string | null>(null);
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
            onClick={() => setStage('group')}
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

  if (stage === 'group') {
    return (
      <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 bg-[#FFF5F5]">
        <div className="max-w-md mx-auto">
          <StepHeader stage="group" onBack={() => setStage('choice')} />
          <h2 className="font-heading font-black text-base text-[#1F1A1C] mb-1">Which field are you targeting?</h2>
          <p className="text-xs text-[#888888] mb-5">Pick the closest one — you'll narrow it down next.</p>
          <div className="grid grid-cols-2 gap-3">
            {TARGET_EXAM_GROUPS.map(({ group: g }) => {
              const Icon = GROUP_ICONS[g] ?? GraduationCap;
              return (
                <button
                  key={g}
                  onClick={() => {
                    setGroup(g);
                    setTargetExam('');
                    setStage('exam');
                  }}
                  className="flex flex-col items-center gap-2 bg-white border border-[#F3DCDD] rounded-2xl p-4 text-center hover:border-[#C12223] hover:shadow-md transition cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FDEAE9] text-[#C12223] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#1F1A1C]">{g}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'exam') {
    const exams = TARGET_EXAM_GROUPS.find((g) => g.group === group)?.exams ?? [];
    return (
      <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 bg-[#FFF5F5]">
        <div className="max-w-md mx-auto">
          <StepHeader stage="exam" onBack={() => setStage('group')} />
          <h2 className="font-heading font-black text-base text-[#1F1A1C] mb-1">Which exam, exactly?</h2>
          <p className="text-xs text-[#888888] mb-5">{group}</p>
          <div className="flex flex-col gap-2">
            {exams.map((exam) => (
              <button
                key={exam}
                onClick={() => {
                  setTargetExam(exam);
                  setStage('date');
                }}
                className="flex items-center justify-between bg-white border border-[#F3DCDD] rounded-xl px-4 py-3 text-left hover:border-[#C12223] hover:bg-[#FFF5F5] transition cursor-pointer"
              >
                <span className="text-sm font-bold text-[#1F1A1C]">{exam}</span>
                <ArrowLeft className="w-4 h-4 text-[#C12223] rotate-180" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 bg-[#FFF5F5]">
      <div className="max-w-md mx-auto">
        <StepHeader stage="date" onBack={() => setStage('exam')} />
        <h2 className="font-heading font-black text-base text-[#1F1A1C] mb-1">Last thing — when is it?</h2>
        <p className="text-xs text-[#888888] mb-5">
          Preparing for <strong className="text-[#1F1A1C]">{targetExam}</strong>. Month and year is enough.
        </p>

        <input
          type="month"
          value={examMonth}
          onChange={(e) => setExamMonth(e.target.value)}
          autoFocus
          className="w-full px-3.5 py-3 bg-white border border-[#F3DCDD] rounded-xl text-base font-semibold mb-4"
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
