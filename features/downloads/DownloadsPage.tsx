'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { 
  Download, FileText, Smartphone, Laptop, Search, 
  CheckCircle2, Sparkles, BookOpen, Calendar, ShieldCheck, 
  ChevronRight, Filter, Eye, Star, ArrowDownToLine, 
  Share2, HardDrive, Cpu, AlertCircle, X, Check
} from 'lucide-react';

export default function DownloadsPage() {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>('all');
  
  // Download Modal / Toast State
  const [downloadingItem, setDownloadingItem] = useState<{ id: string; title: string; fileUrl: string } | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadCompleted, setDownloadCompleted] = useState<boolean>(false);

  // Mock Free Download Resources
  const downloadsData = [
    {
      id: "dl-1",
      title: "GYANM Current Affairs Monthly Magbook - July 2026 Edition",
      category: "magazine",
      exam: "All Govt Exams",
      fileType: "PDF Document",
      size: "14.2 MB",
      pages: 84,
      downloadCount: "48,200+",
      rating: "4.9",
      updatedDate: "July 28, 2026",
      featured: true,
      description: "Complete coverage of National News, Banking Awareness, Defense Deals, Sports, Govt Schemes, and 200+ Practice MCQs with detailed explanations.",
      fileUrl: "#"
    },
    {
      id: "dl-2",
      title: "SSC CGL 2025 Tier-1 All Shifts Question Papers with Video Solutions",
      category: "pyq",
      exam: "SSC CGL",
      fileType: "ZIP Archive (39 PDFs)",
      size: "38.5 MB",
      pages: 320,
      downloadCount: "62,100+",
      rating: "5.0",
      updatedDate: "June 15, 2026",
      featured: true,
      description: "Authentic TCS shift-wise question papers for Quantitative Aptitude, Reasoning, General English, and General Awareness.",
      fileUrl: "#"
    },
    {
      id: "dl-3",
      title: "Vedic Math Shortcuts & Speed Calculation Formula Formula Compendium",
      category: "formulas",
      exam: "Bank PO & SSC",
      fileType: "PDF Document",
      size: "6.8 MB",
      pages: 42,
      downloadCount: "89,500+",
      rating: "4.8",
      updatedDate: "May 10, 2026",
      featured: true,
      description: "Master multiplication tricks, square roots in 3 seconds, percentage-fraction conversion tables, and DI speed hacks.",
      fileUrl: "#"
    },
    {
      id: "dl-4",
      title: "Assam ADRE 2.0 Class III & IV Solved Model Question Papers",
      category: "pyq",
      exam: "Assam ADRE",
      fileType: "Bilingual PDF (Assamese & Eng)",
      size: "18.4 MB",
      pages: 110,
      downloadCount: "34,800+",
      rating: "4.9",
      updatedDate: "July 02, 2026",
      featured: false,
      description: "Specially crafted model papers following State Level Recruitment Commission (SLRC) official syllabus and difficulty curve.",
      fileUrl: "#"
    },
    {
      id: "dl-5",
      title: "IBPS PO / Clerk Mains Financial & Banking Awareness Booster 2026",
      category: "magazine",
      exam: "Banking",
      fileType: "PDF Document",
      size: "11.6 MB",
      pages: 68,
      downloadCount: "29,400+",
      rating: "4.9",
      updatedDate: "July 20, 2026",
      featured: false,
      description: "RBI circulars, Monetary Policy updates, Union Budget summary, Economic Survey points, and Banking terminology lexicon.",
      fileUrl: "#"
    },
    {
      id: "dl-6",
      title: "Punjab State Govt Exams 5000+ GK & Punjab History MCQ Compendium",
      category: "pyq",
      exam: "Punjab Govt",
      fileType: "PDF Document",
      size: "22.1 MB",
      pages: 180,
      downloadCount: "41,300+",
      rating: "4.9",
      updatedDate: "June 28, 2026",
      featured: false,
      description: "Essential for PSSSB Patwari, Punjab Police Constable/Sub-Inspector, Excise Inspector, and Senior Assistant exams.",
      fileUrl: "#"
    },
    {
      id: "dl-7",
      title: "GYANM Live CBT Computer Test Simulator Software for Windows PC",
      category: "app",
      exam: "All Govt Exams",
      fileType: "Windows Installer (.exe)",
      size: "45.0 MB",
      pages: 0,
      downloadCount: "120,000+",
      rating: "5.0",
      updatedDate: "July 2026 v3.4",
      featured: true,
      description: "Replicates exact TCS exam interface with timer, mark for review, section switching, and instant performance analysis offline.",
      fileUrl: "#"
    },
    {
      id: "dl-8",
      title: "GYANM Official Learning App for Android (Direct APK Download)",
      category: "app",
      exam: "Mobile App",
      fileType: "Android Package (.apk)",
      size: "28.4 MB",
      pages: 0,
      downloadCount: "250,000+",
      rating: "4.9",
      updatedDate: "v4.2.1 Latest",
      featured: false,
      description: "Watch live classes, attempt daily free quizzes, download offline video lectures, and chat directly with faculty mentors.",
      fileUrl: "#"
    },
    {
      id: "dl-9",
      title: "English Grammar Rules & Error Spotting 100 Golden Rules Chart",
      category: "formulas",
      exam: "SSC & Bank",
      fileType: "Printable PDF",
      size: "4.5 MB",
      pages: 28,
      downloadCount: "73,000+",
      rating: "4.8",
      updatedDate: "April 18, 2026",
      featured: false,
      description: "High-frequency grammar rules for Subject-Verb agreement, Tenses, Prepositions, and Conditional sentences with practice sets.",
      fileUrl: "#"
    },
    {
      id: "dl-10",
      title: "RRB NTPC & Group D General Science 2000 One-Liners (Physics/Chem/Bio)",
      category: "pyq",
      exam: "Railways RRB",
      fileType: "PDF Document",
      size: "15.8 MB",
      pages: 96,
      downloadCount: "52,600+",
      rating: "4.7",
      updatedDate: "May 30, 2026",
      featured: false,
      description: "NCERT Class 9th & 10th science concepts presented in quick revision one-liner format for rapid memorization.",
      fileUrl: "#"
    },
    {
      id: "dl-11",
      title: "Official TCS Exam Pattern Blueprint & Negative Marking Guidelines 2026",
      category: "syllabus",
      exam: "SSC & Banking",
      fileType: "PDF Document",
      size: "3.2 MB",
      pages: 16,
      downloadCount: "19,800+",
      rating: "4.9",
      updatedDate: "July 01, 2026",
      featured: false,
      description: "Detailed subject-wise weightage breakdown, tier-wise qualification marks, and normalization formulas for multi-shift exams.",
      fileUrl: "#"
    }
  ];

  // Filter Logic
  const filteredDownloads = useMemo(() => {
    return downloadsData.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesExam = selectedExamFilter === 'all' || item.exam.toLowerCase().includes(selectedExamFilter.toLowerCase());
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.exam.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesExam && matchesSearch;
    });
  }, [activeCategory, selectedExamFilter, searchQuery]);

  // Handle Simulated File Download
  const handleTriggerDownload = (item: { id: string; title: string; fileUrl: string }) => {
    setDownloadingItem(item);
    setDownloadProgress(0);
    setDownloadCompleted(false);

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 25) + 15;
      if (current >= 100) {
        current = 100;
        setDownloadProgress(100);
        setDownloadCompleted(true);
        clearInterval(interval);
      } else {
        setDownloadProgress(current);
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#1F1A1C] pb-20">
      
      {/* 1. HERO HEADER */}
      <section className="relative bg-gradient-to-br from-[#8C1316] via-[#A6181B] to-[#6E0E10] text-white pt-12 pb-20 overflow-hidden border-b border-red-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#EF4444_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-red-200 mb-6">
            <button onClick={() => router.push('/')} className="hover:text-white transition cursor-pointer">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-red-300" />
            <span className="text-white font-bold">Free Downloads Center</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/30 text-amber-200 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider backdrop-blur-sm">
              <Download className="w-4 h-4 text-amber-300" />
              <span>100% Free Study Materials & Software</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Download Free PDFs, PYQs & <span className="text-amber-300">CBT Exam Software.</span>
            </h1>

            <p className="text-red-100/90 text-sm sm:text-base leading-relaxed font-medium">
              Access GYANM Academy's curated repository of monthly current affairs magazines, TCS shift-wise question papers, speed math formula sheets, and desktop CBT test software—all free to download.
            </p>
          </div>

        </div>
      </section>

      {/* 2. SEARCH & CATEGORY FILTER BAR */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-red-100 shadow-xl space-y-4">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by title, exam name (e.g. SSC CGL, Assam ADRE, Current Affairs, Formulas)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 bg-gray-50 text-xs sm:text-sm font-bold border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C12223] focus:bg-white"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Categories Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {[
                { id: 'all', label: 'All Resources' },
                { id: 'magazine', label: 'Monthly Current Affairs' },
                { id: 'pyq', label: 'Previous Year Papers' },
                { id: 'formulas', label: 'Formula Cheat Sheets' },
                { id: 'app', label: 'Software & Mobile Apps' },
                { id: 'syllabus', label: 'Exam Syllabi' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${
                    activeCategory === cat.id
                      ? 'bg-[#8C1316] text-white border-[#8C1316] shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#C12223]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Exam Dropdown Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <Filter className="w-4 h-4 text-[#C12223]" />
              <select
                value={selectedExamFilter}
                onChange={(e) => setSelectedExamFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 text-xs font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C12223]"
              >
                <option value="all">All Exam Categories</option>
                <option value="ssc">SSC CGL / CHSL</option>
                <option value="bank">Banking (IBPS/SBI)</option>
                <option value="assam">Assam ADRE & State</option>
                <option value="punjab">Punjab State Exams</option>
                <option value="railways">Railways RRB</option>
              </select>
            </div>

          </div>

        </div>
      </section>

      {/* 3. FEATURED SOFTWARE & APP DOWNLOAD BANNER */}
      {(activeCategory === 'all' || activeCategory === 'app') && (
        <section className="py-12 max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-400 text-red-950 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5" />
                <span>OFFICIAL CBT EXAM SIMULATOR</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
                Practice Like Real TCS Computer-Based Exams
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium max-w-2xl">
                Download the GYANM Windows Desktop App to get offline CBT test software. Experience exact countdown timers, question palette colors, sectional limits, and instant scorecard generation without needing constant internet.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => handleTriggerDownload({
                    id: 'dl-7',
                    title: 'GYANM Windows Desktop CBT Simulator v3.4',
                    fileUrl: '#'
                  })}
                  className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <Laptop className="w-4 h-4 text-amber-300" />
                  <span>Download for Windows PC (45 MB)</span>
                </button>

                <button
                  onClick={() => handleTriggerDownload({
                    id: 'dl-8',
                    title: 'GYANM Android App APK v4.2.1',
                    fileUrl: '#'
                  })}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-2 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Download Android APK (28 MB)</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3 text-xs">
              <div className="font-extrabold text-amber-300 uppercase tracking-wider text-[11px]">System Compatibility:</div>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Windows 10 / 11 (64-bit & 32-bit)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Android 8.0 & Above (Google Play Verified)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No Viruses or Malware (Digitally Signed)</span>
                </li>
              </ul>
            </div>

          </div>
        </section>
      )}

      {/* 4. DOWNLOADS GRID LIST */}
      <section className="py-8 max-w-[1320px] mx-auto px-4 sm:px-6">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[#C12223] font-black text-xs uppercase tracking-widest block">
              FREE PDF ARCHIVE ({filteredDownloads.length} FILES AVAILABLE)
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-black text-[#1F1A1C]">
              Download Verification & Material List
            </h2>
          </div>
        </div>

        {filteredDownloads.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-red-100 space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="font-heading font-black text-lg text-gray-900">No Downloads Found</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto font-medium">
              We couldn't find any downloadable files matching your search query or exam filter. Try resetting your search terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setSelectedExamFilter('all');
              }}
              className="px-5 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl hover:bg-[#A6181B] transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDownloads.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 border border-red-100 shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                {item.featured && (
                  <div className="absolute top-0 right-0 bg-amber-400 text-red-950 font-black text-[9px] uppercase px-3 py-1 rounded-bl-xl shadow-xs">
                    POPULAR DOWNLOAD
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-red-50 text-[#C12223] font-extrabold text-[10px] uppercase rounded-md border border-red-200">
                      {item.exam}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400">
                      {item.fileType}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-base text-[#1F1A1C] group-hover:text-[#C12223] transition line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed font-medium">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-[11px] font-semibold text-gray-500">
                    <div>
                      <span className="block text-gray-400 text-[9px] font-bold uppercase">Size</span>
                      <strong className="text-gray-800">{item.size}</strong>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-[9px] font-bold uppercase">Downloads</span>
                      <strong className="text-emerald-700 font-extrabold">{item.downloadCount}</strong>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-[9px] font-bold uppercase">Rating</span>
                      <strong className="text-amber-600 flex items-center gap-0.5 font-extrabold">
                        ★ {item.rating}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleTriggerDownload(item)}
                    className="w-full py-3 bg-[#FFF5F5] hover:bg-[#C12223] text-[#C12223] hover:text-white font-extrabold text-xs rounded-2xl border border-red-200 transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF ({item.size})</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </section>

      {/* DOWNLOAD PROGRESS & COMPLETION MODAL */}
      <AnimatePresence>
        {downloadingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-red-100 space-y-6 relative"
            >
              <button
                onClick={() => setDownloadingItem(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto transition-colors ${
                  downloadCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-red-50 text-[#C12223]'
                }`}>
                  {downloadCompleted ? (
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  ) : (
                    <ArrowDownToLine className="w-8 h-8 animate-pulse" />
                  )}
                </div>

                <h3 className="font-heading font-black text-lg text-[#1F1A1C]">
                  {downloadCompleted ? 'Download Ready!' : 'Preparing File Package...'}
                </h3>

                <p className="text-xs text-gray-600 font-medium max-w-xs mx-auto line-clamp-2">
                  {downloadingItem.title}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-extrabold text-gray-700">
                  <span>{downloadCompleted ? '100% Completed' : 'Downloading...'}</span>
                  <span>{downloadProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden p-0.5 border border-gray-200">
                  <div 
                    className={`h-full rounded-full transition-all duration-200 ${
                      downloadCompleted ? 'bg-emerald-500' : 'bg-[#C12223]'
                    }`}
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons when completed */}
              {downloadCompleted ? (
                <div className="space-y-2 pt-2">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Successfully initiated download for: ${downloadingItem.title}`);
                      setDownloadingItem(null);
                    }}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Save File to Device</span>
                  </a>
                  <button
                    onClick={() => setDownloadingItem(null)}
                    className="w-full py-2.5 text-gray-500 font-bold text-xs hover:text-gray-700"
                  >
                    Close Dialog
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-gray-400 text-center font-medium">
                  Scanning file for viruses & generating secure GYANM CDN download link...
                </p>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
