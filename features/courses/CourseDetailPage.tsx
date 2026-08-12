"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Course } from '../../types';
import { 
  ArrowLeft, Star, Users, Clock, BookOpen, CheckCircle, PlayCircle, Download, 
  ShieldCheck, Sparkles, Tag, Video, FileText, HelpCircle, PhoneCall, Award, 
  ChevronDown, ChevronRight, Check, Share2, Layers, Calendar, Lock, Globe,
  MessageSquare, UserCheck, AlertCircle, RefreshCw
} from 'lucide-react';

export interface CurriculumTopic {
  id: string;
  title: string;
  videoType: string;
  videoUrl: string | null;
  duration: string | null;
}

export interface CurriculumChapter {
  id: string;
  title: string;
  topics: CurriculumTopic[];
}

interface CourseDetailPageProps {
  course: Course;
  relatedCourses: Course[];
  curriculum?: CurriculumChapter[];
  isEnrolled?: boolean;
  onBackToCourses?: () => void;
  onBackToHome?: () => void;
  onSelectCourseBySlug?: (slug: string) => void;
  onEnrollCourse?: (course: Course) => void;
  onOpenMentorship?: () => void;
}

function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  const videoId = match ? match[1] : '';
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({
  course,
  relatedCourses,
  curriculum = [],
  isEnrolled = false,
  onBackToCourses,
  onBackToHome,
  onSelectCourseBySlug,
  onEnrollCourse,
  onOpenMentorship,
}) => {
  const router = useRouter();
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState('');
  const handleEnroll = async (course: Course) => {
    if (onEnrollCourse) {
      onEnrollCourse(course);
      return;
    }
    if (enrolled) {
      router.push('/dashboard/courses');
      return;
    }
    setEnrollError('');
    setIsEnrolling(true);
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id }),
      });
      const data = await res.json();
      if (res.status === 401) {
        setEnrollError('Please login first (use the header) to enroll in this batch.');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Failed to enroll');
      setEnrolled(true);
      router.refresh();
    } catch (err) {
      setEnrollError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };
  const handleMentorship = () => { if (onOpenMentorship) onOpenMentorship(); else router.push('/?mentorship=true'); };

  const handleBackToCourses = () => {
    if (onBackToCourses) onBackToCourses();
    else router.push('/courses');
  };

  const handleBackToHome = () => {
    if (onBackToHome) onBackToHome();
    else router.push('/');
  };

  const handleSelectCourseSlug = (slug: string) => {
    if (onSelectCourseBySlug) onSelectCourseBySlug(slug);
    else router.push(`/courses/${slug}`);
  };

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'faculty' | 'reviews' | 'faq'>('overview');

  // Interactive Video Player State
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);

  // Coupon Engine State
  const [couponInput, setCouponInput] = useState<string>('GYANM2026');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('GYANM2026');
  const [couponMessage, setCouponMessage] = useState<string>('🎉 Early Bird Discount Applied! Extra 10% Off.');

  // Open Module Accordions
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);

  // Real Curriculum Lecture Player
  const [expandedChapters, setExpandedChapters] = useState<string[]>(curriculum[0] ? [curriculum[0].id] : []);
  const [playingTopic, setPlayingTopic] = useState<CurriculumTopic | null>(null);
  const toggleChapter = (id: string) => {
    setExpandedChapters((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  // Toast Notification for Brochure Download
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Fee calculation with coupon
  const discountAmount = appliedCoupon ? Math.round(course.discountPrice * 0.1) : 0;
  const finalPrice = course.discountPrice - discountAmount;
  const monthlyEmi = Math.round(finalPrice / 12);

  const toggleModule = (idx: number) => {
    if (expandedModules.includes(idx)) {
      setExpandedModules(expandedModules.filter(i => i !== idx));
    } else {
      setExpandedModules([...expandedModules, idx]);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.toUpperCase().trim();
    if (code === 'GYANM2026' || code === 'OFFICER20' || code === 'ASSAM10') {
      setAppliedCoupon(code);
      setCouponMessage(`🎉 Coupon "${code}" Applied Successfully! 10% Discount added.`);
    } else {
      setAppliedCoupon(null);
      setCouponMessage('❌ Invalid Coupon Code. Try using GYANM2026.');
    }
  };

  const handleDownloadBrochure = () => {
    setDownloadToast(`📥 Downloading official syllabus brochure for ${course.title}...`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#1F1A1C] font-sans pb-20">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {downloadToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-[#1F1A1C] text-white px-5 py-3 rounded-2xl shadow-2xl border border-red-500/30 text-xs font-bold flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>{downloadToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER / BREADCRUMB HERO */}
      <section className="bg-gradient-to-br from-[#8C1317] via-[#8C1306] to-[#8C1316] text-white py-10 px-4 sm:px-6 relative overflow-hidden border-b border-red-900/40">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1320px] mx-auto space-y-6 px-8 sm:px-6">
          
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-gray-300">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBackToHome}
                className="hover:text-amber-300 transition cursor-pointer flex items-center gap-1"
              >
                Home
              </button>
              <span>/</span>
              <button
                onClick={handleBackToCourses}
                className="hover:text-amber-300 transition cursor-pointer"
              >
                All Courses
              </button>
              <span>/</span>
              <span className="text-amber-300">{course.category}</span>
              <span>/</span>
              <span className="text-white truncate max-w-[200px] sm:max-w-xs">{course.title}</span>
            </div>

            <button
              onClick={handleBackToCourses}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 border border-white/20 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Batch Directory
            </button>
          </div>

          {/* Course Main Details */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 bg-[#C12223] text-white font-black text-[11px] uppercase rounded-full tracking-wider shadow">
                  {course.category} Exam
                </span>
                {course.badge && (
                  <span className="px-3 py-1 bg-amber-400 text-[#1F1A1C] font-black text-[11px] rounded-full shadow flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> {course.badge}
                  </span>
                )}
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 text-[11px] font-bold rounded-full">
                  Target: {course.targetExam}
                </span>
              </div>

              {/* Course Title */}
              <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              {/* Sub-info Badges */}
              <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-gray-200 pt-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-extrabold bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{course.rating} / 5.0 ({course.reviewsCount} verified reviews)</span>
                </div>

                <div className="flex items-center gap-1.5 text-white/90">
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>{course.studentsEnrolled.toLocaleString()} Students Enrolled</span>
                </div>

                <div className="flex items-center gap-1.5 text-white/90">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Medium: {course.language}</span>
                </div>
              </div>

              {/* Quick Spec Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-0.5">
                  <span className="text-[10px] text-gray-300 uppercase font-extrabold block">Duration</span>
                  <span className="text-xs font-black text-white">{course.duration}</span>
                </div>

                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-0.5">
                  <span className="text-[10px] text-gray-300 uppercase font-extrabold block">Total Lectures</span>
                  <span className="text-xs font-black text-white">{course.lessonsCount}+ High Def VODs</span>
                </div>

                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-0.5">
                  <span className="text-[10px] text-gray-300 uppercase font-extrabold block">Batch Schedule</span>
                  <span className="text-xs font-black text-amber-300">{course.startDate}</span>
                </div>

                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-0.5">
                  <span className="text-[10px] text-gray-300 uppercase font-extrabold block">Course Validity</span>
                  <span className="text-xs font-black text-emerald-300">1 Year Unlimited Access</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* MAIN TWO-COLUMN BODY CONTENT */}
      <section className="max-w-[1320px] mx-auto px-8 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Main Tabs & Curriculum */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Tab Navigation Controls */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#F3DCDD] no-scrollbar">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-5 py-3 rounded-2xl text-xs font-black transition shrink-0 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#C12223] text-white shadow-md'
                    : 'bg-white text-[#555555] hover:text-[#C12223] border border-[#F3DCDD]'
                }`}
              >
                <BookOpen className="w-4 h-4" /> Batch Overview
              </button>

              <button
                onClick={() => setActiveTab('syllabus')}
                className={`px-5 py-3 rounded-2xl text-xs font-black transition shrink-0 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'syllabus'
                    ? 'bg-[#C12223] text-white shadow-md'
                    : 'bg-white text-[#555555] hover:text-[#C12223] border border-[#F3DCDD]'
                }`}
              >
                <Layers className="w-4 h-4" /> Complete Syllabus ({course.syllabusOverview.length} Modules)
              </button>

              <button
                onClick={() => setActiveTab('faculty')}
                className={`px-5 py-3 rounded-2xl text-xs font-black transition shrink-0 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'faculty'
                    ? 'bg-[#C12223] text-white shadow-md'
                    : 'bg-white text-[#555555] hover:text-[#C12223] border border-[#F3DCDD]'
                }`}
              >
                <UserCheck className="w-4 h-4" /> Lead Faculty
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-5 py-3 rounded-2xl text-xs font-black transition shrink-0 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'bg-[#C12223] text-white shadow-md'
                    : 'bg-white text-[#555555] hover:text-[#C12223] border border-[#F3DCDD]'
                }`}
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> Student Feedback
              </button>

              <button
                onClick={() => setActiveTab('faq')}
                className={`px-5 py-3 rounded-2xl text-xs font-black transition shrink-0 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'faq'
                    ? 'bg-[#C12223] text-white shadow-md'
                    : 'bg-white text-[#555555] hover:text-[#C12223] border border-[#F3DCDD]'
                }`}
              >
                <HelpCircle className="w-4 h-4" /> Admission FAQs
              </button>
            </div>

            {/* TAB CONTENT PANELS */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                
                {/* Video Demo Player Box */}
                <div className="bg-white p-6 rounded-3xl border border-[#F3DCDD] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#C12223] tracking-wider block">
                        Free Orientation Lecture
                      </span>
                      <h3 className="font-heading font-black text-xl text-[#1F1A1C]">
                        Sample Class Demo & Strategy Session
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-[#C12223] font-bold text-xs rounded-full flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5" /> 45 Mins Demo
                    </span>
                  </div>

                  {isPlayingDemo ? (
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg relative">
                      <button
                        onClick={() => setIsPlayingDemo(false)}
                        className="absolute top-3 right-3 px-3 py-1 bg-black/80 text-white rounded-xl text-xs font-bold z-10 hover:bg-black cursor-pointer"
                      >
                        Close Video
                      </button>
                      <iframe
                        src="https://www.youtube.com/embed/kqtD5dpn9C8?autoplay=1"
                        title="Sample Demo Lecture"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer border border-gray-200" onClick={() => setIsPlayingDemo(true)}>
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col items-center justify-center text-center p-6 text-white space-y-3">
                        <div className="w-16 h-16 bg-[#C12223] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
                          <PlayCircle className="w-8 h-8 text-white fill-white" />
                        </div>
                        <h4 className="font-bold text-base sm:text-lg">Click to Watch Free Sample Class for {course.targetExam}</h4>
                        <p className="text-xs text-gray-200">Learn shortcut techniques & exam orientation directly from senior faculty</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Key Course Deliverables */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3DCDD] shadow-sm space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#C12223] tracking-wider block">
                      Everything You Get in This Batch
                    </span>
                    <h3 className="font-heading font-black text-2xl text-[#1F1A1C]">
                      Comprehensive Prep Ecosystem Included
                    </h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {course.features.map((feature, idx) => (
                      <div key={idx} className="p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] flex items-start gap-3">
                        <div className="w-7 h-7 bg-[#C12223] rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-[#1F1A1C]">{feature}</h5>
                          <p className="text-[11px] text-[#555555] mt-0.5">Designed according to TCS latest revised exam syllabus</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What You Will Learn Grid */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3DCDD] shadow-sm space-y-6">
                  <h3 className="font-heading font-black text-2xl text-[#1F1A1C]">
                    Core Learning Outcomes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 bg-red-50/60 rounded-2xl border border-red-100 space-y-2">
                      <Award className="w-6 h-6 text-[#C12223]" />
                      <h5 className="font-bold text-sm text-[#1F1A1C]">Calculation Speed Hacks</h5>
                      <p className="text-[#555555] leading-relaxed">Master Vedic math shortcuts and 5-second mental math tricks to solve Quant & DI in record time.</p>
                    </div>

                    <div className="p-4 bg-red-50/60 rounded-2xl border border-red-100 space-y-2">
                      <FileText className="w-6 h-6 text-[#C12223]" />
                      <h5 className="font-bold text-sm text-[#1F1A1C]">Bilingual Handwritten PDFs</h5>
                      <p className="text-[#555555] leading-relaxed">Get printable, chapter-wise notes written in easy Assamese & English for quick revision before exams.</p>
                    </div>

                    <div className="p-4 bg-red-50/60 rounded-2xl border border-red-100 space-y-2">
                      <ShieldCheck className="w-6 h-6 text-[#C12223]" />
                      <h5 className="font-bold text-sm text-[#1F1A1C]">150+ Full TCS Mocks</h5>
                      <p className="text-[#555555] leading-relaxed">Attempt exact replica online tests with instant All-India rank analytics and detailed video solutions.</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* SYLLABUS TAB */}
            {activeTab === 'syllabus' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3DCDD] shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3DCDD] pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C12223] tracking-wider block">
                      Detailed Curriculum Breakdown
                    </span>
                    <h3 className="font-heading font-black text-2xl text-[#1F1A1C]">
                      Module-Wise Subject Syllabus
                    </h3>
                  </div>

                  <button
                    onClick={handleDownloadBrochure}
                    className="px-4 py-2 bg-[#C12223] hover:bg-[#8C1316] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow cursor-pointer self-start sm:self-auto"
                  >
                    <Download className="w-4 h-4" /> Download PDF Syllabus
                  </button>
                </div>

                {/* Real Recorded/Live Lecture Curriculum */}
                {curriculum.length > 0 && (
                  <div className="space-y-4 border-b border-[#F3DCDD] pb-6 mb-2">
                    <h4 className="font-heading font-black text-lg text-[#1F1A1C] flex items-center gap-2">
                      <Video className="w-5 h-5 text-[#C12223]" /> Course Lectures
                    </h4>
                    {curriculum.map((chapter) => {
                      const isOpen = expandedChapters.includes(chapter.id);
                      return (
                        <div key={chapter.id} className="border border-[#F3DCDD] rounded-2xl overflow-hidden">
                          <button
                            onClick={() => toggleChapter(chapter.id)}
                            className={`w-full p-4 flex items-center justify-between text-left font-extrabold text-sm cursor-pointer transition ${
                              isOpen ? 'bg-[#FFF5F5] text-[#C12223]' : 'bg-white text-[#1F1A1C] hover:bg-gray-50'
                            }`}
                          >
                            <span>{chapter.title}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-[#C12223]' : 'text-gray-400'}`} />
                          </button>
                          {isOpen && (
                            <div className="p-4 bg-white border-t border-[#F3DCDD] space-y-2">
                              {chapter.topics.map((topic) => (
                                <button
                                  key={topic.id}
                                  onClick={() => topic.videoUrl && setPlayingTopic(topic)}
                                  disabled={!topic.videoUrl}
                                  className="w-full flex items-center justify-between p-3 bg-[#FFF5F5] rounded-xl border border-[#F3DCDD] text-xs font-semibold text-[#1F1A1C] hover:border-[#C12223] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <span className="flex items-center gap-2">
                                    <PlayCircle className="w-4 h-4 text-[#C12223] shrink-0" />
                                    {topic.title}
                                  </span>
                                  {topic.duration && <span className="text-[10px] text-[#888888]">{topic.duration}</span>}
                                </button>
                              ))}
                              {chapter.topics.length === 0 && (
                                <p className="text-xs text-[#888888] italic">No lectures added yet.</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Modules Accordion */}
                <div className="space-y-4">
                  {course.syllabusOverview.map((mod, idx) => {
                    const isOpen = expandedModules.includes(idx);
                    return (
                      <div key={idx} className="border border-[#F3DCDD] rounded-2xl overflow-hidden transition">
                        <button
                          onClick={() => toggleModule(idx)}
                          className={`w-full p-4 flex items-center justify-between text-left font-extrabold text-sm transition cursor-pointer ${
                            isOpen ? 'bg-[#FFF5F5] text-[#C12223]' : 'bg-white text-[#1F1A1C] hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 bg-[#C12223] text-white rounded-lg text-xs font-black flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span>{mod.module}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-[#C12223]' : 'text-gray-400'}`} />
                        </button>

                        {isOpen && (
                          <div className="p-5 bg-white border-t border-[#F3DCDD] space-y-3">
                            <span className="text-xs font-bold text-[#555555] block">Topics Covered in this Module:</span>
                            <div className="grid sm:grid-cols-2 gap-2 text-xs">
                              {mod.topics.map((t, tid) => (
                                <div key={tid} className="p-2.5 bg-[#FFF5F5] rounded-xl border border-[#F3DCDD] font-medium text-[#1F1A1C] flex items-center gap-2">
                                  <CheckCircle className="w-3.5 h-3.5 text-[#27AE60] shrink-0" />
                                  <span>{t}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FACULTY TAB */}
            {activeTab === 'faculty' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3DCDD] shadow-sm space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-[#C12223] tracking-wider block">
                    Learn From Selected Officers & Experts
                  </span>
                  <h3 className="font-heading font-black text-2xl text-[#1F1A1C]">
                    Lead Batch Instructor
                  </h3>
                </div>

                <div className="p-6 bg-[#FFF5F5] rounded-3xl border border-[#F3DCDD] flex flex-col md:flex-row items-center gap-6">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-28 h-28 rounded-3xl object-cover border-4 border-[#C12223] shadow-md shrink-0"
                  />
                  <div className="space-y-2 text-center md:text-left">
                    <span className="px-2.5 py-0.5 bg-[#C12223] text-white font-bold text-[10px] rounded uppercase">
                      Senior Academic Mentor
                    </span>
                    <h4 className="font-heading font-black text-2xl text-[#1F1A1C]">
                      {course.instructor.name}
                    </h4>
                    <p className="text-xs font-bold text-[#C12223]">
                      {course.instructor.designation}
                    </p>
                    <p className="text-xs text-[#555555] leading-relaxed">
                      Has personally mentored over 15,000+ candidates who are currently serving across Central Ministries, State Secretariat, Railways, and Public Sector Banks.
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-extrabold text-[#1F1A1C] pt-2">
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.95 Mentor Rating
                      </span>
                      <span>• 10,000+ Selections</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3DCDD] shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C12223] tracking-wider block">
                      Student Success Testimonials
                    </span>
                    <h3 className="font-heading font-black text-2xl text-[#1F1A1C]">
                      What Selected Aspirants Say
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-black text-3xl text-[#1F1A1C]">{course.rating}</span>
                    <span className="text-xs text-[#888888] block">Out of 5.0 Rating</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] space-y-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-[#1F1A1C] italic font-medium leading-relaxed">
                      "Joining this batch for {course.targetExam} was the turning point of my preparation. The shortcut tricks and weekly mock tests gave me huge confidence."
                    </p>
                    <div className="pt-2 border-t border-[#F3DCDD] flex items-center justify-between">
                      <span className="font-bold text-[#1F1A1C]">Anurag Gogoi (Selected)</span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">Verified Student</span>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] space-y-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-[#1F1A1C] italic font-medium leading-relaxed">
                      "The Assamese + English bilingual study material and doubt classes saved me from wasting time on unorganized YouTube videos."
                    </p>
                    <div className="pt-2 border-t border-[#F3DCDD] flex items-center justify-between">
                      <span className="font-bold text-[#1F1A1C]">Sunita Das (Assam Police SI)</span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">Verified Student</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ TAB */}
            {activeTab === 'faq' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3DCDD] shadow-sm space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-[#C12223] tracking-wider block">
                    Frequently Asked Questions
                  </span>
                  <h3 className="font-heading font-black text-2xl text-[#1F1A1C]">
                    Admission & Access Details
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] space-y-1">
                    <h5 className="font-bold text-sm text-[#1F1A1C]">How soon do I get course access after enrolling?</h5>
                    <p className="text-[#555555] leading-relaxed">Instant! As soon as your payment is complete, your mobile number gets activated and all batch lectures + notes are unlocked immediately on web and mobile app.</p>
                  </div>

                  <div className="p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] space-y-1">
                    <h5 className="font-bold text-sm text-[#1F1A1C]">Can I watch recorded lectures offline on mobile?</h5>
                    <p className="text-[#555555] leading-relaxed">Yes, the GYANM Android app allows 1-click encrypted offline downloads so you can study without internet.</p>
                  </div>

                  <div className="p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] space-y-1">
                    <h5 className="font-bold text-sm text-[#1F1A1C]">What if I have doubts while studying?</h5>
                    <p className="text-[#555555] leading-relaxed">You get access to a dedicated 24/7 faculty Telegram doubt forum and live weekend doubt clearing webinars.</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: STICKY ENROLLMENT PRICING CARD */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            
            <div className="bg-white rounded-3xl border border-[#F3DCDD] shadow-2xl p-6 space-y-6 overflow-hidden relative">
              
              {/* Course Thumbnail */}
              <div className="relative h-48 rounded-2xl overflow-hidden bg-black group border border-gray-200 shadow-md">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                />
                
                {/* Badge Overlay with z-10 */}
                <div className="absolute top-3 right-3 z-10 bg-[#C12223] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-lg border border-white/20 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Guaranteed Syllabus
                </div>

                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlayingDemo(true)}
                    className="px-4 py-2.5 bg-[#C12223] hover:bg-[#8C1316] text-white rounded-full shadow-2xl hover:scale-105 transition cursor-pointer flex items-center gap-2 text-xs font-bold border border-white/20"
                  >
                    <PlayCircle className="w-5 h-5" /> Watch Sample Lecture
                  </button>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="space-y-2 border-b border-[#F3DCDD] pb-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#888888] font-bold uppercase">Discounted Batch Fee</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded">
                    Save {Math.round(((course.originalPrice - finalPrice) / course.originalPrice) * 100)}% Today
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="font-heading font-black text-4xl text-[#1F1A1C]">
                    ₹{finalPrice.toLocaleString()}
                  </span>
                  <span className="text-base text-[#888888] line-through font-semibold">
                    ₹{course.originalPrice.toLocaleString()}
                  </span>
                </div>

                <span className="text-xs text-[#27AE60] font-bold block">
                  ⚡ No-Cost Monthly EMI starting at ₹{monthlyEmi}/month
                </span>
              </div>

              {/* Coupon Engine Form */}
              <div className="space-y-2 bg-[#FFF5F5] p-3.5 rounded-2xl border border-[#F3DCDD]">
                <div className="flex items-center justify-between text-xs font-bold text-[#C12223]">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Have a Promo Coupon?
                  </span>
                </div>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon"
                    className="px-3 py-2 bg-white border border-[#F3DCDD] rounded-xl text-xs font-extrabold uppercase focus:outline-none focus:border-[#C12223] flex-1 text-[#1F1A1C]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#C12223] hover:bg-[#8C1316] text-white rounded-xl text-xs font-bold transition shadow cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {couponMessage && (
                  <p className={`text-[10px] font-extrabold ${appliedCoupon ? 'text-emerald-700' : 'text-red-600'}`}>
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => handleEnroll(course)}
                  disabled={isEnrolling}
                  className={`w-full py-4 font-black text-sm rounded-2xl shadow-xl transition hover:scale-102 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider disabled:opacity-60 ${
                    enrolled
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                      : 'bg-gradient-to-r from-[#EF4444] to-[#B91C1C] hover:opacity-95 text-white shadow-[#C12223]/30'
                  }`}
                >
                  <span>
                    {isEnrolling ? 'Enrolling...' : enrolled ? '✓ Enrolled — Go to My Courses' : 'Enroll in Batch Now (Free)'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {enrollError && (
                  <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{enrollError}</p>
                )}

                <button
                  onClick={handleDownloadBrochure}
                  className="w-full py-3 bg-[#FFF5F5] hover:bg-[#F3DCDD] text-[#1F1A1C] border border-[#F3DCDD] font-extrabold text-xs rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#C12223]" /> Download Full Syllabus PDF
                </button>

                <button
                  onClick={handleMentorship}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-[#1F1A1C] font-extrabold text-xs rounded-2xl transition flex items-center justify-center gap-2 shadow cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#1F1A1C]" /> Speak to Academic Counselor
                </button>
              </div>

              {/* Guarantees */}
              <div className="space-y-2 pt-2 border-t border-[#F3DCDD] text-[11px] text-[#555555]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Safe Payment & Instant Course Activation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#C12223] shrink-0" />
                  <span>Includes Printed / Digital Study Material</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>7-Day Refund Policy Assurance</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-2 text-center space-y-1.5">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Accepted Payment Modes</span>
                <div className="flex items-center justify-center gap-2 text-[10px] font-extrabold text-gray-600">
                  <span className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200">UPI</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200">Cards</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200">NetBanking</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200">EMI</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* RELATED COURSES SECTION */}
        <div className="mt-16 pt-10 border-t border-[#F3DCDD] space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-[#C12223] tracking-wider block">
                Similar Government Exam Batches
              </span>
              <h3 className="font-heading font-black text-2xl text-[#1F1A1C]">
                You Might Also Be Interested In
              </h3>
            </div>
            <button
              onClick={handleBackToCourses}
              className="text-xs font-bold text-[#C12223] hover:underline cursor-pointer flex items-center gap-1"
            >
              View All Batches →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedCourses.map((relCourse) => (
              <div
                key={relCourse.id}
                onClick={() => handleSelectCourseSlug(relCourse.slug || relCourse.id)}
                className="bg-white p-5 rounded-3xl border border-[#F3DCDD] shadow-md hover:shadow-xl transition cursor-pointer space-y-4 group"
              >
                <div className="relative h-40 rounded-2xl overflow-hidden bg-black">
                  <img
                    src={relCourse.thumbnail}
                    alt={relCourse.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-[#C12223] text-white font-bold text-[9px] rounded uppercase shadow">
                    {relCourse.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#C12223]">{relCourse.targetExam}</span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {relCourse.rating}
                    </span>
                  </div>

                  <h4 className="font-heading font-black text-base text-[#1F1A1C] group-hover:text-[#C12223] transition line-clamp-2">
                    {relCourse.title}
                  </h4>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F3DCDD]">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-bold">Batch Fee</span>
                      <span className="font-heading font-black text-lg text-[#1F1A1C]">
                        ₹{relCourse.discountPrice}
                      </span>
                    </div>

                    <span className="px-3 py-1.5 bg-[#FFF5F5] text-[#C12223] font-extrabold text-xs rounded-xl group-hover:bg-[#C12223] group-hover:text-white transition">
                      Explore Batch →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Curriculum Lecture Video Player Modal */}
      <AnimatePresence>
        {playingTopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="flex items-center justify-between p-3 bg-gray-900 text-white">
                <span className="text-sm font-bold truncate pr-4">{playingTopic.title}</span>
                <button
                  onClick={() => setPlayingTopic(null)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                >
                  Close
                </button>
              </div>
              <div className="aspect-video bg-black">
                {playingTopic.videoUrl && playingTopic.videoType === 'youtube' ? (
                  <iframe
                    src={getYouTubeEmbedUrl(playingTopic.videoUrl)}
                    title={playingTopic.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : playingTopic.videoUrl ? (
                  <video src={playingTopic.videoUrl} controls autoPlay className="w-full h-full" />
                ) : null}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
