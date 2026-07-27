import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, ShieldCheck, Flame, Sparkles, CheckCircle2 } from 'lucide-react';

interface FinalCTAProps {
  onStartLearning: () => void;
  onOpenMentorship: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onStartLearning, onOpenMentorship }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-[#3B0A0C] via-[#8C1316] to-[#C12223] text-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
        
        {/* Urgent Offer Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black text-white border border-white/30">
          <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
          <span>EARLY BIRD BATCH OFFER CLOSING SOON</span>
        </div>

        {/* Headline */}
        <h2 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Ready to Crack Your Dream Government Job in 2026?
        </h2>

        <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto font-medium">
          Join India's most trusted EdTech platform today. Get instant access to live classes, TCS mock tests & 1-on-1 mentorship.
        </p>

        {/* Countdown Box */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
            Special Fee Discount Ends In:
          </span>
          <div className="flex items-center gap-3 font-mono font-black text-2xl text-white">
            <div className="bg-black/30 px-3 py-1 rounded-xl">
              {timeLeft.hours.toString().padStart(2, '0')}<span className="text-[10px] block font-sans text-slate-300">HRS</span>
            </div>
            <span>:</span>
            <div className="bg-black/30 px-3 py-1 rounded-xl">
              {timeLeft.minutes.toString().padStart(2, '0')}<span className="text-[10px] block font-sans text-slate-300">MIN</span>
            </div>
            <span>:</span>
            <div className="bg-black/30 px-3 py-1 rounded-xl">
              {timeLeft.seconds.toString().padStart(2, '0')}<span className="text-[10px] block font-sans text-slate-300">SEC</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onStartLearning}
            className="w-full sm:w-auto px-9 py-4 bg-white text-[#C12223] font-black rounded-2xl text-base shadow-2xl hover:bg-[#FFF8F6] hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2"
          >
            Start Free Trial Now <ArrowRight className="w-5 h-5 text-[#C12223]" />
          </button>

          <button
            onClick={onOpenMentorship}
            className="w-full sm:w-auto px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-extrabold rounded-2xl text-base border border-white/30 transition flex items-center justify-center gap-2"
          >
            Talk to Senior Mentor
          </button>
        </div>

        {/* Bottom Trust Guarantee */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-white/80 font-bold">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-300" /> 7-Day Risk Free Moneyback</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Instant Batch Access</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Hardcopy Books Included</span>
        </div>

      </div>
    </section>
  );
};
