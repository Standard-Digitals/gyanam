import type { Metadata } from 'next';
import { CURRENT_AFFAIRS_ITEMS } from '@/data/mockData';
import { buildMetadata } from '@/lib/metadata';
import CurrentAffairsDetailClient from './CurrentAffairsDetailClient';

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return CURRENT_AFFAIRS_ITEMS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = CURRENT_AFFAIRS_ITEMS.find((item) => item.id === id || item.slug === id);

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
  return <CurrentAffairsDetailClient id={id} />;
}
