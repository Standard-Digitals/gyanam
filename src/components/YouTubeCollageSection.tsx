import React, { useState } from 'react';
import { SuccessStory } from '../types';
import { Youtube, Play, Sparkles, Clock, Search, Filter, ExternalLink, ShieldCheck, Film } from 'lucide-react';

interface YouTubeCollageSectionProps {
  onPlayVideo: (story: SuccessStory) => void;
}

export const TUTOR_LECTURE_VIDEOS: SuccessStory[] = [
  {
    id: 'tutor-vid-1',
    studentName: 'Prof. Rakesh Sharma',
    examCleared: 'Quantitative Aptitude',
    rank: 'Senior Faculty',
    year: 2026,
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
    hasVideo: true,
    videoDuration: '14:20',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    testimonial: 'Master speed math techniques, shortcut tricks for quadratic equations, and high-level Data Interpretation concepts for SSC CGL & Bank PO.',
    previousAttempts: 'Faculty Lecture',
    hometown: 'Gyanam Campus',
    badge: 'Algebra & Quant Masterclass',
    category: 'SSC'
  },
  {
    id: 'tutor-vid-2',
    studentName: 'Dr. Meenakshi Sundaram',
    examCleared: 'Banking & Financial Awareness',
    rank: 'Subject Expert',
    year: 2026,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    hasVideo: true,
    videoDuration: '11:45',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    testimonial: 'Comprehensive analysis of RBI Monetary Policy, Banking Terms, Union Budget updates, and economic static GK for IBPS PO & SBI Mains.',
    previousAttempts: 'Faculty Lecture',
    hometown: 'Gyanam Campus',
    badge: 'IBPS PO Banking Strategy',
    category: 'Banking'
  },
  {
    id: 'tutor-vid-3',
    studentName: 'Faculty Rohan Deshmukh',
    examCleared: 'Reasoning & Analytical Ability',
    rank: 'Lead Tutor',
    year: 2026,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    hasVideo: true,
    videoDuration: '09:15',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    testimonial: 'Step-by-step logic unraveling for complex Floor Puzzles, Circular Seating Arrangements, Syllogisms, and Coding-Decoding patterns.',
    previousAttempts: 'Faculty Lecture',
    hometown: 'Gyanam Campus',
    badge: 'Complex Puzzles & Logic',
    category: 'Banking'
  },
  {
    id: 'tutor-vid-4',
    studentName: 'Bishal Saikia (Faculty)',
    examCleared: 'General Studies & Assam GK',
    rank: 'Assam Govt Specialist',
    year: 2026,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    hasVideo: true,
    videoDuration: '18:10',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    testimonial: 'Specialized focus lecture covering Assam History, Geography, SLRC ADRE 3.0 Syllabus Breakdown, and target practice questions.',
    previousAttempts: 'Faculty Lecture',
    hometown: 'Jorhat, Assam',
    badge: 'Assam ADRE 3.0 Special',
    category: 'Assam Govt'
  }
];

export const YouTubeCollageSection: React.FC<YouTubeCollageSectionProps> = ({ onPlayVideo }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeInlineVideo, setActiveInlineVideo] = useState<SuccessStory | null>(TUTOR_LECTURE_VIDEOS[0]);

  const categories = ['All', 'SSC', 'Banking', 'Assam Govt', 'UPSC', 'Railway'];

  // Filter videos by category & search
  const filteredVideos = TUTOR_LECTURE_VIDEOS.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.examCleared.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Extract Youtube Embed URL from standard link
  const getEmbedUrl = (url: string) => {
    if (!url) return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    if (url.includes('embed/')) return url;
    if (url.includes('v=')) {
      const v = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${v}`;
    }
    if (url.includes('youtu.be/')) {
      const v = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${v}`;
    }
    return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  };

  return (
    <section id="youtube-collage" className="py-20 bg-[#FFF5F5] text-[#1F1A1C] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#C12223]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10 space-y-10">

        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#F3DCDD]">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 bg-[#C12223] text-white text-xs font-black uppercase rounded-full tracking-wider flex items-center gap-1.5 shadow-md">
                <Youtube className="w-4 h-4 fill-white" />
                <span>Gyanam Recorded Lectures</span>
              </span>
              <span className="px-3 py-1 bg-white text-[#C12223] text-xs font-bold rounded-full border border-[#F3DCDD] shadow-sm">
                Recorded Video Gallery
              </span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#1F1A1C] tracking-tight">
              Tutor Recorded Video Lectures
            </h2>
            <p className="text-sm sm:text-base text-[#555555] font-medium">
              Watch recorded video lectures and concept masterclasses uploaded by our expert faculty. Click any video card to preview in the player or open full screen.
            </p>
          </div>

          {/* Search Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search lectures, topics, faculty..."
                className="pl-9 pr-4 py-2.5 bg-white border border-[#F3DCDD] rounded-xl text-xs font-semibold placeholder:text-gray-400 text-[#1F1A1C] focus:outline-none focus:border-[#C12223] transition w-full sm:w-64 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <Filter className="w-4 h-4 text-[#C12223] shrink-0 mr-1" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 border cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#C12223] text-white border-[#C12223] shadow-md'
                  : 'bg-white text-[#555555] border-[#F3DCDD] hover:border-[#C12223] hover:text-[#C12223]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ON-PAGE FEATURED ACTIVE PREVIEW PLAYER */}
        {activeInlineVideo && (
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#F3DCDD] shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs text-[#555555]">
              <span className="flex items-center gap-2 text-[#C12223] font-bold uppercase tracking-wider">
                <Film className="w-4 h-4 text-[#C12223]" />
                <span>Active Lecture Player</span>
              </span>
              <button
                onClick={() => onPlayVideo(activeInlineVideo)}
                className="text-xs text-white bg-[#C12223] hover:bg-[#8C1316] px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition cursor-pointer shadow-sm"
              >
                <span>Full Modal View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Embedded Player */}
              <div className="lg:col-span-2 aspect-video bg-black rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                <iframe
                  src={`${getEmbedUrl(activeInlineVideo.youtubeUrl || '')}?autoplay=0&rel=0`}
                  title={activeInlineVideo.studentName}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Active Video Info */}
              <div className="flex flex-col justify-between space-y-4 bg-[#FFF5F5] p-5 rounded-2xl border border-[#F3DCDD]">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-[#C12223] text-white font-black text-xs rounded-full shadow-sm">
                      {activeInlineVideo.badge}
                    </span>
                    <span className="px-2.5 py-1 bg-white text-[#8C1316] font-bold text-xs rounded-lg border border-[#F3DCDD]">
                      {activeInlineVideo.examCleared}
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-xl text-[#1F1A1C]">
                    {activeInlineVideo.studentName}
                  </h3>

                  <p className="text-xs text-[#555555] leading-relaxed italic bg-white p-3 rounded-xl border border-[#F3DCDD]">
                    "{activeInlineVideo.testimonial}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#F3DCDD] text-xs text-[#666666]">
                  <span className="flex items-center gap-1 font-medium text-[#C12223]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Faculty Lecture</span>
                  </span>
                  <span className="flex items-center gap-1 font-medium text-amber-600">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{activeInlineVideo.videoDuration || '14:20'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TUTOR LECTURES GRID - Uniform 2x2 or 4-column balanced layout (No whitespace gap) */}
        <div>
          <h3 className="text-xs font-black uppercase text-[#888888] tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Select a Lecture to Play ({filteredVideos.length} Videos)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVideos.map((story) => {
              const isActive = activeInlineVideo?.id === story.id;
              return (
                <div
                  key={story.id}
                  onClick={() => {
                    setActiveInlineVideo(story);
                    onPlayVideo(story);
                  }}
                  className={`bg-white rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between overflow-hidden cursor-pointer shadow-md hover:shadow-xl ${
                    isActive ? 'border-[#C12223] ring-2 ring-[#C12223]/20' : 'border-[#F3DCDD] hover:border-[#C12223]'
                  }`}
                >
                  {/* Thumbnail Image Container - Fixed Proportional Aspect Ratio */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#8C1316]">
                    <img
                      src={story.photoUrl}
                      alt={story.studentName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-[#FF0000] hover:bg-[#C12223] text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 border-2 border-white/60">
                        <Play className="w-6 h-6 fill-white translate-x-0.5" />
                      </div>
                    </div>

                    {/* Top Subject Badge */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="px-2.5 py-1 bg-[#C12223] text-white font-extrabold text-[10px] rounded-lg shadow-sm">
                        {story.examCleared}
                      </span>
                    </div>

                    {/* Bottom Duration Badge */}
                    <div className="absolute bottom-3 right-3 z-10">
                      <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-amber-300 font-bold text-[10px] rounded-md border border-white/20 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{story.videoDuration || '12:45'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Details Section - Compact, No Vertical Whitespace */}
                  <div className="p-4 flex flex-col justify-between flex-1 bg-white space-y-2">
                    <div>
                      <h4 className="font-heading font-black text-base text-[#1F1A1C] hover:text-[#C12223] transition line-clamp-1">
                        {story.studentName}
                      </h4>
                      <p className="text-xs font-bold text-[#C12223] line-clamp-1 mt-0.5">
                        {story.badge}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#666666] pt-2 border-t border-gray-100 mt-2">
                      <span className="text-[#27AE60] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Recorded Class
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

