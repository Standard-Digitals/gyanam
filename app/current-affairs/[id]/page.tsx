import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCurrentAffairByIdOrSlug, getAllCurrentAffairIds, getAllCurrentAffairs } from '@/lib/data/currentAffairs';
import { buildMetadata } from '@/lib/metadata';
import CurrentAffairsDetailClient from './CurrentAffairsDetailClient';

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const ids = await getAllCurrentAffairIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getCurrentAffairByIdOrSlug(id);

  if (!article) {
    return buildMetadata({ title: 'Article Not Found', noIndex: true });
  }

  return buildMetadata({
    title: article.title,
    description: article.summary,
    path: `/current-affairs/${article.id}`,
    image: article.thumbnail,
  });
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const article = await getCurrentAffairByIdOrSlug(id);
  if (!article) notFound();
  const allItems = await getAllCurrentAffairs();
  const otherArticles = allItems.filter((item) => item.id !== article.id);
  return <CurrentAffairsDetailClient article={article} otherArticles={otherArticles} />;
}
