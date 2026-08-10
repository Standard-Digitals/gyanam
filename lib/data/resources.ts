import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { FreeResource } from '@/types';
import type { FreeResource as PrismaFreeResource } from '@prisma/client';

function mapResource(r: PrismaFreeResource): FreeResource {
  return {
    id: r.id,
    title: r.title,
    type: r.type as FreeResource['type'],
    category: r.category,
    fileSize: r.fileSize,
    downloadsCount: r.downloadsCount,
    rating: r.rating,
    description: r.description,
    language: r.language ?? undefined,
    pagesCount: r.pagesCount ?? undefined,
    chapters: r.chapters,
    updatedDate: r.updatedDate ?? undefined,
    targetExams: r.targetExams,
    isHot: r.isHot,
    originalPrice: r.originalPrice ?? undefined,
    price: r.price ?? undefined,
    reviewsCount: r.reviewsCount ?? undefined,
    author: r.author ?? undefined,
    badge: r.badge ?? undefined,
    coverBg: r.coverBg ?? undefined,
    coverImage: r.coverImage ?? undefined,
    images: r.images,
    publisher: r.publisher ?? undefined,
    isbn: r.isbn ?? undefined,
    edition: r.edition ?? undefined,
    weight: r.weight ?? undefined,
    inStock: r.inStock,
  };
}

export const getAllFreeResources = cache(async (): Promise<FreeResource[]> => {
  const resources = await prisma.freeResource.findMany({ orderBy: { createdAt: 'asc' } });
  return resources.map(mapResource);
});
