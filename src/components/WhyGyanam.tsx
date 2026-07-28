import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, X, ShieldCheck, Sparkles, Calculator, ArrowRight, DollarSign, Clock, Trophy } from 'lucide-react';

export const WhyGyanam: React.FC = () => {
  const [prepMonths, setPrepMonths] = useState(8);
  const [hostelNeeded, setHostelNeeded] = useState(true);

  // Financial calculation logic
  const offlineTuition = prepMonths * 4500; // ~36,000
  const hostelRent = hostelNeeded ? prepMonths * 7500 : 0; // ~60,000
  const totalOfflineCost = offlineTuition + hostelRent;
  const gyanamCourseFee = 3499;
  const totalSavings = totalOfflineCost - gyanamCourseFee;

  return (
    <section id="why-gyanam" className="py-20 bg-[#FFF5F5] relative overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 bg-[#C12223]/10 text-[#C12223] text-xs font-extrabold uppercase rounded-full tracking-wider">
            Smart Decision For Aspirants
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#1F1A1C] mt-3 tracking-tight">
            GYANAM Tech vs Traditional Offline Coaching
          </h2>
          <p className="text-sm sm:text-base text-[#555555] mt-3">
            Why over 500,000+ students switch from expensive offline centers to GYANAM.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          
          {/* Traditional Coaching Box */}
          <div className="p-8 bg-white rounded-3xl border border-[#F3DCDD] shadow-md opacity-80">
            <div className="flex items-center justify-between pb-6 border-b border-[#F3DCDD] mb-6">
              <div>
                <span className="text-xs font-bold text-[#888888] uppercase tracking-wider block">Old Method</span>
                <h3 className="font-heading font-extrabold text-2xl text-[#555555]">
                  Traditional Offline Coaching
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#888888]">
                <X className="w-6 h-6" />
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-[#555555]">
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>Expensive fees (₹35,000 to ₹80,000/yr) + PG/Hostel rent expense</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>Missed a class? No recording backup available.</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>Crowded 200+ student batch with zero individual attention</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>Paper-based outdated tests with no speed/accuracy analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>2-3 hours wasted daily in traffic commute to coaching centers</span>
              </li>
            </ul>
          </div>

          {/* GYANAM Tech Platform Box */}
          <div className="p-8 bg-gradient-to-br from-[#8C1316] via-[#A6181B] to-[#B91C1C] text-white rounded-3xl border-2 border-red-400 shadow-2xl shadow-[#EF4444]/20 relative">
            <div className="absolute -top-3 right-6 px-4 py-1 bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white font-extrabold text-xs rounded-full uppercase tracking-wider shadow-md">
              ★ 10x Smarter Choice
            </div>

            <div className="flex items-center justify-between pb-6 border-b border-white/20 mb-6">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">GYANAM Technology</span>
                <h3 className="font-heading font-extrabold text-2xl text-white">
                  GYANAM Digital Learning Hub
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#27AE60]/20 flex items-center justify-center text-[#27AE60]">
                <Check className="w-6 h-6" />
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#27AE60] shrink-0 mt-0.5" />
                <span>Affordable ₹1,999 – ₹3,499 full batch fee. Zero hostel/travel cost.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#27AE60] shrink-0 mt-0.5" />
                <span>Unlimited HD recorded backup with 0.5x – 2x speed controls.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#27AE60] shrink-0 mt-0.5" />
                <span>1-on-1 Dedicated Mentor assigned for weekly progress calls.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#27AE60] shrink-0 mt-0.5" />
                <span>Exact TCS Pattern Mock Test Engine with AIR percentile ranking.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#27AE60] shrink-0 mt-0.5" />
                <span>Study comfortably from home. Save 3 hours daily for self-study.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Interactive Savings Calculator */}
        <div className="p-8 bg-white rounded-3xl border border-[#F3DCDD] shadow-xl max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#C12223]/10 text-[#C12223] flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-[#1F1A1C]">
                Calculate Your Preparation Savings with GYANAM
              </h3>
              <p className="text-xs text-[#555555]">
                See how much money & commute hours you save by choosing GYANAM.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center pt-4 border-t border-[#F3DCDD]">
            {/* Input Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-[#1F1A1C] mb-2">
                  <span>Preparation Duration</span>
                  <span className="text-[#C12223]">{prepMonths} Months</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={12}
                  value={prepMonths}
                  onChange={e => setPrepMonths(Number(e.target.value))}
                  className="w-full accent-[#C12223] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#FFF5F5] rounded-xl border border-[#F3DCDD]">
                <span className="text-xs font-bold text-[#1F1A1C]">Requires Relocation / PG Hostel?</span>
                <button
                  type="button"
                  onClick={() => setHostelNeeded(!hostelNeeded)}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition cursor-pointer ${
                    hostelNeeded ? 'bg-[#C12223] text-white' : 'bg-slate-200 text-[#555555]'
                  }`}
                >
                  {hostelNeeded ? 'Yes (Relocating)' : 'No (Home Town)'}
                </button>
              </div>
            </div>

            {/* Savings Result Card */}
            <div className="p-6 bg-gradient-to-br from-[#FFF5F5] to-white rounded-2xl border border-[#C12223]/30 text-center space-y-3">
              <span className="text-xs font-bold text-[#555555] uppercase tracking-wider block">
                Estimated Money Saved
              </span>
              <div className="font-heading font-black text-4xl sm:text-5xl text-[#27AE60]">
                ₹{totalSavings.toLocaleString()}
              </div>
              <p className="text-xs text-[#555555]">
                Plus save over <strong className="text-[#1F1A1C]">{prepMonths * 60} hours</strong> of travel commute!
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
