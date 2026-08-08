'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/modals/SearchModal';
import { AuthModal } from '@/components/modals/AuthModal';
import { MentorshipModal } from '@/components/modals/MentorshipModal';
import type { Course } from '@/types';

export function SiteShell({ children, courses }: { children: React.ReactNode; courses: Course[] }) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [mentorshipOpen, setMentorshipOpen] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <>
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenMentorship={() => setMentorshipOpen(true)}
      />

      <main>{children}</main>

      <Footer />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        courses={courses}
        onSelectCourse={(id) => {
          const found = courses.find(c => c.id === id || c.slug === id);
          if (found) router.push(`/courses/${found.slug || found.id}`);
        }}
      />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
      <MentorshipModal isOpen={mentorshipOpen} onClose={() => setMentorshipOpen(false)} />
    </>
  );
}
