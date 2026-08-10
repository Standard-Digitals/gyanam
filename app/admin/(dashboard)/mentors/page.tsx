import { prisma } from '@/lib/prisma';
import MentorsManager from './MentorsManager';

export default async function AdminMentorsPage() {
  const mentors = await prisma.mentor.findMany({ orderBy: { createdAt: 'desc' } });
  return <MentorsManager mentors={mentors} />;
}
