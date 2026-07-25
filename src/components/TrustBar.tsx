import React from 'react';
import { EXAM_CATEGORIES } from '../data/mockData';
import { Award, Building2, Train, MapPin, Landmark, GraduationCap, Shield, Sparkles } from 'lucide-react';

interface TrustBarProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
}

export const TrustBar: React.FC<TrustBarProps> = ({ selectedCategory, onSelectCategory }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award': return <Award className="w-4 h-4" />;
      case 'Building2': return <Building2 className="w-4 h-4" />;
      case 'Train': return <Train className="w-4 h-4" />;
      case 'MapPin': return <MapPin className="w-4 h-4" />;
      case 'Landmark': return <Landmark className="w-4 h-4" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4" />;
      case 'Shield': return <Shield className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  // Duplicate categories to create a seamless infinite loop
  const categoriesList = [...EXAM_CATEGORIES, ...EXAM_CATEGORIES];

  return (
    <section className="py-8 bg-white border-y border-[#ECECEC]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-6">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#555555]">
            Trusted by 500,000+ Aspirants across SSC, Banking, Railways & State Exams
          </p>
        </div>

        {/* Marquee Infinite Scrolling Wrapper without Scrollbars */}
        <div className="relative overflow-hidden w-full no-scrollbar">
          {/* Subtle Left & Right Fade Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

          {/* Marquee Animated Track - Pauses on Hover */}
          <div className="animate-marquee-track flex items-center gap-3 py-1">
            {categoriesList.map((cat, index) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={`${cat.id}-${index}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center gap-2 shrink-0 border cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#ED7026] to-[#C12223] text-white border-transparent shadow-lg shadow-[#ED7026]/20 scale-105'
                      : 'bg-[#FFF8F6] text-[#555555] border-[#ECECEC] hover:border-[#ED7026] hover:text-[#ED7026] hover:bg-white'
                  }`}
                >
                  <span className={isSelected ? 'text-white' : 'text-[#ED7026]'}>
                    {getIcon(cat.icon)}
                  </span>
                  <span className="whitespace-nowrap">{cat.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white text-[#888888] border border-[#ECECEC]'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );

};
