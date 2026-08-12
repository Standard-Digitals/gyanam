"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { 
  Award, Shield, Users, BookOpen, Target, Sparkles, CheckCircle2, 
  MapPin, Phone, Mail, Clock, ArrowRight, Heart, Trophy, Building2, 
  GraduationCap, Star, ChevronRight, Play, MessageSquare, Compass, 
  Globe2, Lightbulb, ChevronDown, PhoneCall, FileCheck, User
} from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'vision' | 'story' | 'methodology' | 'centers'>('story');
  const [activeCenter, setActiveCenter] = useState<string>('chandigarh');

  const milestones = [
    {
      year: "2012",
      title: "The Genesis in Chandigarh",
      description: "Started with a single classroom of 15 students preparing for Bank PO exams. 12 out of 15 cleared in the first attempt.",
      stat: "80% Success Rate"
    },
    {
      year: "2016",
      title: "Expansion to SSC & Railway Prep",
      description: "Launched comprehensive TCS-pattern test series and offline centers across Punjab & Haryana, training over 5,000+ candidates annually.",
      stat: "5+ Offline Centers"
    },
    {
      year: "2020",
      title: "Digital Transformation & Live Apps",
      description: "Pivoted during the pandemic to full-stack digital learning, launching live 4K interactive classes and bilingual PDF notes.",
      stat: "100k+ App Downloads"
    },
    {
      year: "2023",
      title: "North-East & State Exam Focus (Assam ADRE)",
      description: "Established Guwahati hub with specialized study materials in English, Assamese, and Hindi for ADRE, APSC, and State Police.",
      stat: "15,000+ ADRE Selections"
    },
    {
      year: "2026",
      title: "AI-Powered Adaptive Learning Ecosystem",
      description: "Integrated real-time weakness analytics, automated speed math generators, and 1-on-1 officer mentorship portal.",
      stat: "45,000+ Total Selections"
    }
  ];

  const founders = [
    {
      name: "Dr. A. K. Sharma",
      role: "Founder & Chief Academic Officer",
      credentials: "Ex-Consultant IBPS Board | Ph.D. in Public Administration",
      experience: "22+ Years in Competitive Coaching",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      quote: "Our mission is simple: To bridge the gap between a student's hard work and the exact requirement of the exam paper.",
      achievements: ["Author of 14 Bestselling Prep Books", "Mentored 18,000+ Bank Officers"]
    },
    {
      name: "Er. Rahul Verma",
      role: "Co-Founder & Technology Director",
      credentials: "B.Tech IIT Delhi | Former EdTech Product Architect",
      experience: "14+ Years in Digital Pedagogy",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      quote: "Technology must serve clarity, not complexity. We build tools that make every 15 minutes of study count.",
      achievements: ["Architected GYANM CBT Engine", "Pioneered TCS Pattern Mock Analytics"]
    },
    {
      name: "Prof. Sunita Devi",
      role: "Head of GS & Current Affairs",
      credentials: "M.A. History & Political Science | Ex-UPSC Interview Panelist",
      experience: "18+ Years in Civil Services Prep",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      quote: "General Awareness is not about memorizing facts; it's about connecting events to structural understanding.",
      achievements: ["Created Daily News Analysis Format", "Guided 3,500+ UPSC/APSC Qualifiers"]
    }
  ];

  const coreValues = [
    {
      icon: <Target className="w-6 h-6 text-[#C12223]" />,
      title: "Laser-Focused TCS Pattern Alignment",
      description: "We don't teach irrelevant concepts. Every mock test, daily note, and lecture is strictly calibrated to the latest official exam patterns."
    },
    {
      icon: <Users className="w-6 h-6 text-[#C12223]" />,
      title: "Direct Access to Expert Faculty",
      description: "No bot responses for doubts. Students get direct access to subject gurus through 1-on-1 video mentorship and Telegram doubt counters."
    },
    {
      icon: <Globe2 className="w-6 h-6 text-[#C12223]" />,
      title: "Bilingual & Regional Language Support",
      description: "Study materials available in Hindi, English, and Assamese to ensure candidates in every tier-2 and tier-3 city study without language barriers."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#C12223]" />,
      title: "Unmatched Affordability",
      description: "Top-tier physical  quality at a fraction of offline coaching fees, backed by free daily current affairs and open mock series."
    }
  ];

  const offlineCenters = [
    {
      id: "chandigarh",
      city: "Chandigarh (Headquarters)",
      address: "SCO 13-14-15, Sector 34-A, Near Sub City Centre, Chandigarh - 160022",
      phone: "+91 9117 34 34 34",
      timing: "7:00 AM - 8:00 PM (Mon-Sat)",
      facilities: ["100+ Computer CBT Lab", "24/7 Air-Conditioned Reading Hall", "Doubt Solvers Desk", "Bookstore & Press"]
    },
    {
      id: "guwahati",
      city: "Guwahati (North-East Hub)",
      address: "GS Road, Near Christian Basti Flyover, Opposite ABC Bus Stop, Guwahati, Assam - 781005",
      phone: "+91 9117 35 35 35",
      timing: "8:00 AM - 7:00 PM (Mon-Sat)",
      facilities: ["Assam ADRE Special Wing", "Assamese Language Material Desk", "Library & Speed Math Lab"]
    },
    {
      id: "delhi",
      city: "New Delhi Center",
      address: "2nd Floor, Kingsway Camp, Near GTB Nagar Metro Station Gate No. 1, New Delhi - 110009",
      phone: "+91 9117 36 36 36",
      timing: "7:30 AM - 8:30 PM (Daily)",
      facilities: ["SSC CGL Special Speed Test Wing", "UPSC GS Discussion Rooms", "Live Seminar Hall"]
    },
    {
      id: "patiala",
      city: "Patiala Center",
      address: "Leela Bhawan Chowk, Above State Bank of India, Patiala, Punjab - 147001",
      phone: "+91 9117 37 37 37",
      timing: "8:00 AM - 7:00 PM (Mon-Sat)",
      facilities: ["Punjab State Govt Exam Cell", "Physical Library", "Weekly Test Center"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#1F1A1C] pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#8C1316] via-[#A6181B] to-[#6E0E10] text-white pt-12 pb-20 overflow-hidden border-b border-red-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#EF4444_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#EF4444]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-red-200 mb-6">
            <button onClick={() => router.push('/')} className="hover:text-white transition cursor-pointer">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-red-300" />
            <span className="text-white font-bold">About Us</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/30 text-amber-200 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider backdrop-blur-sm">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>14+ Years of Educational Excellence</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight">
                Democratizing Government Job Exam Preparation <span className="text-amber-300">Across India.</span>
              </h1>

              <p className="text-red-100/90 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                GYANM  is India's premier government job training institution. Built on a foundation of exam-pattern precision, world-class faculty, and relentless student support, we have guided over <strong>45,000+ candidates</strong> into coveted positions in Banking, SSC, Railways, Defense, UPSC, and State Services.
              </p>

              {/* High Impact Key Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
                  <div className="font-heading font-black text-2xl sm:text-3xl text-amber-300">45k+</div>
                  <div className="text-[11px] font-bold text-red-100 uppercase tracking-wider mt-0.5">Selections</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
                  <div className="font-heading font-black text-2xl sm:text-3xl text-white">15+</div>
                  <div className="text-[11px] font-bold text-red-100 uppercase tracking-wider mt-0.5">Physical Hubs</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
                  <div className="font-heading font-black text-2xl sm:text-3xl text-amber-300">50+</div>
                  <div className="text-[11px] font-bold text-red-100 uppercase tracking-wider mt-0.5">Expert Mentors</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
                  <div className="font-heading font-black text-2xl sm:text-3xl text-white">4.9/5</div>
                  <div className="text-[11px] font-bold text-red-100 uppercase tracking-wider mt-0.5">Student Rating</div>
                </div>
              </div>

              {/* CTA Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => router.push('/courses')}
                  className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-sm rounded-xl shadow-xl shadow-amber-400/20 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Join Next Batch</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.push('/#mentors')}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition flex items-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-amber-300" />
                  <span>Request Center Tour</span>
                </button>
              </div>

            </div>

            {/* Right Hero Feature Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 group">
                <img 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800" 
                  alt="GYANM Live Classroom & " 
                  className="w-full h-[380px] object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <span className="bg-[#EF4444] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    CHANDIGARH MAIN HALL
                  </span>
                  <h3 className="font-heading font-extrabold text-lg text-white">
                    Where Aspirations Turn Into Government Appointments
                  </h3>
                  <p className="text-xs text-red-100/80">
                    State-of-the-art CBT computer labs, daily physical library access, and 1-on-1 officer doubt counters.
                  </p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white text-[#1F1A1C] p-4 rounded-2xl shadow-2xl border border-red-100 flex items-center gap-3.5 hidden sm:flex max-w-xs">
                <div className="w-12 h-12 rounded-xl bg-[#FFF5F5] border border-[#C12223]/20 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-[#C12223]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#1F1A1C]">Official Exam Partner</h4>
                  <p className="text-[11px] text-gray-500 font-medium">TCS Pattern Mock Series & Real Exam Interface</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 2. CORE PHILOSOPHY & VALUES */}
      <section className="py-16 max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-[#C12223] font-black text-xs uppercase tracking-widest bg-[#FFF5F5] px-3 py-1 rounded-full border border-[#C12223]/20">
            OUR FOUNDATION
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#1F1A1C]">
            Why Aspirants Trust GYANM 
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm font-medium">
            We don't just teach subjects; we instill exam strategy, time management, and psychological readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm hover:shadow-xl transition duration-300 space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF5F5] border border-[#C12223]/15 flex items-center justify-center group-hover:scale-110 transition duration-300">
                  {val.icon}
                </div>
                <h3 className="font-heading font-extrabold text-base text-[#1F1A1C] group-hover:text-[#C12223] transition">
                  {val.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {val.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center text-[11px] font-extrabold text-[#C12223]">
                <span>Guaranteed Standard</span>
                <CheckCircle2 className="w-3.5 h-3.5 ml-1.5 text-[#27AE60]" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE TAB SECTION: JOURNEY & METHODOLOGY */}
      <section className="py-12 bg-white border-y border-red-100">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[#C12223] font-black text-xs uppercase tracking-widest">
                OUR JOURNEY & METHODOLOGY
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#1F1A1C] mt-1">
                Built by Educators, Driven by Student Results
              </h2>
            </div>

            {/* Tab Switches */}
            <div className="flex items-center gap-2 bg-[#FFF5F5] p-1.5 rounded-2xl border border-[#C12223]/15 self-start md:self-auto">
              <button
                onClick={() => setActiveTab('story')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'story'
                    ? 'bg-[#C12223] text-white shadow-md'
                    : 'text-gray-600 hover:text-[#C12223]'
                }`}
              >
                14-Year Milestones
              </button>
              <button
                onClick={() => setActiveTab('methodology')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'methodology'
                    ? 'bg-[#C12223] text-white shadow-md'
                    : 'text-gray-600 hover:text-[#C12223]'
                }`}
              >
                4-Step Pedagogy
              </button>
            </div>
          </div>

          {/* Tab 1: Timeline Milestones */}
          {activeTab === 'story' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative pl-6 md:pl-0 border-l-2 md:border-l-0 border-[#C12223]/20 md:grid md:grid-cols-5 md:gap-6 space-y-8 md:space-y-0"
            >
              {milestones.map((m, idx) => (
                <div key={idx} className="relative group">
                  {/* Dot */}
                  <div className="absolute -left-[31px] top-1 md:static md:mb-3 w-4 h-4 rounded-full bg-[#C12223] border-4 border-white shadow-md group-hover:scale-125 transition" />
                  
                  <div className="bg-[#FFF5F5] p-5 rounded-2xl border border-red-100 space-y-2.5 hover:border-[#C12223] transition shadow-2xs">
                    <span className="px-2.5 py-0.5 bg-[#C12223] text-white text-[10px] font-black rounded-md inline-block">
                      {m.year}
                    </span>
                    <h4 className="font-heading font-extrabold text-sm text-[#1F1A1C]">
                      {m.title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      {m.description}
                    </p>
                    <div className="pt-2 border-t border-red-200/50 text-[11px] font-bold text-[#C12223]">
                      ★ {m.stat}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Tab 2: Pedagogy */}
          {activeTab === 'methodology' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <div className="bg-[#FFF5F5] p-6 rounded-2xl border border-red-100 space-y-3 relative overflow-hidden">
                <span className="text-4xl font-black text-red-200 absolute top-4 right-4">01</span>
                <div className="w-10 h-10 rounded-xl bg-white text-[#C12223] flex items-center justify-center font-bold shadow-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-extrabold text-base text-[#1F1A1C]">1. Concept Mastery</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Zero-to-hero coverage of core fundamentals in Quantitative Aptitude, Reasoning, English, and General Awareness.
                </p>
              </div>

              <div className="bg-[#FFF5F5] p-6 rounded-2xl border border-red-100 space-y-3 relative overflow-hidden">
                <span className="text-4xl font-black text-red-200 absolute top-4 right-4">02</span>
                <div className="w-10 h-10 rounded-xl bg-white text-[#C12223] flex items-center justify-center font-bold shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-extrabold text-base text-[#1F1A1C]">2. Speed Math & Tricks</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Vedic math shortcuts, option elimination strategies, and time-bound calculation drills.
                </p>
              </div>

              <div className="bg-[#FFF5F5] p-6 rounded-2xl border border-red-100 space-y-3 relative overflow-hidden">
                <span className="text-4xl font-black text-red-200 absolute top-4 right-4">03</span>
                <div className="w-10 h-10 rounded-xl bg-white text-[#C12223] flex items-center justify-center font-bold shadow-sm">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-extrabold text-base text-[#1F1A1C]">3. TCS Pattern Mocks</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Real exam simulation tests with sectional cut-off analysis, percentile ranking, and weak-area heatmaps.
                </p>
              </div>

              <div className="bg-[#FFF5F5] p-6 rounded-2xl border border-red-100 space-y-3 relative overflow-hidden">
                <span className="text-4xl font-black text-red-200 absolute top-4 right-4">04</span>
                <div className="w-10 h-10 rounded-xl bg-white text-[#C12223] flex items-center justify-center font-bold shadow-sm">
                  <User className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-extrabold text-base text-[#1F1A1C]">4. Mentorship & Interview</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Mock interview panels with retired bank GMs, IAS officers, and personality development workshops.
                </p>
              </div>
            </motion.div>
          )}

        </div>
      </section>

      {/* 4. FOUNDERS & ACADEMIC LEADERSHIP */}
      <section className="py-16 max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-[#C12223] font-black text-xs uppercase tracking-widest bg-[#FFF5F5] px-3 py-1 rounded-full border border-[#C12223]/20">
            MEET THE VISIONARIES
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#1F1A1C]">
            Academic Leadership & Guidance
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm font-medium">
            Guided by former exam board panel members, senior professors, and tech pioneers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {founders.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white rounded-3xl border border-red-100 shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img 
                    src={f.image} 
                    alt={f.name} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <span className="px-2 py-0.5 bg-amber-400 text-red-950 font-black text-[10px] uppercase rounded">
                      {f.experience}
                    </span>
                    <h3 className="font-heading font-black text-xl text-white mt-1">
                      {f.name}
                    </h3>
                    <p className="text-xs text-amber-200 font-medium">
                      {f.role}
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs text-gray-500 font-semibold border-b border-gray-100 pb-3">
                    🎓 {f.credentials}
                  </p>

                  <blockquote className="text-xs italic text-gray-700 leading-relaxed bg-[#FFF5F5] p-3 rounded-xl border-l-2 border-[#C12223]">
                    "{f.quote}"
                  </blockquote>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-extrabold text-[#1F1A1C] uppercase tracking-wider">Key Milestones:</div>
                    <ul className="space-y-1 text-xs text-gray-600">
                      {f.achievements.map((ach, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#27AE60] shrink-0" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => router.push('/#mentors')}
                  className="w-full py-2.5 bg-gray-50 hover:bg-[#FFF5F5] text-[#C12223] font-extrabold text-xs rounded-xl border border-gray-200 hover:border-[#C12223]/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Book Mentorship Session</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. PHYSICAL CENTERS & DIGITAL PRESENCE */}
      <section className="py-16 bg-white border-t border-red-100">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-[#C12223] font-black text-xs uppercase tracking-widest bg-[#FFF5F5] px-3 py-1 rounded-full border border-[#C12223]/20">
              PHYSICAL & DIGITAL HUB
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#1F1A1C]">
              Visit Our Offline Prep Academies
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm font-medium">
              Equipped with high-speed CBT computer labs, air-conditioned reading halls, and physical doubt desks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Center Selector List */}
            <div className="lg:col-span-5 space-y-3">
              {offlineCenters.map((center) => (
                <button
                  key={center.id}
                  onClick={() => setActiveCenter(center.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition duration-200 cursor-pointer flex items-center justify-between ${
                    activeCenter === center.id
                      ? 'bg-[#8C1316] text-white border-[#8C1316] shadow-lg scale-[1.02]'
                      : 'bg-[#FFF5F5] text-[#1F1A1C] border-red-100 hover:border-[#C12223]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      activeCenter === center.id ? 'bg-white/20 text-white' : 'bg-white text-[#C12223] border border-red-200'
                    }`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-heading font-extrabold text-sm">{center.city}</h4>
                      <p className={`text-[11px] ${activeCenter === center.id ? 'text-red-100' : 'text-gray-500'}`}>
                        {center.timing}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${activeCenter === center.id ? 'text-amber-300' : 'text-gray-400'}`} />
                </button>
              ))}
            </div>

            {/* Active Center Card Detail */}
            <div className="lg:col-span-7 bg-[#FFF5F5] p-6 sm:p-8 rounded-3xl border border-red-200 shadow-xl space-y-6">
              {(() => {
                const current = offlineCenters.find(c => c.id === activeCenter) || offlineCenters[0];
                return (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-red-200/60 pb-4">
                      <div>
                        <span className="px-2.5 py-1 bg-[#C12223] text-white text-[10px] font-black uppercase rounded">
                          OFFLINE  HUB
                        </span>
                        <h3 className="font-heading font-black text-2xl text-[#1F1A1C] mt-1">
                          {current.city}
                        </h3>
                      </div>
                      <a 
                        href={`tel:${current.phone.replace(/\s+/g, '')}`}
                        className="px-4 py-2 bg-white border border-[#C12223]/30 text-[#C12223] font-bold text-xs rounded-xl hover:bg-[#C12223] hover:text-white transition flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{current.phone}</span>
                      </a>
                    </div>

                    <div className="space-y-4 text-xs text-gray-700 font-medium">
                      <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-red-100">
                        <MapPin className="w-5 h-5 text-[#C12223] shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[#1F1A1C] text-xs">Complete Postal Address:</strong>
                          <span>{current.address}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-red-100">
                        <Clock className="w-5 h-5 text-[#C12223] shrink-0" />
                        <div>
                          <strong className="block text-[#1F1A1C] text-xs">Working Hours:</strong>
                          <span>{current.timing}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-heading font-extrabold text-xs text-[#1F1A1C] uppercase tracking-wider">
                        Available On-Site Facilities:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {current.facilities.map((fac, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl text-xs font-semibold text-[#1F1A1C] border border-gray-100">
                            <CheckCircle2 className="w-4 h-4 text-[#27AE60]" />
                            <span>{fac}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-3">
                      <button
                        onClick={() => router.push('/#mentors')}
                        className="px-5 py-3 bg-[#C12223] hover:bg-[#A6181B] text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                      >
                        <span>Book Offline Demo Class</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>

          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="mt-16 max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#8C1316] via-[#A6181B] to-[#7F1315] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl relative z-10 text-center md:text-left">
            <span className="bg-amber-400 text-red-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              START PREPARATION TODAY
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
              Ready to Clear Your Target Government Exam in 2026?
            </h2>
            <p className="text-red-100 text-xs sm:text-sm font-medium">
              Join thousands of successful officers who transformed their careers with GYANM 's structured mentorship and TCS mock test series.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
            <button
              onClick={() => router.push('/courses')}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-xs rounded-xl shadow-xl transition cursor-pointer"
            >
              Explore All Batches →
            </button>
            <button
              onClick={() => router.push('/#mentors')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition cursor-pointer"
            >
              Talk to Counselor
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
