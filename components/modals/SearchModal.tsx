'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, BookOpen, FileText, ArrowRight, Sparkles, Award } from 'lucide-react';
import type { Course, CurrentAffairItem, FreeResource } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse: (courseId: string) => void;
  courses: Course[];
  currentAffairs: CurrentAffairItem[];
  resources: FreeResource[];
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectCourse, courses, currentAffairs, resources }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredCourses = courses.filter(
    c => c.title.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase()) || c.targetExam.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCA = currentAffairs.filter(
    ca => ca.title.toLowerCase().includes(query.toLowerCase()) || ca.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredResources = resources.filter(
    r => r.title.toLowerCase().includes(query.toLowerCase()) || r.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 sm:px-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#450A0A]/70 backdrop-blur-md"
        />

        {/* Modal Body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#F3DCDD] overflow-hidden z-10"
        >
          {/* Input Header */}
          <div className="flex items-center px-6 py-4 border-b border-[#F3DCDD] bg-[#FFF5F5]">
            <Search className="w-6 h-6 text-[#C12223] mr-3 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search courses, exams (SSC, Banking, ADRE), notes or current affairs..."
              className="w-full text-lg font-medium text-[#1F1A1C] placeholder:text-[#888888] bg-transparent outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-[#888888] hover:text-[#1F1A1C] rounded-full mr-2 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#555555] hover:text-[#C12223] rounded-lg hover:bg-white text-sm font-semibold transition cursor-pointer"
            >
              Esc
            </button>
          </div>

          {/* Quick Filter Tags */}
          <div className="px-6 py-3 bg-[#FFF5F5]/50 border-b border-[#F3DCDD] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-[#888888] uppercase tracking-wider shrink-0">Popular:</span>
            {['SSC CGL', 'IBPS PO', 'Assam ADRE', 'Current Affairs July', 'Quant Formulas'].map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3 py-1 bg-white border border-[#F3DCDD] hover:border-[#C12223] hover:text-[#C12223] text-xs font-medium text-[#555555] rounded-full transition shrink-0 cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Results */}
          <div className="max-h-[60vh] overflow-y-auto p-6 divide-y divide-[#F3DCDD] space-y-6">
            {/* Courses Section */}
            <div>
              <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider text-[#888888]">
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-[#C12223]" /> Courses ({filteredCourses.length})</span>
              </div>
              <div className="space-y-2">
                {filteredCourses.slice(0, 3).map(course => (
                  <div
                    key={course.id}
                    onClick={() => {
                      onSelectCourse(course.id);
                      onClose();
                    }}
                    className="p-3 hover:bg-[#FFF5F5] rounded-xl border border-transparent hover:border-[#F3DCDD] transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={course.thumbnail} alt={course.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <h4 className="font-semibold text-[#1F1A1C] text-sm group-hover:text-[#C12223] transition">{course.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-[#555555] mt-0.5">
                          <span className="bg-[#C12223]/10 text-[#C12223] px-2 py-0.5 rounded font-semibold">{course.category}</span>
                          <span>{course.duration}</span>
                          <span className="text-[#27AE60] font-bold">₹{course.discountPrice}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#888888] group-hover:text-[#C12223] group-hover:translate-x-1 transition" />
                  </div>
                ))}
                {filteredCourses.length === 0 && (
                  <p className="text-xs text-[#888888] italic py-2">No matching courses found.</p>
                )}
              </div>
            </div>

            {/* Current Affairs Section */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider text-[#888888]">
                <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-[#C12223]" /> Current Affairs</span>
              </div>
              <div className="space-y-2">
                {filteredCA.slice(0, 2).map(item => (
                  <div key={item.id} className="p-3 bg-[#FFF5F5]/30 rounded-xl border border-[#F3DCDD] hover:border-[#C12223] transition">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-[#C12223] bg-[#C12223]/10 px-2 py-0.5 rounded">{item.category}</span>
                      <span className="text-xs text-[#888888]">{item.date}</span>
                    </div>
                    <h5 className="font-semibold text-sm text-[#1F1A1C]">{item.title}</h5>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources Section */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider text-[#888888]">
                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-[#27AE60]" /> Free PDF Downloads</span>
              </div>
              <div className="space-y-2">
                {filteredResources.slice(0, 2).map(res => (
                  <div key={res.id} className="p-3 bg-[#FFF5F5]/30 rounded-xl border border-[#F3DCDD] flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-xs text-[#1F1A1C]">{res.title}</h5>
                      <p className="text-[11px] text-[#555555] mt-0.5">{res.fileSize} • {res.downloadsCount.toLocaleString()} downloads</p>
                    </div>
                    <button className="px-3 py-1 text-xs font-semibold bg-[#27AE60]/10 text-[#27AE60] hover:bg-[#27AE60] hover:text-white rounded-lg transition cursor-pointer">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-[#FFF5F5] border-t border-[#F3DCDD] text-center text-xs text-[#555555]">
            Need help finding a specific course? Call Gyanam Student Helpline: <strong className="text-[#C12223] font-bold">9117 34 34 34</strong>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
