import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getCurrentUserProfile } from '@/lib/currentUser';
import { buildMetadata } from '@/lib/metadata';
import { getActiveMockTests } from '@/lib/data/mockTests';
import MockTestsHub from './MockTestsHub';

export const metadata: Metadata = buildMetadata({
  title: 'Mock Tests',
  path: '/dashboard/mock-tests',
  noIndex: true,
});

export default async function DashboardMockTestsPage() {
  const user = await getCurrentUserProfile();
  if (!user) return null;

  const [mockTests, attempts] = await Promise.all([
    getActiveMockTests(),
    prisma.mockTestAttempt.findMany({ where: { userId: user.id }, orderBy: { submittedAt: 'desc' }, take: 20 }),
  ]);

  const mockTestIds = [...new Set(attempts.map((a) => a.mockTestId))];
  const attemptedTests = await prisma.mockTest.findMany({ where: { id: { in: mockTestIds } }, select: { id: true, title: true } });
  const titleMap = new Map(attemptedTests.map((t) => [t.id, t.title]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl text-[#1F1A1C]">Mock Tests</h1>
        <p className="text-sm text-[#888888] mt-0.5">Full-length, exam-pattern tests with instant scorecards.</p>
      </div>
      <MockTestsHub
        mockTests={mockTests}
        attempts={attempts.map((a) => ({
          id: a.id,
          mockTestId: a.mockTestId,
          title: titleMap.get(a.mockTestId) ?? 'Mock Test',
          obtainedMarks: a.obtainedMarks,
          accuracy: a.accuracy,
          submittedAt: a.submittedAt.toISOString(),
        }))}
      />
    </div>
  );
}
