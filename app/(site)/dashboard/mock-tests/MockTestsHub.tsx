'use client';
import { useState } from 'react';
import { ClipboardCheck, Clock, Play } from 'lucide-react';
import QuizTaker, { type QuizTakerQuiz } from '@/features/daily-quiz/QuizTaker';

interface MockTest extends QuizTakerQuiz {
  status: string;
}

interface Attempt {
  id: string;
  mockTestId: string;
  title: string;
  obtainedMarks: number;
  accuracy: number;
  submittedAt: string;
}

export default function MockTestsHub({ mockTests, attempts }: { mockTests: MockTest[]; attempts: Attempt[] }) {
  const [activeMockTest, setActiveMockTest] = useState<MockTest | null>(null);

  if (activeMockTest) {
    return (
      <QuizTaker
        quiz={activeMockTest}
        onExit={() => setActiveMockTest(null)}
        submitUrl={`/api/mock-tests/${activeMockTest.id}/submit`}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading font-black text-sm text-[#1F1A1C] mb-3">Available Mock Tests</h2>
        {mockTests.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-[#F3DCDD] shadow-sm text-center">
            <ClipboardCheck className="w-8 h-8 text-[#D9B4B5] mx-auto mb-2" />
            <p className="text-sm text-[#888888]">No mock tests are live right now. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTests.map((test) => (
              <div key={test.id} className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-xl bg-[#FDEAE9] text-[#C12223] flex items-center justify-center shrink-0">
                    <ClipboardCheck className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-[#C12223] uppercase">{test.examCategory}</span>
                    <h3 className="font-heading font-black text-sm text-[#1F1A1C] leading-snug">{test.title}</h3>
                  </div>
                </div>
                <p className="flex items-center gap-1.5 text-[11px] text-[#888888]">
                  <Clock className="w-3.5 h-3.5" />
                  {test.totalQuestions} questions · {test.timeLimitMinutes} mins
                </p>
                <button
                  onClick={() => setActiveMockTest(test)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Start Test
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-heading font-black text-sm text-[#1F1A1C] mb-3">Your Attempts</h2>
        {attempts.length === 0 ? (
          <p className="text-sm text-[#888888]">No mock test attempts yet.</p>
        ) : (
          <div className="space-y-2">
            {attempts.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#F3DCDD] shadow-sm">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#1F1A1C] truncate">{a.title}</p>
                  <p className="text-[11px] text-[#888888]">
                    {a.obtainedMarks} marks · {a.accuracy}% accuracy
                  </p>
                </div>
                <span className="text-[11px] text-[#888888] font-plexmono shrink-0">
                  {new Date(a.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
