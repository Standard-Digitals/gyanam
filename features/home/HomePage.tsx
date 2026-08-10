'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hero } from '@/components/Hero';
import { TrustBar } from '@/components/TrustBar';
import { StatsCounter } from '@/components/StatsCounter';
import { BentoGrid } from '@/components/BentoGrid';
import { CourseSection } from '@/components/CourseSection';
import { WhyGyanam } from '@/components/WhyGyanam';
import { LearningProcess } from '@/components/LearningProcess';
import { CurrentAffairs } from '@/components/CurrentAffairs';
import { MockTestDashboard } from '@/components/MockTestDashboard';
import { SuccessStories } from '@/components/SuccessStories';
import { YouTubeCollageSection } from '@/components/YouTubeCollageSection';
import { Mentors } from '@/components/Mentors';
import { MobileApp } from '@/components/MobileApp';
import { FreeResources } from '@/components/FreeResources';
import { BlogSection } from '@/components/BlogSection';
import { FAQSection } from '@/components/FAQSection';
import { FinalCTA } from '@/components/FinalCTA';
import { SearchModal } from '@/components/modals/SearchModal';
import { AuthModal } from '@/components/modals/AuthModal';
import { CourseModal } from '@/components/modals/CourseModal';
import { MentorshipModal } from '@/components/modals/MentorshipModal';
import { VideoModal } from '@/components/modals/VideoModal';
import { Course, SuccessStory, Mentor, BlogPost, FAQItem, CurrentAffairItem, DailyQuizQuestion, FreeResource } from '@/types';

interface HomePageProps {
  courses: Course[];
  mentors: Mentor[];
  blogPosts: BlogPost[];
  faqs: FAQItem[];
  successStories: SuccessStory[];
  currentAffairs: CurrentAffairItem[];
  quizQuestions: DailyQuizQuestion[];
  resources: FreeResource[];
}

export function HomePage({
  courses,
  mentors,
  blogPosts,
  faqs,
  successStories,
  currentAffairs,
  quizQuestions,
  resources,
}: HomePageProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [mentorshipOpen, setMentorshipOpen] = useState(false);
  const [selectedVideoStory, setSelectedVideoStory] = useState<SuccessStory | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [searchOpen, setSearchOpen] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <>
      <main>
        <Hero
          onStartLearning={() => handleOpenAuth('signup')}
          onExploreCourses={() => router.push('/courses')}
          onOpenMentorship={() => setMentorshipOpen(true)}
        />
        <TrustBar
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => { setSelectedCategory(catId); router.push('/courses'); }}
        />
        <StatsCounter />
        <BentoGrid
          onOpenMentorship={() => setMentorshipOpen(true)}
          onExploreMockTests={() => document.getElementById('mock-tests')?.scrollIntoView({ behavior: 'smooth' })}
        />
        <CourseSection
          courses={courses}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSelectCourse={(course) => router.push(`/courses/${course.slug || course.id}`)}
          onEnrollCourse={() => handleOpenAuth('signup')}
        />
        <WhyGyanam />
        <LearningProcess />
        <CurrentAffairs items={currentAffairs} quizQuestions={quizQuestions} />
        <MockTestDashboard />
        <SuccessStories stories={successStories} onPlayVideo={(story) => setSelectedVideoStory(story)} />
        <YouTubeCollageSection onPlayVideo={(story) => setSelectedVideoStory(story)} />
        <Mentors mentors={mentors} onOpenMentorship={() => setMentorshipOpen(true)} />
        <MobileApp />
        <FreeResources resources={resources} />
        <BlogSection posts={blogPosts} />
        <FAQSection faqs={faqs} />
        <FinalCTA
          onStartLearning={() => handleOpenAuth('signup')}
          onOpenMentorship={() => setMentorshipOpen(true)}
        />
      </main>
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        courses={courses}
        currentAffairs={currentAffairs}
        resources={resources}
        onSelectCourse={(id) => {
          const found = courses.find(c => c.id === id || c.slug === id);
          if (found) router.push(`/courses/${found.slug || found.id}`);
        }}
      />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
      <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} onEnroll={() => handleOpenAuth('signup')} />
      <MentorshipModal isOpen={mentorshipOpen} onClose={() => setMentorshipOpen(false)} />
      <VideoModal story={selectedVideoStory} onClose={() => setSelectedVideoStory(null)} />
    </>
  );
}
