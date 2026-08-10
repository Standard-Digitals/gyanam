import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { CurrentAffairItem } from '@/types';
import type { CurrentAffairItem as PrismaCurrentAffairItem } from '@prisma/client';

function mapItem(c: PrismaCurrentAffairItem): CurrentAffairItem {
  return {
    id: c.id,
    slug: c.slug ?? undefined,
    title: c.title,
    category: c.category as CurrentAffairItem['category'],
    date: c.date,
    readTime: c.readTime,
    summary: c.summary,
    bullets: c.bullets,
    impForExams: c.impForExams,
    thumbnail: c.thumbnail ?? undefined,
    fullContent: c.fullContent,
    keyTakeaways: c.keyTakeaways,
    backgroundContext: c.backgroundContext ?? undefined,
    mcqQuestion: c.mcqQuestion as CurrentAffairItem['mcqQuestion'],
    syllabusTag: c.syllabusTag ?? undefined,
    sourceName: c.sourceName ?? undefined,
    author: c.author ?? undefined,
  };
}

export const getAllCurrentAffairs = cache(async (): Promise<CurrentAffairItem[]> => {
  const items = await prisma.currentAffairItem.findMany({ orderBy: { createdAt: 'asc' } });
  return items.map(mapItem);
});

export async function getCurrentAffairByIdOrSlug(idOrSlug: string): Promise<CurrentAffairItem | null> {
  const item = await prisma.currentAffairItem.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
  });
  return item ? mapItem(item) : null;
}

export async function getAllCurrentAffairIds(): Promise<string[]> {
  const items = await prisma.currentAffairItem.findMany({ select: { id: true } });
  return items.map((i) => i.id);
}
