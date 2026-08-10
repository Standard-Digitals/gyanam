import { prisma } from '@/lib/prisma';
import CurrentAffairsManager from './CurrentAffairsManager';

export default async function AdminCurrentAffairsPage() {
  const items = await prisma.currentAffairItem.findMany({ orderBy: { createdAt: 'desc' } });
  return <CurrentAffairsManager items={items} />;
}
