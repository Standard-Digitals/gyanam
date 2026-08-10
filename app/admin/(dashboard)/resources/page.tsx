import { prisma } from '@/lib/prisma';
import ResourcesManager from './ResourcesManager';

export default async function AdminResourcesPage() {
  const resources = await prisma.freeResource.findMany({ orderBy: { createdAt: 'desc' } });
  return <ResourcesManager resources={resources} />;
}
