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
    <section id="mock-tests" className="py-20 bg-white border-y border-[#ECECEC]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 bg-[#C12223]/10 text-[#C12223] text-xs font-extrabold uppercase rounded-full tracking-wider">
            TCS Exam Software Clone
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#111111] mt-3 tracking-tight">
            Unlimited Mock Tests & Instant AIR Rank
          </h2>
          <p className="text-sm sm:text-base text-[#555555] mt-3">
            Experience the exact computer-based test interface before your real exam day.
          </p>
        </div>

        {/* Live Simulator Window Box */}
        <div className="max-w-4xl mx-auto bg-[#111111] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ED7026]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Simulator Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ED7026] text-white flex items-center justify-center font-bold">
                TCS
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">
                  Gyanam All India Mock Test Engine
                </h3>
                <p className="text-xs text-slate-400">
                  SSC CGL & IBPS PO Live Simulation Mode
                </p>
              </div>
            </div>

            {testActive && !testSubmitted && (
              <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="font-mono font-bold text-sm text-amber-400">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>

          {/* Simulator Main Display */}
          <div className="py-6 relative z-10">
            {!testActive ? (
              <div className="py-12 text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 bg-[#ED7026]/20 text-[#ED7026] rounded-2xl flex items-center justify-center mx-auto border border-[#ED7026]/30">
                  <FileText className="w-8 h-8" />
                </div>
                <h4 className="font-heading font-extrabold text-2xl text-white">
                  Try a 3-Question Mini Live Mock Test
                </h4>
                <p className="text-xs text-slate-400">
                  Test your real speed & accuracy right now. Get instant score, percentile rank and detailed solution analysis.
                </p>
                <button
                  onClick={handleStartTest}
                  className="px-8 py-4 bg-gradient-to-r from-[#ED7026] to-[#C12223] text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-[#ED7026]/30 hover:scale-105 transition"
                >
                  Start Live Mini Mock Test Now
                </button>
              </div>
            ) : testSubmitted ? (
              <div className="py-8 space-y-6">
                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-3">
                  <Trophy className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
                  <h4 className="font-heading font-black text-2xl text-white">
                    Mock Test Analysis Report
                  </h4>
                  <div className="flex justify-center gap-6 pt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Score</span>
                      <span className="font-heading font-black text-2xl text-[#27AE60]">
                        {calculateScore()} / 3
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Accuracy</span>
                      <span className="font-heading font-black text-2xl text-amber-400">
                        {Math.round((calculateScore() / 3) * 100)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Percentile</span>
                      <span className="font-heading font-black text-2xl text-[#ED7026]">
                        98.6%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {sampleQuestions.map((sq, i) => (
                    <div key={i} className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                      <p className="font-bold text-slate-200 mb-1">Q{i + 1}. {sq.q}</p>
                      <p className="text-slate-400">
                        Correct Answer: <strong className="text-[#27AE60]">{sq.opts[sq.ans]}</strong>
                      </p>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <button
                    onClick={handleStartTest}
                    className="px-6 py-2.5 bg-slate-800 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700"
                  >
                    Retake Mini Mock
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Question {currentQ + 1} of 3</span>
                  <span className="text-[#ED7026] font-bold">{sampleQuestions[currentQ].subject}</span>
                </div>

                <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                  <p className="font-heading font-bold text-base text-white mb-4">
                    {sampleQuestions[currentQ].q}
                  </p>

                  <div className="space-y-2">
                    {sampleQuestions[currentQ].opts.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[currentQ] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQ]: oIdx })}
                          className={`w-full p-3 rounded-xl text-xs font-bold text-left transition border ${
                            isSelected
                              ? 'bg-[#ED7026] text-white border-[#ED7026]'
                              : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
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
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {currentQ < 2 ? (
                    <button
                      onClick={() => setCurrentQ(prev => prev + 1)}
                      className="px-6 py-2 bg-[#ED7026] text-white rounded-xl text-xs font-bold"
                    >
                      Save & Next
                    </button>
                  ) : (
                    <button
                      onClick={() => setTestSubmitted(true)}
                      className="px-6 py-2 bg-[#27AE60] text-white rounded-xl text-xs font-bold"
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
