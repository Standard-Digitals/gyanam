import React from 'react';
import { motion } from 'motion/react';
import { Users, Award, BookOpen, CheckSquare, PlayCircle, Trophy, Sparkles } from 'lucide-react';

export const StatsCounter: React.FC = () => {
  const stats = [
    { label: 'Total Enrolled Aspirants', value: '500,000+', icon: Users, accent: 'text-red-400' },
    { label: 'Verified Selections', value: '10,000+', icon: Trophy, accent: 'text-[#C12223]' },
    { label: 'Structured Video Lessons', value: '25,000+', icon: PlayCircle, accent: 'text-[#27AE60]' },
    { label: 'TCS Pattern Mock Tests', value: '5,000+', icon: CheckSquare, accent: 'text-amber-400' },
    { label: 'Daily Practice Quizzes', value: '15,000+', icon: Sparkles, accent: 'text-sky-400' },
    { label: 'Flagship Batches', value: '100+', icon: BookOpen, accent: 'text-red-400' },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-[#8C1316] via-[#B91C1C] to-[#C12223] text-white relative overflow-hidden">
      {/* Subtle Glow Backdrop */}
      <div className="absolute -top-32 right-1/4 w-[400px] h-[400px] bg-red-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-[400px] h-[400px] bg-amber-400/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3.5 py-1.5 bg-white/15 border border-white/25 text-amber-300 text-xs font-black uppercase rounded-full tracking-wider shadow-sm">
            Proven Results & Impact
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mt-3.5">
            Numbers That Define Gyanam’s Excellence
          </h2>
          <p className="text-sm text-red-100 font-medium mt-2">
            Empowering students from tier-1 metros to rural towns to crack government exams with confidence.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-white/60 hover:bg-white/15 transition-all shadow-xl text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition shadow-sm text-white">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
                  {item.value}
                </h3>
                <p className="text-xs text-red-100 font-medium mt-1">
                  {item.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
