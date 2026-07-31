import type { Metadata } from 'next';
import './globals.css';
import { SiteShell } from '@/components/SiteShell';
import { buildMetadata } from '@/lib/metadata';
import { SITE } from '@/lib/siteConfig';

export const metadata: Metadata = buildMetadata({
  title: SITE.tagline,
  path: '',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
