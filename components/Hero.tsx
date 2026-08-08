'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, ArrowRight, ShieldCheck, Flame, ChevronRight, ChevronLeft, 
  PhoneCall, Trophy, PlayCircle, Monitor, Users, Sparkles, Clock, CheckCircle2,
  User, Phone, BookOpen, Send, HelpCircle
} from 'lucide-react';

interface HeroProps {
  onStartLearning: () => void;
  onExploreCourses: () => void;
  onOpenMentorship: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartLearning, onExploreCourses, onOpenMentorship }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [selectedGoal, setSelectedGoal] = useState<string>('All');

  // Query Form State
  const [queryName, setQueryName] = useState<string>('');
  const [queryPhone, setQueryPhone] = useState<string>('');
  const [queryExam, setQueryExam] = useState<string>('SSC CGL 2026');
  const [queryMode, setQueryMode] = useState<string>('Online Live');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [querySubmitted, setQuerySubmitted] = useState<boolean>(false);

  const goals = [
    { id: 'All', name: 'All Exams' },
    { id: 'SSC', name: 'SSC CGL & CHSL' },
    { id: 'Banking', name: 'IBPS & SBI PO' },
    { id: 'Assam', name: 'Assam ADRE 3.0' },
    { id: 'Railways', name: 'Railways RRB' },
    { id: 'UPSC', name: 'UPSC & APSC' }
  ];

  const banners = [
    {
      id: 1,
      tag: '🔥 POPULAR LIVE BATCH 2026',
      badgeColor: 'bg-[#DC2626]',
      title: 'SSC CGL 2026 Foundation + Mains Super Batch',
      subtitle: '350+ Live Interactive Classes • Tier I + Tier II • TCS Pattern Mock Tests • Bilingual Notes',
      offer: 'Flat 60% OFF • Early Bird Price ₹3,499',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
      ctaText: 'Enroll In Live Batch',
      action: onStartLearning,
      mentors: [
        { name: 'Rakesh Sharma', title: 'Ex-Central Excise Inspector' },
        { name: 'Anuj Gupta', title: 'Ex-SBI PO' }
      ]
    },
    {
      id: 2,
      tag: 'STATE EXAM SPECIAL',
      badgeColor: 'bg-[#C12223]',
      title: 'Assam ADRE 3.0 (Grade III & IV) Target Batch',
      subtitle: 'Complete Assam History, Polity, Geography, General Maths & English in Assamese & English medium',
      offer: 'Special State Discount • ₹1,999 Only',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200',
      ctaText: 'Join ADRE Batch',
      action: onExploreCourses,
      mentors: [
        { name: 'Pranab Kumar Das', title: 'Assam State Exam Expert' }
      ]
    },
    {
      id: 3,
      tag: 'FREE ALL-INDIA MOCK TEST',
      badgeColor: 'bg-[#27AE60]',
      title: 'TCS Pattern Full Mock Test Series 2026',
      subtitle: 'Real CBT Exam Interface, Instant All India Rank (AIR), Detailed Solutions & Performance Analytics',
      offer: '100% FREE Access For All Aspirants',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
      ctaText: 'Attempt Free Mock Test',
      action: onExploreCourses,
      mentors: [
        { name: 'TCS Exam Engine', title: '100+ Sectional Tests' }
      ]
    },
    {
      id: 4,
      tag: 'PERSONAL GUIDANCE',
      badgeColor: 'bg-[#C12223]',
      title: '1-on-1 Mentorship With Selected Officers',
      subtitle: 'Customized Study Plan, Weekly Answer Writing Review & Doubt Solving directly via Zoom/Calls',
      offer: 'Book Free 15-Min Academic Strategy Call',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200',
      ctaText: 'Book Free Mentor Call',
      action: onOpenMentorship,
      mentors: [
        { name: 'Dr. V. K. Nanda', title: 'Retd. Additional Secretary' },
        { name: 'Ex-Officers Team', title: 'UPSC & State PSC Mentors' }
      ]
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryName.trim() || queryPhone.trim().length !== 10) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: queryName,
          phone: queryPhone,
          targetExam: queryExam,
          mode: queryMode,
          source: 'HERO_QUERY',
        }),
      });
      setQuerySubmitted(true);
    } catch (err) {
      console.error('Failed to submit lead', err);
      setQuerySubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentBanner = banners[currentSlide];

  return (
    <section className="bg-gradient-to-b from-[#FFF5F5] via-[#FFFAFA] to-white py-8 lg:py-12 border-b border-[#F3DCDD] relative overflow-hidden">
      
      {/* Background Ambient Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-gradient-to-b from-[#C12223]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Top Clean Goal Selection Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C12223] animate-ping shrink-0" />
            <span className="font-heading font-black text-lg sm:text-xl text-[#1F1A1C] tracking-tight">
              Gyanam ACADEMY <span className="text-[#C12223]">•</span> BATCHES & OFFERS
            </span>
          </div>

          {/* Goal Exam Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {goals.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setSelectedGoal(g.id);
                  onExploreCourses();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedGoal === g.id
                    ? 'bg-[#C12223] text-white shadow-sm'
                    : 'bg-white text-[#555555] border border-[#F3DCDD] hover:border-[#C12223] hover:text-[#C12223]'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN HERO GRID: Slider Banner + Query Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* MAIN BANNER SLIDER CARD (Left 7-8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 relative rounded-3xl overflow-hidden shadow-2xl border border-red-500/30 bg-gradient-to-br from-[#8C1316] via-[#A81B1E] to-[#B91C1C] text-white min-h-[380px] lg:min-h-[440px] flex flex-col justify-between">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full min-h-[380px] lg:min-h-[440px] p-6 sm:p-8 lg:p-10 flex flex-col justify-between z-10"
              >
                {/* Background Image with Vibrant Red Vignette */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={currentBanner.image}
                    alt={currentBanner.title}
                    className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8C1316] via-[#8C1316]/90 to-[#8C1316]/40" />
                </div>

                {/* Banner Content Upper Area */}
                <div className="relative z-10 max-w-2xl space-y-3.5">
                  
                  {/* Category Badge */}
                  <div className="inline-flex flex-wrap items-center gap-2">
                    <span className={`${currentBanner.badgeColor} text-white text-[10px] sm:text-xs font-black uppercase px-3 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1`}>
                      <Sparkles className="w-3 h-3 text-white" />
                      <span>{currentBanner.tag}</span>
                    </span>

                    <span className="text-xs text-amber-300 font-extrabold flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{currentBanner.offer}</span>
                    </span>
                  </div>

                  {/* Main Slide Title */}
                  <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-tight tracking-tight">
                    {currentBanner.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
                    {currentBanner.subtitle}
                  </p>

                  {/* Mentors Pill list */}
                  <div className="pt-1 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                      FACULTY:
                    </span>
                    {currentBanner.mentors.map((m, idx) => (
                      <span
                        key={idx}
                        className="bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-lg"
                      >
                        {m.name} <span className="text-gray-200 font-normal">({m.title})</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Banner Lower Area: CTAs + Nav Controls */}
                <div className="relative z-10 pt-5 border-t border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6">
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={currentBanner.action}
                      className="px-5 py-3 bg-gradient-to-r from-[#EF4444] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#EF4444] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-[#C12223]/30 transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{currentBanner.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={onExploreCourses}
                      className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-md"
                    >
                      <Monitor className="w-4 h-4 text-[#EF4444]" />
                      <span>View Batches</span>
                    </button>
                  </div>

                  {/* Banner Carousel Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    
                    {/* Indicator Dots */}
                    <div className="flex items-center gap-1.5">
                      {banners.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            currentSlide === idx ? 'w-6 bg-[#EF4444]' : 'w-2 bg-white/40 hover:bg-white'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Left / Right Navigation */}
                    <div className="flex items-center gap-1.5 ml-2">
                      <button
                        onClick={handlePrev}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer backdrop-blur-md"
                        aria-label="Previous Slide"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer backdrop-blur-md"
                        aria-label="Next Slide"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* QUERY FORM CARD (Right 4-5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl p-6 shadow-xl border border-[#F3DCDD] flex flex-col justify-between relative overflow-hidden">
            
            {/* Header / Title */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0EA] border border-[#C12223]/25 text-[#C12223] text-[11px] font-black uppercase rounded-full tracking-wider">
                  <HelpCircle className="w-3.5 h-3.5 text-[#C12223]" />
                  <span>Free Academic Guidance</span>
                </div>
                <span className="text-[10px] font-extrabold text-[#27AE60] bg-[#27AE60]/10 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60] animate-pulse" />
                  Counselors Live
                </span>
              </div>

              <h3 className="font-heading font-black text-xl sm:text-2xl text-[#1F1A1C] leading-tight mb-1">
                Have Exam Queries?
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed mb-4 font-medium">
                Request an instant call back from Gyanam Senior Faculty for fees, batch timings & strategy.
              </p>

              {querySubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#F0FDF4] border border-[#27AE60]/30 p-5 rounded-2xl text-center space-y-3 my-4"
                >
                  <div className="w-12 h-12 bg-[#27AE60] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-base text-[#1F1A1C]">
                      Callback Request Registered!
                    </h4>
                    <p className="text-xs text-[#555555] mt-1 leading-relaxed">
                      Thank you, <strong className="text-[#1F1A1C]">{queryName}</strong>. Our Senior Academic Counselor will call you at <strong className="text-[#C12223]">{queryPhone}</strong> within 15 minutes.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setQuerySubmitted(false);
                      setQueryName('');
                      setQueryPhone('');
                    }}
                    className="mt-2 text-xs font-bold text-[#C12223] underline hover:text-[#8C1316] transition cursor-pointer"
                  >
                    Submit another query
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleQuerySubmit} className="space-y-3.5">
                  {/* Name Input */}
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#555555] mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={queryName}
                        onChange={(e) => setQueryName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C12223] focus:bg-white focus:ring-2 focus:ring-[#C12223]/10 rounded-xl text-xs font-semibold text-[#1F1A1C] outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#555555] mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={queryPhone}
                        onChange={(e) => setQueryPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C12223] focus:bg-white focus:ring-2 focus:ring-[#C12223]/10 rounded-xl text-xs font-semibold text-[#1F1A1C] outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Target Exam Select */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#555555] mb-1">
                        Target Exam
                      </label>
                      <div className="relative">
                        <select
                          value={queryExam}
                          onChange={(e) => setQueryExam(e.target.value)}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C12223] focus:bg-white rounded-xl text-xs font-semibold text-[#1F1A1C] outline-none transition appearance-none cursor-pointer"
                        >
                          <option value="SSC CGL 2026">SSC CGL / CHSL</option>
                          <option value="Assam ADRE 3.0">Assam ADRE 3.0</option>
                          <option value="IBPS & SBI PO">IBPS & SBI PO</option>
                          <option value="Railways RRB">Railways RRB</option>
                          <option value="UPSC / APSC GS">UPSC / APSC</option>
                          <option value="Other Govt Exam">Other Exam</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#555555] mb-1">
                        Batch Mode
                      </label>
                      <select
                        value={queryMode}
                        onChange={(e) => setQueryMode(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C12223] focus:bg-white rounded-xl text-xs font-semibold text-[#1F1A1C] outline-none transition appearance-none cursor-pointer"
                      >
                        <option value="Online Live">Online Live Batch</option>
                        <option value="Offline Classroom">Offline Center</option>
                        <option value="Test Series Only">Test Series Only</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-[#EF4444] via-[#C12223] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#EF4444] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#C12223]/25 hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? (
                      <span>Sending Query...</span>
                    ) : (
                      <>
                        <PhoneCall className="w-4 h-4" />
                        <span>Request Instant Callback</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Trust Footer inside Query Form Card */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#666666] font-medium mt-3">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#27AE60]" />
                100% Free Counseling
              </span>
              <span className="text-[#C12223] font-bold">
                ⚡ Call in ~15 Mins
              </span>
            </div>

          </div>

        </div>

        {/* BOTTOM CLEAN TRUST STATS BAR - Spacious & High-Contrast */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#F3DCDD] shadow-sm flex items-center gap-3.5 hover:border-[#C12223]/40 transition">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <span className="font-heading font-black text-lg text-[#1F1A1C] block leading-none">
                4.9 / 5.0 Rating
              </span>
              <span className="text-xs text-[#666666] font-medium mt-1 block">
                12,500+ Student Reviews
              </span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#F3DCDD] shadow-sm flex items-center gap-3.5 hover:border-[#C12223]/40 transition">
            <div className="w-11 h-11 rounded-xl bg-[#C12223]/10 text-[#C12223] flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-black text-lg text-[#1F1A1C] block leading-none">
                10,000+ Selections
              </span>
              <span className="text-xs text-[#666666] font-medium mt-1 block">
                In SSC, Banking & State PSC
              </span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#F3DCDD] shadow-sm flex items-center gap-3.5 hover:border-[#C12223]/40 transition">
            <div className="w-11 h-11 rounded-xl bg-[#C12223]/10 text-[#C12223] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-black text-lg text-[#1F1A1C] block leading-none">
                5,00,000+ Aspirants
              </span>
              <span className="text-xs text-[#666666] font-medium mt-1 block">
                Trust Gyanam Academy
              </span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#F3DCDD] shadow-sm flex items-center gap-3.5 hover:border-[#C12223]/40 transition">
            <div className="w-11 h-11 rounded-xl bg-[#27AE60]/10 text-[#27AE60] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-black text-lg text-[#1F1A1C] block leading-none">
                100% TCS Pattern
              </span>
              <span className="text-xs text-[#666666] font-medium mt-1 block">
                Latest 2026 Exam Engine
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

