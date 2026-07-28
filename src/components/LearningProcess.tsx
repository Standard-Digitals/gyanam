import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Video, FileCheck, LineChart, Users, Trophy, ArrowRight } from 'lucide-react';

export const LearningProcess: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Choose Target Exam Batch',
      desc: 'Select from SSC, Banking, Railways, ADRE or State PSC batches structured specifically for your target post.',
      icon: BookOpen
    },
    {
      num: '02',
      title: 'Structured Live & 4K Backup',
      desc: 'Attend daily interactive live classes by top subject wizards with instant voice & chat doubt clearing.',
      icon: Video
    },
    {
      num: '03',
      title: 'Daily Practice & PDF Notes',
      desc: 'Solve Daily Practice Problem (DPP) sets with detailed video solutions and downloadable class PDF notes.',
      icon: FileCheck
    },
    {
      num: '04',
      title: 'TCS Pattern Mock Tests',
      desc: 'Take unlimited full-length mock tests designed exactly on official TCS software with instant AIR rank.',
      icon: LineChart
    },
    {
      num: '05',
      title: '1-on-1 Mentor Guidance',
      desc: 'Get personal weekly counseling calls with selected officers to fix weak areas & manage exam anxiety.',
      icon: Users
    },
    {
      num: '06',
      title: 'Crack Dream Govt Job!',
      desc: 'Join over 10,000+ Gyanam alumni working across Central & State Ministries, Banks, and Railways.',
      icon: Trophy
    }
  ];

  return (
    <section className="py-20 bg-white border-y border-[#F3DCDD]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 bg-[#27AE60]/10 text-[#27AE60] text-xs font-extrabold uppercase rounded-full tracking-wider">
            6-Step Proven System
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#1F1A1C] mt-3 tracking-tight">
            How Gyanam Guides You to Selection
          </h2>
          <p className="text-sm sm:text-base text-[#555555] mt-3">
            A scientifically designed learning framework refined over 15+ years.
          </p>
        </div>

        {/* 6-Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((s, idx) => {
            const IconComp = s.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="p-8 bg-[#FFF5F5] rounded-3xl border border-[#F3DCDD] hover:border-[#C12223] hover:shadow-xl transition relative group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#F3DCDD] text-[#DC2626] flex items-center justify-center font-bold shadow-sm group-hover:bg-[#C12223] group-hover:text-white transition">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="font-heading font-black text-3xl text-[#C12223]/20 group-hover:text-[#C12223] transition">
                    {s.num}
                  </span>
                </div>

                <h3 className="font-heading font-extrabold text-xl text-[#1F1A1C] mb-2">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
