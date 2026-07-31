'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { CURRENT_AFFAIRS_ITEMS } from '../../data/mockData';
import { CurrentAffairItem } from '../../types';
import { 
  ArrowLeft, Calendar, Clock, Bookmark, Share2, Download, CheckCircle, 
  BookOpen, Tag, Award, Sparkles, HelpCircle, ArrowRight, ThumbsUp, 
  Copy, Check, FileText, Zap, ChevronRight
} from 'lucide-react';

const sscBankBanner = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1600';

export const CurrentAffairsDetailPage: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();

  // Find article by id or slug
  const article: CurrentAffairItem | undefined = CURRENT_AFFAIRS_ITEMS.find(
    item => item.id === id || item.slug === id
  ) || CURRENT_AFFAIRS_ITEMS[0]; // fallback to first item if not found

  // Local interaction states
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('Gyanam_ca_bookmarks');
      const arr = saved ? JSON.parse(saved) : [];
      return article ? arr.includes(article.id) : false;
    } catch {
      return false;
    }
  });

  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(342);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  // Interactive MCQ state
  const [selectedMcqOpt, setSelectedMcqOpt] = useState<number | null>(null);
  const [showMcqAnswer, setShowMcqAnswer] = useState<boolean>(false);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 max-w-md space-y-4 shadow-sm">
          <FileText className="w-12 h-12 text-gray-300 mx-auto" />
          <h2 className="text-xl font-bold text-gray-800">Article Not Found</h2>
          <p className="text-xs text-gray-500">The current affairs post you are looking for might have been moved or updated.</p>
          <button 
            onClick={() => router.push('/current-affairs')}
            className="px-4 py-2 bg-[#C12223] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Back to Current Affairs Hub
          </button>
        </div>
      </div>
    );
  }

  const toggleBookmark = () => {
    try {
      const saved = localStorage.getItem('Gyanam_ca_bookmarks');
      let arr = saved ? JSON.parse(saved) : [];
      if (isBookmarked) {
        arr = arr.filter((bId: string) => bId !== article.id);
        setIsBookmarked(false);
      } else {
        arr.push(article.id);
        setIsBookmarked(true);
      }
      localStorage.setItem('Gyanam_ca_bookmarks', JSON.stringify(arr));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleLike = () => {
    if (!userLiked) {
      setLikesCount(prev => prev + 1);
      setUserLiked(true);
    }
  };

  const otherArticles = CURRENT_AFFAIRS_ITEMS.filter(item => item.id !== article.id);

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#1F1A1C] font-sans pb-20">
      
      {/* HERO HEADER WITH TEXTURE */}
      <section className="bg-[#1A0B0C] text-white py-10 px-4 sm:px-6 relative overflow-hidden border-b border-red-900/40">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={article.thumbnail || sscBankBanner}
            alt="Article Banner Background"
            className="w-full h-full object-cover object-center opacity-30 scale-105 filter brightness-75 contrast-125 blur-sm"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#8C1316] via-[#8C1316]/90 to-[#6B1113]/85" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#8C1316]/60 via-transparent to-[#6B1113]/95" />
        </div>

        <div className="max-w-[1100px] mx-auto space-y-5 relative z-10">
          
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
              <button onClick={() => router.push('/')} className="hover:text-white transition">Home</button>
              <span>/</span>
              <button onClick={() => router.push('/current-affairs')} className="hover:text-white transition">Current Affairs</button>
              <span>/</span>
              <span className="text-gray-400 truncate max-w-[200px]">{article.category}</span>
            </div>

            <button
              onClick={() => router.push('/current-affairs')}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Articles
            </button>
          </div>

          {/* Article Category & Title */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-black uppercase px-3 py-1 rounded bg-[#C12223] text-white">
                {article.category}
              </span>
              {article.syllabusTag && (
                <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded border border-amber-500/30">
                  {article.syllabusTag}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              {article.title}
            </h1>

            {/* Author & Source Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-300 pt-1">
              <span className="flex items-center gap-1.5 text-white">
                <span className="w-6 h-6 rounded-full bg-[#C12223] text-white text-[10px] font-black flex items-center justify-center">G</span>
                <span>{article.author || 'Gyanam Editorial Desk'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-gray-300">
                <Calendar className="w-3.5 h-3.5 text-[#FF6B6B]" /> {article.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-gray-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> {article.readTime}
              </span>
              {article.sourceName && (
                <>
                  <span>•</span>
                  <span className="text-gray-400 font-normal">Source: {article.sourceName}</span>
                </>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* MAIN ARTICLE BODY AREA */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ARTICLE CONTENT (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Top Toolbar: Font Resizer, Share & Bookmark */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-red-100 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
              
              {/* Font Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-bold">Text Size:</span>
                <div className="flex bg-gray-100 p-0.5 rounded-lg">
                  <button 
                    onClick={() => setFontSize('sm')} 
                    className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${fontSize === 'sm' ? 'bg-white shadow text-[#1F1A1C]' : 'text-gray-500'}`}
                  >
                    Small
                  </button>
                  <button 
                    onClick={() => setFontSize('base')} 
                    className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${fontSize === 'base' ? 'bg-white shadow text-[#1F1A1C]' : 'text-gray-500'}`}
                  >
                    Normal
                  </button>
                  <button 
                    onClick={() => setFontSize('lg')} 
                    className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${fontSize === 'lg' ? 'bg-white shadow text-[#1F1A1C]' : 'text-gray-500'}`}
                  >
                    Large
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleBookmark}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isBookmarked 
                      ? 'bg-purple-50 text-purple-700 border-purple-200' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-bold transition flex items-center gap-1.5 cursor-pointer hidden sm:flex"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Print A4</span>
                </button>
              </div>
            </div>

            {/* Featured Image */}
            {article.thumbnail && (
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm max-h-[380px] bg-gray-100">
                <img 
                  src={article.thumbnail} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Background Context Callout */}
            {article.backgroundContext && (
              <div className="bg-[#FFF5F5] border border-red-200 p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-[#C12223] text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> Why is this in the news?
                </div>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                  {article.backgroundContext}
                </p>
              </div>
            )}

            {/* Full Content Body */}
            <div className={`bg-white p-6 sm:p-8 rounded-2xl border border-red-100 shadow-sm space-y-6 ${
              fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm'
            }`}>
              
              <div className="space-y-4 text-gray-800 leading-relaxed font-normal">
                {article.fullContent ? (
                  article.fullContent.map((paragraph, pIdx) => (
                    <p key={pIdx} className="bg-gray-50/60 p-4 rounded-xl border border-gray-100/80">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="p-4 rounded-xl bg-gray-50">{article.summary}</p>
                )}
              </div>

              {/* Key Exam Takeaways Box */}
              <div className="bg-gradient-to-br from-[#8C1316] to-[#8C1316] text-white p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                  <Award className="w-4 h-4" /> High-Yield Exam Key Takeaways
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-200">
                  {(article.keyTakeaways || article.bullets).map((point, kIdx) => (
                    <li key={kIdx} className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Target Exam Relevance Badges */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">
                  Relevant for Exams:
                </span>
                <div className="flex flex-wrap gap-2">
                  {article.impForExams.map((exam, eIdx) => (
                    <span key={eIdx} className="px-3 py-1 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold">
                      {exam}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* ATTACHED INTERACTIVE MCQ PRACTICE CARD */}
            {article.mcqQuestion && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="inline-flex items-center gap-2 text-amber-900 font-black text-sm">
                    <Zap className="w-4 h-4 text-amber-500" /> Check Your Understanding (Instant Practice MCQ)
                  </div>
                  <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded">
                    +2 Marks
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-[#1F1A1C]">
                  {article.mcqQuestion.question}
                </p>

                {/* MCQ Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {article.mcqQuestion.options.map((opt, optIdx) => {
                    let optClass = "bg-gray-50 border-gray-200 hover:border-[#C12223] text-gray-800";

                    if (selectedMcqOpt === optIdx) {
                      optClass = "bg-red-50 border-[#C12223] text-[#C12223] font-bold";
                    }

                    if (showMcqAnswer) {
                      if (optIdx === article.mcqQuestion?.correctAnswer) {
                        optClass = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                      } else if (selectedMcqOpt === optIdx) {
                        optClass = "bg-red-100 border-red-500 text-red-900 line-through";
                      } else {
                        optClass = "bg-gray-50 border-gray-200 text-gray-400 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => {
                          setSelectedMcqOpt(optIdx);
                          setShowMcqAnswer(true);
                        }}
                        className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${optClass}`}
                      >
                        <span><strong className="mr-2 uppercase">{['A', 'B', 'C', 'D'][optIdx]}.</strong>{opt}</span>
                        {showMcqAnswer && optIdx === article.mcqQuestion?.correctAnswer && (
                          <Check className="w-4 h-4 text-emerald-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {showMcqAnswer && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                    <span className="font-extrabold text-emerald-950 block">Explanation:</span>
                    <p className="text-emerald-900 font-medium">{article.mcqQuestion.explanation}</p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Feedback & Social Action Footer */}
            <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    userLiked 
                      ? 'bg-red-100 text-[#C12223]' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{likesCount} Aspirants Found Useful</span>
                </button>
              </div>

              <button
                onClick={() => router.push('/current-affairs')}
                className="text-xs font-bold text-[#C12223] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Browse All Articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* SIDEBAR (4 COLS) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            
            {/* SIDEBAR WIDGET 1: MORE TODAY'S ARTICLES */}
            <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-[#1F1A1C] border-b border-gray-100 pb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#C12223]" /> Related News Summaries
              </h3>

              <div className="space-y-4">
                {otherArticles.slice(0, 4).map((rel) => (
                  <div 
                    key={rel.id} 
                    onClick={() => router.push(`/current-affairs/${rel.id}`)}
                    className="group cursor-pointer space-y-1"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                      <span className="text-[#C12223] uppercase">{rel.category}</span>
                      <span>•</span>
                      <span>{rel.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#1F1A1C] group-hover:text-[#C12223] transition line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push('/current-affairs')}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                View Full Current Affairs Hub
              </button>
            </div>

            {/* SIDEBAR WIDGET 2: FEATURED COURSE PROMO */}
            <div className="bg-gradient-to-br from-[#8C1316]/90 via-[#8C1316]/80 to-[#8C1316] text-white p-6 rounded-2xl shadow-md space-y-4">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-amber-400 text-amber-950">
                🔥 Recommended Batch
              </span>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">SSC CGL & ADRE 3.0 Complete Selection Batch</h3>
                <p className="text-xs text-gray-300">Live Classes, Subject Notes, & Daily Current Affairs Coverage.</p>
              </div>

              <button
                onClick={() => router.push('/courses')}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Full Course & Syllabus</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
