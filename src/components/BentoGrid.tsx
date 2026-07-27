import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, FileText, PlayCircle, BarChart3, UserCheck, MessageSquare, Download, Layers, Shield, ArrowRight } from 'lucide-react';

interface BentoGridProps {
  onOpenMentorship: () => void;
  onExploreMockTests: () => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ onOpenMentorship, onExploreMockTests }) => {
  return (
    <section id="features" className="py-20 bg-[#FFF5F5]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 bg-[#C12223]/10 text-[#C12223] text-xs font-extrabold uppercase rounded-full tracking-wider">
            Why GYANAM Leads EdTech in India
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#1F1A1C] mt-3 tracking-tight">
            Designed Like a Tech Product, <br className="hidden sm:inline" />
            <span className="gradient-text">Built For Exam Success</span>
          </h2>
          <p className="text-sm sm:text-base text-[#555555] mt-3 font-normal">
            Everything you need to qualify SSC, Banking, Railways, UPSC and State Exams in a single unified platform.
          </p>
        </div>

        {/* 7-Card Linear / Apple Style Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">

          {/* Bento Card 1: Large Feature - Daily Current Affairs (Span 8) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-8 p-8 bg-white rounded-3xl border border-[#F3DCDD] shadow-xl hover:shadow-2xl relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C12223]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C12223]/10 text-[#C12223] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-xs font-extrabold uppercase text-[#C12223] tracking-wider block">
                Daily Current Affairs Engine
              </span>
              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1F1A1C]">
                Hindu, PIB & Express Editorials Distilled into 5-Minute Summaries
              </h3>
              <p className="text-sm text-[#555555] max-w-xl">
                No need to read 3 newspapers every morning. Our editorial team distills national news into bullet points, daily quizzes, and downloadable monthly PDF magazines in both English & Assamese.
              </p>
            </div>

            {/* Interactive Preview Snippet */}
            <div className="mt-6 p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#27AE60] animate-ping" />
                <span className="text-xs font-bold text-[#1F1A1C]">Today's Digest Ready (25 July 2026)</span>
              </div>
              <a href="#current-affairs" className="text-xs font-bold text-[#C12223] hover:underline flex items-center gap-1">
                Read Editorial & Take Quiz <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>

          {/* Bento Card 2: Performance Analytics Radar (Span 4) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-4 p-8 bg-gradient-to-br from-[#2D0A0B] to-[#3B0A0C] text-white rounded-3xl border border-red-950/40 shadow-xl relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#DC2626] flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-xs font-extrabold uppercase text-amber-400 tracking-wider block">
                AI Performance Analytics
              </span>
              <h3 className="font-heading font-extrabold text-xl text-white">
                Pinpoint Weak Areas Before the Exam
              </h3>
              <p className="text-xs text-red-200/80">
                Track speed vs accuracy matrix, time spent per question, and compare your score against AIR toppers.
              </p>
            </div>

            <div className="mt-6 p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] text-red-200/80 block">Predicted Speed Boost</span>
              <span className="font-heading font-black text-2xl text-amber-400">+38% Faster Solving</span>
            </div>
          </motion.div>

          {/* Bento Card 3: TCS Pattern Mock Test (Span 4) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-4 p-7 bg-white rounded-3xl border border-[#F3DCDD] shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C12223]/10 text-[#C12223] flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-extrabold text-xl text-[#1F1A1C]">
                100% Exact TCS Exam Interface
              </h4>
              <p className="text-xs text-[#555555]">
                Practice on the actual UI used by SSC and Railways. Zero exam-day anxiety guaranteed.
              </p>
            </div>
            <button
              onClick={onExploreMockTests}
              className="mt-6 text-xs font-bold text-[#C12223] flex items-center gap-1 hover:underline cursor-pointer"
            >
              Try Free Live Mock Test <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Bento Card 4: HD Live & Recorded Classes (Span 4) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-4 p-7 bg-white rounded-3xl border border-[#F3DCDD] shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C12223]/10 text-[#C12223] flex items-center justify-center">
                <PlayCircle className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-extrabold text-xl text-[#1F1A1C]">
                4K Live & Unlimited Recorded Backup
              </h4>
              <p className="text-xs text-[#555555]">
                Watch classes on mobile or laptop. Change playback speed (0.5x to 2x) & download videos offline.
              </p>
            </div>
            <span className="mt-6 text-[11px] font-bold text-[#27AE60]">
              ✓ Dual Language Audio (Hindi & English)
            </span>
          </motion.div>

          {/* Bento Card 5: Smart PDF Notes & Mind Maps (Span 4) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-4 p-7 bg-white rounded-3xl border border-[#F3DCDD] shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#27AE60]/10 text-[#27AE60] flex items-center justify-center">
                <Download className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-extrabold text-xl text-[#1F1A1C]">
                One-Click Downloadable PDF Notes
              </h4>
              <p className="text-xs text-[#555555]">
                Color-coded class notes, formula cheat sheets, and mind maps ready for home printing.
              </p>
            </div>
            <a href="#free-resources" className="mt-6 text-xs font-bold text-[#C12223] flex items-center gap-1 hover:underline">
              Download Free PDFs <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          {/* Bento Card 6: 1-on-1 Mentorship & Doubt Solving (Span 12) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-12 p-8 bg-gradient-to-r from-[#FFF5F5] via-white to-[#FFF5F5] rounded-3xl border border-[#C12223]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#DC2626] to-[#8C1316] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#C12223]/30">
                <UserCheck className="w-8 h-8" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 bg-[#C12223]/10 text-[#C12223] text-[10px] font-extrabold uppercase rounded-full">
                  1-on-1 Personal Mentorship
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-[#1F1A1C] mt-1">
                  Never Study Alone. Get Assigned a Dedicated Mentor.
                </h3>
                <p className="text-xs sm:text-sm text-[#555555] max-w-xl mt-1">
                  Connect with selected officers for weekly progress reviews, strategy tweaks, and 24/7 WhatsApp doubt clearing.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenMentorship}
              className="px-6 py-3.5 bg-gradient-to-r from-[#DC2626] to-[#8C1316] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-[#C12223]/25 hover:scale-105 transition shrink-0 cursor-pointer"
            >
              Book Free Mentorship Session
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
