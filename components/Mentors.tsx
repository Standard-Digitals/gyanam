'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mentor } from '@/types';
import { 
  Star, Award, Users, Calendar, 
  ShieldCheck, GraduationCap, ChevronDown, ChevronRight, X, Sparkles, MessageSquare
} from 'lucide-react';

interface MentorsProps {
  mentors: Mentor[];
  onOpenMentorship: () => void;
}

export const Mentors: React.FC<MentorsProps> = ({ mentors, onOpenMentorship }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeMentorModal, setActiveMentorModal] = useState<Mentor | null>(null);
  const [hoveredMentorId, setHoveredMentorId] = useState<string | null>(null);

  const filterCategories = [
    { id: 'All', label: 'All Faculty' },
    { id: 'Quant', label: 'Quant & Maths' },
    { id: 'Reasoning', label: 'Reasoning & Banking' },
    { id: 'State', label: 'Assam & State Exams' },
    { id: 'UPSC', label: 'UPSC & Polity' }
  ];

  const filteredMentors = mentors.filter(m => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Quant') return m.subject.toLowerCase().includes('quant') || m.subject.toLowerCase().includes('math');
    if (selectedFilter === 'Reasoning') return m.subject.toLowerCase().includes('reasoning') || m.subject.toLowerCase().includes('banking');
    if (selectedFilter === 'State') return m.subject.toLowerCase().includes('assam') || m.subject.toLowerCase().includes('state');
    if (selectedFilter === 'UPSC') return m.subject.toLowerCase().includes('polity') || m.subject.toLowerCase().includes('upsc');
    return true;
  });

  return (
    <section id="mentors" className="py-20 bg-gradient-to-b from-[#FFF5F5] via-[#FFFAFA] to-white border-y border-[#F3DCDD] relative overflow-hidden">
      {/* Background Decorative Ambient Elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#C12223]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#EF4444]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFF0EA] border border-[#C12223]/30 text-[#C12223] text-xs font-black uppercase rounded-full tracking-wider shadow-sm mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C12223]" />
            <span>LEARN FROM INDIA'S FINEST FACULTY</span>
          </div>
          
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#1F1A1C] tracking-tight leading-tight">
            Ex-Officers & Veteran Mentors
          </h2>
          <p className="text-sm sm:text-base text-[#555555] mt-3 leading-relaxed">
            Get mentored directly by educators who have personally cracked UPSC, SSC CGL, SBI PO & State PSC exams.
          </p>

          {/* Filter Bar */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-8">
            {filterCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                  selectedFilter === cat.id
                    ? 'bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white shadow-md shadow-[#C12223]/25 scale-105'
                    : 'bg-white text-[#555555] border border-[#F3DCDD] hover:border-[#C12223] hover:text-[#C12223]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mentors Grid - Fresh Modern Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {filteredMentors.map((m) => {
            const isHovered = hoveredMentorId === m.id;

            return (
              <motion.div
                key={m.id}
                onMouseEnter={() => setHoveredMentorId(m.id)}
                onMouseLeave={() => setHoveredMentorId(null)}
                className={`bg-white rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isHovered
                    ? 'border-[#C12223] shadow-2xl shadow-[#C12223]/15 -translate-y-2'
                    : 'border-[#F3DCDD] shadow-sm hover:shadow-md'
                }`}
              >
                {/* Top Subtle Gradient Accent */}
                <div className={`h-1.5 w-full bg-gradient-to-r from-[#EF4444] to-[#B91C1C] transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                <div className="p-5">
                  {/* Portrait Image Container */}
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-[#FFF5F5] border border-[#F3DCDD] mb-4 group">
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Top Right Rating Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#1F1A1C] text-[11px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-white/40">
                      <Star className="w-3.5 h-3.5 fill-[#C12223] text-[#C12223]" />
                      <span>{m.rating.toFixed(2)}</span>
                    </div>

                    {/* Top Left Experience Badge */}
                    <div className="absolute top-3 left-3 bg-[#B91C1C]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-md flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-300" />
                      <span>{m.experienceYears}+ Yrs Exp</span>
                    </div>

                    {/* Bottom Ex-Role Pill Banner Over Portrait */}
                    {m.exRole && (
                      <div className="absolute bottom-3 inset-x-3 bg-gradient-to-r from-[#EF4444] to-[#B91C1C] backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-1.5 shadow-lg">
                        <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
                        <span className="truncate">{m.exRole}</span>
                      </div>
                    )}
                  </div>

                  {/* Clean Basic Info (Default View) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-black text-xl text-[#1F1A1C] hover:text-[#C12223] transition-colors leading-tight">
                        {m.name}
                      </h3>
                    </div>

                    <p className="text-xs font-bold text-[#C12223]">{m.title}</p>
                    
                    <div className="flex items-center gap-1 text-[11px] text-[#666666] pt-1">
                      <GraduationCap className="w-3.5 h-3.5 text-[#888888] shrink-0" />
                      <span className="truncate">{m.qualification}</span>
                    </div>
                  </div>

                  {/* Subject Tag */}
                  <div className="mt-3.5 p-2.5 bg-[#FFF5F5] rounded-xl border border-[#C12223]/15 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#C12223] block">
                        SUBJECT
                      </span>
                      <span className="text-xs font-bold text-[#1F1A1C] line-clamp-1">
                        {m.subject}
                      </span>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <span className="text-[9px] font-extrabold text-[#777777] block">SELECTIONS</span>
                      <span className="text-xs font-black text-[#C12223]">
                        {m.selectionsMentored.toLocaleString()}+
                      </span>
                    </div>
                  </div>

                  {/* Hover Dropdown Preview Area */}
                  <div className="mt-3">
                    <button
                      onClick={() => setActiveMentorModal(m)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between border cursor-pointer ${
                        isHovered
                          ? 'bg-[#FFF0EA] border-[#C12223]/40 text-[#C12223]'
                          : 'bg-gray-50 border-[#F3DCDD] text-[#555555] hover:bg-[#FFF5F5]'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#C12223]" />
                        <span>{isHovered ? 'Faculty Overview' : 'More Details'}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#C12223] transition-transform duration-300 ${
                          isHovered ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Expandable Hover Bio Container */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 space-y-2">
                            <p className="text-xs text-[#555555] italic leading-relaxed bg-[#FFF5F5] p-3 rounded-xl border border-[#F3DCDD]">
                              "{m.bio}"
                            </p>

                            <button
                              onClick={() => setActiveMentorModal(m)}
                              className="w-full text-center text-[11px] font-extrabold text-[#C12223] hover:text-[#8C1316] pt-1 flex items-center justify-center gap-1 group/btn cursor-pointer"
                            >
                              <span>View Full Teaching Experience</span>
                              <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Primary Card Action CTA */}
                <div className="p-5 pt-0 mt-2">
                  <button
                    onClick={onOpenMentorship}
                    className="w-full py-2.5 bg-gradient-to-r from-[#DC2626] to-[#8C1316] hover:from-[#8C1316] hover:to-[#DC2626] text-white text-xs font-extrabold rounded-xl shadow-md shadow-[#C12223]/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book 1-on-1 Call</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#8C1316] via-[#A6181B] to-[#B91C1C] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden border border-red-400/30">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#EF4444]/20 to-transparent pointer-events-none" />
          
          <div className="space-y-2 text-center md:text-left relative z-10 max-w-2xl">
            <span className="bg-[#EF4444] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
              PERSONALIZED GUIDANCE
            </span>
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white">
              Want Personal Mentorship From Selected Officers?
            </h3>
            <p className="text-xs sm:text-sm text-red-100">
              Get customized study plans, weekly answer writing feedback, and doubt clearing directly on Zoom or 1-on-1 calls.
            </p>
          </div>

          <button
            onClick={onOpenMentorship}
            className="shrink-0 px-6 py-3.5 bg-white text-[#8C1316] hover:bg-red-50 font-extrabold text-sm rounded-2xl shadow-xl flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer relative z-10"
          >
            <MessageSquare className="w-4 h-4 text-[#8C1316]" />
            <span>Connect With A Mentor</span>
          </button>
        </div>

      </div>

      {/* Faculty Full Profile Modal */}
      <AnimatePresence>
        {activeMentorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#8C1316]/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl overflow-hidden border border-[#F3DCDD]"
            >
              <button
                onClick={() => setActiveMentorModal(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                <img
                  src={activeMentorModal.image}
                  alt={activeMentorModal.name}
                  className="w-24 h-24 rounded-2xl object-cover object-top border-2 border-[#C12223] shrink-0 shadow-md"
                />
                <div>
                  <span className="text-[10px] font-bold bg-[#C12223]/10 text-[#C12223] px-2.5 py-0.5 rounded-md uppercase">
                    {activeMentorModal.experienceYears}+ Years Experience
                  </span>
                  <h3 className="font-heading font-black text-2xl text-[#1F1A1C] mt-1">
                    {activeMentorModal.name}
                  </h3>
                  <p className="text-xs font-bold text-[#C12223]">{activeMentorModal.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activeMentorModal.qualification}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {activeMentorModal.exRole && (
                  <div className="p-3 bg-gradient-to-r from-[#DC2626] via-[#C12223] to-[#B91C1C] text-white rounded-2xl flex items-center gap-2 text-xs font-extrabold shadow-md border border-red-400/30">
                    <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>Background: {activeMentorModal.exRole}</span>
                  </div>
                )}

                <div className="p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD]">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#C12223] mb-1">
                    Expertise & Teaching Specialization
                  </h4>
                  <p className="text-sm font-bold text-[#1F1A1C]">
                    {activeMentorModal.subject}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-1">
                    About Educator
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {activeMentorModal.bio}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-100">
                    <span className="block text-lg font-black text-[#1F1A1C]">
                      {activeMentorModal.selectionsMentored.toLocaleString()}+
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">Aspirants Mentored</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-100">
                    <span className="block text-lg font-black text-[#C12223]">
                      {activeMentorModal.rating} / 5.0
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">Student Rating</span>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setActiveMentorModal(null);
                      onOpenMentorship();
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white font-extrabold rounded-xl text-xs shadow-lg shadow-[#C12223]/20 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book 1-on-1 Mentorship</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
