'use client';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import type { FreeResource } from '@/types';
import { Download, FileText, CheckCircle2, Star, Sparkles, ArrowRight } from 'lucide-react';

export const FreeResources: React.FC<{ resources: FreeResource[] }> = ({ resources }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (resId: string) => {
    setDownloadingId(resId);
    setTimeout(() => {
      setDownloadingId(null);
      alert('PDF Download started successfully! Check your downloads folder.');
    }, 1200);
  };

  return (
    <section id="free-resources" className="py-20 bg-white border-y border-[#F3DCDD]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 bg-[#27AE60]/10 text-[#27AE60] text-xs font-extrabold uppercase rounded-full tracking-wider">
            100% Free Study Material
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#1F1A1C] mt-3 tracking-tight">
            Download Free PDF Notes & PYQ Papers
          </h2>
          <p className="text-sm sm:text-base text-[#555555] mt-3">
            Handwritten class notes, monthly current affairs booklets, and last 10 years solved papers.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map(res => (
            <motion.div
              key={res.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-[#FFF5F5] rounded-3xl p-6 border border-[#F3DCDD] shadow-xl hover:shadow-2xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-[#27AE60]/10 text-[#27AE60] font-extrabold text-[10px] uppercase rounded-full">
                    {res.type}
                  </span>
                  <span className="text-xs text-[#888888] font-bold">{res.fileSize}</span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-white border border-[#F3DCDD] text-[#C12223] flex items-center justify-center mb-4 shadow-sm group-hover:bg-[#C12223] group-hover:text-white transition">
                  <FileText className="w-6 h-6" />
                </div>

                <h3 className="font-heading font-extrabold text-base text-[#1F1A1C] group-hover:text-[#C12223] transition mb-2">
                  {res.title}
                </h3>

                <p className="text-xs text-[#555555] leading-relaxed mb-4">
                  {res.description}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-[#555555] mb-3 pt-3 border-t border-[#F3DCDD]">
                  <span>{res.category}</span>
                  <span className="font-bold text-[#1F1A1C]">
                    {res.downloadsCount.toLocaleString()} downloads
                  </span>
                </div>

                <button
                  onClick={() => handleDownload(res.id)}
                  disabled={downloadingId === res.id}
                  className="w-full py-3 bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white font-bold text-xs rounded-xl shadow-md shadow-[#C12223]/20 hover:scale-102 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {downloadingId === res.id ? (
                    'Preparing PDF...'
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> Instant Free Download
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
