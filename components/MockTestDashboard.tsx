'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Clock, Trophy, BarChart3, CheckCircle2, ShieldAlert, ArrowRight, RefreshCw, Flame, Award } from 'lucide-react';

export const MockTestDashboard: React.FC = () => {
  const [testActive, setTestActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIdx: number]: number }>({});
  const [testSubmitted, setTestSubmitted] = useState(false);

  const sampleQuestions = [
    {
      q: 'Which term is used to describe the speed of a computer processor?',
      opts: ['Gigahertz (GHz)', 'Megabytes (MB)', 'Bandwidth (Mbps)', 'Resolution (DPI)'],
      ans: 0,
      subject: 'Computer Knowledge - SSC & ADRE'
    },
    {
      q: 'A train 150m long crosses a telegraph pole in 10 seconds. What is the speed of the train in km/h?',
      opts: ['45 km/h', '54 km/h', '60 km/h', '72 km/h'],
      ans: 1,
      subject: 'Quantitative Aptitude'
    },
    {
      q: 'Statements: All cats are dogs. All dogs are birds. Conclusion I: All cats are birds.',
      opts: ['Only Conclusion I follows', 'Only Conclusion II follows', 'Neither follows', 'Both follow'],
      ans: 0,
      subject: 'Reasoning Ability - IBPS & SSC'
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testActive && !testSubmitted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !testSubmitted) {
      setTestSubmitted(true);
    }
    return () => clearInterval(timer);
  }, [testActive, testSubmitted, timeRemaining]);

  const handleStartTest = () => {
    setTestActive(true);
    setTestSubmitted(false);
    setTimeRemaining(120);
    setSelectedAnswers({});
    setCurrentQ(0);
  };

  const calculateScore = () => {
    let correct = 0;
    sampleQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.ans) correct += 1;
    });
    return correct;
  };

  return (
    <section id="mock-tests" className="py-20 bg-white border-y border-[#F3DCDD]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 bg-[#C12223]/10 text-[#C12223] text-xs font-extrabold uppercase rounded-full tracking-wider">
            TCS Exam Software Clone
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#1F1A1C] mt-3 tracking-tight">
            Unlimited Mock Tests & Instant AIR Rank
          </h2>
          <p className="text-sm sm:text-base text-[#555555] mt-3">
            Experience the exact computer-based test interface before your real exam day.
          </p>
        </div>

        {/* Live Simulator Window Box - Rich Red Background */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#8C1316] via-[#A6181B] to-[#B91C1C] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-red-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#EF4444]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Simulator Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-red-400/30 gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EF4444] text-white flex items-center justify-center font-bold">
                TCS
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">
                  Gyanm All India Mock Test Engine
                </h3>
                <p className="text-xs text-red-100">
                  SSC CGL & IBPS PO Live Simulation Mode
                </p>
              </div>
            </div>

            {testActive && !testSubmitted && (
              <div className="flex items-center gap-3 bg-[#8C1316]/80 px-4 py-2 rounded-xl border border-red-400/30">
                <Clock className="w-4 h-4 text-amber-300 animate-spin" />
                <span className="font-mono font-bold text-sm text-amber-300">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>

          {/* Simulator Main Display */}
          <div className="py-6 relative z-10">
            {!testActive ? (
              <div className="py-12 text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 bg-white/15 text-white rounded-2xl flex items-center justify-center mx-auto border border-white/20 shadow-lg">
                  <FileText className="w-8 h-8 text-amber-300" />
                </div>
                <h4 className="font-heading font-extrabold text-2xl text-white">
                  Try a 3-Question Mini Live Mock Test
                </h4>
                <p className="text-xs text-red-100/90">
                  Test your real speed & accuracy right now. Get instant score, percentile rank and detailed solution analysis.
                </p>
                <button
                  onClick={handleStartTest}
                  className="px-8 py-4 bg-white text-[#8C1316] hover:bg-red-50 font-black text-sm rounded-2xl shadow-xl transition transform hover:scale-105 cursor-pointer"
                >
                  Start Live Mini Mock Test Now
                </button>
              </div>
            ) : testSubmitted ? (
              <div className="py-6 space-y-6">
                <div className="p-6 sm:p-8 bg-white text-[#1F1A1C] rounded-2xl border border-red-100 text-center space-y-4 shadow-2xl">
                  <div className="w-16 h-16 bg-[#FFF5F5] text-[#C12223] rounded-2xl flex items-center justify-center mx-auto border border-[#F3DCDD]">
                    <Trophy className="w-8 h-8 text-amber-500" />
                  </div>
                  <h4 className="font-heading font-black text-2xl text-[#1F1A1C]">
                    Mock Test Analysis Report
                  </h4>
                  <div className="grid grid-cols-3 gap-4 pt-2 max-w-md mx-auto">
                    <div className="p-3 bg-[#FFF5F5] rounded-xl border border-[#F3DCDD]">
                      <span className="text-[10px] text-[#666666] uppercase font-bold block">Score</span>
                      <span className="font-heading font-black text-2xl text-[#27AE60]">
                        {calculateScore()} / 3
                      </span>
                    </div>
                    <div className="p-3 bg-[#FFF5F5] rounded-xl border border-[#F3DCDD]">
                      <span className="text-[10px] text-[#666666] uppercase font-bold block">Accuracy</span>
                      <span className="font-heading font-black text-2xl text-amber-500">
                        {Math.round((calculateScore() / 3) * 100)}%
                      </span>
                    </div>
                    <div className="p-3 bg-[#FFF5F5] rounded-xl border border-[#F3DCDD]">
                      <span className="text-[10px] text-[#666666] uppercase font-bold block">Percentile</span>
                      <span className="font-heading font-black text-2xl text-[#C12223]">
                        98.6%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {sampleQuestions.map((sq, i) => (
                    <div key={i} className="p-4 bg-white rounded-xl border border-red-100 text-xs shadow-md">
                      <p className="font-bold text-[#1F1A1C] mb-1">Q{i + 1}. {sq.q}</p>
                      <p className="text-[#555555]">
                        Correct Answer: <strong className="text-[#27AE60] font-bold">{sq.opts[sq.ans]}</strong>
                      </p>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={handleStartTest}
                    className="px-6 py-3 bg-white text-[#8C1316] hover:bg-red-50 rounded-xl text-xs font-extrabold shadow-lg transition cursor-pointer"
                  >
                    Retake Mini Mock
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between text-xs text-red-100 font-semibold">
                  <span>Question {currentQ + 1} of 3</span>
                  <span className="text-amber-300 font-extrabold bg-white/10 px-3 py-1 rounded-full border border-white/20">{sampleQuestions[currentQ].subject}</span>
                </div>

                {/* White / Light Question Card */}
                <div className="p-6 sm:p-8 bg-white rounded-2xl shadow-2xl text-[#1F1A1C]">
                  <p className="font-heading font-black text-base sm:text-lg text-[#1F1A1C] mb-5 leading-snug">
                    {sampleQuestions[currentQ].q}
                  </p>

                  <div className="space-y-2.5">
                    {sampleQuestions[currentQ].opts.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[currentQ] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQ]: oIdx })}
                          className={`w-full p-3.5 rounded-xl text-xs font-bold text-left transition border cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white border-transparent shadow-md'
                              : 'bg-gray-50 text-[#1F1A1C] border-gray-200 hover:border-[#C12223] hover:bg-[#FFF5F5] hover:text-[#C12223]'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Test Navigation Bar */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    disabled={currentQ === 0}
                    onClick={() => setCurrentQ(prev => prev - 1)}
                    className="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/25 rounded-xl text-xs font-extrabold disabled:opacity-40 cursor-pointer backdrop-blur-md"
                  >
                    Previous
                  </button>

                  {currentQ < 2 ? (
                    <button
                      onClick={() => setCurrentQ(prev => prev + 1)}
                      className="px-7 py-2.5 bg-white text-[#8C1316] hover:bg-red-50 rounded-xl text-xs font-extrabold shadow-lg transition cursor-pointer"
                    >
                      Save & Next
                    </button>
                  ) : (
                    <button
                      onClick={() => setTestSubmitted(true)}
                      className="px-7 py-2.5 bg-white text-[#C12223] hover:bg-red-50 rounded-xl text-xs font-black shadow-xl border border-white/50 transition cursor-pointer"
                    >
                      Submit Test
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
