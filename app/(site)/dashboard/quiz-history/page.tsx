import { prisma } from '@/lib/prisma';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { getQuizzesBySubject } from '@/lib/data/quizzes';
import { Trophy } from 'lucide-react';
import QuizHub from './QuizHub';

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default async function DashboardQuizPage() {
  const user = await getCurrentUserProfile();
  if (!user) return null;

  const [currentAffairsQuizzes, quizAttempts] = await Promise.all([
    getQuizzesBySubject('Current Affairs'),
    prisma.quizAttempt.findMany({ where: { userId: user.id }, orderBy: { submittedAt: 'desc' }, take: 50 }),
  ]);
  const quizIds = [...new Set(quizAttempts.map((a) => a.quizId))];
  const quizzes = await prisma.quiz.findMany({ where: { id: { in: quizIds } }, select: { id: true, title: true } });
  const quizTitleMap = new Map(quizzes.map((q) => [q.id, q.title]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-black text-2xl text-[#1F1A1C]">Quiz</h1>
        <p className="text-sm text-[#888888] mt-0.5">Take the latest Current Affairs quiz and track your attempt history.</p>
      </div>

      <QuizHub
        quizzes={currentAffairsQuizzes.map((q) => ({
          id: q.id,
          title: q.title,
          examCategory: q.examCategory,
          totalQuestions: q.totalQuestions,
          timeLimitMinutes: q.timeLimitMinutes,
          questions: q.questions,
        }))}
      />

      <div>
        <h2 className="font-heading font-black text-sm text-[#1F1A1C] mb-3">Your Attempt History ({quizAttempts.length})</h2>
        {quizAttempts.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-[#F3DCDD] shadow-sm text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#FDEAE9] text-[#C12223] flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6" />
            </div>
            <p className="text-sm text-[#555555]">No quiz attempts yet — take a quiz above to see your history here.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {quizAttempts.map((attempt) => {
              const good = attempt.accuracy >= 70;
              return (
                <div key={attempt.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#F3DCDD] shadow-sm">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-plexmono font-black text-xs shrink-0 ${
                      good ? 'bg-[#E7F5EE] text-[#127A52]' : 'bg-[#FBF0DF] text-[#B4590A]'
                    }`}
                  >
                    {attempt.accuracy}%
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-[#1F1A1C] truncate">{quizTitleMap.get(attempt.quizId) ?? 'Quiz'}</p>
                    <p className="text-[11px] text-[#888888] mt-0.5">
                      {new Date(attempt.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} ·{' '}
                      {fmtTime(attempt.timeTakenSec)} · {attempt.correctCount} correct, {attempt.incorrectCount} wrong
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-plexmono font-black text-sm text-[#C12223]">{attempt.obtainedMarks}</p>
                    <p className="text-[10px] text-[#888888]">marks</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
