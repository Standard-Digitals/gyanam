'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, XCircle, Clock, Award, Zap, HelpCircle, 
  RotateCcw, Trophy, Share2, Flame, ChevronRight, Filter, 
  BookOpen, Sparkles, AlertCircle, ArrowRight, Target,
  Check, X, ChevronLeft, BarChart3, Users, Play, Star, Calendar
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic?: string;
}

interface Quiz {
  id: string;
  title: string;
  subject: string;
  examCategory: string;
  date: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  totalMarks: number;
  attemptsCount: string;
  avgScore: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  questions: Question[];
}

export default function DailyQuizPage() {
  const router = useRouter();

  // State
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(600); // 10 mins in seconds
  const [userStreak, setUserStreak] = useState<number>(5);

  // Mock Quizzes Data
  const quizzesList: Quiz[] = [
    {
      id: "qz-ca-01",
      title: "Daily Current Affairs Quiz - August 1, 2026",
      subject: "Current Affairs",
      examCategory: "All Govt Exams",
      date: "August 01, 2026",
      totalQuestions: 5,
      timeLimitMinutes: 5,
      totalMarks: 5,
      attemptsCount: "14,820+",
      avgScore: "4.2 / 5",
      difficulty: "Moderate",
      questions: [
        {
          id: 1,
          question: "Which Indian public sector bank recently launched the 'AI-Powered Micro Digital Kisan Credit Card' for small farmers?",
          options: [
            "State Bank of India (SBI)",
            "Punjab National Bank (PNB)",
            "Bank of Baroda (BoB)",
            "Canara Bank"
          ],
          correctAnswer: 1,
          explanation: "Punjab National Bank (PNB) launched the AI-backed Micro Digital KCC to provide instant credit up to ₹1.6 Lakhs without branch visits."
        },
        {
          id: 2,
          question: "What is the primary theme of the 2026 World Economic Forum (WEF) Special Session on Sustainable Digital Infrastructure?",
          options: [
            "Resilient Growth in AI Age",
            "Green Energy for Cloud Computing",
            "Global Digital Public Infrastructure",
            "Empowering Rural Connectivity"
          ],
          correctAnswer: 2,
          explanation: "The theme focuses on scaling 'Global Digital Public Infrastructure' using open-source frameworks modeled after India's UPI."
        },
        {
          id: 3,
          question: "Which state government recently passed the 'Unified Direct Recruitment Commission Bill 2026' for Grade 3 & 4 vacancies?",
          options: [
            "Punjab",
            "Assam",
            "Haryana",
            "Odisha"
          ],
          correctAnswer: 1,
          explanation: "Assam SLRC expanded the ADRE framework with new digitized examination protocols under the 2026 unified bill."
        },
        {
          id: 4,
          question: "Who was recently appointed as the Chief Economist of the Asian Development Bank (ADB)?",
          options: [
            "Dr. Indermit Gill",
            "Dr. Soumya Kanti Ghosh",
            "Dr. Albert Park",
            "Dr. Raghuram Rajan"
          ],
          correctAnswer: 2,
          explanation: "Dr. Albert Park leads ADB's economic research division focusing on post-transition fiscal policies in South Asia."
        },
        {
          id: 5,
          question: "Which space agency successfully placed the 'EarthCARE' environmental observation satellite into Sun-synchronous orbit?",
          options: [
            "ISRO",
            "NASA & ESA Joint Mission",
            "JAXA & ESA Joint Mission",
            "CNES"
          ],
          correctAnswer: 2,
          explanation: "EarthCARE (Earth Cloud, Aerosol and Radiation Explorer) is a joint satellite mission by ESA (Europe) and JAXA (Japan)."
        }
      ]
    },
    {
      id: "qz-quant-02",
      title: "Speed Math & DI Booster - 10-Minute Drill",
      subject: "Quantitative Aptitude",
      examCategory: "SSC CGL & Bank PO",
      date: "August 01, 2026",
      totalQuestions: 5,
      timeLimitMinutes: 5,
      totalMarks: 5,
      attemptsCount: "22,400+",
      avgScore: "3.8 / 5",
      difficulty: "Hard",
      questions: [
        {
          id: 1,
          question: "What is the value of: (32² - 18²) ÷ 14 + √(1521)?",
          options: [
            "89",
            "79",
            "99",
            "109"
          ],
          correctAnswer: 0,
          explanation: "Using (a² - b²) = (a-b)(a+b): (32-18)(32+18) = 14 × 50. So 14 × 50 ÷ 14 = 50. √(1521) = 39. Result = 50 + 39 = 89."
        },
        {
          id: 2,
          question: "A train running at 72 km/h crosses a telegraph post in 12 seconds. How long will it take to cross a 260m long platform?",
          options: [
            "20 seconds",
            "25 seconds",
            "22 seconds",
            "28 seconds"
          ],
          correctAnswer: 1,
          explanation: "Speed in m/s = 72 × (5/18) = 20 m/s. Length of train = 20 × 12 = 240m. Total distance for platform = 240 + 260 = 500m. Time = 500 / 20 = 25 seconds."
        },
        {
          id: 3,
          question: "If A can do a work in 15 days and B in 20 days, and they work together for 4 days, what fraction of work is left?",
          options: [
            "7/15",
            "8/15",
            "1/3",
            "2/5"
          ],
          correctAnswer: 1,
          explanation: "1 day work = (1/15) + (1/20) = 7/60. 4 days work = 4 × (7/60) = 7/15. Fraction left = 1 - (7/15) = 8/15."
        },
        {
          id: 4,
          question: "Find the compound interest on ₹12,500 for 2 years at 12% per annum compounded annually.",
          options: [
            "₹3,180",
            "₹3,120",
            "₹3,000",
            "₹3,250"
          ],
          correctAnswer: 0,
          explanation: "CI = P[(1 + R/100)² - 1] = 12500[(1.12)² - 1] = 12500 × 0.2544 = ₹3,180."
        },
        {
          id: 5,
          question: "If 15% of A is equal to 20% of B, then A : B is equal to:",
          options: [
            "3 : 4",
            "4 : 3",
            "5 : 4",
            "2 : 3"
          ],
          correctAnswer: 1,
          explanation: "15/100 A = 20/100 B => 3A = 4B => A/B = 4/3 => A:B = 4:3."
        }
      ]
    },
    {
      id: "qz-reas-03",
      title: "SSC CGL TCS Pattern Syllogism & Coding Challenge",
      subject: "Reasoning Ability",
      examCategory: "SSC CGL / CHSL",
      date: "August 01, 2026",
      totalQuestions: 5,
      timeLimitMinutes: 5,
      totalMarks: 5,
      attemptsCount: "18,900+",
      avgScore: "4.1 / 5",
      difficulty: "Moderate",
      questions: [
        {
          id: 1,
          question: "Statements: All Chairs are Tables. Some Tables are Desks. No Desk is a Pen. Conclusions: I. Some Chairs are Desks. II. No Table is a Pen.",
          options: [
            "Only conclusion I follows",
            "Only conclusion II follows",
            "Neither conclusion I nor II follows",
            "Both conclusions follow"
          ],
          correctAnswer: 2,
          explanation: "Chairs and Desks have no definite relation (can be or cannot be). Tables and Pens can overlap without violating No Desk is Pen. Neither follows definitely."
        },
        {
          id: 2,
          question: "In a certain code language, 'STATION' is written as 'TUDUJPO'. How will 'JOURNEY' be written in that code?",
          options: [
            "KPVSODZ",
            "KPVTNFZ",
            "KPVUSFZ",
            "LQVTNFZ"
          ],
          correctAnswer: 1,
          explanation: "Pattern: Each letter is shifted +1 in alphabetical order (S->T, T->U, A->D (+3 for vowel? No, +1 to each letter: J+1=K, O+1=P, U+1=V, R+1=S, N+1=O, E+1=F, Y+1=Z => KPVSODZ / KPVTNFZ depending on standard +1)."
        },
        {
          id: 3,
          question: "Pointing to a photograph, Rohit said, 'She is the daughter of my grandfather's only son.' How is the girl related to Rohit?",
          options: [
            "Sister",
            "Cousin",
            "Mother",
            "Aunt"
          ],
          correctAnswer: 0,
          explanation: "Rohit's grandfather's only son = Rohit's father. Daughter of Rohit's father = Rohit's sister."
        },
        {
          id: 4,
          question: "Select the missing number in the series: 7, 14, 25, 40, 59, ?",
          options: [
            "82",
            "84",
            "80",
            "86"
          ],
          correctAnswer: 0,
          explanation: "Differences between consecutive numbers: +7, +11, +15, +19... (arithmetic progression with common difference +4). Next difference = +23. So 59 + 23 = 82."
        },
        {
          id: 5,
          question: "Four words are given below. Which one is odd one out?",
          options: [
            "Guwahati",
            "Dispur",
            "Itanagar",
            "Imphal"
          ],
          correctAnswer: 0,
          explanation: "Dispur (Assam), Itanagar (Arunachal Pradesh), and Imphal (Manipur) are official capital cities. Guwahati is a major city in Assam, but the capital is Dispur."
        }
      ]
    },
    {
      id: "qz-bank-04",
      title: "IBPS Bank PO Financial & Banking Awareness Quiz",
      subject: "Banking Awareness",
      examCategory: "Banking (IBPS / SBI)",
      date: "July 31, 2026",
      totalQuestions: 5,
      timeLimitMinutes: 5,
      totalMarks: 5,
      attemptsCount: "11,200+",
      avgScore: "3.5 / 5",
      difficulty: "Hard",
      questions: [
        {
          id: 1,
          question: "What is the minimum paid-up capital required to establish a Small Finance Bank (SFB) under RBI guidelines?",
          options: [
            "₹100 Crore",
            "₹200 Crore",
            "₹300 Crore",
            "₹500 Crore"
          ],
          correctAnswer: 1,
          explanation: "RBI increased the minimum paid-up voting equity capital for SFBs from ₹100 crore to ₹200 crore."
        },
        {
          id: 2,
          question: "Which among the following rates is NOT decided directly by the RBI Monetary Policy Committee (MPC)?",
          options: [
            "Repo Rate",
            "Marginal Standing Facility (MSF)",
            "Prime Lending Rate (PLR)",
            "Reverse Repo Rate"
          ],
          correctAnswer: 2,
          explanation: "Prime Lending Rate (PLR) or Base Rate is determined independently by commercial banks based on their cost of funds, not directly by RBI MPC."
        },
        {
          id: 3,
          question: "Under the Ombudsman Scheme for Digital Transactions, within how many days must a customer report unauthorized transactions to get full zero-liability protection?",
          options: [
            "Within 3 working days",
            "Within 7 working days",
            "Within 10 working days",
            "Within 30 working days"
          ],
          correctAnswer: 0,
          explanation: "If reported within 3 working days of receiving the notification from the bank, customer liability is zero."
        },
        {
          id: 4,
          question: "What does 'CTS' stand for in banking clearing operations?",
          options: [
            "Cheque Truncation System",
            "Central Transaction Settlement",
            "Core Transfer Service",
            "Credit Transfer System"
          ],
          correctAnswer: 0,
          explanation: "Cheque Truncation System (CTS) is an online image-based cheque clearing system introduced by NPCI and RBI."
        },
        {
          id: 5,
          question: "Which priority sector lending (PSL) sub-target percentage applies to Agriculture for domestic commercial banks?",
          options: [
            "18% of ANBC",
            "10% of ANBC",
            "7.5% of ANBC",
            "12% of ANBC"
          ],
          correctAnswer: 0,
          explanation: "18% of Adjusted Net Bank Credit (ANBC) or Credit Equivalent Amount of Off-Balance Sheet Exposure is earmarked for Agriculture."
        }
      ]
    }
  ];

  // Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeQuiz && !quizSubmitted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleQuizSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeQuiz, quizSubmitted, timeRemaining]);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setMarkedForReview({});
    setQuizSubmitted(false);
    setTimeRemaining(quiz.timeLimitMinutes * 60);
  };

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleToggleReview = (questionId: number) => {
    setMarkedForReview(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  // Calculate Scorecard
  const scoreResults = useMemo(() => {
    if (!activeQuiz) return { correctCount: 0, incorrectCount: 0, unattemptedCount: 0, totalMarks: 0, obtainedMarks: 0, accuracy: 0 };

    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    activeQuiz.questions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected === undefined) {
        unattempted++;
      } else if (selected === q.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const marks = correct * 1 - incorrect * 0.25;
    const accuracy = (correct + incorrect) > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;

    return {
      correctCount: correct,
      incorrectCount: incorrect,
      unattemptedCount: unattempted,
      totalMarks: activeQuiz.totalQuestions * 1,
      obtainedMarks: Math.max(0, marks),
      accuracy
    };
  }, [activeQuiz, userAnswers]);

  // Filtered Quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzesList.filter((q) => {
      const matchSubject = selectedSubject === 'all' || q.subject.toLowerCase() === selectedSubject.toLowerCase();
      const matchExam = selectedExam === 'all' || q.examCategory.toLowerCase().includes(selectedExam.toLowerCase());
      return matchSubject && matchExam;
    });
  }, [selectedSubject, selectedExam]);

  // Format Time Helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#1F1A1C] pb-20">
      
      {/* If Quiz is Active (Full-Screen Test Player) */}
      {activeQuiz ? (
        <div className="max-w-5xl mx-auto px-4 py-6">
          
          {/* TEST PLAYER HEADER */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-red-100 shadow-xl flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="px-2.5 py-0.5 bg-red-50 text-[#C12223] text-[10px] font-black uppercase rounded border border-red-200">
                {activeQuiz.examCategory}
              </span>
              <h2 className="font-heading font-black text-lg sm:text-xl text-[#1F1A1C] mt-1">
                {activeQuiz.title}
              </h2>
            </div>

            {/* Timer & Exit */}
            <div className="flex items-center gap-4">
              {!quizSubmitted && (
                <div className="flex items-center gap-2 bg-[#8C1316] text-white px-4 py-2 rounded-2xl shadow-md">
                  <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span className="font-mono font-bold text-sm">{formatTime(timeRemaining)}</span>
                </div>
              )}

              <button
                onClick={() => setActiveQuiz(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Exit Test
              </button>
            </div>
          </div>

          {/* ACTIVE QUIZ MAIN INTERFACE */}
          {!quizSubmitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Question Player Card */}
              <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-red-100 shadow-xl space-y-6">
                
                {/* Question Info Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                    Question {currentQuestionIndex + 1} of {activeQuiz.totalQuestions}
                  </span>
                  
                  <button
                    onClick={() => handleToggleReview(activeQuiz.questions[currentQuestionIndex].id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      markedForReview[activeQuiz.questions[currentQuestionIndex].id]
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>{markedForReview[activeQuiz.questions[currentQuestionIndex].id] ? 'Marked for Review' : 'Mark for Review'}</span>
                  </button>
                </div>

                {/* Question Text */}
                <div className="space-y-4">
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#1F1A1C] leading-snug">
                    {activeQuiz.questions[currentQuestionIndex].question}
                  </h3>

                  {/* Options List */}
                  <div className="space-y-3 pt-2">
                    {activeQuiz.questions[currentQuestionIndex].options.map((option, idx) => {
                      const isSelected = userAnswers[activeQuiz.questions[currentQuestionIndex].id] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(activeQuiz.questions[currentQuestionIndex].id, idx)}
                          className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[#FFF5F5] border-[#C12223] text-[#8C1316] font-bold shadow-sm'
                              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isSelected ? 'bg-[#C12223] text-white' : 'bg-white text-gray-500 border border-gray-300'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{option}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-[#C12223]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition disabled:opacity-30 cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {currentQuestionIndex < activeQuiz.totalQuestions - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="px-6 py-2.5 bg-[#C12223] hover:bg-[#A6181B] text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1"
                    >
                      <span>Save & Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleQuizSubmit}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1"
                    >
                      <span>Submit Final Test</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>

              {/* Question Palette Sidebar */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-red-100 shadow-xl space-y-6">
                <h4 className="font-heading font-black text-sm text-[#1F1A1C] uppercase tracking-wider border-b border-gray-100 pb-3">
                  Question Palette
                </h4>

                <div className="grid grid-cols-5 gap-2.5">
                  {activeQuiz.questions.map((q, idx) => {
                    const isAnswered = userAnswers[q.id] !== undefined;
                    const isMarked = markedForReview[q.id];
                    const isCurrent = currentQuestionIndex === idx;

                    let bgClass = "bg-gray-100 text-gray-600 border-gray-200";
                    if (isCurrent) bgClass = "ring-2 ring-[#C12223] bg-[#FFF5F5] font-black text-[#8C1316]";
                    else if (isMarked) bgClass = "bg-amber-100 text-amber-900 border-amber-300 font-bold";
                    else if (isAnswered) bgClass = "bg-emerald-600 text-white font-bold";

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`w-10 h-10 rounded-xl text-xs flex items-center justify-center border transition cursor-pointer ${bgClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="space-y-2 text-[11px] font-semibold text-gray-600 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-md bg-emerald-600" />
                    <span>Answered ({Object.keys(userAnswers).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-md bg-amber-100 border border-amber-300" />
                    <span>Marked for Review ({Object.values(markedForReview).filter(Boolean).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-md bg-gray-100 border border-gray-200" />
                    <span>Unanswered ({activeQuiz.totalQuestions - Object.keys(userAnswers).length})</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleQuizSubmit}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
                  >
                    Submit Test Now
                  </button>
                </div>
              </div>

            </div>
          ) : (
            
            /* RESULT SCORECARD & DETAILED SOLUTIONS */
            <div className="space-y-8">
              
              {/* Score summary banner */}
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8 rounded-3xl shadow-2xl space-y-6 border border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <span className="px-3 py-1 bg-amber-400 text-red-950 font-black text-[10px] uppercase rounded-full">
                      PERFORMANCE ANALYTICS
                    </span>
                    <h2 className="font-heading font-black text-2xl text-white mt-1">
                      Quiz Scorecard & Accuracy Report
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setUserAnswers({});
                      setQuizSubmitted(false);
                      setTimeRemaining(activeQuiz.timeLimitMinutes * 60);
                      setCurrentQuestionIndex(0);
                    }}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-300" />
                    <span>Re-Attempt Quiz</span>
                  </button>
                </div>

                {/* Numbers Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                    <div className="text-2xl sm:text-3xl font-black text-amber-300">
                      {scoreResults.obtainedMarks} / {scoreResults.totalMarks}
                    </div>
                    <div className="text-[10px] font-bold text-gray-300 uppercase mt-0.5">Total Score</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                      {scoreResults.accuracy}%
                    </div>
                    <div className="text-[10px] font-bold text-gray-300 uppercase mt-0.5">Accuracy Rate</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {scoreResults.correctCount} / {activeQuiz.totalQuestions}
                    </div>
                    <div className="text-[10px] font-bold text-gray-300 uppercase mt-0.5">Correct Qs</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                    <div className="text-2xl sm:text-3xl font-black text-red-400">
                      {scoreResults.incorrectCount}
                    </div>
                    <div className="text-[10px] font-bold text-gray-300 uppercase mt-0.5">Wrong Qs (-0.25)</div>
                  </div>
                </div>
              </div>

              {/* DETAILED SOLUTIONS & EXPLANATIONS */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-red-100 shadow-xl space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="font-heading font-black text-xl text-[#1F1A1C]">
                    Detailed Question Solutions & Explanations
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Review correct answers, formula shortcuts, and conceptual notes for every question.
                  </p>
                </div>

                <div className="space-y-6">
                  {activeQuiz.questions.map((q, qIdx) => {
                    const userSelected = userAnswers[q.id];
                    const isCorrect = userSelected === q.correctAnswer;
                    const isUnattempted = userSelected === undefined;

                    return (
                      <div 
                        key={q.id}
                        className={`p-5 rounded-2xl border space-y-4 ${
                          isCorrect 
                            ? 'bg-emerald-50/50 border-emerald-200' 
                            : isUnattempted 
                            ? 'bg-gray-50 border-gray-200' 
                            : 'bg-red-50/50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-heading font-extrabold text-sm sm:text-base text-[#1F1A1C]">
                            Q{qIdx + 1}. {q.question}
                          </h4>

                          <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-md shrink-0 ${
                            isCorrect 
                              ? 'bg-emerald-600 text-white' 
                              : isUnattempted 
                              ? 'bg-gray-300 text-gray-800' 
                              : 'bg-red-600 text-white'
                          }`}>
                            {isCorrect ? 'Correct (+1.0)' : isUnattempted ? 'Unattempted' : 'Incorrect (-0.25)'}
                          </span>
                        </div>

                        {/* Options breakdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, optIdx) => {
                            const isThisCorrect = optIdx === q.correctAnswer;
                            const isThisUserSelection = userSelected === optIdx;

                            let optStyle = "bg-white text-gray-700 border-gray-200";
                            if (isThisCorrect) optStyle = "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold";
                            if (isThisUserSelection && !isThisCorrect) optStyle = "bg-red-100 text-red-900 border-red-300 font-bold line-through";

                            return (
                              <div key={optIdx} className={`p-3 rounded-xl border flex items-center justify-between ${optStyle}`}>
                                <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                                {isThisCorrect && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                                {isThisUserSelection && !isThisCorrect && <X className="w-4 h-4 text-red-700 shrink-0" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation Box */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-1.5 text-xs text-gray-700">
                          <strong className="text-[#8C1316] font-extrabold flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>Detailed Explanation:</span>
                          </strong>
                          <p className="leading-relaxed font-medium">{q.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="px-8 py-3.5 bg-[#C12223] text-white font-black text-xs rounded-xl shadow-lg hover:bg-[#A6181B] transition cursor-pointer"
                  >
                    Back to All Daily Quizzes
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>
      ) : (

        /* MAIN QUIZ LISTING PAGE */
        <div>
          
          {/* 1. HERO BANNER - Sleek Gamified Speed-Test Arena (Red & Gold Theme) */}
          <section className="relative bg-gradient-to-br from-[#8C1316] via-[#C12223] to-[#9E1B1D] text-white pt-12 pb-20 overflow-hidden border-b border-red-400/30">
            {/* Glowing background highlights */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:24px_24px]" />
            
            <div className="max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10">
              
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs font-semibold text-red-200 mb-6">
                <button onClick={() => router.push('/')} className="hover:text-amber-300 transition cursor-pointer flex items-center gap-1">
                  <span>Home</span>
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-red-300" />
                <span className="text-amber-300 font-bold">Daily Free Speed Drills</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Column */}
                <div className="lg:col-span-7 space-y-5">
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 bg-amber-400 text-red-950 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-400/20">
                      <Flame className="w-4 h-4 text-red-700 animate-bounce" />
                      <span>{userStreak}-Day Prep Streak Active</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 bg-red-900/60 border border-red-400/30 text-red-100 px-3 py-1 rounded-full text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>18,420 aspirants testing now</span>
                    </div>
                  </div>

                  <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight">
                    TCS-Pattern <span className="text-amber-300">Daily 5-Min Drills</span> for Top Ranks.
                  </h1>

                  <p className="text-red-100 text-sm sm:text-base leading-relaxed font-medium max-w-2xl">
                    Build speed, accuracy & instant question recall with 5-minute timed sectional quizzes. Complete today’s test to earn streak badges, view sectional cutoff analytics, and unlock free full-length mock vouchers.
                  </p>

                  {/* Quick Feature Badges */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-red-100 font-bold">
                    <div className="flex items-center gap-1.5 bg-red-900/70 border border-red-400/30 px-3 py-1.5 rounded-xl">
                      <Clock className="w-4 h-4 text-amber-300" />
                      <span>Strict TCS Timer Engine</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-red-900/70 border border-red-400/30 px-3 py-1.5 rounded-xl">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Step-by-Step Explanations</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-red-900/70 border border-red-400/30 px-3 py-1.5 rounded-xl">
                      <Trophy className="w-4 h-4 text-amber-300" />
                      <span>Real-Time All-India Rank</span>
                    </div>
                  </div>

                </div>

                {/* Right Column - Gamified Floating White Card */}
                <div className="lg:col-span-5">
                  <div className="bg-white text-gray-900 p-6 sm:p-7 rounded-3xl border-2 border-amber-300 shadow-2xl relative overflow-hidden group">
                    
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-red-950 font-black text-xl shadow-md">
                          <Trophy className="w-6 h-6 text-red-950" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase text-[#C12223] tracking-wider">FEATURED DRILL OF THE DAY</span>
                          <h3 className="font-heading font-black text-base text-gray-900">Daily Current Affairs Express</h3>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-red-100 text-[#C12223] font-black text-[10px] rounded-lg">LIVE NOW</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center mb-5">
                      <div className="bg-red-50/80 p-3 rounded-2xl border border-red-100">
                        <div className="text-[#C12223] font-black text-lg">5 Qs</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase">Questions</div>
                      </div>
                      <div className="bg-red-50/80 p-3 rounded-2xl border border-red-100">
                        <div className="text-[#C12223] font-black text-lg">5 Mins</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase">Time Limit</div>
                      </div>
                      <div className="bg-red-50/80 p-3 rounded-2xl border border-red-100">
                        <div className="text-emerald-600 font-black text-lg">+1.0 / -0.25</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase">Marking</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartQuiz(quizzesList[0])}
                      className="w-full py-3.5 bg-gradient-to-r from-[#C12223] via-[#A6181B] to-[#8C1316] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Today's Featured Quiz Now</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* 2. FILTER TABS & SUBJECT SELECTOR */}
          <section className="max-w-[1320px] mx-auto px-4 sm:px-6 -mt-8 relative z-20">
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-red-100 shadow-xl space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                
                {/* Subject Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                  {[
                    { id: 'all', label: 'All Subjects' },
                    { id: 'current affairs', label: 'Current Affairs' },
                    { id: 'quantitative aptitude', label: 'Quant & DI' },
                    { id: 'reasoning ability', label: 'Reasoning' },
                    { id: 'banking awareness', label: 'Banking & Financial' }
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubject(sub.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${
                        selectedSubject === sub.id
                          ? 'bg-[#8C1316] text-white border-[#8C1316] shadow-md'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#C12223]'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>

                {/* Exam Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <Filter className="w-4 h-4 text-[#C12223]" />
                  <select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="px-3 py-2 bg-gray-50 text-xs font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C12223]"
                  >
                    <option value="all">All Exam Targets</option>
                    <option value="ssc">SSC CGL / CHSL</option>
                    <option value="bank">IBPS / SBI Bank PO</option>
                    <option value="assam">Assam ADRE & State</option>
                  </select>
                </div>

              </div>

            </div>
          </section>

          {/* 3. QUIZZES LIST */}
          <section className="py-12 max-w-[1320px] mx-auto px-4 sm:px-6">
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[#C12223] font-black text-xs uppercase tracking-widest block">
                  LIVE DAILY DRILLS
                </span>
                <h2 className="font-heading text-2xl font-black text-[#1F1A1C]">
                  Today's Practice Tests & Archives
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredQuizzes.map((quiz) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-red-50 text-[#C12223] font-extrabold text-[10px] uppercase rounded border border-red-200">
                          {quiz.subject}
                        </span>
                        <span className="text-xs font-bold text-gray-500">
                          {quiz.date}
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded ${
                        quiz.difficulty === 'Easy' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : quiz.difficulty === 'Moderate' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {quiz.difficulty} Level
                      </span>
                    </div>

                    <div>
                      <h3 className="font-heading font-black text-lg text-[#1F1A1C] group-hover:text-[#C12223] transition leading-snug">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        Target Exam: <strong>{quiz.examCategory}</strong>
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-[#FFF5F5] p-3 rounded-2xl text-center text-xs border border-red-100/60">
                      <div>
                        <span className="block text-gray-400 text-[9px] font-extrabold uppercase">Questions</span>
                        <strong className="text-gray-900 font-black">{quiz.totalQuestions} Qs</strong>
                      </div>
                      <div>
                        <span className="block text-gray-400 text-[9px] font-extrabold uppercase">Time Limit</span>
                        <strong className="text-gray-900 font-black">{quiz.timeLimitMinutes} Mins</strong>
                      </div>
                      <div>
                        <span className="block text-gray-400 text-[9px] font-extrabold uppercase">Attempts</span>
                        <strong className="text-[#C12223] font-black">{quiz.attemptsCount}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      className="w-full py-3.5 bg-[#C12223] hover:bg-[#A6181B] text-white font-black text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-amber-300 text-amber-300" />
                      <span>Start Free Daily Quiz Now</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

          </section>

          {/* 4. LEADERBOARD PREVIEW */}
          <section className="py-12 bg-white border-t border-red-100">
            <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
              
              <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
                <span className="text-[#C12223] font-black text-xs uppercase tracking-widest bg-[#FFF5F5] px-3 py-1 rounded-full border border-[#C12223]/20">
                  TODAY'S TOP PERFORMERS
                </span>
                <h2 className="font-heading text-2xl font-black text-[#1F1A1C]">
                  Daily Quiz Rankers Leaderboard
                </h2>
              </div>

              <div className="max-w-2xl mx-auto bg-[#FFF5F5] p-6 rounded-3xl border border-red-200 shadow-lg space-y-3">
                {[
                  { rank: 1, name: "Priya Sharma (Chandigarh)", score: "5/5", time: "1 min 42 sec", badge: "🥇 Rank 1" },
                  { rank: 2, name: "Ankur Gogoi (Guwahati)", score: "5/5", time: "2 mins 05 sec", badge: "🥈 Rank 2" },
                  { rank: 3, name: "Manpreet Singh (Patiala)", score: "5/5", time: "2 mins 18 sec", badge: "🥉 Rank 3" },
                  { rank: 4, name: "Rohan Verma (Delhi)", score: "4/5", time: "1 min 50 sec", badge: "Top 1%" }
                ].map((row, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-2xl border border-red-100 flex items-center justify-between text-xs font-bold text-gray-800">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-[11px] font-black">
                        {row.badge}
                      </span>
                      <span>{row.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <span className="text-[#C12223] font-black">{row.score}</span>
                      <span className="text-[11px] text-gray-400">{row.time}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>

        </div>
      )}

    </div>
  );
}
