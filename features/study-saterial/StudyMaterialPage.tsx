'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { FREE_RESOURCES } from '../../data/mockData';
import { FreeResource } from '../../types';
import { 
  Download, FileText, Search, Filter, Bookmark, CheckCircle, 
  Sparkles, Star, BookOpen, Layers, Award, ArrowRight, Share2, 
  Check, Eye, HelpCircle, Bell, RefreshCw, X, ChevronDown, ChevronRight, Zap,
  ShoppingBag, Heart, SlidersHorizontal, Grid, List, Tag, ShieldCheck, Clock,
  ArrowUpDown, CheckSquare, Square, Trash2, ArrowUpRight, BookMarked
} from 'lucide-react';

export const StudyMaterialPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL State
  const categoryFromUrl = searchParams.get('category') || 'All';
  const examFromUrl = searchParams.get('exam') || 'All';

  const [selectedType, setSelectedType] = useState<string>(categoryFromUrl);
  const [selectedExam, setSelectedExam] = useState<string>(examFromUrl);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedPageFilter, setSelectedPageFilter] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('downloads');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Saved / Cart items
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gyanm_store_saved');
      return saved ? JSON.parse(saved) : ['res-1', 'res-3'];
    } catch {
      return ['res-1', 'res-3'];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);

  // Modals & Download Status
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessModal, setDownloadSuccessModal] = useState<FreeResource | null>(null);
  const [previewResource, setPreviewResource] = useState<FreeResource | null>(null);

  // Notes Request Form State
  const [requestSubject, setRequestSubject] = useState<string>('');
  const [requestExam, setRequestExam] = useState<string>('');
  const [requestEmail, setRequestEmail] = useState<string>('');
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    const ex = searchParams.get('exam');
    if (cat) setSelectedType(cat);
    if (ex) setSelectedExam(ex);
  }, [searchParams]);

  const updateParams = (type: string, exam: string) => {
    const params = new URLSearchParams();
    if (type !== 'All') params.set('category', type);
    if (exam !== 'All') params.set('exam', exam);
    router.push(`/study-material${params.toString() ? '?' + params.toString() : ''}`);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    updateParams(type, selectedExam);
  };

  const handleExamChange = (exam: string) => {
    setSelectedExam(exam);
    updateParams(selectedType, exam);
  };

  const toggleSaveItem = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: string[];
    if (savedIds.includes(id)) {
      updated = savedIds.filter(sId => sId !== id);
    } else {
      updated = [...savedIds, id];
    }
    setSavedIds(updated);
    try {
      localStorage.setItem('gyanm_store_saved', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const triggerDownload = (resource: FreeResource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDownloadingId(resource.id);
    
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadSuccessModal(resource);
    }, 1100);
  };

  const handleBatchDownload = () => {
    if (savedIds.length === 0) return;
    const firstItem = FREE_RESOURCES.find(r => savedIds.includes(r.id)) || FREE_RESOURCES[0];
    setDownloadingId('batch');
    setTimeout(() => {
      setDownloadingId(null);
      setIsCartOpen(false);
      setDownloadSuccessModal(firstItem);
    }, 1500);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestSubject || !requestExam) return;
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubject('');
      setRequestExam('');
      setRequestEmail('');
      setRequestSubmitted(false);
    }, 3500);
  };

  // Filter & Sort Logic
  const filteredResources = FREE_RESOURCES.filter(item => {
    const matchesType = selectedType === 'All' ? true :
      selectedType === 'PDF Notes' ? (item.type === 'PDF Notes' || item.type === 'NCERT Gist') :
      selectedType === 'PYQ Paper' ? item.type === 'PYQ Paper' :
      selectedType === 'Formula Sheet' ? item.type === 'Formula Sheet' :
      selectedType === 'Current Affairs Magazine' ? item.type === 'Current Affairs Magazine' :
      selectedType === 'Syllabus PDF' ? item.type === 'Syllabus PDF' :
      item.type === selectedType;

    const matchesExam = selectedExam === 'All' ? true :
      item.category.toLowerCase().includes(selectedExam.toLowerCase()) ||
      (item.targetExams && item.targetExams.some(e => e.toLowerCase().includes(selectedExam.toLowerCase())));

    const matchesLanguage = selectedLanguage === 'All' ? true :
      item.language?.toLowerCase().includes(selectedLanguage.toLowerCase());

    const matchesPages = selectedPageFilter === 'All' ? true :
      selectedPageFilter === 'short' ? (item.pagesCount && item.pagesCount <= 50) :
      selectedPageFilter === 'medium' ? (item.pagesCount && item.pagesCount > 50 && item.pagesCount <= 120) :
      selectedPageFilter === 'long' ? (item.pagesCount && item.pagesCount > 120) : true;

    const matchesRating = item.rating >= minRating;

    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.chapters && item.chapters.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesType && matchesExam && matchesLanguage && matchesPages && matchesRating && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'downloads') return b.downloadsCount - a.downloadsCount;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'pages') return (b.pagesCount || 0) - (a.pagesCount || 0);
    return 0;
  });

  const savedList = FREE_RESOURCES.filter(r => savedIds.includes(r.id));

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-slate-800 font-sans pb-28">
      
      {/* 1. E-COMMERCE TOP PROMO TICKER */}
      <div className="bg-[#B91C1C] text-white text-[11px] font-extrabold py-1.5 px-4 text-center flex items-center justify-center gap-3 shadow-inner">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>GYANM DIGITAL E-BOOKSTORE</span>
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline text-amber-200">100% Free Direct Downloads • Verified Faculty Solutions</span>
        <span>•</span>
        <span className="bg-amber-400 text-red-950 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
          2026 Shift Updated
        </span>
      </div>

      {/* 2. E-COMMERCE STORE MARKETPLACE HERO */}
      <section className="bg-gradient-to-br from-[#B91C1C] via-[#991B1B] to-[#7F1D1D] text-white py-8 sm:py-10 px-4 sm:px-6 relative overflow-hidden shadow-lg border-b border-red-900">
        
        {/* Subtle background decorative shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1340px] mx-auto space-y-6 relative z-10 px-6 lg:px-6">
          
          {/* Store Navigation & Saved Library Bar */}
          <div className="flex items-center justify-between border-b border-white/15 pb-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-red-100">
              <button onClick={() => router.push('/')} className="hover:text-amber-300 transition flex items-center gap-1 cursor-pointer">
                <span>Home</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span className="text-amber-300 font-extrabold flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-300" /> E-Bookstore & Digital Library
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-[11px] font-extrabold bg-black/25 text-red-100 px-3 py-1 rounded-full border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Free Direct Downloads</span>
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-amber-400 hover:bg-amber-300 text-red-950 px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-md transform active:scale-95"
              >
                <BookMarked className="w-4 h-4 text-red-950" />
                <span>Saved Library</span>
                <span className="bg-red-950 text-white px-2 py-0.2 text-[10px] rounded-full font-black">
                  {savedIds.length}
                </span>
              </button>
            </div>
          </div>

          {/* MAIN E-COMMERCE HERO GRID (SEARCH + FEATURED BOOK SHOWCASE) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            
            {/* LEFT COLUMN: E-COMMERCE HEADLINE + AMAZON STYLE SEARCH BAR */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-200 text-[11px] font-black uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-amber-300" />
                <span>INDIA'S #1 FREE EXAM DIGITAL BOOKSTORE</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Exam E-Books & Solved PYQ <span className="text-amber-300 underline decoration-amber-400/50 underline-offset-8">Marketplace</span>
              </h1>

              <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed max-w-xl">
                Browse and instantly download 500+ high-yield e-books, handwritten topper notes, and last 10 years shift-wise solved papers. Verified by senior Gyanm faculty with zero paywalls.
              </p>

              {/* INTEGRATED E-COMMERCE MARKETPLACE SEARCH BAR */}
              <div className="space-y-2 pt-1">
                <div className="bg-white p-1.5 rounded-2xl shadow-2xl border-2 border-amber-300/80 flex flex-col sm:flex-row items-stretch gap-1.5">
                  
                  {/* Category / Department Dropdown inside Search Bar (Amazon Style) */}
                  <div className="relative shrink-0 border-b sm:border-b-0 sm:border-r border-gray-200 pr-1">
                    <select
                      value={selectedType}
                      onChange={(e) => handleTypeChange(e.target.value)}
                      className="w-full sm:w-auto px-3 py-2.5 text-xs font-black text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-xl focus:outline-none cursor-pointer border-0"
                    >
                      <option value="All">All Departments</option>
                      <option value="PDF Notes">Handwritten Notes</option>
                      <option value="PYQ Paper">10 Yrs Solved PYQs</option>
                      <option value="Formula Sheet">Speed Math Booklets</option>
                      <option value="Current Affairs Magazine">Monthly Current Affairs</option>
                      <option value="Syllabus PDF">Official Blueprints</option>
                    </select>
                  </div>

                  {/* Main Search Input */}
                  <div className="relative flex-1 flex items-center">
                    <Search className="w-4 h-4 text-red-600 absolute left-3" />
                    <input
                      type="text"
                      placeholder="Search 500+ E-Books, PYQs, Subjects (e.g., 'Assam GK', 'Polity', 'SSC CGL')..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 text-xs font-bold text-gray-900 bg-transparent focus:outline-none placeholder-gray-400"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 text-xs font-bold text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* E-Commerce Search CTA Button */}
                  <button
                    onClick={() => {}}
                    className="bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-xs px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-md"
                  >
                    <Search className="w-4 h-4" />
                    <span>SEARCH STORE</span>
                  </button>

                </div>

                {/* Popular Search Tags below Search Bar */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                  <span className="font-bold text-amber-200/90 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-300 fill-amber-300" /> Hot Searches:
                  </span>
                  {[
                    { tag: 'Assam ADRE 3.0', exam: 'Assam Govt' },
                    { tag: 'SSC CGL 10-Yr PYQ', exam: 'SSC' },
                    { tag: 'Vedic Math Tricks', exam: 'All' },
                    { tag: 'Polity Mind Maps', exam: 'UPSC' },
                    { tag: 'July 2026 CA Digest', exam: 'Banking' }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(item.tag);
                        if (item.exam !== 'All') handleExamChange(item.exam);
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white hover:text-amber-300 border border-white/20 px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer"
                    >
                      #{item.tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Trust Value Props */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-left border-t border-white/10">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-extrabold text-white block">Instant PDF</span>
                    <span className="text-[10px] text-red-200">Zero wait & no signup</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-extrabold text-white block">Faculty Keys</span>
                    <span className="text-[10px] text-red-200">100% Verified PYQs</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-extrabold text-white block">100% Free</span>
                    <span className="text-[10px] text-red-200">No hidden charges</span>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: FEATURED BESTSELLER SHOWCASE (3D E-BOOK DEAL CARD) */}
            <div className="lg:col-span-5">
              {(() => {
                const spotlightItem = FREE_RESOURCES[spotlightIndex % FREE_RESOURCES.length];

                return (
                  <div className="bg-gradient-to-br from-red-950 via-slate-900/5 to-red-950 p-5 rounded-3xl border-2 border-amber-400/50 shadow-2xl space-y-4 relative overflow-hidden group">
                    
                    {/* Top Deal Banner Stripe */}
                    <div className="flex items-center justify-between border-b border-white/15 pb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                        </span>
                        <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                          BESTSELLER DEAL OF THE DAY
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px]">
                        <button
                          onClick={() => setSpotlightIndex(prev => (prev > 0 ? prev - 1 : FREE_RESOURCES.length - 1))}
                          className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded font-black cursor-pointer"
                          title="Previous Featured E-Book"
                        >
                          ‹
                        </button>
                        <span className="text-gray-300 font-bold">{(spotlightIndex % FREE_RESOURCES.length) + 1}/{FREE_RESOURCES.length}</span>
                        <button
                          onClick={() => setSpotlightIndex(prev => prev + 1)}
                          className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded font-black cursor-pointer"
                          title="Next Featured E-Book"
                        >
                          ›
                        </button>
                      </div>
                    </div>

                    {/* Featured Book Showcase Layout */}
                    <div className="flex items-center gap-4">
                      
                      {/* 3D E-Book Cover Image / Graphic */}
                      <div className="w-28 sm:w-32 h-40 rounded-2xl p-3 text-white flex flex-col justify-between shadow-2xl relative border border-white/20 shrink-0 transform group-hover:scale-105 transition duration-300" style={{ background: spotlightItem.coverBg || 'linear-gradient(to bottom right, #dc2626, #991b1b)' }}>
                        {/* Book Spine Shadow */}
                        <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-black/30 border-r border-white/20" />
                        
                        <div className="pl-2 space-y-1">
                          <span className="px-1.5 py-0.2 bg-amber-400 text-red-950 font-black text-[8px] uppercase rounded">
                            {spotlightItem.badge || 'SPOTLIGHT'}
                          </span>
                          <h4 className="font-extrabold text-[11px] leading-tight line-clamp-3 text-white">
                            {spotlightItem.title}
                          </h4>
                        </div>

                        <div className="pl-2 border-t border-white/20 pt-1 text-[9px] font-bold text-amber-200">
                          {spotlightItem.pagesCount} Pages PDF
                        </div>
                      </div>

                      {/* Featured Book Details & Pricing */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold bg-amber-400 text-red-950 px-2 py-0.5 rounded uppercase">
                            FREE TODAY
                          </span>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                            100% OFF
                          </span>
                        </div>

                        <h3 className="font-black text-sm sm:text-base text-white line-clamp-2 leading-snug">
                          {spotlightItem.title}
                        </h3>

                        <p className="text-[11px] text-gray-300 line-clamp-2">
                          {spotlightItem.description}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] pt-1">
                          <span className="text-amber-300 font-extrabold flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-current text-amber-300" />
                            <span>{spotlightItem.rating}★</span>
                          </span>
                          <span className="text-gray-400">({spotlightItem.reviewsCount || 1200}+ ratings)</span>
                        </div>

                        {/* E-Commerce Price Tag */}
                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="text-xl font-black text-amber-400">₹0 FREE</span>
                          {spotlightItem.originalPrice && (
                            <span className="text-xs text-gray-400 line-through font-bold">
                              ₹{spotlightItem.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Quick E-Commerce Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                      <button
                        onClick={() => setPreviewResource(spotlightItem)}
                        className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer border border-white/15"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-300" /> Quick Index
                      </button>

                      <button
                        onClick={(e) => triggerDownload(spotlightItem, e)}
                        disabled={downloadingId === spotlightItem.id}
                        className="py-2 px-3 bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer shadow-lg transform active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5 text-red-950" />
                        <span>{downloadingId === spotlightItem.id ? 'Downloading...' : 'Get Free PDF'}</span>
                      </button>
                    </div>

                  </div>
                );
              })()}
            </div>

          </div>

        </div>
      </section>

      {/* 3. STORE QUICK CATEGORY CIRCLES / TILES BAR (AMAZON STYLE) */}
      <section className="max-w-[1340px] mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm flex items-center gap-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'All', label: 'All Items', icon: Layers, badge: '500+' },
            { id: 'PDF Notes', label: 'Handwritten Notes', icon: BookOpen, badge: 'High Yield' },
            { id: 'PYQ Paper', label: '10 Yrs Solved PYQs', icon: FileText, badge: '2016-2025' },
            { id: 'Formula Sheet', label: 'Speed Math Booklet', icon: Zap, badge: 'Formulas' },
            { id: 'Current Affairs Magazine', label: 'Monthly CA Digest', icon: Award, badge: 'July 2026' },
            { id: 'Syllabus PDF', label: 'Official Syllabus', icon: ShieldCheck, badge: 'Blueprints' }
          ].map(cat => {
            const Icon = cat.icon;
            const active = selectedType === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleTypeChange(cat.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-extrabold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  active 
                    ? 'bg-red-600 text-white border-red-600 shadow-md' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-amber-300' : 'text-red-600'}`} />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                  active ? 'bg-white/20 text-white' : 'bg-red-50 text-red-700'
                }`}>
                  {cat.badge}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. MAIN STORE BODY: SIDEBAR + PRODUCT LISTING GRID */}
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT E-COMMERCE FILTER SIDEBAR (DESKTOP) */}
          <aside className={`lg:col-span-3 bg-white p-5 rounded-2xl border border-red-100 shadow-sm space-y-6 ${
            isMobileFilterOpen ? 'block fixed inset-0 z-50 overflow-y-auto bg-white m-4 border-2 border-red-300 shadow-2xl' : 'hidden lg:block'
          }`}>
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-sm font-black text-gray-900">
                <Filter className="w-4 h-4 text-red-600" />
                <span>Store Filters</span>
              </div>

              {isMobileFilterOpen ? (
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold"
                >
                  Close ✕
                </button>
              ) : (
                (selectedType !== 'All' || selectedExam !== 'All' || selectedLanguage !== 'All' || selectedPageFilter !== 'All' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedType('All');
                      setSelectedExam('All');
                      setSelectedLanguage('All');
                      setSelectedPageFilter('All');
                      setMinRating(0);
                      setSearchQuery('');
                      router.push('/study-material');
                    }}
                    className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Reset All
                  </button>
                )
              )}
            </div>

            {/* Filter Group 1: Material Type */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">
                Category / Format
              </span>
              <div className="space-y-1">
                {[
                  { id: 'All', name: 'All Categories' },
                  { id: 'PDF Notes', name: 'Handwritten Notes' },
                  { id: 'PYQ Paper', name: 'Solved PYQ Papers' },
                  { id: 'Formula Sheet', name: 'Formula & Trick Sheets' },
                  { id: 'Current Affairs Magazine', name: 'Current Affairs Digest' },
                  { id: 'Syllabus PDF', name: 'Official Syllabus Pattern' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleTypeChange(item.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                      selectedType === item.id 
                        ? 'bg-red-50 text-red-700 font-extrabold border-l-4 border-red-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.name}</span>
                    {selectedType === item.id && <Check className="w-3.5 h-3.5 text-red-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Group 2: Target Exam */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">
                Target Exam
              </span>
              <div className="space-y-1">
                {[
                  { id: 'All', name: 'All Exams' },
                  { id: 'SSC', name: 'SSC CGL & CHSL' },
                  { id: 'Banking', name: 'IBPS PO & SBI' },
                  { id: 'Assam Govt', name: 'Assam ADRE 3.0 & APSC' },
                  { id: 'UPSC', name: 'UPSC & State PSC' }
                ].map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => handleExamChange(ex.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                      selectedExam === ex.id 
                        ? 'bg-red-50 text-red-700 font-extrabold border-l-4 border-red-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{ex.name}</span>
                    {selectedExam === ex.id && <Check className="w-3.5 h-3.5 text-red-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Group 3: Language */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">
                Language Edition
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {['All', 'Bilingual', 'English', 'Assamese'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border text-center transition cursor-pointer ${
                      selectedLanguage === lang 
                        ? 'bg-red-600 text-white border-red-600' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-red-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Group 4: Page Length */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">
                Booklet Length
              </span>
              <div className="space-y-1">
                {[
                  { id: 'All', label: 'Any Page Count' },
                  { id: 'short', label: 'Quick Revision (≤ 50 pages)' },
                  { id: 'medium', label: 'Standard Module (50-120 pages)' },
                  { id: 'long', label: 'Master Booklet (120+ pages)' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPageFilter(p.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                      selectedPageFilter === p.id 
                        ? 'bg-red-50 text-red-700 font-extrabold' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{p.label}</span>
                    {selectedPageFilter === p.id && <Check className="w-3.5 h-3.5 text-red-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Group 5: Ratings */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">
                Minimum Rating
              </span>
              <div className="flex items-center gap-1">
                {[0, 4.5, 4.8, 4.9].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`px-2 py-1 rounded text-[11px] font-extrabold transition cursor-pointer ${
                      minRating === r 
                        ? 'bg-amber-400 text-red-950 shadow-sm' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {r === 0 ? 'All' : `${r}★+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Store Guarantee Box */}
            <div className="p-3.5 bg-red-50 rounded-xl border border-red-100 space-y-1.5 text-[11px]">
              <span className="font-extrabold text-red-800 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-red-600" /> Official Guarantee
              </span>
              <p className="text-gray-600 leading-normal">
                All PYQ keys and notes are cross-checked by Senior Gyanm Faculty for 100% accuracy.
              </p>
            </div>

          </aside>

          {/* RIGHT PRODUCT LISTING GRID */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* TOP BAR: SORTING, VIEW TOGGLE & RESULTS COUNT */}
            <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <span>Showing <strong className="text-red-600 text-sm">{filteredResources.length}</strong> E-Books & Notes</span>
                {searchQuery && <span className="text-gray-400">for "{searchQuery}"</span>}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                
                {/* Sort selector */}
                <div className="flex items-center gap-1.5 text-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-red-600" />
                  <span className="font-extrabold text-gray-700 hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 text-xs font-bold bg-red-50/50 border border-red-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                  >
                    <option value="downloads">Most Downloaded (Popular)</option>
                    <option value="rating">Highest Rated (4.9★)</option>
                    <option value="pages">Most Comprehensive (Page Count)</option>
                  </select>
                </div>

                {/* View toggle buttons */}
                <div className="flex items-center border border-gray-200 rounded-xl p-0.5 bg-gray-50">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === 'grid' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === 'list' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* PRODUCT ITEMS GRID / LIST */}
            {filteredResources.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-red-100 shadow-sm space-y-4">
                <FileText className="w-12 h-12 text-red-300 mx-auto" />
                <h3 className="text-lg font-black text-gray-900">No E-Books Match Your Selected Filters</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Try adjusting your search query, exam selection, or category filters to find available study materials.
                </p>
                <button
                  onClick={() => {
                    setSelectedType('All');
                    setSelectedExam('All');
                    setSelectedLanguage('All');
                    setSelectedPageFilter('All');
                    setMinRating(0);
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer"
                >
                  Clear All Filters & Show All
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              
              /* E-COMMERCE PRODUCT GRID (3 COLUMNS) */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((res) => {
                  const isSaved = savedIds.includes(res.id);

                  return (
                    <motion.div
                      key={res.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-2xl border border-red-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group overflow-hidden relative"
                    >
                      
                      {/* E-BOOK MOCKUP HEADER THUMBNAIL */}
                      <div className="p-5 text-white relative flex flex-col justify-between min-h-[160px]" style={{ background: res.coverBg || 'linear-gradient(to bottom right, #dc2626, #991b1b)' }}>
                        
                        {/* Book Spine Texture Line */}
                        <div className="absolute top-0 bottom-0 left-0 w-3 bg-black/20 border-r border-white/20" />

                        {/* Top Badges Row */}
                        <div className="flex items-center justify-between gap-2 pl-3">
                          <span className="px-2 py-0.5 bg-amber-400 text-red-950 font-black text-[10px] uppercase rounded tracking-wider shadow-sm">
                            {res.badge || res.type}
                          </span>

                          <button
                            onClick={(e) => toggleSaveItem(res.id, e)}
                            className={`p-1.5 rounded-full backdrop-blur-md transition cursor-pointer ${
                              isSaved 
                                ? 'bg-white text-red-600 shadow-md' 
                                : 'bg-black/20 text-white hover:bg-white hover:text-red-600'
                            }`}
                            title={isSaved ? "Remove from Saved" : "Save E-Book"}
                          >
                            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Book Cover Title & Author */}
                        <div className="pl-3 space-y-1 my-2">
                          <span className="text-[10px] font-bold text-red-200 uppercase tracking-wider block">
                            {res.category} • {res.language || 'Bilingual'}
                          </span>
                          <h3 className="font-extrabold text-sm sm:text-base leading-snug line-clamp-2 text-white group-hover:text-amber-200 transition">
                            {res.title}
                          </h3>
                        </div>

                        {/* Pages & Rating Footer Stripe */}
                        <div className="pl-3 flex items-center justify-between text-[11px] font-bold text-red-100 pt-2 border-t border-white/20">
                          <span>{res.pagesCount ? `${res.pagesCount} Pages PDF` : res.fileSize}</span>
                          <span className="flex items-center gap-1 text-amber-300 font-extrabold">
                            <Star className="w-3.5 h-3.5 fill-current text-amber-300" />
                            <span>{res.rating}</span>
                          </span>
                        </div>

                      </div>

                      {/* E-COMMERCE PRODUCT DETAILS BODY */}
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        
                        <div className="space-y-3">
                          
                          {/* Author Credential */}
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                            <span className="text-gray-700 font-extrabold truncate">By {res.author || 'Gyanm Academic Team'}</span>
                            <span className="text-emerald-700 font-black text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Verified
                            </span>
                          </div>

                          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                            {res.description}
                          </p>

                          {/* Key Chapters Pill List */}
                          {res.chapters && res.chapters.length > 0 && (
                            <div className="bg-red-50/50 p-2.5 rounded-xl border border-red-100/80 space-y-1">
                              <span className="text-[10px] font-black text-red-800 uppercase tracking-wider block">
                                Top Chapters:
                              </span>
                              <div className="space-y-0.5">
                                {res.chapters.slice(0, 2).map((ch, idx) => (
                                  <p key={idx} className="text-[11px] text-gray-700 font-medium truncate flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                    <span className="truncate">{ch}</span>
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>

                        {/* PRICE & ACTION FOOTER */}
                        <div className="pt-3 border-t border-gray-100 space-y-3">
                          
                          {/* Price Display */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-black text-red-600">FREE</span>
                              {res.originalPrice && (
                                <span className="text-xs font-bold text-gray-400 line-through">
                                  ₹{res.originalPrice}
                                </span>
                              )}
                              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                100% OFF
                              </span>
                            </div>

                            <span className="text-[11px] font-bold text-gray-400">
                              {res.downloadsCount.toLocaleString()} downloads
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setPreviewResource(res)}
                              className="py-2 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> Quick Preview
                            </button>

                            <button
                              onClick={(e) => triggerDownload(res, e)}
                              disabled={downloadingId === res.id}
                              className="py-2 px-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              {downloadingId === res.id ? (
                                <span className="animate-pulse">Saving...</span>
                              ) : (
                                <>
                                  <Download className="w-3.5 h-3.5 text-amber-300" /> Free PDF
                                </>
                              )}
                            </button>
                          </div>

                        </div>

                      </div>

                    </motion.div>
                  );
                })}
              </div>

            ) : (

              /* COMPACT E-COMMERCE LIST VIEW */
              <div className="space-y-4">
                {filteredResources.map((res) => {
                  const isSaved = savedIds.includes(res.id);

                  return (
                    <motion.div
                      key={res.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-red-100 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        {/* Book Icon Cover Badge */}
                        <div className="w-14 h-16 rounded-xl text-white flex flex-col items-center justify-center shrink-0 shadow-sm p-1 text-center" style={{ background: res.coverBg || 'linear-gradient(to bottom right, #dc2626, #991b1b)' }}>
                          <BookOpen className="w-6 h-6 text-amber-300 mb-1" />
                          <span className="text-[9px] font-black uppercase tracking-tight line-clamp-1">{res.type}</span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                              {res.category}
                            </span>
                            <span className="text-[11px] font-bold text-gray-500">By {res.author || 'Gyanm Faculty'}</span>
                            <span className="text-[11px] font-black text-amber-600 flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current text-amber-400" /> {res.rating}★
                            </span>
                          </div>

                          <h3 className="font-extrabold text-base text-gray-900 hover:text-red-600 transition">
                            {res.title}
                          </h3>

                          <p className="text-xs text-gray-600 line-clamp-1">
                            {res.description}
                          </p>
                        </div>
                      </div>

                      {/* Price & Action Row */}
                      <div className="flex items-center gap-3 w-full md:w-auto justify-between border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 shrink-0">
                        <div className="text-right">
                          <div className="text-base font-black text-red-600">FREE</div>
                          <div className="text-[10px] text-gray-400 font-bold">{res.fileSize}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewResource(res)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition cursor-pointer"
                            title="Preview Index"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => triggerDownload(res, e)}
                            disabled={downloadingId === res.id}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5 text-amber-300" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            )}

          </main>

        </div>
      </div>

      {/* 5. E-COMMERCE CUSTOM ORDER / REQUEST MISSING NOTES SECTION */}
      <section className="max-w-[1340px] mx-auto px-4 sm:px-6 pt-16">
        <div className="bg-gradient-to-r from-white via-red-50/50 to-white rounded-3xl p-6 sm:p-10 border border-red-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-3">
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-black uppercase rounded-md inline-block">
              Custom E-Book Concierge
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              Can't Find Your Subject or Exam PYQ Booklet?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Our academic research cell adds 15+ new PDF e-books and shift papers every week. Request your specific subject or target exam year, and we will upload the free PDF within 24 hours.
            </p>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-red-200 shadow-md space-y-4">
            {requestSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-black text-emerald-900">E-Book Request Received!</h4>
                <p className="text-xs text-emerald-800">Our faculty team will prepare and email you when the PDF study material is published.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-3">
                <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-2">
                  Request Free E-Book Upload
                </h3>

                <div>
                  <label className="text-[11px] font-extrabold text-gray-700 block mb-1">Subject / Topic Needed</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern History Tribal Movements or Reasoning Puzzles"
                    value={requestSubject}
                    onChange={(e) => setRequestSubject(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-extrabold text-gray-700 block mb-1">Target Exam</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Assam ADRE 3.0"
                      value={requestExam}
                      onChange={(e) => setRequestExam(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-extrabold text-gray-700 block mb-1">Email / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="For upload notification"
                      value={requestEmail}
                      onChange={(e) => setRequestEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition shadow-md cursor-pointer"
                >
                  Submit E-Book Request →
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* 6. SAVED LIBRARY / CART SLIDE-OVER DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-red-600 text-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-300" />
                  <h3 className="text-base font-black">Your Saved E-Book Library</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Saved List Body */}
              <div className="p-5 overflow-y-auto space-y-3 flex-1">
                {savedList.length === 0 ? (
                  <div className="text-center py-12 space-y-3 text-gray-500">
                    <Heart className="w-12 h-12 text-red-200 mx-auto" />
                    <p className="text-sm font-bold">No saved e-books in your library yet.</p>
                    <p className="text-xs text-gray-400">Click the heart icon on any study material to bookmark it for quick batch download.</p>
                  </div>
                ) : (
                  savedList.map(res => (
                    <div key={res.id} className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex items-center justify-between gap-3">
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <span className="text-[10px] font-extrabold text-red-700 uppercase block">{res.type}</span>
                        <h4 className="text-xs font-bold text-gray-900 truncate">{res.title}</h4>
                        <span className="text-[10px] text-gray-500">{res.fileSize} • FREE</span>
                      </div>

                      <button
                        onClick={(e) => toggleSaveItem(res.id, e)}
                        className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer Batch Actions */}
              {savedList.length > 0 && (
                <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                    <span>Total E-Books Selected:</span>
                    <span className="text-red-600 font-black text-sm">{savedList.length} Files</span>
                  </div>

                  <button
                    onClick={handleBatchDownload}
                    disabled={downloadingId === 'batch'}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-300" />
                    <span>{downloadingId === 'batch' ? 'Preparing Download Package...' : 'Batch Download All Saved PDFs'}</span>
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. QUICK PREVIEW PRODUCT MODAL */}
      <AnimatePresence>
        {previewResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-red-100 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setPreviewResource(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <span className="px-3 py-1 bg-amber-400 text-red-950 font-black text-xs uppercase rounded-md inline-block">
                  {previewResource.badge || previewResource.type}
                </span>
                <h3 className="text-xl font-black text-gray-900 leading-snug">
                  {previewResource.title}
                </h3>
                <p className="text-xs text-gray-500">
                  By {previewResource.author || 'Gyanm Faculty'} • {previewResource.category} • {previewResource.pagesCount || 120} Pages
                </p>
              </div>

              {/* Book Description */}
              <div className="bg-red-50/60 p-4 rounded-2xl border border-red-100 space-y-2">
                <span className="text-xs font-extrabold text-red-800 uppercase block">Product Summary & Key Features:</span>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {previewResource.description}
                </p>
              </div>

              {/* Chapters List */}
              {previewResource.chapters && (
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider block">
                    Table of Contents / Chapter Index:
                  </span>
                  <div className="space-y-2">
                    {previewResource.chapters.map((chap, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-red-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{chap}</span>
                        </span>
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Target Exams */}
              {previewResource.targetExams && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-extrabold text-gray-700 block">Recommended For:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {previewResource.targetExams.map((ex, idx) => (
                      <span key={idx} className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-gray-100 text-gray-800">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-red-600">FREE</span>
                  {previewResource.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">₹{previewResource.originalPrice}</span>
                  )}
                </div>

                <button
                  onClick={() => {
                    const res = previewResource;
                    setPreviewResource(null);
                    triggerDownload(res);
                  }}
                  className="px-6 py-2.5 bg-red-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-red-700 transition flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-300" /> Free Instant Download
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. DOWNLOAD SUCCESS TOAST MODAL */}
      <AnimatePresence>
        {downloadSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-emerald-200"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Download className="w-8 h-8 animate-bounce" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-gray-900">E-Book Download Started!</h3>
                <p className="text-xs text-gray-600">
                  <strong className="text-red-600">{downloadSuccessModal.title}</strong> is being saved to your downloads folder.
                </p>
              </div>

              <div className="p-3 bg-red-50 rounded-xl text-[11px] font-bold text-red-800">
                Tip: Join Gyanm Telegram / WhatsApp community to receive daily fresh PDF notes on your phone.
              </div>

              <button
                onClick={() => setDownloadSuccessModal(null)}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
              >
                Back to E-Bookstore
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
