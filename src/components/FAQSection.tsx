import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQS_DATA } from '../data/mockData';
import { ChevronDown, HelpCircle, Phone, Search } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'General', 'Courses & Batches', 'Mock Tests', 'App & Access', 'Payments'];

  const filteredFaqs = FAQS_DATA.filter(faq => {
    const matchesCat = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="faq" className="py-20 bg-white border-y border-[#ECECEC]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3.5 py-1 bg-[#ED7026]/10 text-[#ED7026] text-xs font-extrabold uppercase rounded-full tracking-wider">
            Clear All Doubts
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#111111] mt-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#555555] mt-2">
            Got questions regarding Gyanam courses, mock tests or batches? We’re here to help.
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
              className="w-full pl-12 pr-4 py-3 bg-[#FFF8F6] border border-[#ECECEC] rounded-2xl text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#ED7026]"
            />
          </div>

          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 border ${
                  activeCategory === cat
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-[#555555] border-[#ECECEC] hover:border-[#ED7026]'
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
                className="bg-[#FFF8F6] rounded-2xl border border-[#ECECEC] overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenId(isOpen ? '' : faq.id)}
                  className="w-full p-5 text-left font-heading font-extrabold text-base text-[#111111] flex items-center justify-between gap-4 hover:text-[#C12223] transition"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-[#ED7026] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 text-xs sm:text-sm text-[#555555] leading-relaxed border-t border-[#ECECEC]/60 pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-12 p-6 bg-[#FFF8F6] rounded-3xl border border-[#ECECEC] max-w-xl mx-auto text-center space-y-3">
          <HelpCircle className="w-8 h-8 text-[#ED7026] mx-auto" />
          <h4 className="font-heading font-bold text-base text-[#111111]">
            Still have questions? Speak to a Counselor.
          </h4>
          <p className="text-xs text-[#555555]">
            Call Gyanam Student Helpdesk directly: <a href="tel:9117343434" className="font-bold text-[#C12223]">9117 34 34 34</a> (9 AM – 8 PM)
          </p>
        </div>

      </div>
    </section>
  );
};
