import { prisma } from '@/lib/prisma';

export interface AnnouncementBannerItem {
  id: string;
  badge: string;
  message: string;
  link: string | null;
}

export async function getActiveAnnouncementBanners(): Promise<AnnouncementBannerItem[]> {
  const banners = await prisma.announcementBanner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
  return banners.map((b) => ({ id: b.id, badge: b.badge, message: b.message, link: b.link }));
}
