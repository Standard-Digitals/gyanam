'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Clock, Trophy, Flame, ChevronRight, Filter, Sparkles, Play } from 'lucide-react';
import QuizTaker from './QuizTaker';

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
  attemptsCount: number;
  avgScore: number;
  difficulty: string;
  questions: Question[];
}

interface LeaderboardRow {
  rank: number;
  name: string;
  obtainedMarks: number;
  accuracy: number;
  timeTakenSec: number;
}

export default function DailyQuizPage({ quizzes: quizzesList }: { quizzes: Quiz[] }) {
  const router = useRouter();

  // State
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [userStreak, setUserStreak] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);

  const refreshStreakAndLeaderboard = async () => {
    try {
      const [streakRes, leaderboardRes] = await Promise.all([
        fetch('/api/quiz/streak'),
        fetch('/api/quiz/leaderboard'),
      ]);
      const streakData = await streakRes.json();
      const leaderboardData = await leaderboardRes.json();
      setUserStreak(streakData.streak ?? 0);
      setLeaderboard(leaderboardData.leaderboard ?? []);
    } catch (err) {
      console.error('Failed to load streak/leaderboard', err);
    }
  };

  useEffect(() => {
    refreshStreakAndLeaderboard();
  }, []);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
  };

  // Filtered Quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzesList.filter((q) => {
      const matchSubject = selectedSubject === 'all' || q.subject.toLowerCase() === selectedSubject.toLowerCase();
      const matchExam = selectedExam === 'all' || q.examCategory.toLowerCase().includes(selectedExam.toLowerCase());
      return matchSubject && matchExam;
    });
  }, [selectedSubject, selectedExam]);

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#1F1A1C] pb-20">
      
      {/* If Quiz is Active (Full-Screen Test Player) */}
      {activeQuiz ? (
        <div className="px-4 py-6">
          <QuizTaker quiz={activeQuiz} onExit={() => setActiveQuiz(null)} onSubmitSuccess={refreshStreakAndLeaderboard} />
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
                    Build speed, accuracy & instant question recall with 5-minute timed sectional quizzes. Complete today's test to earn streak badges, view sectional cutoff analytics, and unlock free full-length mock vouchers.
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
                {leaderboard.length === 0 ? (
                  <p className="text-center text-xs text-gray-500 py-4">
                    No quiz attempts yet — be the first to top the leaderboard!
                  </p>
                ) : (
                  leaderboard.map((row) => {
                    const medal = row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : null;
                    return (
                      <div key={row.rank} className="bg-white p-3.5 rounded-2xl border border-red-100 flex items-center justify-between text-xs font-bold text-gray-800">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-[11px] font-black">
                            {medal ? `${medal} Rank ${row.rank}` : `Rank ${row.rank}`}
                          </span>
                          <span>{row.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600">
                          <span className="text-[#C12223] font-black">{row.obtainedMarks}</span>
                          <span className="text-[11px] text-gray-400">{row.timeTakenSec}s</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          </section>

        </div>
      )}

    </div>
  );
}
