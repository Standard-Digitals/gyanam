'use client';
import React from 'react';
import { motion } from 'motion/react';
import { BLOG_POSTS } from '@/data/mockData';
import { ArrowRight, Clock, User, Bell } from 'lucide-react';

export const BlogSection: React.FC = () => {
  return (
    <section id="blog" className="py-20 bg-[#FFF5F5]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="px-3.5 py-1 bg-[#C12223]/10 text-[#C12223] text-xs font-extrabold uppercase rounded-full tracking-wider">
              Exam Alerts & Articles
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#1F1A1C] mt-3 tracking-tight">
              Latest Exam Strategy & Notifications
            </h2>
            <p className="text-sm text-[#555555] mt-2 max-w-xl">
              Stay updated with official notification releases, cut-offs, and strategy guides.
            </p>
          </div>

          <a href="#" className="text-xs font-bold text-[#C12223] hover:underline flex items-center gap-1">
            View All Articles <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map(post => (
            <motion.div
              key={post.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-[#F3DCDD] shadow-xl hover:shadow-2xl overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-[#450A0A]">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-[#C12223] text-white font-extrabold text-[10px] uppercase rounded-full shadow-md">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-[#888888]">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="font-heading font-extrabold text-lg text-[#1F1A1C] group-hover:text-[#C12223] transition line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#555555] leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#F3DCDD] mt-4 flex items-center justify-between text-xs text-[#555555]">
                <span>By {post.author}</span>
                <span className="font-bold text-[#C12223] group-hover:translate-x-1 transition flex items-center gap-1">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
