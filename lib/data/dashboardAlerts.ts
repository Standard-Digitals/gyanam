import { cache } from 'react';
import { prisma } from '@/lib/prisma';

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export const getQuizStreak = cache(async (userId: string): Promise<{ streak: number; last7Days: boolean[] }> => {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId },
    select: { submittedAt: true },
    orderBy: { submittedAt: 'desc' },
  });
  const dateKeys = new Set(attempts.map((a) => toDateKey(a.submittedAt)));

  let streak = 0;
  const cursor = new Date();
  const todayKey = toDateKey(cursor);
  if (!dateKeys.has(todayKey)) cursor.setUTCDate(cursor.getUTCDate() - 1);
  while (dateKeys.has(toDateKey(cursor))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  const last7Days: boolean[] = [];
  const dayCursor = new Date();
  dayCursor.setUTCDate(dayCursor.getUTCDate() - 6);
  for (let i = 0; i < 7; i++) {
    last7Days.push(dateKeys.has(toDateKey(dayCursor)));
    dayCursor.setUTCDate(dayCursor.getUTCDate() + 1);
  }

  return { streak, last7Days };
});

export interface DashboardNotification {
  id: string;
  icon: 'order' | 'news';
  text: string;
  href: string;
}

export const getDashboardNotifications = cache(async (userId: string): Promise<DashboardNotification[]> => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [pendingOrders, recentNews] = await Promise.all([
    prisma.order.findMany({
      where: { userId, orderStatus: { notIn: ['DELIVERED', 'CANCELLED'] } },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.currentAffairItem.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ]);

  const notifications: DashboardNotification[] = [
    ...pendingOrders.map((o) => ({
      id: `order-${o.id}`,
      icon: 'order' as const,
      text: `Order ${o.orderNumber} is ${o.orderStatus.toLowerCase()}`,
      href: '/dashboard/orders',
    })),
    ...recentNews.map((n) => ({
      id: `news-${n.id}`,
      icon: 'news' as const,
      text: n.title,
      href: `/current-affairs/${n.slug ?? n.id}`,
    })),
  ];

  return notifications.slice(0, 8);
});
