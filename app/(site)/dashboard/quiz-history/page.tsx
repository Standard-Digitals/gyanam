import { prisma } from '@/lib/prisma';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { Trophy } from 'lucide-react';

export default async function DashboardQuizHistoryPage() {
  const user = await getCurrentUserProfile();
  if (!user) return null;

  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    orderBy: { submittedAt: 'desc' },
    take: 50,
  });
  const quizIds = [...new Set(quizAttempts.map((a) => a.quizId))];
  const quizzes = await prisma.quiz.findMany({ where: { id: { in: quizIds } }, select: { id: true, title: true } });
  const quizTitleMap = new Map(quizzes.map((q) => [q.id, q.title]));

  return (
    <div className="space-y-6">
      <h1 className="font-heading font-black text-2xl text-[#1F1A1C]">Quiz History ({quizAttempts.length})</h1>
      {quizAttempts.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-[#F3DCDD] shadow-sm text-center space-y-2">
          <Trophy className="w-10 h-10 text-[#C12223] mx-auto" />
          <p className="text-sm text-[#555555]">No quiz attempts yet — take a Daily Quiz to see your history here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {quizAttempts.map((attempt) => (
            <div key={attempt.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#F3DCDD] shadow-sm text-sm">
              <div>
                <p className="font-bold text-[#1F1A1C]">{quizTitleMap.get(attempt.quizId) ?? 'Quiz'}</p>
                <p className="text-xs text-[#888888]">{new Date(attempt.submittedAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-[#C12223]">{attempt.obtainedMarks} marks</p>
                <p className="text-xs text-[#888888]">{attempt.accuracy}% accuracy</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
