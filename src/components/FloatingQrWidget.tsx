import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, X, CheckCircle2, ChevronLeft } from 'lucide-react';
import { GyanamLogo } from './GyanamLogo';

export const FloatingQrWidget: React.FC = () => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleZoneEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsHovered(true);
  };

  const handleTabEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsHovered(true);
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // After mouse leaves, wait 2 seconds then smoothly collapse back to low visibility
    timerRef.current = setTimeout(() => {
      setIsHovered(false);
      setIsExpanded(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Invisible vertical hover strip along the right edge of screen to detect mouse movement */}
      <div
        className="fixed right-0 top-1/4 bottom-1/4 w-12 z-40"
        onMouseEnter={handleZoneEnter}
        onMouseLeave={handleMouseLeave}
      />

      {/* Right Edge Floating QR Code Widget Container */}
      <div
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center justify-end"
        onMouseEnter={handleTabEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          onClick={() => setShowQrModal(true)}
          className={`group flex items-center gap-2.5 bg-gradient-to-l from-[#B91C1C] via-[#C12223] to-[#EF4444] text-white rounded-l-2xl border-l-2 border-y-2 border-white/30 cursor-pointer transition-all duration-500 ease-out ${
            isExpanded
              ? 'p-3 translate-x-0 opacity-100 shadow-2xl shadow-[#C12223]/50 scale-100 ring-2 ring-[#C12223]/30'
              : isHovered
              ? 'p-2.5 translate-x-0 opacity-100 shadow-xl shadow-[#C12223]/40 scale-100'
              : 'p-1.5 translate-x-2 opacity-30 shadow-none scale-90'
          }`}
          title="Click to scan QR Code & download app"
          aria-label="Quick Scan QR Code"
        >
          {/* Peeking QR Icon Badge (Matches the user's reference image) */}
          <div
            className={`rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner shrink-0 transition-all duration-300 ${
              isExpanded ? 'w-9 h-9' : 'w-7 h-7'
            }`}
          >
            <QrCode
              className={`text-white transition-all duration-300 ${
                isExpanded ? 'w-5 h-5 animate-pulse' : 'w-4 h-4'
              }`}
            />
          </div>

          {/* Text Content - Smoothly slides out on hover */}
          <div
            className={`transition-all duration-500 ease-out overflow-hidden text-left whitespace-nowrap ${
              isExpanded ? 'max-w-[200px] opacity-100 pr-1' : 'max-w-0 opacity-0 pr-0'
            }`}
          >
            <span className="text-[9px] uppercase font-black text-amber-300 tracking-wider block">
              QUICK APP DOWNLOAD
            </span>
            <span className="text-sm font-black text-white block leading-tight">
              Scan QR Code
            </span>
            <span className="text-[10px] text-white/80 font-medium block mt-0.5">
              Click to view QR code
            </span>
          </div>

          {/* Chevron Indicator */}
          <div
            className={`transition-all duration-300 ease-out overflow-hidden shrink-0 ${
              isExpanded ? 'max-w-[20px] opacity-100' : 'max-w-0 opacity-0'
            }`}
          >
            <ChevronLeft className="w-4 h-4 text-amber-300" />
          </div>
        </button>
      </div>

      {/* QR Code Modal Overlay */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#450A0A]/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative border border-[#F3DCDD] shadow-2xl text-[#1F1A1C]"
            >
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-[#C12223] transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-[#C12223]/10 text-[#C12223] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#C12223]/20">
                <QrCode className="w-6 h-6" />
              </div>

              <h3 className="font-heading font-black text-2xl text-[#1F1A1C] mb-1">
                Scan to Install App
              </h3>
              <p className="text-xs text-[#555555] mb-6">
                Point your mobile phone camera or Google Lens at this QR code to download Gyanam App instantly.
              </p>

              {/* QR Code Graphics Card */}
              <div className="p-4 bg-[#FFF5F5] rounded-2xl border-2 border-dashed border-[#C12223]/30 inline-block mb-6 relative group">
                <div className="w-48 h-48 bg-white p-3 rounded-xl border border-[#F3DCDD] shadow-md flex items-center justify-center relative">
                  {/* Realistic SVG QR Pattern */}
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-[#1F1A1C]">
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
                  <GyanamLogo className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[#C12223] border-2 border-white flex items-center justify-center text-white font-heading font-black text-xs shadow-md" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#27AE60] bg-[#27AE60]/10 py-2.5 px-4 rounded-xl border border-[#27AE60]/20">
                <CheckCircle2 className="w-4 h-4" /> Compatible with Android & iOS
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
