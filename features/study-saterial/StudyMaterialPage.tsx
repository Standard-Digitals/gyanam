'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FREE_RESOURCES } from '@/data/mockData';
import { FreeResource } from '@/types';
import { 
  Download, FileText, Search, Filter, Bookmark, CheckCircle, 
  Sparkles, Star, BookOpen, Layers, Award, ArrowRight, Share2, 
  Check, Eye, HelpCircle, Bell, RefreshCw, X, ChevronDown, ChevronRight, Zap
} from 'lucide-react';

export const StudyMaterialPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const setSearchParams = (params: Record<string, string>) => {
    const qs = new URLSearchParams(params).toString();
    router.replace(pathname + (qs ? `?${qs}` : ''), { scroll: false });
  };

  const selectedType = searchParams.get('category') || 'All';
  const selectedExam = searchParams.get('exam') || 'All';
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Bookmarks saved in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gyanm_study_bookmarks');
      return saved ? JSON.parse(saved) : ['res-1', 'res-3'];
    } catch {
      return ['res-1', 'res-3'];
    }
  });

  // Download state tracking
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessModal, setDownloadSuccessModal] = useState<FreeResource | null>(null);

  // Preview Modal state
  const [previewResource, setPreviewResource] = useState<FreeResource | null>(null);

  // Notes Request Form State
  const [requestSubject, setRequestSubject] = useState<string>('');
  const [requestExam, setRequestExam] = useState<string>('');
  const [requestEmail, setRequestEmail] = useState<string>('');
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);

  const handleTypeChange = (type: string) => {
    const newParams: Record<string, string> = {};
    if (type !== 'All') newParams.category = type;
    if (selectedExam !== 'All') newParams.exam = selectedExam;
    setSearchParams(newParams);
  };

  const handleExamChange = (exam: string) => {
    const newParams: Record<string, string> = {};
    if (selectedType !== 'All') newParams.category = selectedType;
    if (exam !== 'All') newParams.exam = exam;
    setSearchParams(newParams);
  };

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: string[];
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter(bId => bId !== id);
    } else {
      updated = [...bookmarkedIds, id];
    }
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('gyanm_study_bookmarks', JSON.stringify(updated));
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
    }, 1200);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestSubject || !requestExam) return;
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubject('');
      setRequestExam('');
      setRequestEmail('');
    }, 3000);
  };

  // Filter items
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

    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.chapters && item.chapters.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesType && matchesExam && matchesLanguage && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#1E293B] font-sans pb-24">
      
      {/* VIBRANT RED HERO HEADER - STRICTLY NO BLACK/BROWN BACKGROUNDS */}
      <section className="bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#991B1B] text-white py-14 px-4 sm:px-6 relative overflow-hidden shadow-lg">
        {/* Subtle decorative circles & red glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-red-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl" />
        </div>

        <div className="max-w-[1320px] mx-auto space-y-6 relative z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold text-red-100">
            <button onClick={() => router.push('/')} className="hover:text-white transition">Home</button>
            <span>/</span>
            <span className="text-amber-200">Free Study Material & PYQ Hub</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-extrabold uppercase tracking-wide backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>100% Free Downloads • Verified Official Answer Keys</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Study Material, Notes & <span className="text-amber-300">Previous Year Papers</span>
              </h1>

              <p className="text-sm sm:text-base text-red-100 leading-relaxed font-normal">
                Download high-yield handwritten subject notes, last 10 years solved PYQ booklets, formula cheat sheets, and official syllabus PDFs curated for SSC CGL, Banking, Assam ADRE 3.0, and UPSC.
              </p>
            </div>

            {/* Header Stats Counter */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-center">
                <span className="text-2xl font-black text-white block">500+</span>
                <span className="text-[11px] font-bold text-red-100 uppercase tracking-wider">Free PDFs</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-center">
                <span className="text-2xl font-black text-amber-300 block">4.95★</span>
                <span className="text-[11px] font-bold text-red-100 uppercase tracking-wider">Rating</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-center col-span-2 sm:col-span-1">
                <span className="text-2xl font-black text-white block">2.5 Lakh+</span>
                <span className="text-[11px] font-bold text-red-100 uppercase tracking-wider">Downloads</span>
              </div>
            </div>
          </div>

          {/* SEARCH BAR OVER HERO */}
          <div className="pt-2">
            <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xl border border-red-200/80 flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full flex-1">
                <Search className="w-5 h-5 text-red-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search subject notes, PYQ paper, formulas (e.g., 'Quant', 'Polity', 'Assam GK', 'SSC 2024')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-xs sm:text-sm font-semibold bg-red-50/50 border border-red-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 placeholder-gray-400"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500 hover:text-red-700 p-1 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <select
                  value={selectedExam}
                  onChange={(e) => handleExamChange(e.target.value)}
                  className="px-3.5 py-3 text-xs font-bold bg-white border border-red-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer w-full sm:w-auto"
                >
                  <option value="All">All Exams Target</option>
                  <option value="SSC">SSC CGL & CHSL</option>
                  <option value="Banking">Banking (IBPS & SBI)</option>
                  <option value="Assam Govt">Assam ADRE & APSC</option>
                  <option value="UPSC">UPSC & State PSC</option>
                </select>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 pt-8 space-y-8">

        {/* RESOURCE TYPE TAB NAVIGATION */}
        <div className="bg-white p-3 rounded-2xl border border-red-100 shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'All', label: 'All Resources', icon: Layers, badge: '500+' },
            { id: 'PDF Notes', label: 'Handwritten Notes', icon: BookOpen, badge: 'High Yield' },
            { id: 'PYQ Paper', label: 'Solved PYQ Papers', icon: FileText, badge: '2016-2025' },
            { id: 'Formula Sheet', label: 'Formula Sheets', icon: Zap, badge: 'Speed Math' },
            { id: 'Current Affairs Magazine', label: 'Monthly CA Magazines', icon: Award, badge: 'July 2026' },
            { id: 'Syllabus PDF', label: 'Syllabus & Pattern', icon: CheckCircle, badge: 'Official' }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = selectedType === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTypeChange(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                  isSelected 
                    ? 'bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white shadow-md' 
                    : 'bg-red-50/60 text-gray-700 hover:bg-red-100/80 hover:text-red-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-red-600'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-red-100 text-red-800'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* EXTRA SECONDARY FILTERS & ACTIVE TAGS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-red-100/80 shadow-sm">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-extrabold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-red-600" /> Language:
            </span>
            {['All', 'Bilingual', 'English', 'Assamese'].map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`text-xs font-bold px-3 py-1 rounded-lg transition cursor-pointer ${
                  selectedLanguage === lang 
                    ? 'bg-red-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-gray-500 flex items-center gap-2">
            <span>Showing <strong className="text-red-700">{filteredResources.length}</strong> study material files</span>
            {(selectedType !== 'All' || selectedExam !== 'All' || selectedLanguage !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedLanguage('All');
                  setSearchQuery('');
                  setSearchParams({});
                }}
                className="text-red-600 hover:underline text-xs font-extrabold cursor-pointer ml-2"
              >
                Reset All Filters
              </button>
            )}
          </div>

        </div>

        {/* STUDY MATERIAL CARDS GRID */}
        {filteredResources.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-red-100 space-y-4 shadow-sm">
            <FileText className="w-12 h-12 text-red-300 mx-auto" />
            <h3 className="text-lg font-bold text-gray-800">No Study Material Found</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              We couldn't find any PDF files matching your active search keywords or filter options.
            </p>
            <button
              onClick={() => { setSelectedLanguage('All'); setSearchQuery(''); setSearchParams({}); }}
              className="px-5 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition cursor-pointer"
            >
              Clear Search & Show All Files
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => {
              const isBookmarked = bookmarkedIds.includes(res.id);

              return (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Top Red Accent Stripe */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-red-700" />

                  <div className="space-y-4 pt-1">
                    
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-red-50 text-red-700 font-black text-[10px] uppercase rounded-md border border-red-200">
                          {res.type}
                        </span>
                        {res.isHot && (
                          <span className="px-2 py-0.5 bg-amber-500 text-amber-950 font-black text-[9px] uppercase rounded animate-pulse">
                            🔥 Hot Popular
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => toggleBookmark(res.id, e)}
                        title={isBookmarked ? "Remove Bookmark" : "Save PDF"}
                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                          isBookmarked 
                            ? 'bg-purple-50 text-purple-700 border-purple-200' 
                            : 'text-gray-400 hover:text-purple-600 border-gray-200'
                        }`}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Icon & Title */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-gray-900 group-hover:text-red-600 transition leading-snug">
                            {res.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 mt-1">
                            <span>{res.category}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-extrabold">{res.rating}★ Rating</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 pt-1">
                        {res.description}
                      </p>
                    </div>

                    {/* Chapters Breakdown Preview Badge */}
                    {res.chapters && res.chapters.length > 0 && (
                      <div className="bg-red-50/60 p-3 rounded-xl border border-red-100/80 space-y-1.5">
                        <span className="text-[10px] font-black text-red-800 uppercase tracking-wider block">
                          Included Key Chapters:
                        </span>
                        <ul className="space-y-1">
                          {res.chapters.slice(0, 2).map((chap, cIdx) => (
                            <li key={cIdx} className="text-[11px] font-medium text-gray-700 flex items-center gap-1.5 truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                              <span className="truncate">{chap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Target Exam Tags */}
                    {res.targetExams && (
                      <div className="flex flex-wrap gap-1">
                        {res.targetExams.map((ex, exIdx) => (
                          <span key={exIdx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                            {ex}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
                    
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                      <span>{res.fileSize} {res.pagesCount ? `• ${res.pagesCount} Pages` : ''}</span>
                      <span className="text-gray-700 font-extrabold">
                        {res.downloadsCount.toLocaleString()} downloads
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPreviewResource(res)}
                        className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview Index
                      </button>

                      <button
                        onClick={(e) => triggerDownload(res, e)}
                        disabled={downloadingId === res.id}
                        className="py-2.5 px-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
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

                </motion.div>
              );
            })}
          </div>
        )}

        {/* SECTION 2: REQUEST CUSTOM NOTES / MISSING STUDY MATERIAL */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-red-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-black uppercase rounded-md inline-block">
              Can't Find Your Subject?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              Request Handwritten Notes or Missing PYQ Papers
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Our academic team releases fresh PDF study materials every week. Submit your subject name or targeted exam year, and we will upload the verified notes within 24 hours.
            </p>
          </div>

          <div className="lg:col-span-5 bg-red-50/70 p-5 rounded-2xl border border-red-100 space-y-3">
            {requestSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">Request Received!</h4>
                <p className="text-xs text-emerald-800">Our faculty team will prepare and notify you via email when notes are uploaded.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-extrabold text-gray-700 block mb-1">Subject / Chapter Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern History Tribal Uprisings or Bank DI"
                    value={requestSubject}
                    onChange={(e) => setRequestSubject(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-semibold bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-extrabold text-gray-700 block mb-1">Target Exam</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Assam ADRE / SSC CGL"
                      value={requestExam}
                      onChange={(e) => setRequestExam(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-semibold bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-gray-700 block mb-1">Your Email / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="To notify when PDF is ready"
                      value={requestEmail}
                      onChange={(e) => setRequestEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-semibold bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition shadow-md cursor-pointer"
                >
                  Submit Study Material Request →
                </button>
              </form>
            )}
          </div>
        </section>

      </div>

      {/* SAMPLE INDEX PREVIEW MODAL */}
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
                <span className="px-3 py-1 bg-red-100 text-red-700 font-black text-xs uppercase rounded-md">
                  {previewResource.type} Index Preview
                </span>
                <h3 className="text-xl font-black text-gray-900 leading-snug">
                  {previewResource.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {previewResource.category} • {previewResource.fileSize} • {previewResource.language || 'Bilingual'}
                </p>
              </div>

              {/* Description */}
              <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 space-y-2">
                <span className="text-xs font-extrabold text-red-800 uppercase block">Overview:</span>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {previewResource.description}
                </p>
              </div>

              {/* Chapters List */}
              {previewResource.chapters && (
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider block">
                    Table of Contents / Included Chapters:
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

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setPreviewResource(null)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close Preview
                </button>

                <button
                  onClick={() => {
                    const res = previewResource;
                    setPreviewResource(null);
                    triggerDownload(res);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:from-red-700 hover:to-red-800 transition flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-300" /> Instant Download PDF
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DOWNLOAD SUCCESS TOAST MODAL */}
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
                <h3 className="text-lg font-black text-gray-900">PDF Download Started!</h3>
                <p className="text-xs text-gray-600">
                  <strong className="text-red-600">{downloadSuccessModal.title}</strong> is being saved to your downloads folder.
                </p>
              </div>

              <div className="p-3 bg-red-50 rounded-xl text-[11px] font-bold text-red-800">
                Tip: Subscribe on WhatsApp to receive daily PDF notes directly on your phone.
              </div>

              <button
                onClick={() => setDownloadSuccessModal(null)}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
              >
                Continue Browsing Study Materials
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
