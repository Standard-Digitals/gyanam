'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Award, Youtube, ThumbsUp, ShieldCheck, ExternalLink } from 'lucide-react';
import { SuccessStory } from '../../types';

interface VideoModalProps {
  story: SuccessStory | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ story, onClose }) => {
  const [useIframePlayer, setUseIframePlayer] = useState<boolean>(true);
  const [likesCount, setLikesCount] = useState<number>(4820);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  if (!story) return null;

  const handleLike = () => {
    if (!hasLiked) {
      setLikesCount(prev => prev + 1);
      setHasLiked(true);
    } else {
      setLikesCount(prev => prev - 1);
      setHasLiked(false);
    }
  };

  const embedUrl = story.youtubeUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Dark Red Tinted Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#F3DCDD] overflow-hidden z-10 text-[#1F1A1C] my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 bg-black/70 hover:bg-[#C12223] text-white rounded-full transition z-40 cursor-pointer shadow-lg border border-white/20"
            title="Close Video Preview"
          >
            <X className="w-5 h-5" />
          </button>

          {/* YouTube Style Video Player Section */}
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
            {useIframePlayer ? (
              <iframe
                src={`${embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                title={`${story.studentName} Gyanam Topper Strategy Interview`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full bg-gradient-to-br from-[#8C1316] via-[#A81B1E] to-[#B91C1C] flex items-center justify-center">
                <img
                  src={story.photoUrl}
                  alt={story.studentName}
                  className="absolute inset-0 w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

                {/* Overlay Badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#C12223] text-white text-[10px] font-black uppercase rounded-lg flex items-center gap-1.5 shadow-lg tracking-wider">
                    <Youtube className="w-4 h-4 fill-white" />
                    <span>Gyanam RECORDED LECTURE</span>
                  </span>
                  {story.videoDuration && (
                    <span className="px-2.5 py-1 bg-black/50 backdrop-blur-md text-amber-300 border border-white/20 text-[10px] font-extrabold rounded-lg">
                      {story.videoDuration}
                    </span>
                  )}
                </div>

                {/* Center Play Button to launch iframe */}
                <button
                  onClick={() => setUseIframePlayer(true)}
                  className="relative z-20 w-16 h-16 sm:w-20 sm:h-20 bg-[#FF0000] hover:bg-[#C12223] text-white rounded-full flex items-center justify-center shadow-2xl transition transform hover:scale-110 cursor-pointer border-2 border-white/40"
                >
                  <Play className="w-9 h-9 fill-white translate-x-0.5" />
                </button>
              </div>
            )}
          </div>

          {/* Details & Testimonial Section */}
          <div className="p-5 sm:p-6 space-y-4 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-[#C12223] text-white font-black text-xs rounded-full inline-flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>{story.badge}</span>
                  </span>
                  <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#27AE60]" /> Official Faculty Video
                  </span>
                </div>
                <h3 className="font-heading font-black text-xl text-[#1F1A1C]">
                  {story.studentName} — {story.examCleared}
                </h3>
                <p className="text-xs text-[#555555]">
                  Subject / Topic: <strong className="text-[#1F1A1C]">{story.badge}</strong> | Campus: <strong className="text-[#1F1A1C]">{story.hometown}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleLike}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                    hasLiked
                      ? 'bg-[#C12223] text-white border-[#C12223]'
                      : 'bg-gray-50 text-[#555555] border-gray-200 hover:border-[#C12223]'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{likesCount} Likes</span>
                </button>

                <button
                  onClick={() => window.open(embedUrl, '_blank')}
                  className="px-3 py-1.5 bg-gray-50 text-[#555555] border border-gray-200 hover:border-[#C12223] rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="Open in YouTube"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>YouTube</span>
                </button>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="bg-[#FFF5F5] p-4 rounded-2xl border border-[#F3DCDD]">
              <p className="text-xs sm:text-sm text-[#1F1A1C] font-medium leading-relaxed italic">
                "{story.testimonial}"
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

