import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, ArrowRight, ShieldCheck, Flame, ChevronRight, ChevronLeft, 
  PhoneCall, Trophy, PlayCircle, Monitor, Users, Sparkles, Clock, CheckCircle2
} from 'lucide-react';

interface HeroProps {
  onStartLearning: () => void;
  onExploreCourses: () => void;
  onOpenMentorship: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartLearning, onExploreCourses, onOpenMentorship }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [selectedGoal, setSelectedGoal] = useState<string>('All');

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
      badgeColor: 'bg-[#8C1316]',
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
              GYANAM ACADEMY <span className="text-[#C12223]">•</span> BATCHES & OFFERS
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
                    ? 'bg-[#3B0A0C] text-white shadow-sm'
                    : 'bg-white text-[#555555] border border-[#F3DCDD] hover:border-[#C12223] hover:text-[#C12223]'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN BANNER SLIDER CARD - Clean, Premium, Deep Red */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-red-950/20 bg-[#2D0A0B] text-white min-h-[380px] lg:min-h-[420px] flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-full min-h-[380px] lg:min-h-[420px] p-6 sm:p-10 lg:p-12 flex flex-col justify-between z-10"
            >
              {/* Background Image with Dark Red Vignette */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={currentBanner.image}
                  alt={currentBanner.title}
                  className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#2D0A0B] via-[#2D0A0B]/85 to-[#2D0A0B]/40" />
              </div>

              {/* Banner Content Upper Area */}
              <div className="relative z-10 max-w-2xl space-y-4">
                
                {/* Category Badge */}
                <div className="inline-flex items-center gap-2">
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
                <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-white leading-tight tracking-tight">
                  {currentBanner.title}
                </h2>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                  {currentBanner.subtitle}
                </p>

                {/* Mentors Pill list */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    FACULTY:
                  </span>
                  {currentBanner.mentors.map((m, idx) => (
                    <span
                      key={idx}
                      className="bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-lg"
                    >
                      {m.name} <span className="text-gray-300 font-normal">({m.title})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Banner Lower Area: CTAs + Nav Controls */}
              <div className="relative z-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={currentBanner.action}
                    className="px-6 py-3.5 bg-gradient-to-r from-[#DC2626] to-[#8C1316] hover:from-[#8C1316] hover:to-[#DC2626] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-[#C12223]/30 transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{currentBanner.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onExploreCourses}
                    className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-md"
                  >
                    <Monitor className="w-4 h-4 text-[#DC2626]" />
                    <span>View All Batches</span>
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
                          currentSlide === idx ? 'w-6 bg-[#DC2626]' : 'w-2 bg-white/40 hover:bg-white'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Left / Right Navigation */}
                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      onClick={handlePrev}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer backdrop-blur-md"
                      aria-label="Previous Slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer backdrop-blur-md"
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
                Trust GYANAM Academy
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
