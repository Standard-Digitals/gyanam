import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { SuccessStory } from '@/types';

export const getAllSuccessStories = cache(async (): Promise<SuccessStory[]> => {
  const stories = await prisma.successStory.findMany({ orderBy: { createdAt: 'asc' } });
  return stories.map((s) => ({
    ...s,
    videoUrl: s.videoUrl ?? undefined,
    youtubeUrl: s.youtubeUrl ?? undefined,
    youtubeViews: s.youtubeViews ?? undefined,
    videoDuration: s.videoDuration ?? undefined,
    rollNumber: s.rollNumber ?? undefined,
    score: s.score ?? undefined,
  }));
});
