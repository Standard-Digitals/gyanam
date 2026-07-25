import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CURRENT_AFFAIRS_ITEMS, DAILY_QUIZ_QUESTIONS } from '../data/mockData';
import { Sparkles, BookOpen, CheckCircle, Flame, Download, HelpCircle, ArrowRight, RefreshCw } from 'lucide-react';

export const CurrentAffairs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'quiz'>('news');
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (qId: number, optIdx: number) => {
    setQuizAnswers({ ...quizAnswers, [qId]: optIdx });
  };

  const calculateScore = () => {
    let score = 0;
    DAILY_QUIZ_QUESTIONS.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  return (
    <section id="current-affairs" className="py-20 bg-[#FFF8F6]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="px-3.5 py-1 bg-[#ED7026]/10 text-[#ED7026] text-xs font-extrabold uppercase rounded-full tracking-wider">
              Updated Daily at 7:00 AM
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#111111] mt-3 tracking-tight">
              Daily Current Affairs & Practice Quiz
            </h2>
            <p className="text-sm text-[#555555] mt-2 max-w-xl">
              Curated for SSC CGL, IBPS PO, Assam ADRE 3.0 & UPSC Prelims.
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#ECECEC] shadow-sm">
            <button
              onClick={() => setActiveTab('news')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
                activeTab === 'news'
                  ? 'bg-gradient-to-r from-[#ED7026] to-[#C12223] text-white shadow-md'
                  : 'text-[#555555] hover:text-[#111111]'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Latest News & Analysis
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
                activeTab === 'quiz'
                  ? 'bg-gradient-to-r from-[#ED7026] to-[#C12223] text-white shadow-md'
                  : 'text-[#555555] hover:text-[#111111]'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Daily 5-MCQ Live Test
            </button>
          </div>
        </div>

        {/* Tab Content: News & Analysis */}
        {activeTab === 'news' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {CURRENT_AFFAIRS_ITEMS.map(item => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-6 border border-[#ECECEC] shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-[#ED7026]/10 text-[#ED7026] font-extrabold text-[10px] uppercase rounded-full">
                      {item.category}
                    </span>
                    <span className="text-xs text-[#888888] font-medium">{item.date}</span>
                  </div>

                  <h3 className="font-heading font-extrabold text-lg text-[#111111] group-hover:text-[#C12223] transition mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#555555] leading-relaxed mb-4">
                    {item.summary}
                  </p>

                  <div className="space-y-1.5 p-3.5 bg-[#FFF8F6] rounded-2xl border border-[#ECECEC] mb-4">
                    <span className="text-[10px] font-extrabold text-[#C12223] uppercase block mb-1">
                      Key Exam Takeaways:
                    </span>
                    {item.bullets.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#111111]">
                        <span className="text-[#ED7026] font-bold">•</span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#ECECEC] flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {item.impForExams.slice(0, 3).map((ex, i) => (
                      <span key={i} className="text-[10px] font-bold text-[#555555] bg-slate-100 px-2 py-0.5 rounded">
                        {ex}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-[#888888] font-semibold">{item.readTime}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tab Content: Daily 5-MCQ Live Test */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-[#ECECEC] shadow-2xl">
            <div className="flex items-center justify-between pb-6 border-b border-[#ECECEC] mb-6">
              <div>
                <span className="text-xs font-bold text-[#ED7026] uppercase tracking-wider block">
                  Interactive Practice
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-[#111111]">
                  Today's 5-Question Current Affairs Challenge
                </h3>
              </div>
              {showResults && (
                <button
                  onClick={() => {
                    setQuizAnswers({});
                    setShowResults(false);
                  }}
                  className="px-3 py-1.5 bg-[#FFF8F6] border border-[#ECECEC] text-[#111111] hover:text-[#ED7026] rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retake Quiz
                </button>
              )}
            </div>

            <div className="space-y-6">
              {DAILY_QUIZ_QUESTIONS.map((q, qIdx) => (
                <div key={q.id} className="p-5 bg-[#FFF8F6] rounded-2xl border border-[#ECECEC]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#ED7026]">Question {qIdx + 1} of 5</span>
                    <span className="text-[10px] font-extrabold text-[#555555] bg-white px-2 py-0.5 rounded border border-[#ECECEC]">
                      {q.examTag}
                    </span>
                  </div>

                  <p className="font-heading font-bold text-sm text-[#111111] mb-3">
                    {q.question}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[q.id] === optIdx;
                      const isCorrect = q.correctAnswer === optIdx;

                      let btnStyle = 'bg-white text-[#111111] border-[#ECECEC] hover:border-[#ED7026]';
                      if (showResults) {
                        if (isCorrect) btnStyle = 'bg-[#27AE60] text-white border-[#27AE60]';
                        else if (isSelected) btnStyle = 'bg-[#C12223] text-white border-[#C12223]';
                      } else if (isSelected) {
                        btnStyle = 'bg-[#ED7026] text-white border-[#ED7026]';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => !showResults && handleSelectOption(q.id, optIdx)}
                          className={`p-3 rounded-xl text-xs font-bold text-left transition border ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {showResults && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-[#ECECEC] text-xs text-[#555555]">
                      <strong className="text-[#111111] block mb-1">Explanation:</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quiz Submit Bar */}
            <div className="mt-8 pt-6 border-t border-[#ECECEC] flex items-center justify-between">
              {showResults ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#27AE60]/10 text-[#27AE60] font-heading font-black text-xl flex items-center justify-center">
                    {calculateScore()}/5
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-[#111111]">Quiz Result</h5>
                    <p className="text-xs text-[#555555]">
                      {calculateScore() >= 4 ? '🎉 Excellent performance! Exam ready.' : 'Good effort! Review explanations above.'}
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowResults(true)}
                  disabled={Object.keys(quizAnswers).length < 5}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#ED7026] to-[#C12223] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#ED7026]/25 disabled:opacity-50 transition"
                >
                  Submit & Check Solutions
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
