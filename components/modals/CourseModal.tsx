'use client';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Star, Users, Clock, BookOpen, Calendar, ShieldCheck, Download, PlayCircle, ArrowRight } from 'lucide-react';
import { Course } from '../../types';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onEnroll: (course: Course) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, onEnroll }) => {
  if (!course) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#450A0A]/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-[#F3DCDD] overflow-y-auto z-10 my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 bg-white/80 hover:bg-white text-[#1F1A1C] rounded-full shadow-md transition z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Image & Badge */}
          <div className="relative h-56 sm:h-64 overflow-hidden bg-[#8C1316]">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#8C1316] via-[#8C1316]/60 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-[#C12223] text-white font-bold text-xs rounded-full uppercase tracking-wider">
                  {course.category}
                </span>
                {course.badge && (
                  <span className="px-3 py-1 bg-[#8C1316] text-white font-bold text-xs rounded-full">
                    {course.badge}
                  </span>
                )}
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-full flex items-center gap-1 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {course.rating} ({course.reviewsCount} reviews)
                </span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl leading-tight">
                {course.title}
              </h2>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD]">
              <div>
                <span className="text-xs text-[#555555] block">Duration</span>
                <span className="font-bold text-sm text-[#1F1A1C] flex items-center gap-1 mt-0.5">
                  <Clock className="w-4 h-4 text-[#C12223]" /> {course.duration}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#555555] block">Enrolled</span>
                <span className="font-bold text-sm text-[#1F1A1C] flex items-center gap-1 mt-0.5">
                  <Users className="w-4 h-4 text-[#C12223]" /> {course.studentsEnrolled.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#555555] block">Language</span>
                <span className="font-bold text-sm text-[#1F1A1C] flex items-center gap-1 mt-0.5">
                  <BookOpen className="w-4 h-4 text-[#C12223]" /> {course.language}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#555555] block">Batch Schedule</span>
                <span className="font-bold text-sm text-[#C12223] flex items-center gap-1 mt-0.5">
                  <Calendar className="w-4 h-4 text-[#C12223]" /> {course.startDate}
                </span>
              </div>
            </div>

            {/* Instructor Profile */}
            <div className="flex items-center gap-4 p-4 bg-[#FFF5F5]/50 rounded-2xl border border-[#F3DCDD]">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#C12223]"
              />
              <div>
                <span className="text-xs font-bold text-[#C12223] uppercase tracking-wider">Lead Mentor</span>
                <h4 className="font-bold text-base text-[#1F1A1C]">{course.instructor.name}</h4>
                <p className="text-xs text-[#555555]">{course.instructor.designation}</p>
              </div>
            </div>

            {/* Features Included */}
            <div>
              <h3 className="font-heading font-extrabold text-lg text-[#1F1A1C] mb-3">
                What's Included in this Super Batch:
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1F1A1C]">
                    <CheckCircle className="w-4 h-4 text-[#27AE60] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Syllabus Structure */}
            <div>
              <h3 className="font-heading font-extrabold text-lg text-[#1F1A1C] mb-3">
                Syllabus & Module Breakdown
              </h3>
              <div className="space-y-3">
                {course.syllabusOverview.map((mod, i) => (
                  <div key={i} className="p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD]">
                    <h4 className="font-bold text-sm text-[#1F1A1C] mb-2">{mod.module}</h4>
                    <div className="flex flex-wrap gap-2">
                      {mod.topics.map((t, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white text-[#555555] text-xs rounded-lg border border-[#F3DCDD] font-medium">
                          • {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing CTA Bar */}
            <div className="pt-4 border-t border-[#F3DCDD] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#555555]">Special Early Bird Fee</span>
                <div className="flex items-baseline gap-3">
                  <span className="font-heading font-extrabold text-3xl text-[#1F1A1C]">
                    ₹{course.discountPrice}
                  </span>
                  <span className="text-sm text-[#888888] line-through">
                    ₹{course.originalPrice}
                  </span>
                  <span className="px-2 py-0.5 bg-[#27AE60]/10 text-[#27AE60] text-xs font-extrabold rounded">
                    {Math.round(((course.originalPrice - course.discountPrice) / course.originalPrice) * 100)}% OFF
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => onEnroll(course)}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white font-bold rounded-2xl text-sm shadow-xl shadow-[#C12223]/30 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  Enroll Now in Batch <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
