import { prisma } from '@/lib/prisma';
import BlogManager from './BlogManager';

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
  return <BlogManager posts={posts} />;
}
