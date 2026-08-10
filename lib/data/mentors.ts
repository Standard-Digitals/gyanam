import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { Mentor } from '@/types';

export const getAllMentors = cache(async (): Promise<Mentor[]> => {
  const mentors = await prisma.mentor.findMany({ orderBy: { createdAt: 'asc' } });
  return mentors.map((m) => ({ ...m, exRole: m.exRole ?? undefined }));
});
