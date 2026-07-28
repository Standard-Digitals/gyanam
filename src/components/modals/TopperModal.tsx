import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, ShieldCheck, MapPin, Hash, CheckCircle2, Play, Quote, Sparkles, GraduationCap, Calendar, Share2 } from 'lucide-react';
import { SuccessStory } from '../../types';

interface TopperModalProps {
  story: SuccessStory | null;
  onClose: () => void;
  onWatchVideo?: (story: SuccessStory) => void;
}

export const TopperModal: React.FC<TopperModalProps> = ({ story, onClose, onWatchVideo }) => {
  if (!story) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Dark Tinted Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Card Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#F3DCDD] overflow-hidden z-10 text-[#1F1A1C] my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-[#C12223] text-white rounded-full transition z-30 cursor-pointer shadow-lg"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Banner - High Visual Impact */}
          <div className="relative h-64 sm:h-72 bg-gradient-to-br from-[#8C1316] via-[#A81B1E] to-[#B91C1C] overflow-hidden">
            <img
              src={story.photoUrl}
              alt={story.studentName}
              className="w-full h-full object-cover object-top opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

            {/* Badges on Banner */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-20">
              <span className="px-3 py-1 bg-[#C12223] text-white font-black text-xs rounded-full shadow-lg border border-white/30 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-300" />
                <span>{story.rank}</span>
              </span>
              <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-amber-300 font-extrabold text-xs rounded-lg border border-white/20">
                {story.examCleared}
              </span>
            </div>

            {/* Bottom Topper Identity Info */}
            <div className="absolute bottom-4 left-6 right-6 text-white z-20 space-y-1">
              <span className="px-2.5 py-0.5 bg-emerald-500/90 text-white font-extrabold text-[10px] rounded-md inline-flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Selection</span>
              </span>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight drop-shadow-md">
                {story.studentName}
              </h3>
              <p className="text-sm text-amber-300 font-bold drop-shadow-sm">
                {story.badge}
              </p>
            </div>
          </div>

          {/* Body Information */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] text-center">
                <span className="text-[10px] text-[#666666] font-bold uppercase block flex items-center justify-center gap-1">
                  <Hash className="w-3 h-3 text-[#C12223]" /> Roll No
                </span>
                <span className="font-heading font-black text-xs sm:text-sm text-[#1F1A1C] mt-0.5 block truncate">
                  {story.rollNumber || '10293841'}
                </span>
              </div>

              <div className="p-3 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] text-center">
                <span className="text-[10px] text-[#666666] font-bold uppercase block flex items-center justify-center gap-1">
                  <GraduationCap className="w-3 h-3 text-[#C12223]" /> Score / Marks
                </span>
                <span className="font-heading font-black text-xs sm:text-sm text-[#27AE60] mt-0.5 block truncate">
                  {story.score || 'Top Tier Marks'}
                </span>
              </div>

              <div className="p-3 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] text-center">
                <span className="text-[10px] text-[#666666] font-bold uppercase block flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C12223]" /> Hometown
                </span>
                <span className="font-heading font-black text-xs sm:text-sm text-[#1F1A1C] mt-0.5 block truncate">
                  {story.hometown}
                </span>
              </div>

              <div className="p-3 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] text-center">
                <span className="text-[10px] text-[#666666] font-bold uppercase block flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3 text-[#C12223]" /> Batch Year
                </span>
                <span className="font-heading font-black text-xs sm:text-sm text-[#1F1A1C] mt-0.5 block truncate">
                  {story.year} Batch
                </span>
              </div>
            </div>

            {/* Preparation Background / Strategy */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-[#C12223] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Preparation Journey & Strategy</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#555555] font-semibold bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                {story.previousAttempts}
              </p>
            </div>

            {/* Testimonial Quote */}
            <div className="p-4 sm:p-5 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] relative">
              <Quote className="w-8 h-8 text-[#C12223]/20 absolute top-3 left-3" />
              <p className="text-xs sm:text-sm text-[#1F1A1C] font-medium leading-relaxed italic relative z-10 pl-5">
                "{story.testimonial}"
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-[#27AE60] font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Gyanam Classroom / Online Candidate</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#1F1A1C] font-extrabold text-xs rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
