import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SUCCESS_STORIES } from '../data/mockData';
import { SuccessStory } from '../types';
import { Play, Award, CheckCircle2, Quote, Star, ArrowRight } from 'lucide-react';

interface SuccessStoriesProps {
  onPlayVideo: (story: SuccessStory) => void;
}

export const SuccessStories: React.FC<SuccessStoriesProps> = ({ onPlayVideo }) => {
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'SSC', 'Banking', 'Assam Govt', 'UPSC'];

  const filteredStories = filter === 'All'
    ? SUCCESS_STORIES
    : SUCCESS_STORIES.filter(s => s.category === filter);

  return (
    <section id="success-stories" className="py-20 bg-[#FFF8F6]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="px-3.5 py-1 bg-[#27AE60]/10 text-[#27AE60] text-xs font-extrabold uppercase rounded-full tracking-wider">
              Gyanam Hall of Fame
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#111111] mt-3 tracking-tight">
              10,000+ Dreams Turned Into Reality
            </h2>
            <p className="text-sm text-[#555555] mt-2 max-w-xl">
              Meet our top rankers who cracked SSC, Banking, Assam ADRE & Civil Services.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 border ${
                  filter === cat
                    ? 'bg-[#C12223] text-white border-[#C12223]'
                    : 'bg-white text-[#555555] border-[#ECECEC] hover:border-[#ED7026]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredStories.map(story => (
            <motion.div
              key={story.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-[#ECECEC] shadow-xl hover:shadow-2xl overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Rank Badge */}
                <div className="relative h-64 overflow-hidden bg-slate-900">
                  <img
                    src={story.photoUrl}
                    alt={story.studentName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Play Video Button if video exists */}
                  {story.hasVideo && (
                    <button
                      onClick={() => onPlayVideo(story)}
                      className="absolute inset-0 m-auto w-14 h-14 bg-[#ED7026]/90 hover:bg-[#ED7026] text-white rounded-full flex items-center justify-center shadow-2xl transition hover:scale-110"
                      title="Watch Interview Video"
                    >
                      <Play className="w-6 h-6 fill-white translate-x-0.5" />
                    </button>
                  )}

                  {/* Rank Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#C12223] text-white font-extrabold text-xs rounded-full shadow-md">
                      {story.rank}
                    </span>
                  </div>

                  {/* Exam cleared */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h4 className="font-heading font-extrabold text-lg leading-tight">
                      {story.studentName}
                    </h4>
                    <span className="text-xs text-amber-300 font-bold block mt-0.5">
                      {story.badge}
                    </span>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="p-6 space-y-3">
                  <Quote className="w-6 h-6 text-[#ED7026]/40" />
                  <p className="text-xs text-[#555555] leading-relaxed italic line-clamp-4">
                    "{story.testimonial}"
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0 border-t border-[#ECECEC] mt-2 flex items-center justify-between text-xs text-[#555555]">
                <span>{story.hometown}</span>
                <span className="flex items-center gap-1 text-[#27AE60] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
