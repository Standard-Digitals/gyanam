import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Download, CheckCircle2, PlayCircle, FileText, MessageSquare, Flame, Star, ArrowRight, QrCode, X } from 'lucide-react';
import { GyanamLogo } from './GyanamLogo';

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
  const [showQr, setShowQr] = useState(false);

  return (
    <section id="mobile-app" className="py-20 bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#250d0e] text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#ED7026]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#C12223]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: App Highlights & SMS Link Sender */}
          <div className="lg:col-span-7 space-y-6">
            <span className="px-3.5 py-1 bg-[#ED7026]/20 border border-[#ED7026]/30 text-amber-400 text-xs font-extrabold uppercase rounded-full tracking-wider">
              📱 Study Anytime, Anywhere
            </span>

            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Download the Official <br />
              <span className="gradient-text font-black">Gyanam Mobile App</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed">
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
                    className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2 border ${
                      isActive
                        ? 'bg-gradient-to-r from-[#ED7026] to-[#C12223] text-white border-transparent shadow-lg shadow-[#ED7026]/30'
                        : 'bg-white/10 text-slate-300 border-white/10 hover:border-[#ED7026]'
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
              <button className="px-5 py-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition flex items-center gap-3">
                <GooglePlayIcon />
                <div className="text-left">
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">Download on</span>
                  <span className="font-bold text-xs text-white">Google Play Store</span>
                </div>
              </button>
              <button className="px-5 py-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition flex items-center gap-3">
                <AppleIcon />
                <div className="text-left">
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">Download on</span>
                  <span className="font-bold text-xs text-white">Apple App Store</span>
                </div>
              </button>

              {/* Show QR Button */}
              <button
                onClick={() => setShowQr(true)}
                className="px-5 py-3 bg-gradient-to-r from-[#ED7026] to-[#C12223] hover:opacity-90 rounded-2xl border border-white/30 transition flex items-center gap-3 text-white shadow-lg shadow-[#ED7026]/20 active:scale-95"
              >
                <QrCode className="w-6 h-6 text-white" />
                <div className="text-left">
                  <span className="text-[9px] uppercase text-amber-200 block font-bold">Quick Scan</span>
                  <span className="font-bold text-xs text-white">Show QR Code</span>
                </div>
              </button>
            </div>
          </div>

          {/* QR Code Modal Overlay */}
          <AnimatePresence>
            {showQr && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative border border-[#ECECEC] shadow-2xl text-[#111111]"
                >
                  <button
                    onClick={() => setShowQr(false)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-black transition"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="w-12 h-12 bg-[#ED7026]/10 text-[#ED7026] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#ED7026]/20">
                    <QrCode className="w-6 h-6" />
                  </div>

                  <h3 className="font-heading font-black text-2xl text-[#111111] mb-1">
                    Scan to Install App
                  </h3>
                  <p className="text-xs text-[#555555] mb-6">
                    Point your mobile phone camera or Google Lens at this QR code to download Gyanam App instantly.
                  </p>

                  {/* QR Code Graphics Card */}
                  <div className="p-4 bg-[#FFF8F6] rounded-2xl border-2 border-dashed border-[#ED7026]/30 inline-block mb-6 relative group">
                    <div className="w-48 h-48 bg-white p-3 rounded-xl border border-[#ECECEC] shadow-md flex items-center justify-center relative">
                      {/* Realistic SVG QR Pattern */}
                      <svg viewBox="0 0 100 100" className="w-full h-full fill-[#111111]">
                        {/* Corner Position Detection Squares */}
                        <path d="M0,0 h30 v30 h-30 z M4,4 v22 h22 v-22 z M8,8 h14 v14 h-14 z" />
                        <path d="M70,0 h30 v30 h-30 z M74,4 v22 h22 v-22 z M78,8 h14 v14 h-14 z" />
                        <path d="M0,70 h30 v30 h-30 z M4,74 v22 h22 v-22 z M8,78 h14 v14 h-14 z" />
                        
                        {/* Internal QR Matrix Data Modules */}
                        <rect x="36" y="4" width="8" height="8" />
                        <rect x="48" y="4" width="16" height="8" />
                        <rect x="36" y="16" width="12" height="8" />
                        <rect x="52" y="16" width="12" height="8" />
                        <rect x="4" y="36" width="8" height="12" />
                        <rect x="16" y="36" width="12" height="8" />
                        <rect x="32" y="32" width="12" height="12" />
                        <rect x="48" y="36" width="8" height="12" />
                        <rect x="60" y="32" width="16" height="8" />
                        <rect x="80" y="36" width="16" height="12" />
                        
                        <rect x="4" y="52" width="16" height="8" />
                        <rect x="24" y="48" width="8" height="16" />
                        <rect x="36" y="52" width="16" height="8" />
                        <rect x="56" y="48" width="12" height="12" />
                        <rect x="72" y="52" width="8" height="12" />
                        <rect x="84" y="52" width="12" height="8" />

                        <rect x="36" y="68" width="12" height="12" />
                        <rect x="52" y="64" width="12" height="8" />
                        <rect x="68" y="68" width="16" height="8" />
                        <rect x="36" y="84" width="20" height="12" />
                        <rect x="60" y="80" width="8" height="16" />
                        <rect x="72" y="84" width="24" height="12" />
                      </svg>
                      {/* Center Logo */}
                      <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[#C12223] border-2 border-white flex items-center justify-center text-white font-heading font-black text-xs shadow-md">
                        ज्ञा
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#27AE60] bg-[#27AE60]/10 py-2.5 px-4 rounded-xl border border-[#27AE60]/20">
                    <CheckCircle2 className="w-4 h-4" /> Compatible with Android & iOS
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* RIGHT: Interactive Smartphone UI Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-72 sm:w-80 h-[520px] bg-slate-900 rounded-[40px] p-3 border-4 border-slate-700 shadow-2xl relative glow-orange"
            >
              {/* Phone Notch */}
              <div className="w-32 h-4 bg-slate-800 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
                <div className="w-8 h-1 bg-slate-600 rounded-full" />
              </div>

              {/* Phone Screen Display */}
              <div className="w-full h-[470px] bg-[#FFF8F6] rounded-[30px] p-4 text-[#111111] overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#ECECEC] mb-3">
                    <div className="flex items-center gap-1.5">
                      <GyanamLogo className="w-8 h-8" />
                      <span className="font-heading font-black text-sm text-[#C12223]">Gyanam App</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#27AE60] bg-[#27AE60]/10 px-2 py-0.5 rounded">ONLINE</span>
                  </div>

                  {activeScreen === 'live' && (
                    <div className="space-y-3">
                      <div className="relative h-32 rounded-2xl bg-slate-900 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400"
                          alt="Live Class"
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <PlayCircle className="w-10 h-10 text-white fill-[#ED7026]" />
                        </div>
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#C12223] text-white text-[9px] font-black rounded">
                          LIVE NOW
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-[#111111]">SSC CGL Quant Speed Hacks</h5>
                      <p className="text-[10px] text-[#555555]">Rakesh Sir • 1,240 Students Watching</p>
                    </div>
                  )}

                  {activeScreen === 'test' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-xl border border-[#ECECEC]">
                        <span className="text-[10px] font-bold text-[#ED7026] block">FULL MOCK #14</span>
                        <h5 className="font-bold text-xs text-[#111111]">IBPS PO Mains Special</h5>
                        <div className="mt-2 text-[10px] text-[#27AE60] font-bold">Accuracy: 96% • Rank #02</div>
                      </div>
                    </div>
                  )}

                  {activeScreen === 'notes' && (
                    <div className="space-y-2">
                      <div className="p-3 bg-white rounded-xl border border-[#ECECEC] flex items-center justify-between">
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
                      <div className="p-2.5 bg-[#ED7026]/10 rounded-xl text-xs text-[#111111]">
                        <strong>Student:</strong> How to solve geometry chord question?
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-[#ECECEC] text-xs text-[#111111]">
                        <strong>Mentor:</strong> Applying Theorem: AP × PB = CP × PD. Answer is 8cm.
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-2 bg-white rounded-xl border border-[#ECECEC] text-center text-[10px] font-bold text-[#555555]">
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
