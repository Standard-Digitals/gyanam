import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Award, CheckCircle } from 'lucide-react';
import { SuccessStory } from '../../types';

interface VideoModalProps {
  story: SuccessStory | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ story, onClose }) => {
  if (!story) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="relative w-full max-w-2xl bg-black rounded-3xl shadow-2xl border border-white/10 overflow-hidden z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 text-white hover:bg-white hover:text-black rounded-full transition z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Video Placeholder Box */}
          <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            <img
              src={story.photoUrl}
              alt={story.studentName}
              className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm"
            />
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 space-y-4 max-w-md">
              <div className="w-16 h-16 bg-[#ED7026] text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-[#ED7026]/50 animate-pulse">
                <Play className="w-8 h-8 fill-white translate-x-0.5" />
              </div>
              <div>
                <span className="px-3 py-1 bg-[#C12223] text-white font-extrabold text-xs rounded-full inline-block mb-1">
                  {story.rank} • {story.examCleared}
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-white">
                  {story.studentName}'s Journey to Rank 1
                </h3>
                <p className="text-white/80 text-xs italic mt-2">
                  "{story.testimonial}"
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#ED7026]" />
              <span>{story.badge} ({story.hometown})</span>
            </div>
            <div className="flex items-center gap-1 text-[#27AE60] font-bold">
              <CheckCircle className="w-4 h-4" /> Verified Selection
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
