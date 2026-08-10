import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { FAQItem } from '@/types';

export const getAllFaqs = cache(async (): Promise<FAQItem[]> => {
  const faqs = await prisma.fAQItem.findMany({ orderBy: { createdAt: 'asc' } });
  return faqs.map((f) => ({ ...f, category: f.category as FAQItem['category'] }));
});
