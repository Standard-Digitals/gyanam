import { prisma } from '@/lib/prisma';
import CurrentAffairsManager from './CurrentAffairsManager';

export default async function AdminCurrentAffairsPage() {
  const items = await prisma.currentAffairItem.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <CurrentAffairsManager
      items={items.map((i) => ({
        ...i,
        mcqQuestion: i.mcqQuestion as { question: string; options: string[]; correctAnswer: number; explanation: string } | null,
      }))}
    />
  );
}
