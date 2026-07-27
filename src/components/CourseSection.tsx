import React from 'react';
import { motion } from 'motion/react';
import { COURSES_DATA, EXAM_CATEGORIES } from '../data/mockData';
import { Course } from '../types';
import { Star, Users, Clock, ArrowRight, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface CourseSectionProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  onSelectCourse: (course: Course) => void;
  onEnrollCourse: (course: Course) => void;
}

export const CourseSection: React.FC<CourseSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectCourse,
  onEnrollCourse
}) => {
  const filteredCourses = selectedCategory === 'all'
    ? COURSES_DATA
    : COURSES_DATA.filter(c => c.category === selectedCategory);

  return (
    <section id="courses" className="py-20 bg-white border-t border-[#F3DCDD]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="px-3.5 py-1 bg-[#C12223]/10 text-[#C12223] text-xs font-extrabold uppercase rounded-full tracking-wider">
              Popular Live & Foundation Batches
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#1F1A1C] mt-3 tracking-tight">
              Master Your Target Government Exam
            </h2>
            <p className="text-sm text-[#555555] mt-2 max-w-xl">
              Structured curriculum covering prelims, mains, descriptive writing and personal interviews.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {EXAM_CATEGORIES.slice(0, 5).map(cat => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 border ${
                  selectedCategory === cat.id
                    ? 'bg-[#3B0A0C] text-white border-[#3B0A0C]'
                    : 'bg-[#FFF5F5] text-[#555555] border-[#F3DCDD] hover:border-[#C12223] hover:text-[#C12223]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <motion.div
              key={course.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-[#F3DCDD] shadow-xl hover:shadow-2xl overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Course Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 bg-[#C12223] text-white font-extrabold text-[10px] uppercase rounded-full shadow-md">
                      {course.category}
                    </span>
                    {course.badge && (
                      <span className="px-3 py-1 bg-[#8C1316] text-white font-extrabold text-[10px] rounded-full shadow-md">
                        {course.badge}
                      </span>
                    )}
                  </div>

                  {/* Bottom Stats Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {course.rating} ({course.reviewsCount})
                    </span>
                    <span className="font-semibold text-white/90 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {course.studentsEnrolled.toLocaleString()} Aspirants
                    </span>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-6 space-y-4">
                  <h3 className="font-heading font-extrabold text-lg text-[#1F1A1C] group-hover:text-[#C12223] transition line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Instructor Pill */}
                  <div className="flex items-center gap-3 p-2.5 bg-[#FFF5F5] rounded-xl border border-[#F3DCDD]">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#C12223]"
                    />
                    <div>
                      <h5 className="font-bold text-xs text-[#1F1A1C]">{course.instructor.name}</h5>
                      <p className="text-[10px] text-[#555555] truncate max-w-[180px]">{course.instructor.designation}</p>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-1.5 text-xs text-[#555555]">
                    {course.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C12223]" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer & Pricing */}
              <div className="p-6 pt-0 border-t border-[#F3DCDD] mt-4 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-[#888888] block uppercase font-bold">Course Fee</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-extrabold text-2xl text-[#1F1A1C]">
                      ₹{course.discountPrice}
                    </span>
                    <span className="text-xs text-[#888888] line-through">
                      ₹{course.originalPrice}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectCourse(course)}
                    className="p-2.5 bg-[#FFF5F5] border border-[#F3DCDD] hover:border-[#C12223] text-[#1F1A1C] hover:text-[#C12223] rounded-xl text-xs font-bold transition"
                    title="View Syllabus & Batch Schedule"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onEnrollCourse(course)}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#DC2626] to-[#8C1316] text-white font-bold text-xs rounded-xl shadow-md shadow-[#C12223]/20 hover:scale-105 active:scale-95 transition flex items-center gap-1"
                  >
                    Enroll <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
