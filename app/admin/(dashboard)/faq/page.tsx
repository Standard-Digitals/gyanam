import { prisma } from '@/lib/prisma';
import FaqManager from './FaqManager';

export default async function AdminFaqPage() {
  const faqs = await prisma.fAQItem.findMany({ orderBy: { createdAt: 'desc' } });
  return <FaqManager faqs={faqs} />;
}
