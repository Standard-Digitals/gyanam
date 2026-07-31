'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { CURRENT_AFFAIRS_ITEMS, DAILY_QUIZ_QUESTIONS, FREE_RESOURCES } from '../../data/mockData';
import { 
  Calendar, Clock, BookOpen, Download, Share2, Bookmark, CheckCircle, 
  ArrowLeft, ArrowRight, Search, Filter, Sparkles, FileText, HelpCircle, 
  Layers, Award, Tag, Bell, Check, ChevronRight, ExternalLink, Zap,
  Flame, RefreshCw, ThumbsUp, MessageSquare
} from 'lucide-react';

const sscBankBanner = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1600';

export const CurrentAffairsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL tab handling or local state tab
  const activeTabFromUrl = searchParams.get('tab') || 'news';
  const [activeTab, setActiveTab] = useState<string>(activeTabFromUrl);
  
  // Category filter for News Analysis
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('All');

  // Bookmarks state in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gyanam_ca_bookmarks');
      return saved ? JSON.parse(saved) : ['ca-1'];
    } catch {
      return ['ca-1'];
    }
  });

  // Daily Quiz interactive state
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);

  // Sync tab state with URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/current-affairs?tab=${tab}`, { scroll: false });
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter(bId => bId !== id);
    } else {
      updated = [...bookmarkedIds, id];
    }
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('gyanam_ca_bookmarks', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Filter items logic
  const filteredArticles = CURRENT_AFFAIRS_ITEMS.filter((item) => {
    const matchesCategory = 
      selectedCategory === 'All' ? true :
      selectedCategory === 'Assam' ? (item.category === 'Assam & NE' || item.category === 'State Exams' || item.impForExams.some(e => e.includes('Assam'))) :
      item.category === selectedCategory;

    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bullets.some(b => b.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.impForExams.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDate = selectedDate === 'All' ? true : item.date.includes(selectedDate);

    return matchesCategory && matchesSearch && matchesDate;
  });

  // Quiz submission handler
  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleQuizSubmit = () => {
    let score = 0;
    DAILY_QUIZ_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score += 2; // +2 for correct
      }
    });
    setUserScore(score);
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setUserScore(0);
    setCurrentQuizIndex(0);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#1F1A1C] font-sans pb-20">
      
      {/* HERO BANNER WITH AMBIENT TEXTURE */}
      <section className="bg-[#1A0B0C] text-white py-12 px-4 sm:px-6 relative overflow-hidden border-b border-red-900/40">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={sscBankBanner}
            alt="Current Affairs Banner Texture"
            className="w-full h-full object-cover object-center opacity-40 scale-105 filter brightness-90 contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#6B1113] via-[#6B1113]/90 to-[#6B1113]/85" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#6B1113]/60 via-transparent to-[#6B1113]/95" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-[1320px] mx-auto space-y-6 relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
            <button onClick={() => router.push('/')} className="hover:text-white transition">Home</button>
            <span>/</span>
            <span className="text-[#C12223] font-bold">Current Affairs Daily Hub</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C12223]/20 border border-[#C12223]/40 text-[#FF6B6B] text-xs font-extrabold uppercase tracking-wide">
                <Flame className="w-3.5 h-3.5 text-[#FF6B6B] animate-pulse" />
                <span>Updated Every Morning at 7:00 AM</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Daily Current Affairs <span className="text-[#FF6B6B]">& Editorial Digest</span>
              </h1>
              
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                Curated news analysis, PIB summaries, state-specific Assam GK alerts, daily 5-MCQ live tests, and downloadable monthly PDF booklets tailored strictly for SSC, Banking, UPSC, and State Govt aspirants.
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
              <button 
                onClick={() => handleTabChange('quiz')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C12223] to-[#990000] text-white text-xs font-bold hover:shadow-lg hover:shadow-red-900/40 transition flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Take Today's 5-MCQ Quiz</span>
              </button>
              
              <button 
                onClick={() => handleTabChange('pdf')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download July PDF Booklet</span>
              </button>
            </div>
          </div>

          {/* MAIN TAB SWITCHER NAVIGATION */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => handleTabChange('news')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'news' 
                  ? 'bg-white text-[#1F1A1C] shadow-md' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-[#C12223]" />
              <span>Today's News Analysis</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-[#C12223] font-black">Daily</span>
            </button>

            <button
              onClick={() => handleTabChange('assam')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'assam' 
                  ? 'bg-white text-[#1F1A1C] shadow-md' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Assam & NE Special CA</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black">ADRE 3.0</span>
            </button>

            <button
              onClick={() => handleTabChange('quiz')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'quiz' 
                  ? 'bg-white text-[#1F1A1C] shadow-md' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Daily 5-MCQ Live Test</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-black">Interactive</span>
            </button>

            <button
              onClick={() => handleTabChange('pdf')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'pdf' 
                  ? 'bg-white text-[#1F1A1C] shadow-md' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Monthly PDF Booklets</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-black">Free</span>
            </button>

            <button
              onClick={() => handleTabChange('bookmarks')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'bookmarks' 
                  ? 'bg-white text-[#1F1A1C] shadow-md' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4 text-purple-400" />
              <span>Saved Articles</span>
              {bookmarkedIds.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-black">{bookmarkedIds.length}</span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* PAGE CONTENT BODY */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 pt-8 space-y-8">

        {/* TAB 1: NEWS ANALYSIS / GENERAL CURRENT AFFAIRS */}
        {(activeTab === 'news' || activeTab === 'assam') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* MAIN CONTENT AREA (8 COLS) */}
            <div className="lg:col-span-8 space-y-6">

              {/* SEARCH & FILTER CONTROLS */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-red-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  {/* Search Input */}
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search news by topic, keyword, or exam (e.g. RBI, ISRO, Assam)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C12223]/20 focus:border-[#C12223] transition"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')} 
                        className="text-xs font-bold text-gray-400 hover:text-gray-600 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Date Filter */}
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <Calendar className="w-4 h-4 text-[#C12223]" />
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C12223]/20 text-[#1F1A1C] cursor-pointer w-full sm:w-auto"
                    >
                      <option value="All">All Dates</option>
                      <option value="25 July">25 July 2026 (Today)</option>
                      <option value="24 July">24 July 2026 (Yesterday)</option>
                      <option value="23 July">23 July 2026</option>
                      <option value="22 July">22 July 2026</option>
                      <option value="21 July">21 July 2026</option>
                    </select>
                  </div>
                </div>

                {/* Category Pills */}
                {activeTab === 'news' && (
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-gray-100">
                    <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider shrink-0 mr-1">Category:</span>
                    {['All', 'Economy', 'Science & Tech', 'Assam & NE', 'International', 'Schemes'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
                          selectedCategory === cat 
                            ? 'bg-[#C12223] text-white shadow-sm' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* LIST OF ARTICLES */}
              {filteredArticles.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-4">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto" />
                  <h3 className="text-lg font-bold text-gray-700">No current affairs articles found</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Try searching for another keyword or clearing your category / date filters.
                  </p>
                  <button
                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setSelectedDate('All'); }}
                    className="px-4 py-2 bg-[#C12223] text-white text-xs font-bold rounded-xl hover:bg-[#A01B1C] transition cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredArticles.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl border border-red-100/80 shadow-sm hover:shadow-md transition-all overflow-hidden group flex flex-col sm:flex-row"
                    >
                      {/* Image Thumbnail */}
                      {item.thumbnail && (
                        <div className="sm:w-64 h-48 sm:h-auto bg-gray-100 overflow-hidden relative shrink-0">
                          <img 
                            src={item.thumbnail} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-3 left-3 bg-[#1F1A1C]/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                            {item.category}
                          </div>
                        </div>
                      )}

                      {/* Content Details */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2 text-xs font-bold text-gray-400">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-[#C12223]">
                                <Calendar className="w-3.5 h-3.5" /> {item.date}
                              </span>
                              <span className="flex items-center gap-1 text-gray-500">
                                <Clock className="w-3.5 h-3.5" /> {item.readTime}
                              </span>
                            </div>

                            <button
                              onClick={(e) => toggleBookmark(item.id, e)}
                              title={bookmarkedIds.includes(item.id) ? 'Remove Bookmark' : 'Save Article'}
                              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                bookmarkedIds.includes(item.id)
                                  ? 'bg-purple-50 text-purple-600 border-purple-200'
                                  : 'text-gray-400 hover:text-purple-600 border-gray-200'
                              }`}
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </button>
                          </div>

                          <h2 
                            onClick={() => router.push(`/current-affairs/${item.id}`)}
                            className="text-lg sm:text-xl font-black text-[#1F1A1C] group-hover:text-[#C12223] transition leading-snug cursor-pointer"
                          >
                            {item.title}
                          </h2>

                          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                            {item.summary}
                          </p>
                        </div>

                        {/* Bullet Highlights */}
                        <div className="bg-[#FFF5F5] rounded-xl p-3 border border-red-100/60 space-y-1.5">
                          {item.bullets.slice(0, 2).map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2 text-[11px] font-semibold text-[#444444]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C12223] shrink-0 mt-1" />
                              <span>{bullet}</span>
                            </div>
                          ))}
                        </div>

                        {/* Exam Relevance Tags & Detail Action */}
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mr-1">Exams:</span>
                            {item.impForExams.map((exam, eIdx) => (
                              <span key={eIdx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                                {exam}
                              </span>
                            ))}
                          </div>

                          <button
                            onClick={() => router.push(`/current-affairs/${item.id}`)}
                            className="text-xs font-bold text-[#C12223] hover:text-[#990000] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <span>Read Editorial & Take Quiz</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* SIDEBAR WIDGETS (4 COLS) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* WIDGET 1: DAILY 5-MCQ QUIZ CARD */}
              <div className="bg-gradient-to-br from-[#1F1A1C] to-[#3A0F11] text-white p-6 rounded-2xl border border-red-900/50 shadow-md space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wide">
                    <Zap className="w-3 h-3 text-amber-400" /> Live Daily Quiz
                  </div>
                  <span className="text-[11px] font-bold text-gray-300">5 Questions</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">Daily CA Test (25 July 2026)</h3>
                  <p className="text-xs text-gray-300">Test your retention with TCS-pattern MCQs updated daily.</p>
                </div>

                <div className="bg-white/10 rounded-xl p-3 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-200">
                    <span>Q1. Reserve Bank of India Repo Rate</span>
                    <span className="text-emerald-400">+2 Marks</span>
                  </div>
                  <p className="text-[11px] text-gray-300 line-clamp-2">
                    What is the current policy repo rate maintained by the Monetary Policy Committee?
                  </p>
                </div>

                <button
                  onClick={() => handleTabChange('quiz')}
                  className="w-full py-3 bg-[#C12223] hover:bg-[#A01B1C] text-white text-xs font-black rounded-xl transition shadow-lg shadow-red-900/50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start 5-Minute Quiz Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* WIDGET 2: FREE MONTHLY PDF DOWNLOAD */}
              <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-red-50 text-[#C12223]">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#1F1A1C]">July 2026 Monthly Magazine</h3>
                    <p className="text-xs text-gray-500">120+ Pages Color Printed PDF</p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  Includes static GK tricks, monthly timeline, national news, Assam special gazette highlights, and 200+ practice MCQs.
                </p>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified High Quality
                  </span>
                  <button 
                    onClick={() => handleTabChange('pdf')}
                    className="text-[#C12223] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Download Free PDF</span>
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* WIDGET 3: WHATSAPP / TELEGRAM DAILY ALERT SIGNUP */}
              <div className="bg-emerald-950 text-white p-6 rounded-2xl border border-emerald-800/60 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold uppercase">
                  <Bell className="w-4 h-4" /> Daily Morning Alert
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-black text-white">Get Daily 7 AM CA PDF on WhatsApp</h3>
                  <p className="text-xs text-emerald-200/80">Join 45,000+ aspirants receiving free daily news summaries directly on phone.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully for WhatsApp Daily CA Updates!'); }} className="space-y-2">
                  <input
                    type="tel"
                    placeholder="Enter WhatsApp Mobile Number"
                    className="w-full px-3.5 py-2.5 text-xs font-bold bg-white/10 border border-emerald-700/50 rounded-xl text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 text-xs font-black rounded-xl transition cursor-pointer"
                  >
                    Subscribe Daily WhatsApp Bulletin
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: DAILY 5-MCQ INTERACTIVE QUIZ */}
        {activeTab === 'quiz' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-red-100 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-100 text-[#C12223] text-xs font-black uppercase tracking-wider mb-2">
                    <Zap className="w-3.5 h-3.5" /> Daily 5-MCQ Speed Challenge
                  </div>
                  <h2 className="text-2xl font-black text-[#1F1A1C]">Today's Current Affairs Live Test</h2>
                  <p className="text-xs text-gray-500">Targeting TCS Pattern for SSC CGL, IBPS PO, Assam ADRE & UPSC</p>
                </div>

                {quizSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl text-center">
                    <span className="text-xs font-bold text-gray-500 block">Your Total Score</span>
                    <span className="text-xl font-black text-emerald-700">{userScore} / 10 Marks</span>
                  </div>
                ) : (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                      Object.keys(selectedAnswers).length > 0 
                        ? 'bg-[#C12223] hover:bg-[#A01B1C] text-white shadow-md' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Submit Test & View Answers
                  </button>
                )}
              </div>

              {/* Quiz Questions List */}
              <div className="space-y-8">
                {DAILY_QUIZ_QUESTIONS.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const selectedOpt = selectedAnswers[q.id];
                  const isCorrect = selectedOpt === q.correctAnswer;

                  return (
                    <div key={q.id} className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-[#1F1A1C] text-white text-xs font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-red-100 text-[#C12223]">
                            {q.examTag}
                          </span>
                        </div>

                        <span className="text-[11px] font-bold text-gray-400">2 Marks</span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-[#1F1A1C] leading-snug">
                        {q.question}
                      </h3>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {q.options.map((option, optIdx) => {
                          let optionStyle = "bg-white border-gray-200 text-[#1F1A1C] hover:border-[#C12223]";
                          
                          if (selectedOpt === optIdx) {
                            optionStyle = "bg-red-50 border-[#C12223] text-[#C12223] font-black";
                          }

                          if (quizSubmitted) {
                            if (optIdx === q.correctAnswer) {
                              optionStyle = "bg-emerald-50 border-emerald-500 text-emerald-800 font-black";
                            } else if (selectedOpt === optIdx && !isCorrect) {
                              optionStyle = "bg-red-100 border-red-500 text-red-800 font-bold line-through";
                            } else {
                              optionStyle = "bg-white border-gray-200 text-gray-400 opacity-60";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleAnswerSelect(q.id, optIdx)}
                              className={`p-3 rounded-xl border text-left text-xs transition flex items-center justify-between cursor-pointer ${optionStyle}`}
                            >
                              <span><strong className="mr-2 uppercase">{['A', 'B', 'C', 'D'][optIdx]}.</strong>{option}</span>
                              {quizSubmitted && optIdx === q.correctAnswer && (
                                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Detailed Explanation Box after Submit */}
                      {quizSubmitted && (
                        <div className="mt-4 p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs space-y-1">
                          <span className="font-extrabold text-blue-900 block">Explanation & Conceptual Key:</span>
                          <p className="text-blue-950 font-medium leading-relaxed">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={resetQuiz}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retake Test
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTabChange('news')}
                    className="px-5 py-2.5 bg-[#1F1A1C] hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Read Today's News Analysis
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: MONTHLY PDF BOOKLET DOWNLOAD CENTER */}
        {activeTab === 'pdf' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-red-100 shadow-sm space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#1F1A1C]">Current Affairs E-Books & Monthly Magazines</h2>
                <p className="text-xs text-gray-500">Free downloadable PDF compilations formatted for direct A4 printing</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {FREE_RESOURCES.filter(r => r.type === 'Current Affairs Magazine' || r.category.includes('Current Affairs')).concat([
                  {
                    id: 'ca-pdf-july-2026',
                    title: 'July 2026 Complete Current Affairs Monthly Digest',
                    type: 'Current Affairs Magazine',
                    category: 'All Exams',
                    fileSize: '14.2 MB PDF',
                    downloadsCount: 18400,
                    rating: 4.9,
                    description: 'Complete month roundup of National, International, Defense, Economy, Appointments, and 200+ Practice MCQs.'
                  },
                  {
                    id: 'ca-pdf-assam-2026',
                    title: 'Assam & Northeast Special CA Yearbook 2026',
                    type: 'Current Affairs Magazine',
                    category: 'Assam ADRE & APSC',
                    fileSize: '18.6 MB PDF',
                    downloadsCount: 22100,
                    rating: 4.95,
                    description: 'Comprehensive coverage of Assam Cabinet decisions, Budget 2026 highlights, Environment & Wildlife gazette for SLRC.'
                  }
                ]).map((res, rIdx) => (
                  <div key={rIdx} className="bg-gray-50 p-6 rounded-2xl border border-gray-200/80 hover:border-red-200 transition space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-red-100 text-[#C12223]">
                          {res.category}
                        </span>
                        <span className="text-xs font-bold text-gray-400">{res.fileSize}</span>
                      </div>

                      <h3 className="text-base font-black text-[#1F1A1C] leading-snug">{res.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{res.description}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-bold flex items-center gap-1">
                        <Download className="w-3.5 h-3.5 text-gray-400" /> {res.downloadsCount.toLocaleString()} Downloads
                      </span>
                      <button 
                        onClick={() => alert(`Downloading ${res.title}... PDF will start saved in your downloads.`)}
                        className="px-4 py-2 rounded-xl bg-[#C12223] hover:bg-[#A01B1C] text-white font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Free PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BOOKMARKED / SAVED ARTICLES */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-red-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-[#1F1A1C]">Your Saved Current Affairs Articles</h2>
                  <p className="text-xs text-gray-500">Quickly revise important news saved during your preparation</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-900 rounded-full">
                  {bookmarkedIds.length} Saved
                </span>
              </div>

              {bookmarkedIds.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Bookmark className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm font-bold text-gray-600">No saved articles yet.</p>
                  <p className="text-xs text-gray-400">Click the bookmark icon on any current affairs card to save it for quick revision.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {CURRENT_AFFAIRS_ITEMS.filter(item => bookmarkedIds.includes(item.id)).map(item => (
                    <div key={item.id} className="p-5 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                          <span className="text-[#C12223]">{item.category}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>
                        <h3 
                          onClick={() => router.push(`/current-affairs/${item.id}`)}
                          className="text-base font-bold text-[#1F1A1C] hover:text-[#C12223] transition cursor-pointer"
                        >
                          {item.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => router.push(`/current-affairs/${item.id}`)}
                          className="px-4 py-2 bg-[#C12223] text-white text-xs font-bold rounded-xl hover:bg-[#A01B1C] transition cursor-pointer"
                        >
                          Read Article
                        </button>
                        <button
                          onClick={(e) => toggleBookmark(item.id, e)}
                          className="px-3 py-2 bg-gray-200 hover:bg-red-100 text-gray-700 hover:text-red-700 text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
