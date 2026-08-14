import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { FAQItem } from '../types';
import { ChevronDown, HelpCircle, Phone, Search, ArrowRight } from 'lucide-react';

export const FAQSection: React.FC<{ faqs: FAQItem[] }> = ({ faqs }) => {
  const [openId, setOpenId] = useState<string>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'General', 'Courses & Batches', 'Mock Tests', 'App & Access', 'Payments'];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCat = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="faq" className="py-20 bg-white border-y border-[#F3DCDD]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3.5 py-1 bg-[#C12223]/10 text-[#C12223] text-xs font-extrabold uppercase rounded-full tracking-wider">
            Clear All Doubts
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#1F1A1C] mt-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#555555] mt-2">
            Got questions regarding GYANM courses, mock tests or batches? We’re here to help.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="max-w-2xl mx-auto mb-10 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-[#888888] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search your question (e.g. mock test, live class, refund, app access)..."
              className="w-full pl-12 pr-4 py-3 bg-[#FFF5F5] border border-[#F3DCDD] rounded-2xl text-sm font-semibold text-[#1F1A1C] focus:outline-none focus:border-[#C12223]"
            />
          </div>

          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 border cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#C12223] text-white border-[#C12223]'
                    : 'bg-white text-[#555555] border-[#F3DCDD] hover:border-[#C12223]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.map(faq => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenId(isOpen ? '' : faq.id)}
                  className="w-full p-5 text-left font-heading font-extrabold text-base text-[#1F1A1C] flex items-center justify-between gap-4 hover:text-[#C12223] transition cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-[#C12223] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 text-xs sm:text-sm text-[#555555] leading-relaxed border-t border-[#F3DCDD]/60 pt-3"
                    >
                      {faq.answer}
                      {faq.linkUrl && (
                        <Link
                          href={faq.linkUrl}
                          className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-[#C12223] hover:underline"
                        >
                          Learn more <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-12 p-6 sm:p-8 bg-[#FFF5F5] rounded-3xl border border-[#F3DCDD] max-w-2xl mx-auto text-center space-y-4">
          <HelpCircle className="w-10 h-10 text-[#C12223] mx-auto" />
          <h4 className="font-heading font-black text-lg text-[#1F1A1C]">
            Need More Specific Help or Order Tracking?
          </h4>
          <p className="text-xs text-[#555555]">
            Call GYANM Student Helpdesk directly at <a href="tel:919117343434" className="font-bold text-[#C12223]">9117 34 34 34</a> or open our full interactive resolution desk.
          </p>
          <div className="pt-1">
            <a
              href="/helpdesk"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C12223] hover:bg-[#A6181B] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer"
            >
              <span>Explore Full 24/7 Helpdesk & Ticket Portal</span>
              <span>→</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
