'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Newspaper, Clock, Play } from 'lucide-react';
import QuizTaker, { type QuizTakerQuiz } from '@/features/daily-quiz/QuizTaker';

export default function QuizHub({ quizzes }: { quizzes: QuizTakerQuiz[] }) {
  const router = useRouter();
  const [activeQuiz, setActiveQuiz] = useState<QuizTakerQuiz | null>(null);

  if (activeQuiz) {
    return (
      <QuizTaker
        quiz={activeQuiz}
        onExit={() => {
          setActiveQuiz(null);
          router.refresh();
        }}
        onSubmitSuccess={() => router.refresh()}
      />
    );
  }

  return (
    <div>
      <h2 className="font-heading font-black text-sm text-[#1F1A1C] mb-3">Current Affairs Quiz</h2>
      {quizzes.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl border border-[#F3DCDD] shadow-sm text-center">
          <p className="text-sm text-[#888888]">No Current Affairs quiz is live right now. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-[#FDEAE9] text-[#C12223] flex items-center justify-center shrink-0">
                  <Newspaper className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#C12223] uppercase">{quiz.examCategory}</span>
                  <h3 className="font-heading font-black text-sm text-[#1F1A1C] leading-snug">{quiz.title}</h3>
                </div>
              </div>
              <p className="flex items-center gap-1.5 text-[11px] text-[#888888]">
                <Clock className="w-3.5 h-3.5" />
                {quiz.totalQuestions} questions · {quiz.timeLimitMinutes} mins
              </p>
              <button
                onClick={() => setActiveQuiz(quiz)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
