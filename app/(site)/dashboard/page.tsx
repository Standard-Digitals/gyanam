import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { buildMetadata } from '@/lib/metadata';
import ProfileForm from './ProfileForm';
import { BookOpen, Trophy, Download, Lock } from 'lucide-react';

export const metadata: Metadata = buildMetadata({
  title: 'My Dashboard',
  path: '/dashboard',
  noIndex: true,
});

export default async function DashboardPage() {
  const user = await getCurrentUserProfile();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FFF5F5] px-4">
        <div className="text-center space-y-3 bg-white p-10 rounded-3xl border border-[#F3DCDD] shadow-sm max-w-sm">
          <Lock className="w-10 h-10 text-[#C12223] mx-auto" />
          <h1 className="font-heading font-black text-xl text-[#1F1A1C]">Login Required</h1>
          <p className="text-sm text-[#555555]">Please login from the Student Portal menu in the header to view your dashboard.</p>
        </div>
      </div>
    );
  }

  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    orderBy: { submittedAt: 'desc' },
    take: 20,
  });
  const quizIds = [...new Set(quizAttempts.map((a) => a.quizId))];
  const quizzes = await prisma.quiz.findMany({ where: { id: { in: quizIds } }, select: { id: true, title: true } });
  const quizTitleMap = new Map(quizzes.map((q) => [q.id, q.title]));

  const downloadLogs = await prisma.downloadLog.findMany({
    where: { userId: user.id },
    orderBy: { downloadedAt: 'desc' },
    take: 20,
  });
  const resourceIds = [...new Set(downloadLogs.map((d) => d.resourceId))];
  const resources = await prisma.freeResource.findMany({ where: { id: { in: resourceIds } }, select: { id: true, title: true } });
  const resourceTitleMap = new Map(resources.map((r) => [r.id, r.title]));

  return (
    <div className="min-h-screen bg-[#FFF5F5] py-10">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 space-y-6">
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#1F1A1C]">My Dashboard</h1>

        <ProfileForm name={user.name} phone={user.phone} targetExam={user.targetExam} />

        {/* Enrolled Courses */}
        <div className="bg-white p-6 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-3">
          <h3 className="font-heading font-black text-lg text-[#1F1A1C] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#C12223]" /> My Enrolled Courses
          </h3>
          <p className="text-sm text-[#888888]">
            Course enrollment & payments are launching soon. Once live, your enrolled batches will show up here automatically.
          </p>
        </div>

        {/* Quiz History */}
        <div className="bg-white p-6 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-3">
          <h3 className="font-heading font-black text-lg text-[#1F1A1C] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#C12223]" /> Quiz History ({quizAttempts.length})
          </h3>
          {quizAttempts.length === 0 ? (
            <p className="text-sm text-[#888888]">No quiz attempts yet — take a Daily Quiz to see your history here.</p>
          ) : (
            <div className="space-y-2">
              {quizAttempts.map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between p-3 bg-[#FFF5F5] rounded-xl border border-[#F3DCDD] text-sm">
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

        {/* Download History */}
        <div className="bg-white p-6 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-3">
          <h3 className="font-heading font-black text-lg text-[#1F1A1C] flex items-center gap-2">
            <Download className="w-5 h-5 text-[#C12223]" /> Download History ({downloadLogs.length})
          </h3>
          {downloadLogs.length === 0 ? (
            <p className="text-sm text-[#888888]">No downloads yet — download free PDFs from Study Material to see them here.</p>
          ) : (
            <div className="space-y-2">
              {downloadLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-[#FFF5F5] rounded-xl border border-[#F3DCDD] text-sm">
                  <p className="font-bold text-[#1F1A1C]">{resourceTitleMap.get(log.resourceId) ?? 'Resource'}</p>
                  <p className="text-xs text-[#888888]">{new Date(log.downloadedAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
