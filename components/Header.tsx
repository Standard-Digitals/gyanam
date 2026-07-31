'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GyanamLogo } from '@/components/GyanamLogo';
import { 
  Search, Phone, User, ArrowRight, Menu, X, Sparkles, Award, Shield, 
  ChevronDown, BookOpen, FileText, Download, GraduationCap, Newspaper, 
  HelpCircle, MessageSquare, LayoutDashboard, Heart, History, Bell, 
  PhoneCall, BookMarked, Layers, CheckCircle2,
  User2
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenMentorship: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenSearch, 
  onOpenAuth, 
  onOpenMentorship,
}) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [studentPortalOpen, setStudentPortalOpen] = useState(false);
  const [activeMobileSub, setActiveMobileSub] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (menuName: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  return (
    <>
      {/* Top Announcement Bar - Vibrant Red Header */}
      <div className="bg-gradient-to-r from-[#8C1316] via-[#A6181B] to-[#8C1316] text-white py-2 px-4 text-xs border-b border-red-500/20">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="bg-[#EF4444] text-white font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider shrink-0 shadow-sm">
              NEW BATCH 2026
            </span>
            <span className="text-red-100 text-xs truncate">
              Admissions open for <strong className="text-white">SSC CGL Tier I+II</strong>, <strong className="text-white font-bold">Assam ADRE 3.0</strong> & <strong className="text-white font-bold">SBI PO</strong>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-5 text-red-100 text-xs shrink-0 font-medium">
            <a href="tel:9117343434" className="flex items-center gap-1.5 hover:text-white transition">
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>Helpline: <strong className="text-white">9117 34 34 34</strong></span>
            </a>
            <span className="text-white/20">|</span>
            <button
              onClick={onOpenMentorship}
              className="hover:text-amber-300 transition flex items-center gap-1 font-semibold cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
              <span>Request Callback</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Clean Header Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md py-2 shadow-md border-b border-red-100'
            : 'bg-white py-3.5 border-b border-gray-100'
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Brand Logo with Smooth Scroll Shrink Effect */}
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 transition-all duration-300 cursor-pointer text-left"
          >
            <GyanamLogo 
              className={`transition-all duration-300 ease-in-out group-hover:scale-105 shrink-0 ${
                isScrolled ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-16 h-16 sm:w-18 sm:h-18'
              }`} 
            />
          </button>

          {/* Desktop Navigation Links - Clean, Spacious, Well-Grouped */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-xs xl:text-sm font-semibold text-[#222222]">
            
            {/* 1. COURSES DROPDOWN */}
            <div
              className="relative py-2 shrink-0"
              onMouseEnter={() => handleMouseEnter('courses')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                onClick={() => router.push('/courses')}
                className={`flex items-center gap-1.5 hover:text-[#C12223] transition py-1 font-bold whitespace-nowrap cursor-pointer ${
                  ''
                }`}
              >
                <span>Courses & Batches</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'courses' ? 'rotate-180 text-[#C12223]' : 'text-gray-400'}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'courses' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-[540px] bg-white rounded-2xl p-6 shadow-2xl border border-red-100 grid grid-cols-2 gap-6 z-50 text-left"
                  >
                    <div>
                      <div className="text-[11px] font-black text-[#C12223] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> Target Exam Batches
                      </div>
                      <ul className="space-y-1.5 text-xs font-semibold text-[#444444]">
                        <li>
                          <button 
                            onClick={() => {
                              setActiveDropdown(null);
                              router.push('/courses/ssc-cgl-2026-foundation-mains-super-batch')
                            }} 
                            className="w-full text-left hover:text-[#C12223] hover:translate-x-1 transition p-2 rounded-xl hover:bg-[#FFF5F5] cursor-pointer"
                          >
                            SSC CGL & CHSL 2026 Batch
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => {
                              setActiveDropdown(null);
                              router.push('/courses/bank-po-clerk-2026-complete-selection-batch')
                            }} 
                            className="w-full text-left hover:text-[#C12223] hover:translate-x-1 transition p-2 rounded-xl hover:bg-[#FFF5F5] cursor-pointer"
                          >
                            IBPS & SBI PO / Clerk Masterclass
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => {
                              setActiveDropdown(null);
                              router.push('/courses/assam-adre-grade-iii-iv-super-target-batch')
                            }} 
                            className="w-full text-left hover:text-[#C12223] hover:translate-x-1 transition p-2 rounded-xl hover:bg-[#FFF5F5] cursor-pointer"
                          >
                            Assam ADRE 3.0 Special Batch
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => {
                              setActiveDropdown(null);
                              router.push('/courses/rrb-ntpc-group-d-ultimate-express-batch')
                            }} 
                            className="w-full text-left hover:text-[#C12223] hover:translate-x-1 transition p-2 rounded-xl hover:bg-[#FFF5F5] cursor-pointer"
                          >
                            Railway RRB NTPC & ALP Express
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => {
                              setActiveDropdown(null);
                              router.push('/courses/upsc-cse-2026-gs-prelims-mains-integrated-foundation')
                            }} 
                            className="w-full text-left hover:text-[#C12223] hover:translate-x-1 transition p-2 rounded-xl hover:bg-[#FFF5F5] cursor-pointer"
                          >
                            UPSC GS Foundation & State PSC
                          </button>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-[#FFF5F5] p-4 rounded-xl border border-[#C12223]/15 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] font-black text-[#C12223] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Included Features
                        </div>
                        <ul className="space-y-2 text-xs text-[#222222] font-medium">
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#27AE60] shrink-0" /> Live Interactive 4K Classes</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#27AE60] shrink-0" /> Bilingual Handwritten PDFs</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#27AE60] shrink-0" /> TCS Pattern Mock Series</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#27AE60] shrink-0" /> 1-on-1 Officer Guidance</li>
                        </ul>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveDropdown(null);
                          router.push('/courses');
                        }} 
                        className="block w-full text-center py-2.5 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white rounded-xl text-xs font-extrabold shadow-sm hover:opacity-95 transition cursor-pointer"
                      >
                        Explore All Batches →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. DAILY CURRENT AFFAIRS */}
            <div
              className="relative py-2 shrink-0"
              onMouseEnter={() => handleMouseEnter('currentAffairs')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                onClick={() => { setActiveDropdown(null); router.push('/current-affairs'); }}
              className="flex items-center gap-1.5 hover:text-[#C12223] transition py-1 font-semibold whitespace-nowrap cursor-pointer">
                <span>Current Affairs</span>
                <span className="bg-[#C12223] text-white text-[9px] font-black px-1.5 py-0.5 rounded shrink-0">
                  DAILY
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'currentAffairs' ? 'rotate-180 text-[#C12223]' : 'text-gray-400'}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'currentAffairs' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-72 bg-white rounded-2xl p-4 shadow-2xl border border-red-100 z-50 text-left space-y-2"
                  >
                    <div className="text-[11px] font-black text-[#C12223] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Newspaper className="w-3.5 h-3.5" /> CA & Daily Quiz Hub
                    </div>
                    <ul className="space-y-1 text-xs font-semibold text-[#444444]">
                      <li>
                        <button onClick={() => { setActiveDropdown(null); router.push('/current-affairs?tab=news'); }} className="w-full text-left hover:text-[#C12223] p-2 rounded-xl hover:bg-[#FFF5F5] flex items-center justify-between transition cursor-pointer">
                          <span>Today's News Analysis</span>
                          <span className="text-[9px] bg-[#27AE60]/10 text-[#27AE60] font-extrabold px-1.5 py-0.5 rounded">7:00 AM</span>
                        </button>
                      </li>
                      <li>
                        <button onClick={() => { setActiveDropdown(null); router.push('/current-affairs?tab=quiz'); }} className="w-full text-left hover:text-[#C12223] p-2 rounded-xl hover:bg-[#FFF5F5] flex items-center justify-between transition cursor-pointer">
                          <span>Daily 5-MCQ Live Test</span>
                          <span className="text-[9px] bg-[#C12223]/10 text-[#C12223] font-extrabold px-1.5 py-0.5 rounded">Live</span>
                        </button>
                      </li>
                      <li>
                        <button onClick={() => { setActiveDropdown(null); router.push('/current-affairs?tab=pdf'); }} className="w-full text-left hover:text-[#C12223] p-2 rounded-xl hover:bg-[#FFF5F5] flex items-center justify-between transition cursor-pointer">
                          <span>Monthly PDF Booklet</span>
                          <span className="text-[9px] bg-gray-100 text-gray-700 font-extrabold px-1.5 py-0.5 rounded">PDF</span>
                        </button>
                      </li>
                      <li>
                        <button onClick={() => { setActiveDropdown(null); router.push('/current-affairs?tab=assam'); }} className="w-full text-left hover:text-[#C12223] p-2 rounded-xl hover:bg-[#FFF5F5] flex items-center justify-between transition cursor-pointer">
                          <span>Assam & State Special CA</span>
                          <span className="text-[9px] bg-[#C12223]/10 text-[#C12223] font-extrabold px-1.5 py-0.5 rounded">ADRE</span>
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. STUDY MATERIAL */}
            <div
              className="relative py-2 shrink-0"
              onMouseEnter={() => handleMouseEnter('downloads')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                onClick={() => { setActiveDropdown(null); router.push('/study-material'); }}
                className="flex items-center gap-1.5 hover:text-[#C12223] transition py-1 font-semibold whitespace-nowrap cursor-pointer"
              >
                <span>Study Material</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'downloads' ? 'rotate-180 text-[#C12223]' : 'text-gray-400'}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'downloads' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-72 bg-white rounded-2xl p-4 shadow-2xl border border-red-100 z-50 text-left space-y-2"
                  >
                    <div className="text-[11px] font-black text-[#C12223] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" /> Free PDF & PYQ Portal
                    </div>
                    <ul className="space-y-1 text-xs font-semibold text-[#444444]">
                      <li><button onClick={() => { setActiveDropdown(null); router.push('/study-material?category=PDF Notes'); }} className="w-full text-left hover:text-[#C12223] p-2 rounded-xl hover:bg-[#FFF5F5] block transition cursor-pointer">Handwritten Subject Notes PDF</button></li>
                      <li><button onClick={() => { setActiveDropdown(null); router.push('/study-material?category=PYQ Paper'); }} className="w-full text-left hover:text-[#C12223] p-2 rounded-xl hover:bg-[#FFF5F5] block transition cursor-pointer">Previous 10 Years Solved PYQs</button></li>
                      <li><button onClick={() => { setActiveDropdown(null); router.push('/study-material?category=Syllabus PDF'); }} className="w-full text-left hover:text-[#C12223] p-2 rounded-xl hover:bg-[#FFF5F5] block transition cursor-pointer">Official Syllabus & Exam Pattern</button></li>
                      <li><button onClick={() => { setActiveDropdown(null); router.push('/study-material?category=Formula Sheet'); }} className="w-full text-left hover:text-[#C12223] p-2 rounded-xl hover:bg-[#FFF5F5] block transition cursor-pointer">Formula Sheets & Speed Math</button></li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 4. MOCK TESTS */}
            <a href="#mock-tests" className="hover:text-[#C12223] transition py-2 font-semibold whitespace-nowrap shrink-0">
              Mock Tests
            </a>

            {/* 5. MORE / RESOURCES DROPDOWN */}
            <div
              className="relative py-2 shrink-0"
              onMouseEnter={() => handleMouseEnter('more')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-1 hover:text-[#C12223] transition py-1 font-semibold whitespace-nowrap cursor-pointer">
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'more' ? 'rotate-180 text-[#C12223]' : 'text-gray-400'}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'more' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 w-64 bg-white rounded-2xl p-4 shadow-2xl border border-red-100 z-50 text-left space-y-2"
                  >
                    <div className="text-[11px] font-black text-[#C12223] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Information & Support
                    </div>
                    <ul className="space-y-1 text-xs font-semibold text-[#444444]">
                      <li><a href="#mentors" className="hover:text-[#C12223] p-2 rounded-xl hover:bg-[#FFF5F5] block transition">Faculty & Mentors</a></li>
                      <li><a href="#blog" className="hover:text-[#C12223] p-2 rounded-xl hover:bg-[#FFF5F5] block transition">Exam Official Notifications</a></li>
                      <li><a href="#success-stories" className="hover:text-[#C12223] p-2 rounded-xl hover:bg-[#FFF5F5] block transition">Toppers' Hall of Fame</a></li>
                      <li><a href="#why-gyanm" className="hover:text-[#C12223] p-2 rounded-xl hover:bg-[#FFF5F5] block transition">About GYANM EdTech</a></li>
                      <li><a href="#faq" className="hover:text-[#C12223] p-2 rounded-xl hover:bg-[#FFF5F5] block transition">Helpdesk & FAQs</a></li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </nav>

          {/* Right Clean Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Compact Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 bg-gray-50 border border-gray-200 hover:border-[#ED7026] text-gray-600 hover:text-[#C12223] rounded-xl transition shadow-2xs flex items-center gap-2 text-xs font-semibold cursor-pointer"
              title="Search Courses, Exams, Notes"
            >
              <Search className="w-4 h-4 text-[#ED7026]" />
            </button>

            {/* Student Dashboard Portal Button */}
<div className="relative">
              <button
                onClick={() => setStudentPortalOpen(!studentPortalOpen)}
                className="p-2.5 bg-gray-50 border border-gray-200 hover:border-[#ED7026] text-gray-600 hover:text-[#C12223] rounded-xl transition shadow-2xs flex items-center gap-2 text-xs font-semibold cursor-pointer"
              >
                <User2 className="w-4 h-4 text-[#ED7026]" />
              </button>

              <AnimatePresence>
                {studentPortalOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl p-5 shadow-2xl border border-red-100 z-50 text-left space-y-3"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div>
                        <h5 className="font-heading font-extrabold text-sm text-[#1F1A1C]">Student Portal</h5>
                        <p className="text-[10px] text-gray-400">Manage courses, orders & downloads</p>
                      </div>
                      <button
                        onClick={() => setStudentPortalOpen(false)}
                        className="text-gray-400 hover:text-[#1F1A1C] cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <ul className="space-y-1.5 text-xs font-semibold text-[#444444]">
                      <li>
                        <button
                          onClick={() => {
                            setStudentPortalOpen(false);
                            onOpenAuth('login');
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-[#FFF5F5] hover:text-[#C12223] flex items-center gap-2 cursor-pointer"
                        >
                          <BookMarked className="w-4 h-4 text-[#C12223]" /> My Enrolled Courses
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setStudentPortalOpen(false);
                            onOpenAuth('login');
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-[#FFF5F5] hover:text-[#C12223] flex items-center gap-2 cursor-pointer"
                        >
                          <History className="w-4 h-4 text-[#C12223]" /> Download History
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setStudentPortalOpen(false);
                            onOpenAuth('login');
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-[#FFF5F5] hover:text-[#C12223] flex items-center gap-2 cursor-pointer"
                        >
                          <Heart className="w-4 h-4 text-[#C12223]" /> Saved Notes & PYQs
                        </button>
                      </li>
                    </ul>

                    <div className="pt-2 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setStudentPortalOpen(false);
                          onOpenAuth('login');
                        }}
                        className="w-full py-2 bg-[#FFF5F5] border border-[#C12223]/20 text-[#1F1A1C] hover:text-[#C12223] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-[#C12223]" /> Student Login
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-4 py-2.5 bg-gradient-to-r from-[#EF4444] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#EF4444] text-white font-extrabold text-xs rounded-xl shadow-md shadow-[#C12223]/20 hover:shadow-lg transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Join Batch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1F1A1C] hover:text-[#C12223] rounded-xl border border-gray-200 bg-white cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-200 px-6 py-5 space-y-4 shadow-xl max-h-[80vh] overflow-y-auto"
          >
            <button
              onClick={() => {
                onOpenSearch();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl text-left text-xs text-gray-600 flex items-center gap-2 font-semibold"
            >
              <Search className="w-4 h-4 text-[#C12223]" /> Search courses, exams, study material...
            </button>

            <nav className="flex flex-col space-y-2 font-semibold text-sm text-[#1F1A1C]">
              <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-[#C12223] font-bold py-1">Home</a>
              
              <div>
                <button
                  onClick={() => setActiveMobileSub(activeMobileSub === 'courses' ? null : 'courses')}
                  className="w-full flex items-center justify-between py-2 text-left font-bold text-[#1F1A1C]"
                >
                  <span>Courses & Batches</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeMobileSub === 'courses' ? 'rotate-180 text-[#C12223]' : ''}`} />
                </button>
                {activeMobileSub === 'courses' && (
                  <div className="pl-4 py-2 space-y-2 text-xs font-medium text-[#555555] bg-[#FFF5F5] rounded-xl border border-[#C12223]/15 my-1">
                    <a href="#courses" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#C12223]">SSC CGL & CHSL 2026</a>
                    <a href="#courses" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#C12223]">IBPS & SBI PO Masterclass</a>
                    <a href="#courses" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#C12223]">Assam ADRE 3.0 Special</a>
                    <a href="#courses" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#C12223]">Railway RRB NTPC & ALP</a>
                    <a href="#courses" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#C12223]">UPSC GS & State PSC</a>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => setActiveMobileSub(activeMobileSub === 'ca' ? null : 'ca')}
                  className="w-full flex items-center justify-between py-2 text-left font-bold text-[#1F1A1C] cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    Daily Current Affairs
                    <span className="bg-[#C12223] text-white text-[9px] font-black px-1.5 py-0.5 rounded">DAILY</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeMobileSub === 'ca' ? 'rotate-180 text-[#C12223]' : ''}`} />
                </button>
                {activeMobileSub === 'ca' && (
                  <div className="pl-4 py-2 space-y-2 text-xs font-medium text-[#555555] bg-[#FFF5F5] rounded-xl border border-[#C12223]/15 my-1">
                    <button onClick={() => { setMobileMenuOpen(false); router.push('/current-affairs?tab=news'); }} className="block w-full text-left py-1 hover:text-[#C12223] cursor-pointer">Daily News & Analysis</button>
                    <button onClick={() => { setMobileMenuOpen(false); router.push('/current-affairs?tab=quiz'); }} className="block w-full text-left py-1 hover:text-[#C12223] cursor-pointer">Daily 5-MCQ Live Test</button>
                    <button onClick={() => { setMobileMenuOpen(false); router.push('/current-affairs?tab=pdf'); }} className="block w-full text-left py-1 hover:text-[#C12223] cursor-pointer">Monthly PDF CA Booklet</button>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => setActiveMobileSub(activeMobileSub === 'study' ? null : 'study')}
                  className="w-full flex items-center justify-between py-2 text-left font-bold text-[#1F1A1C]"
                >
                  <span>Study Material & Downloads</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeMobileSub === 'study' ? 'rotate-180 text-[#C12223]' : ''}`} />
                </button>
                {activeMobileSub === 'study' && (
                  <div className="pl-4 py-2 space-y-2 text-xs font-medium text-[#555555] bg-[#FFF5F5] rounded-xl border border-[#C12223]/15 my-1">
                    <button onClick={() => { setMobileMenuOpen(false); router.push('/study-material?category=PDF Notes'); }} className="block w-full text-left py-1 hover:text-[#C12223] cursor-pointer">Handwritten PDF Notes</button>
                    <button onClick={() => { setMobileMenuOpen(false); router.push('/study-material?category=PYQ Paper'); }} className="block w-full text-left py-1 hover:text-[#C12223] cursor-pointer">Previous Year Papers (PYQ)</button>
                    <button onClick={() => { setMobileMenuOpen(false); router.push('/study-material?category=Syllabus PDF'); }} className="block w-full text-left py-1 hover:text-[#C12223] cursor-pointer">Syllabus & eBooks</button>
                  </div>
                )}
              </div>

              <a href="#mock-tests" onClick={() => setMobileMenuOpen(false)} className="py-1">TCS Mock Tests</a>
              <a href="#mentors" onClick={() => setMobileMenuOpen(false)} className="py-1">Faculty & Mentors</a>
              <a href="#blog" onClick={() => setMobileMenuOpen(false)} className="py-1">Notifications & Articles</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-1">Helpdesk & FAQs</a>
            </nav>

            <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center font-bold text-sm text-[#1F1A1C] bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-[#C12223]" /> Student Login
              </button>
              <button
                onClick={() => {
                  onOpenAuth('signup');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 text-center font-bold text-sm text-white bg-gradient-to-r from-[#EF4444] to-[#B91C1C] rounded-xl shadow-md"
              >
                Join Now - Start Prep
              </button>
            </div>
          </motion.div>
        )}
      </header>
    </>
  );
};
