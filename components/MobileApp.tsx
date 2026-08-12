'use client';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Download, PlayCircle, FileText, MessageSquare } from 'lucide-react';
import { GyanamLogo } from '@/components/GyanamLogo';

const GooglePlayIcon: React.FC = () => (
  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.608 1.808C3.36 2.062 3.2 2.457 3.2 2.973v18.053c0 .516.16 0.911.408 1.165l.061.056 10.113-10.113v-.238L3.67 1.752l-.062.056z" fill="#20A1D6"/>
    <path d="M17.15 15.228l-3.368-3.368v-.238l3.368-3.368.077.044 3.99 2.267c1.138.647 1.138 1.706 0 2.353l-3.99 2.266-.077.044z" fill="#FFD200"/>
    <path d="M13.843 11.622l3.307 3.307-3.307 3.307-10.235 5.892c-.248.143-.541.178-.808.082l11.043-12.588" fill="#FF3A44"/>
    <path d="M13.843 11.622L2.8 2.316c.267-.096.56-.061.808.082l10.235 5.892 3.307 3.307-3.307 3.307z" fill="#00E676"/>
  </svg>
);

const AppleIcon: React.FC = () => (
  <svg className="w-6 h-6 shrink-0 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.12c.67-.82 1.13-1.97.99-3.12-1 .04-2.18.67-2.88 1.48-.62.72-1.16 1.88-.99 3.01 1.12.09 2.22-.55 2.88-1.37z"/>
  </svg>
);

export const MobileApp: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<'live' | 'test' | 'notes' | 'doubt'>('live');

  return (
    <section id="mobile-app" className="py-20 bg-gradient-to-br from-[#8C1316] via-[#A6181B] to-[#B91C1C] text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#EF4444]/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#EF4444]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: App Highlights & SMS Link Sender */}
          <div className="lg:col-span-7 space-y-6">
            <span className="px-3.5 py-1 bg-[#EF4444]/20 border border-[#EF4444]/40 text-amber-300 text-xs font-extrabold uppercase rounded-full tracking-wider">
              📱 Study Anytime, Anywhere
            </span>

            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Download the Official <br />
              <span className="gradient-text font-black">Gyanm Mobile App</span>
            </h2>

            <p className="text-sm sm:text-base text-red-100 max-w-xl font-normal leading-relaxed">
              Access 1,000+ hours of 4K HD live classes, TCS pattern mock tests, offline video downloads, and 24/7 instant doubt chat directly on your mobile device.
            </p>

            {/* Interactive Screen Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { id: 'live', name: 'Live Classes', icon: PlayCircle },
                { id: 'test', name: 'Mock Tests', icon: FileText },
                { id: 'notes', name: 'PDF Notes', icon: Download },
                { id: 'doubt', name: '24/7 Doubts', icon: MessageSquare }
              ].map(btn => {
                const IconComp = btn.icon;
                const isActive = activeScreen === btn.id;
                return (
                  <button
                    key={btn.id}
                    onClick={() => setActiveScreen(btn.id as any)}
                    className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2 border cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white border-transparent shadow-lg shadow-[#EF4444]/30'
                        : 'bg-white/10 text-red-100 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>{btn.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Store Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button className="px-5 py-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition flex items-center gap-3 cursor-pointer">
                <GooglePlayIcon />
                <div className="text-left">
                  <span className="text-[9px] uppercase text-red-200 block font-bold">Download on</span>
                  <span className="font-bold text-xs text-white">Google Play Store</span>
                </div>
              </button>
              <button className="px-5 py-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition flex items-center gap-3 cursor-pointer">
                <AppleIcon />
                <div className="text-left">
                  <span className="text-[9px] uppercase text-red-200 block font-bold">Download on</span>
                  <span className="font-bold text-xs text-white">Apple App Store</span>
                </div>
              </button>
            </div>
          </div>

          {/* RIGHT: Interactive Smartphone UI Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-72 sm:w-80 h-[520px] bg-[#9E1B1E] rounded-[40px] p-3 border-4 border-red-400/50 shadow-2xl shadow-[#EF4444]/30 relative"
            >
              {/* Phone Notch */}
              <div className="w-32 h-4 bg-[#8C1316] rounded-b-xl mx-auto mb-2 flex items-center justify-center">
                <div className="w-8 h-1 bg-red-400/60 rounded-full" />
              </div>

              {/* Phone Screen Display */}
              <div className="w-full h-[470px] bg-[#FFF5F5] rounded-[30px] p-4 text-[#1F1A1C] overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#F3DCDD] mb-3">
                    <div className="flex items-center gap-1.5">
                      <GyanamLogo className="w-5 h-5" />
                      <span className="font-heading font-black text-sm text-[#C12223]">GYANM App</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#27AE60] bg-[#27AE60]/10 px-2 py-0.5 rounded">ONLINE</span>
                  </div>

                  {activeScreen === 'live' && (
                    <div className="space-y-3">
                      <div className="relative h-32 rounded-2xl bg-[#B91C1C] overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400"
                          alt="Live Class"
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute inset-0 bg-[#8C1316]/40 flex items-center justify-center">
                          <PlayCircle className="w-10 h-10 text-white fill-[#C12223]" />
                        </div>
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#C12223] text-white text-[9px] font-black rounded">
                          LIVE NOW
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-[#1F1A1C]">SSC CGL Quant Speed Hacks</h5>
                      <p className="text-[10px] text-[#555555]">Rakesh Sir • 1,240 Students Watching</p>
                    </div>
                  )}

                  {activeScreen === 'test' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-xl border border-[#F3DCDD]">
                        <span className="text-[10px] font-bold text-[#C12223] block">FULL MOCK #14</span>
                        <h5 className="font-bold text-xs text-[#1F1A1C]">IBPS PO Mains Special</h5>
                        <div className="mt-2 text-[10px] text-[#27AE60] font-bold">Accuracy: 96% • Rank #02</div>
                      </div>
                    </div>
                  )}

                  {activeScreen === 'notes' && (
                    <div className="space-y-2">
                      <div className="p-3 bg-white rounded-xl border border-[#F3DCDD] flex items-center justify-between">
                        <div>
                          <h6 className="font-bold text-xs">July CA Digest PDF</h6>
                          <span className="text-[10px] text-[#555555]">14.2 MB • Downloaded</span>
                        </div>
                        <Download className="w-4 h-4 text-[#27AE60]" />
                      </div>
                    </div>
                  )}

                  {activeScreen === 'doubt' && (
                    <div className="space-y-2">
                      <div className="p-2.5 bg-[#C12223]/10 rounded-xl text-xs text-[#1F1A1C]">
                        <strong>Student:</strong> How to solve geometry chord question?
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-[#F3DCDD] text-xs text-[#1F1A1C]">
                        <strong>Mentor:</strong> Applying Theorem: AP × PB = CP × PD. Answer is 8cm.
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-2 bg-white rounded-xl border border-[#F3DCDD] text-center text-[10px] font-bold text-[#555555]">
                  ★ 4.9 Rating on Play Store (50,000+ Downloads)
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
