import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { BlogPost } from '@/types';

export const getAllBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'asc' } });
  return posts.map((p) => ({ ...p, category: p.category as BlogPost['category'] }));
});
