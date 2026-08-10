import type { Metadata } from 'next';
import '../globals.css';
import { SiteShell } from '@/components/SiteShell';
import { buildMetadata } from '@/lib/metadata';
import { SITE } from '@/lib/siteConfig';
import { ScrollToTop } from '@/components/ScrollToTop';
import { FloatingQrWidget } from '@/components/FloatingQrWidget';
import { getAllCourses } from '@/lib/data/courses';
import { getAllCurrentAffairs } from '@/lib/data/currentAffairs';
import { getAllFreeResources } from '@/lib/data/resources';
import { getCurrentUserProfile } from '@/lib/currentUser';

export const metadata: Metadata = buildMetadata({
  title: SITE.tagline,
  path: '',
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [courses, currentAffairs, resources, userProfile] = await Promise.all([
    getAllCourses(),
    getAllCurrentAffairs(),
    getAllFreeResources(),
    getCurrentUserProfile(),
  ]);
  const user = userProfile ? { name: userProfile.name, phone: userProfile.phone } : null;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <SiteShell courses={courses} currentAffairs={currentAffairs} resources={resources} user={user}>{children}</SiteShell>
              <ScrollToTop />
                    <FloatingQrWidget />
      </body>
    </html>
  );
}
