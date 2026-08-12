"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { EXAM_CATEGORIES } from '../../data/mockData';
import { Course } from '../../types';
import { 
  Search, Filter, Star, Users, Clock, BookOpen, ArrowRight, CheckCircle, 
  PlayCircle, Download, ShieldCheck, Sparkles, Scale, X, Check, ChevronRight, 
  Calendar, Layers, Tag, Video, FileText, HelpCircle, PhoneCall, Grid, List, 
  Award, RefreshCw, ChevronDown, Percent, ArrowLeft
} from 'lucide-react';

export const CoursePage: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const router = useRouter();
  const onEnrollCourse = (_course?: Course) => router.push('/?enroll=true');
  const onOpenMentorship = () => router.push('/?mentorship=true');
  const onSelectCourseSlug = (slug: string) => router.push('/courses/' + slug);

  const handleBackToHome = () => router.push('/');

  const handleSelectCourseSlug = (slug: string) => {
    if (onSelectCourseSlug) onSelectCourseSlug(slug);
    ;
  };
  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-low' | 'discount'>('popular');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  // Selected course for direct modal view
  const [activeCourseDetail, setActiveCourseDetail] = useState<Course | null>(null);
  const [demoVideoUrl, setDemoVideoUrl] = useState<string | null>(null);

  // Compare courses state
  const [compareList, setCompareList] = useState<Course[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  // Promo code engine
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMsg, setCouponMsg] = useState<string>('');

  // Delivery Modes
  const modes = [
    { id: 'all', name: 'All Batch Modes' },
    { id: 'live', name: '🔴 Live Interactive' },
    { id: 'recorded', name: '📹 Recorded VOD' },
    { id: 'offline', name: '🏫 Offline Campus' }
  ];

  // Languages
  const languages = [
    { id: 'all', name: 'All Languages' },
    { id: 'bilingual', name: 'Hindi + English' },
    { id: 'assamese', name: 'Assamese + English' },
    { id: 'english', name: 'English Only' }
  ];

  // Filtered & Sorted Courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Category filter
      const matchesCat = selectedCategory === 'all' || course.category === selectedCategory;

      // Language filter
      let matchesLang = true;
      if (selectedLanguage === 'bilingual') matchesLang = course.language.includes('Hindi');
      else if (selectedLanguage === 'assamese') matchesLang = course.language.includes('Assamese');
      else if (selectedLanguage === 'english') matchesLang = course.language === 'English';

      // Price filter
      let matchesPrice = true;
      if (priceRange === 'under-2k') matchesPrice = course.discountPrice < 2000;
      else if (priceRange === '2k-5k') matchesPrice = course.discountPrice >= 2000 && course.discountPrice <= 5000;
      else if (priceRange === 'above-5k') matchesPrice = course.discountPrice > 5000;

      // Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        course.title.toLowerCase().includes(q) ||
        course.targetExam.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q) ||
        course.instructor.name.toLowerCase().includes(q);

      return matchesCat && matchesLang && matchesPrice && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.discountPrice - b.discountPrice;
      if (sortBy === 'discount') {
        const discA = ((a.originalPrice - a.discountPrice) / a.originalPrice);
        const discB = ((b.originalPrice - b.discountPrice) / b.originalPrice);
        return discB - discA;
      }
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.studentsEnrolled - a.studentsEnrolled;
    });
  }, [courses, selectedCategory, selectedLanguage, priceRange, searchQuery, sortBy]);

  // Coupon Applier
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.toUpperCase() === 'GYANAM2026' || couponInput.toUpperCase() === 'OFFICER20') {
      setAppliedCoupon(couponInput.toUpperCase());
      setCouponMsg('🎉 Coupon applied! Extra 10% discount added to all fees.');
    } else {
      setCouponMsg('❌ Invalid Coupon Code. Try using GYANAM2026.');
    }
  };

  // Compare Toggle
  const handleToggleCompare = (course: Course) => {
    if (compareList.some(c => c.id === course.id)) {
      setCompareList(compareList.filter(c => c.id !== course.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can select a maximum of 3 courses for side-by-side comparison.');
        return;
      }
      setCompareList([...compareList, course]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#1F1A1C] font-sans">
      
      {/* Course Page Header Banner */}
      <section className="bg-gradient-to-br from-[#8C1316] via-[#8C1306] to-[#8C1317] text-white py-12 px-4 sm:px-6 relative overflow-hidden border-b border-red-900/40">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1320px] mx-auto space-y-6 px-8 sm:px-6">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
              <button
                onClick={handleBackToHome}
                className="hover:text-amber-300 transition flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Home
              </button>
              <span>/</span>
              <span className="text-white font-bold">Courses & Exam Batches 2026</span>
            </div>

            <button
              onClick={onOpenMentorship}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#1F1A1C] text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Request Counseling
            </button>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2 max-w-3xl">
            <span className="px-3 py-1 bg-red-500/20 text-red-200 border border-red-500/30 text-[11px] font-black uppercase rounded-full tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Official GYANAM Course Directory</span>
            </span>
            <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
              All Target Government Exam Batches
            </h1>
            <p className="text-xs sm:text-base text-gray-200 font-medium leading-relaxed">
              Explore Live online, recorded video courses, and classroom batches designed by Ex-Bureaucrats & Senior Subject Experts with TCS pattern test series and bilingual study notes.
            </p>
          </div>

          {/* Key Quick Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>100% TCS Updated Pattern</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>4.9/5 Rating (50k+ Reviews)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <Video className="w-4 h-4 text-sky-400" />
              <span>Unlimited Recorded Replays</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>1-on-1 Doubt Clearing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Course Content Section */}
      <section className="py-12 max-w-[1320px] mx-auto px-8 sm:px-6 space-y-8">
        
        {/* Category Pills & Promo Coupon Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Exam Category Slider */}
          <div className="lg:col-span-8 space-y-2">
            <div className="text-xs font-black uppercase text-[#888888] tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#C12223]" />
              <span>Filter by Exam Category</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {EXAM_CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition shrink-0 border flex items-center gap-2 cursor-pointer shadow-sm ${
                      isSelected
                        ? 'bg-[#C12223] text-white border-[#C12223] shadow-md shadow-[#C12223]/20 scale-102'
                        : 'bg-white text-[#555555] border-[#F3DCDD] hover:border-[#C12223] hover:text-[#C12223]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coupon Code Engine Box */}
          <div className="lg:col-span-4 bg-gradient-to-r from-[#FFF5F5] to-red-50 p-4 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#C12223] flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Early Bird Student Discount
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                Code: GYANAM2026
              </span>
            </div>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Enter GYANAM2026"
                className="px-3 py-1.5 bg-white border border-[#F3DCDD] rounded-xl text-xs font-bold uppercase focus:outline-none focus:border-[#C12223] flex-1 text-[#1F1A1C]"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#C12223] hover:bg-[#8C1316] text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer whitespace-nowrap"
              >
                Apply
              </button>
            </form>

            {couponMsg && (
              <p className={`text-[11px] font-bold ${appliedCoupon ? 'text-emerald-700' : 'text-red-600'}`}>
                {couponMsg}
              </p>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-white rounded-2xl border border-[#F3DCDD] shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by exam, subject or faculty name..."
                className="w-full pl-9 pr-8 py-2.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-xs font-semibold placeholder:text-gray-400 text-[#1F1A1C] focus:outline-none focus:border-[#C12223] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Language filter */}
            <div className="md:col-span-3 flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap hidden lg:inline">Medium:</span>
              <select
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-xs font-bold text-[#1F1A1C] focus:outline-none focus:border-[#C12223] cursor-pointer"
              >
                {languages.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>

            {/* Price filter */}
            <div className="md:col-span-3 flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap hidden lg:inline">Fee:</span>
              <select
                value={priceRange}
                onChange={e => setPriceRange(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-xs font-bold text-[#1F1A1C] focus:outline-none focus:border-[#C12223] cursor-pointer"
              >
                <option value="all">All Fee Ranges</option>
                <option value="under-2k">Under ₹2,000</option>
                <option value="2k-5k">₹2,000 - ₹5,000</option>
                <option value="above-5k">Above ₹5,000</option>
              </select>
            </div>

            {/* Sort & Layout Toggle */}
            <div className="md:col-span-2 flex items-center justify-between gap-2">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full px-2.5 py-2.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-xs font-bold text-[#1F1A1C] focus:outline-none focus:border-[#C12223] cursor-pointer"
              >
                <option value="popular">🔥 Bestsellers</option>
                <option value="rating">⭐ Top Rated</option>
                <option value="price-low">🏷️ Lowest Fee</option>
                <option value="discount">💥 Max Discount</option>
              </select>

              <div className="flex items-center gap-1 bg-[#FFF5F5] p-1 border border-[#F3DCDD] rounded-xl">
                <button
                  onClick={() => setViewLayout('grid')}
                  className={`p-1.5 rounded-lg transition ${
                    viewLayout === 'grid' ? 'bg-[#C12223] text-white shadow' : 'text-gray-500 hover:text-black'
                  }`}
                  title="Grid Layout"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewLayout('list')}
                  className={`p-1.5 rounded-lg transition ${
                    viewLayout === 'list' ? 'bg-[#C12223] text-white shadow' : 'text-gray-500 hover:text-black'
                  }`}
                  title="List Layout"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Active Comparison Bar */}
          {compareList.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-[#C12223] text-white rounded-xl shadow-md text-xs">
              <div className="flex items-center gap-2 font-bold">
                <Scale className="w-4 h-4 text-amber-300" />
                <span>{compareList.length} Courses selected for side-by-side comparison</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCompareOpen(true)}
                  className="px-3 py-1 bg-white text-[#C12223] font-black rounded-lg hover:bg-amber-100 transition cursor-pointer"
                >
                  Compare Batches
                </button>
                <button
                  onClick={() => setCompareList([])}
                  className="p-1 hover:bg-white/20 rounded text-white"
                  title="Clear compare list"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-[#555555] font-semibold">
          <span>Showing <strong className="text-[#1F1A1C]">{filteredCourses.length}</strong> official course batches</span>
          {(selectedCategory !== 'all' || searchQuery || priceRange !== 'all' || selectedLanguage !== 'all') && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLanguage('all');
                setPriceRange('all');
                setSearchQuery('');
              }}
              className="text-[#C12223] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>

        {/* Course Cards Grid or List View */}
        {filteredCourses.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#F3DCDD] space-y-4 max-w-lg mx-auto shadow-sm">
            <BookOpen className="w-12 h-12 text-[#C12223] mx-auto opacity-50" />
            <h3 className="font-heading font-black text-xl text-[#1F1A1C]">
              No Courses Match Your Criteria
            </h3>
            <p className="text-xs text-[#555555]">
              Try adjusting your search keywords, price filter, or exam category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLanguage('all');
                setPriceRange('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl hover:bg-[#8C1316] transition shadow-md cursor-pointer"
            >
              Show All Courses
            </button>
          </div>
        ) : viewLayout === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => {
              const finalFee = appliedCoupon ? Math.round(course.discountPrice * 0.9) : course.discountPrice;
              const emiPrice = Math.round(finalFee / 12);
              const isComparing = compareList.some(c => c.id === course.id);

              return (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-3xl border border-[#F3DCDD] shadow-xl hover:shadow-2xl overflow-hidden flex flex-col justify-between group relative"
                >
                  <div>
                    {/* Course Image Header */}
                    <div className="relative h-52 overflow-hidden bg-[#450A0A]">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#450A0A]/90 via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                        <span className="px-3 py-1 bg-[#C12223] text-white font-extrabold text-[10px] uppercase rounded-full shadow-md">
                          {course.category}
                        </span>
                        {course.badge && (
                          <span className="px-3 py-1 bg-[#8C1316] text-white font-extrabold text-[10px] rounded-full shadow-md">
                            {course.badge}
                          </span>
                        )}
                      </div>

                      {/* Compare Checkbox */}
                      <button
                        onClick={() => handleToggleCompare(course)}
                        className={`absolute top-4 right-4 z-20 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 border shadow-md transition cursor-pointer ${
                          isComparing
                            ? 'bg-amber-400 text-[#1F1A1C] border-amber-500'
                            : 'bg-black/60 text-white border-white/30 hover:bg-black/80'
                        }`}
                      >
                        <Scale className="w-3 h-3" />
                        <span>{isComparing ? 'Added' : 'Compare'}</span>
                      </button>

                      {/* Rating Stats Overlay */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {course.rating} ({course.reviewsCount})
                        </span>
                        <span className="flex items-center gap-1 text-white/90">
                          <Users className="w-3.5 h-3.5" /> {course.studentsEnrolled.toLocaleString()} Enrolled
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 space-y-4">
                      <div className="text-[11px] font-extrabold text-[#C12223] bg-red-50 px-2.5 py-1 rounded-lg inline-block border border-red-100">
                        Target: {course.targetExam}
                      </div>

                      <h3 
                        onClick={() => {
                          if (onSelectCourseSlug) onSelectCourseSlug(course.slug || course.id);
                          else setActiveCourseDetail(course);
                        }}
                        className="font-heading font-extrabold text-lg text-[#1F1A1C] group-hover:text-[#C12223] transition line-clamp-2 leading-snug cursor-pointer"
                      >
                        {course.title}
                      </h3>

                      {/* Faculty Info */}
                      <div className="flex items-center gap-3 p-2.5 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD]">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#C12223]"
                        />
                        <div>
                          <h5 className="font-bold text-xs text-[#1F1A1C]">{course.instructor.name}</h5>
                          <p className="text-[10px] text-[#555555] truncate max-w-[180px]">{course.instructor.designation}</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-1.5 text-xs text-[#555555]">
                        {course.features.slice(0, 3).map((f, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-[#27AE60] shrink-0 mt-0.5" />
                            <span className="truncate font-medium">{f}</span>
                          </div>
                        ))}
                      </div>

                      {/* Schedule info */}
                      <div className="flex items-center gap-2 text-[11px] text-[#555555] pt-1">
                        <Clock className="w-3.5 h-3.5 text-[#C12223]" />
                        <span className="font-semibold text-[#1F1A1C]">{course.startDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-0 border-t border-[#F3DCDD] mt-4 flex items-end justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#888888] font-bold uppercase">Fee</span>
                        {appliedCoupon && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.2 rounded">
                            Extra 10% Off
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading font-black text-2xl text-[#1F1A1C]">
                          ₹{finalFee.toLocaleString()}
                        </span>
                        <span className="text-xs text-[#888888] line-through">
                          ₹{course.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#27AE60] font-bold block">
                        EMI starts at ₹{emiPrice}/mo
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (onSelectCourseSlug) onSelectCourseSlug(course.slug || course.id);
                          else setActiveCourseDetail(course);
                        }}
                        className="p-2.5 bg-[#FFF5F5] border border-[#F3DCDD] hover:border-[#C12223] text-[#1F1A1C] hover:text-[#C12223] rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                        title="View Full Internal Course Page"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span className="hidden sm:inline">Details</span>
                      </button>

                      <button
                        onClick={() => onEnrollCourse(course)}
                        className="px-4 py-2.5 bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white font-bold text-xs rounded-xl shadow-md shadow-[#C12223]/20 hover:scale-105 transition flex items-center gap-1 cursor-pointer"
                      >
                        Enroll <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* List View Layout */
          <div className="space-y-4">
            {filteredCourses.map(course => {
              const finalFee = appliedCoupon ? Math.round(course.discountPrice * 0.9) : course.discountPrice;
              return (
                <div
                  key={course.id}
                  className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-md hover:shadow-lg transition flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 border border-gray-200"
                    />
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-[#C12223] text-white font-bold text-[9px] rounded uppercase">
                          {course.category}
                        </span>
                        <span className="text-xs font-bold text-[#C12223]">
                          Target: {course.targetExam}
                        </span>
                      </div>
                      <h3 className="font-heading font-black text-base text-[#1F1A1C]">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-[#555555]">
                        <span className="flex items-center gap-1 font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {course.rating}
                        </span>
                        <span>{course.duration}</span>
                        <span>{course.language}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-gray-500 block">Total Fee</span>
                      <span className="font-heading font-black text-2xl text-[#1F1A1C]">
                        ₹{finalFee.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 line-through block">
                        ₹{course.originalPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveCourseDetail(course)}
                        className="px-4 py-2.5 bg-[#FFF5F5] border border-[#F3DCDD] text-xs font-bold rounded-xl text-[#1F1A1C] hover:text-[#C12223] hover:border-[#C12223] transition cursor-pointer"
                      >
                        Syllabus
                      </button>

                      <button
                        onClick={() => onEnrollCourse(course)}
                        className="px-5 py-2.5 bg-[#C12223] text-white text-xs font-bold rounded-xl hover:bg-[#8C1316] transition shadow cursor-pointer"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Course FAQ Accordion */}
        <div className="p-8 bg-white rounded-3xl border border-[#F3DCDD] space-y-6 shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-[#C12223] tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>Got Questions About GYANAM Batches?</span>
            </span>
            <h3 className="font-heading font-black text-2xl text-[#1F1A1C]">
              Frequently Asked Course Admission Questions
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] space-y-1.5">
              <h5 className="font-bold text-sm text-[#1F1A1C]">1. How do I join the daily live classes?</h5>
              <p className="text-[#555555] leading-relaxed">
                Classes are broadcast live via the official GYANAM Android / Web app. You get instant access to live chat with faculty to ask doubts during lectures.
              </p>
            </div>

            <div className="p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] space-y-1.5">
              <h5 className="font-bold text-sm text-[#1F1A1C]">2. What if I miss a live class?</h5>
              <p className="text-[#555555] leading-relaxed">
                Every live class is recorded in 4K resolution and uploaded to your student portal within 1 hour. You can watch recorded videos unlimited times.
              </p>
            </div>

            <div className="p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] space-y-1.5">
              <h5 className="font-bold text-sm text-[#1F1A1C]">3. Are study notes provided in Assamese & English?</h5>
              <p className="text-[#555555] leading-relaxed">
                Yes! Regional exam batches like ADRE and Assam Police provide handwritten bilingual PDFs in both Assamese and English mediums.
              </p>
            </div>

            <div className="p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] space-y-1.5">
              <h5 className="font-bold text-sm text-[#1F1A1C]">4. Is installment / EMI facility available?</h5>
              <p className="text-[#555555] rounded-2xl leading-relaxed">
                Yes, no-cost monthly EMI options starting at ₹149/month are available at checkout with all major credit/debit cards and UPI apps.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* SINGLE COURSE FULL DETAIL MODAL */}
      <AnimatePresence>
        {activeCourseDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCourseDetail(null)}
              className="fixed inset-0 bg-[#450A0A]/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#F3DCDD] overflow-y-auto max-h-[92vh] z-10 my-auto p-6 sm:p-8 space-y-6"
            >
              <button
                onClick={() => setActiveCourseDetail(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-[#1F1A1C] rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Banner */}
              <div className="flex flex-col sm:flex-row items-start gap-6 border-b border-[#F3DCDD] pb-6">
                <img
                  src={activeCourseDetail.thumbnail}
                  alt={activeCourseDetail.title}
                  className="w-full sm:w-48 h-36 rounded-2xl object-cover shrink-0 border border-gray-200"
                />
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#C12223] text-white font-bold text-[10px] rounded uppercase">
                      {activeCourseDetail.category}
                    </span>
                    <span className="text-xs font-bold text-[#C12223] bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      {activeCourseDetail.targetExam}
                    </span>
                  </div>
                  <h2 className="font-heading font-extrabold text-2xl text-[#1F1A1C]">
                    {activeCourseDetail.title}
                  </h2>
                  <div className="flex items-center gap-4 text-xs text-[#555555]">
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {activeCourseDetail.rating} ({activeCourseDetail.reviewsCount} reviews)
                    </span>
                    <span>{activeCourseDetail.studentsEnrolled.toLocaleString()} Enrolled Students</span>
                  </div>
                </div>
              </div>

              {/* Faculty */}
              <div className="p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={activeCourseDetail.instructor.avatar}
                    alt={activeCourseDetail.instructor.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#C12223]"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-[#C12223] uppercase">Course Lead Instructor</span>
                    <h5 className="font-bold text-sm text-[#1F1A1C]">{activeCourseDetail.instructor.name}</h5>
                    <p className="text-xs text-[#555555]">{activeCourseDetail.instructor.designation}</p>
                  </div>
                </div>

                <button
                  onClick={() => setDemoVideoUrl('https://www.youtube.com/embed/kqtD5dpn9C8?autoplay=1')}
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  <PlayCircle className="w-4 h-4" /> Watch Free Sample Class
                </button>
              </div>

              {/* Sample Video Embed */}
              {demoVideoUrl && (
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg relative">
                  <button
                    onClick={() => setDemoVideoUrl(null)}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-full z-10 hover:bg-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <iframe
                    src={demoVideoUrl}
                    title="Sample Demo Lecture"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Included Features */}
              <div>
                <h4 className="font-bold text-sm text-[#1F1A1C] mb-2">Key Batch Features:</h4>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-[#555555]">
                  {activeCourseDetail.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#27AE60] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Syllabus */}
              <div>
                <h4 className="font-bold text-sm text-[#1F1A1C] mb-2">Subject Syllabus Breakdown:</h4>
                <div className="space-y-3">
                  {activeCourseDetail.syllabusOverview.map((s, idx) => (
                    <div key={idx} className="p-3.5 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD]">
                      <h5 className="font-bold text-xs text-[#1F1A1C] mb-1.5">{s.module}</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {s.topics.map((t, tid) => (
                          <span key={tid} className="px-2.5 py-1 bg-white text-[#555555] text-[11px] font-medium rounded-lg border border-[#F3DCDD]">
                            • {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="pt-4 border-t border-[#F3DCDD] flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[#555555] block">Discounted Course Fee</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-black text-3xl text-[#1F1A1C]">
                      ₹{activeCourseDetail.discountPrice}
                    </span>
                    <span className="text-xs text-[#888888] line-through">
                      ₹{activeCourseDetail.originalPrice}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const c = activeCourseDetail;
                    setActiveCourseDetail(null);
                    onEnrollCourse(c);
                  }}
                  className="px-8 py-3.5 bg-[#C12223] hover:bg-[#8C1316] text-white font-bold text-xs rounded-2xl shadow-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Enroll in Batch Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPARISON MODAL */}
      <AnimatePresence>
        {isCompareOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCompareOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-[#F3DCDD] p-6 z-10 overflow-y-auto max-h-[90vh] space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#F3DCDD]">
                <div className="flex items-center gap-2">
                  <Scale className="w-6 h-6 text-[#C12223]" />
                  <div>
                    <h3 className="font-heading font-black text-xl text-[#1F1A1C]">
                      Course Batch Comparison Matrix
                    </h3>
                    <p className="text-xs text-[#555555]">
                      Compare key parameters before enrolling
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCompareOpen(false)}
                  className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr>
                      <th className="p-3 bg-[#FFF5F5] font-extrabold text-[#1F1A1C] border border-[#F3DCDD] min-w-[150px]">
                        Parameter
                      </th>
                      {compareList.map(c => (
                        <th key={c.id} className="p-3 bg-white font-black text-[#1F1A1C] border border-[#F3DCDD] min-w-[220px]">
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 bg-[#C12223] text-white text-[9px] font-bold rounded">
                              {c.category}
                            </span>
                            <div className="font-bold text-sm text-[#1F1A1C] line-clamp-2">{c.title}</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 bg-[#FFF5F5] font-bold border border-[#F3DCDD]">Target Exam</td>
                      {compareList.map(c => (
                        <td key={c.id} className="p-3 border border-[#F3DCDD] font-semibold text-[#C12223]">{c.targetExam}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 bg-[#FFF5F5] font-bold border border-[#F3DCDD]">Fee</td>
                      {compareList.map(c => (
                        <td key={c.id} className="p-3 border border-[#F3DCDD] font-black text-sm text-[#1F1A1C]">
                          ₹{c.discountPrice} <span className="line-through text-xs text-gray-400 font-normal">₹{c.originalPrice}</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 bg-[#FFF5F5] font-bold border border-[#F3DCDD]">Duration</td>
                      {compareList.map(c => (
                        <td key={c.id} className="p-3 border border-[#F3DCDD]">{c.duration}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 bg-[#FFF5F5] font-bold border border-[#F3DCDD]">Faculty</td>
                      {compareList.map(c => (
                        <td key={c.id} className="p-3 border border-[#F3DCDD] font-bold">{c.instructor.name}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 bg-[#FFF5F5] font-bold border border-[#F3DCDD]">Language</td>
                      {compareList.map(c => (
                        <td key={c.id} className="p-3 border border-[#F3DCDD] font-semibold">{c.language}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 bg-[#FFF5F5] font-bold border border-[#F3DCDD]">Features</td>
                      {compareList.map(c => (
                        <td key={c.id} className="p-3 border border-[#F3DCDD]">
                          <ul className="space-y-1">
                            {c.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 bg-[#FFF5F5] font-bold border border-[#F3DCDD]">Action</td>
                      {compareList.map(c => (
                        <td key={c.id} className="p-3 border border-[#F3DCDD]">
                          <button
                            onClick={() => {
                              setIsCompareOpen(false);
                              onEnrollCourse(c);
                            }}
                            className="w-full py-2 bg-[#C12223] text-white font-bold rounded-xl hover:bg-[#8C1316] transition cursor-pointer"
                          >
                            Enroll Now
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
