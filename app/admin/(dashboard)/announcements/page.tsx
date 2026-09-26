import { prisma } from '@/lib/prisma';
import AnnouncementsManager from './AnnouncementsManager';

export default async function AdminAnnouncementsPage() {
  const banners = await prisma.announcementBanner.findMany({ orderBy: { order: 'asc' } });
  return <AnnouncementsManager banners={banners} />;
}
