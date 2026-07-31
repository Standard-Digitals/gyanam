'use client';
import React, { useState } from 'react';
import { SUCCESS_STORIES } from '@/data/mockData';
import { SuccessStory } from '@/types';
import { Award, Sparkles, MapPin, ShieldCheck, CheckCircle2, Eye, Info } from 'lucide-react';
import { TopperModal } from './modals/TopperModal';

interface SuccessStoriesProps {
  onPlayVideo: (story: SuccessStory) => void;
}

export const SuccessStories: React.FC<SuccessStoriesProps> = ({ onPlayVideo }) => {
  const [filter, setFilter] = useState<string>('All');
  const [selectedTopper, setSelectedTopper] = useState<SuccessStory | null>(null);

  const categories = ['All', 'SSC', 'Banking', 'Assam Govt', 'UPSC', 'Railway'];

  const filteredStories = filter === 'All'
    ? SUCCESS_STORIES
    : SUCCESS_STORIES.filter(s => s.category === filter);

  // Split stories into two distinct rows for parallax effect
  const halfLength = Math.ceil(filteredStories.length / 2);
  const row1Base = filteredStories.slice(0, halfLength);
  const row2Base = filteredStories.length > 1 ? filteredStories.slice(halfLength) : filteredStories;

  // Build repeated lists so each row has sufficient width and 2 identical halves [List, List]
  // This guarantees that moving from 0% to -50% (or -50% to 0%) is 100% seamless without jumps or cut-offs
  const buildLoopList = (items: SuccessStory[]) => {
    if (!items || items.length === 0) return [];
    let list = [...items];
    while (list.length < 6) {
      list = [...list, ...items];
    }
    return [...list, ...list]; // Two identical halves: [halfA, halfA]
  };

  const row1Items = buildLoopList(row1Base);
  const row2Items = buildLoopList(row2Base);

  return (
    <section id="success-stories" className="py-20 bg-[#FFF5F5] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#C12223]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="px-4 py-1.5 bg-[#C12223]/10 border border-[#F3DCDD] text-[#C12223] text-xs font-black uppercase rounded-full tracking-wider inline-flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Gyanam Hall of Fame • Selection Champions</span>
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#1F1A1C] tracking-tight">
              Top Rankers & Verified Performers
            </h2>
            <p className="text-sm sm:text-base text-[#555555] font-medium max-w-2xl">
              Hover over any card to pause the marquee scroll. Click on a photo to open full profile, roll number & strategy details.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 border cursor-pointer ${
                  filter === cat
                    ? 'bg-[#C12223] text-white border-[#C12223] shadow-md'
                    : 'bg-white text-[#555555] border-[#F3DCDD] hover:border-[#C12223]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* PARALLAX DUAL-ROW INFINITE HORIZONTAL MARQUEE */}
      <div className="space-y-6 pt-8 w-full overflow-hidden">

        {/* ROW 1: Moves Left-to-Right */}
        <div className="relative w-full overflow-hidden py-2">
          {/* Gradient Edge Masks for sleek edge dissolve */}
          <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#FFF5F5] to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#FFF5F5] to-transparent z-20 pointer-events-none" />

          <div className="animate-marquee-left flex gap-5">
            {row1Items.map((story, idx) => (
              <TopperCard
                key={`row1-${story.id}-${idx}`}
                story={story}
                onClick={() => setSelectedTopper(story)}
              />
            ))}
          </div>
        </div>

        {/* ROW 2: Moves Right-to-Left (Opposite Direction for Parallax) */}
        <div className="relative w-full overflow-hidden py-2">
          {/* Gradient Edge Masks */}
          <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#FFF5F5] to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#FFF5F5] to-transparent z-20 pointer-events-none" />

          <div className="animate-marquee-right flex gap-5">
            {row2Items.map((story, idx) => (
              <TopperCard
                key={`row2-${story.id}-${idx}`}
                story={story}
                onClick={() => setSelectedTopper(story)}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Topper Details Modal */}
      <TopperModal
        story={selectedTopper}
        onClose={() => setSelectedTopper(null)}
        onWatchVideo={onPlayVideo}
      />
    </section>
  );
};

// Sleek, minimal topper photo card
const TopperCard: React.FC<{ story: SuccessStory; onClick: () => void }> = ({ story, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="w-72 sm:w-80 shrink-0 bg-white rounded-3xl border border-[#F3DCDD] shadow-md hover:shadow-2xl hover:border-[#C12223] transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between transform hover:-translate-y-1"
    >
      {/* Photo Frame with Clean Overlays */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-[#8C1316]">
        <img
          src={story.photoUrl}
          alt={story.studentName}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* Top-Left Rank Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1 bg-[#C12223] text-white font-black text-xs rounded-full shadow-lg border border-white/30 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>{story.rank}</span>
          </span>
        </div>

        {/* Top-Right Exam Tag */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-amber-300 font-extrabold text-[10px] rounded-lg border border-white/20">
            {story.examCleared}
          </span>
        </div>

        {/* Student Name */}
        <div className="absolute bottom-3 left-3 right-3 text-white z-10">
          <h4 className="font-heading font-black text-lg leading-snug drop-shadow-md">
            {story.studentName}
          </h4>
        </div>
      </div>

      {/* Minimal 1-2 Lines Details */}
      <div className="p-4 space-y-2">
        <p className="text-xs font-bold text-[#C12223] truncate">
          {story.badge}
        </p>

        <div className="flex items-center justify-between text-[11px] text-[#666666] pt-2 border-t border-gray-100">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#C12223]" />
            <span>{story.hometown}</span>
          </span>

          <span className="flex items-center gap-1 text-[#27AE60] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Selection</span>
          </span>
        </div>
      </div>
    </div>
  );
};
