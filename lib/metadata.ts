import type { Metadata } from 'next';
import { SITE } from './siteConfig';

interface MetaOptions {
  title: string;
  description?: string;
  path?: string;           // e.g. '/courses' or '/courses/ssc-cgl-2026'
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description = SITE.defaultDescription,
  path = '',
  image = SITE.defaultOgImage,
  keywords = [],
  noIndex = false,
}: MetaOptions): Metadata {
  const fullTitle = `${title} | ${SITE.name}`;
  const url = `${SITE.url}${path}`;

  return {
    title: fullTitle,
    description,
    keywords: [...keywords, SITE.name, 'government exam preparation', 'online coaching India'],
    ...(noIndex && { robots: { index: false, follow: false } }),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: SITE.twitterHandle,
    },
    alternates: { canonical: url },
  };
}
