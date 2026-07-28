import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { StatsCounter } from './components/StatsCounter';
import { BentoGrid } from './components/BentoGrid';
import { CourseSection } from './components/CourseSection';
import { WhyGyanam } from './components/WhyGyanam';
import { LearningProcess } from './components/LearningProcess';
import { CurrentAffairs } from './components/CurrentAffairs';
import { MockTestDashboard } from './components/MockTestDashboard';
import { SuccessStories } from './components/SuccessStories';
import { YouTubeCollageSection } from './components/YouTubeCollageSection';
import { Mentors } from './components/Mentors';
import { MobileApp } from './components/MobileApp';
import { FreeResources } from './components/FreeResources';
import { BlogSection } from './components/BlogSection';
import { FAQSection } from './components/FAQSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { FloatingQrWidget } from './components/FloatingQrWidget';

// Modals
import { SearchModal } from './components/modals/SearchModal';
import { AuthModal } from './components/modals/AuthModal';
import { CourseModal } from './components/modals/CourseModal';
import { MentorshipModal } from './components/modals/MentorshipModal';
import { VideoModal } from './components/modals/VideoModal';

import { Course, SuccessStory } from './types';
import { COURSES_DATA } from './data/mockData';

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [mentorshipOpen, setMentorshipOpen] = useState(false);
  const [selectedVideoStory, setSelectedVideoStory] = useState<SuccessStory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleSelectCourseById = (courseId: string) => {
    const found = COURSES_DATA.find(c => c.id === courseId);
    if (found) {
      setSelectedCourse(found);
    }
  };

  const handleEnrollCourse = (course: Course) => {
    setSelectedCourse(null);
    handleOpenAuth('signup');
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#1F1A1C] font-sans antialiased selection:bg-[#C12223] selection:text-white">
      {/* Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenMentorship={() => setMentorshipOpen(true)}
      />

      <main>
        {/* Hero Section */}
        <Hero
          onStartLearning={() => handleOpenAuth('signup')}
          onExploreCourses={() => {
            const el = document.getElementById('courses');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenMentorship={() => setMentorshipOpen(true)}
        />

        {/* Trust Bar & Exam Categories */}
        <TrustBar
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            const el = document.getElementById('courses');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Stats Counter */}
        <StatsCounter />

        {/* Bento Grid Features */}
        <BentoGrid
          onOpenMentorship={() => setMentorshipOpen(true)}
          onExploreMockTests={() => {
            const el = document.getElementById('mock-tests');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Popular Courses */}
        <CourseSection
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSelectCourse={(course) => setSelectedCourse(course)}
          onEnrollCourse={(course) => handleEnrollCourse(course)}
        />

        {/* Why Gyanam + Savings Calculator */}
        <WhyGyanam />

        {/* Learning Process Timeline */}
        <LearningProcess />

        {/* Daily Current Affairs & Interactive Quiz */}
        <CurrentAffairs />

        {/* Mock Test Simulator */}
        <MockTestDashboard />

        {/* Success Stories & Hall of Fame (Photo Marquee) */}
        <SuccessStories
          onPlayVideo={(story) => setSelectedVideoStory(story)}
        />

        {/* YouTube Video Collage Hub */}
        <YouTubeCollageSection
          onPlayVideo={(story) => setSelectedVideoStory(story)}
        />

        {/* Faculty Mentors */}
        <Mentors
          onOpenMentorship={() => setMentorshipOpen(true)}
        />

        {/* Mobile App Showcase */}
        <MobileApp />

        {/* Free Resources & PDF Downloads */}
        <FreeResources />

        {/* Blog & Exam Notifications */}
        <BlogSection />

        {/* FAQ Accordion */}
        <FAQSection />

        {/* Final CTA Banner */}
        <FinalCTA
          onStartLearning={() => handleOpenAuth('signup')}
          onOpenMentorship={() => setMentorshipOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Popups */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectCourse={handleSelectCourseById}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />

      <CourseModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnroll={handleEnrollCourse}
      />

      <MentorshipModal
        isOpen={mentorshipOpen}
        onClose={() => setMentorshipOpen(false)}
      />

      <VideoModal
        story={selectedVideoStory}
        onClose={() => setSelectedVideoStory(null)}
      />

      {/* Floating Scroll To Top Button */}
      <ScrollToTop />

      {/* Floating Side Right Center QR Code Widget */}
      <FloatingQrWidget />
    </div>
  );
}
