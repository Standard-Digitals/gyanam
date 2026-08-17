'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2, Clock, RotateCcw, ChevronRight, ChevronLeft,
  Star, Check, X, Sparkles,
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizTakerQuiz {
  id: string;
  title: string;
  examCategory: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  questions: Question[];
}

export default function QuizTaker({
  quiz,
  onExit,
  onSubmitSuccess,
}: {
  quiz: QuizTakerQuiz;
  onExit: () => void;
  onSubmitSuccess?: () => void;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(quiz.timeLimitMinutes * 60);
  const [loginRequiredNotice, setLoginRequiredNotice] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!quizSubmitted && timeRemaining > 0) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizSubmitted, timeRemaining]);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleToggleReview = (questionId: number) => {
    setMarkedForReview((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleQuizSubmit = async () => {
    setQuizSubmitted(true);
    const timeTakenSec = quiz.timeLimitMinutes * 60 - timeRemaining;
    try {
      const res = await fetch(`/api/quiz/${quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: userAnswers, timeTakenSec }),
      });
      if (res.status === 401) {
        setLoginRequiredNotice(true);
        return;
      }
      if (res.ok) {
        onSubmitSuccess?.();
      }
    } catch (err) {
      console.error('Failed to save quiz attempt', err);
    }
  };

  const scoreResults = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    quiz.questions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected === undefined) unattempted++;
      else if (selected === q.correctAnswer) correct++;
      else incorrect++;
    });

    const marks = correct * 1 - incorrect * 0.25;
    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;

    return {
      correctCount: correct,
      incorrectCount: incorrect,
      unattemptedCount: unattempted,
      totalMarks: quiz.totalQuestions * 1,
      obtainedMarks: Math.max(0, marks),
      accuracy,
    };
  }, [quiz, userAnswers]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-red-100 shadow-xl flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span className="px-2.5 py-0.5 bg-red-50 text-[#C12223] text-[10px] font-black uppercase rounded border border-red-200">
            {quiz.examCategory}
          </span>
          <h2 className="font-heading font-black text-lg sm:text-xl text-[#1F1A1C] mt-1">{quiz.title}</h2>
        </div>

        <div className="flex items-center gap-4">
          {!quizSubmitted && (
            <div className="flex items-center gap-2 bg-[#8C1316] text-white px-4 py-2 rounded-2xl shadow-md">
              <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="font-mono font-bold text-sm">{formatTime(timeRemaining)}</span>
            </div>
          )}
          <button
            onClick={onExit}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Exit Test
          </button>
        </div>
      </div>

      {!quizSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-red-100 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                Question {currentQuestionIndex + 1} of {quiz.totalQuestions}
              </span>
              <button
                onClick={() => handleToggleReview(quiz.questions[currentQuestionIndex].id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  markedForReview[quiz.questions[currentQuestionIndex].id]
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>{markedForReview[quiz.questions[currentQuestionIndex].id] ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#1F1A1C] leading-snug">
                {quiz.questions[currentQuestionIndex].question}
              </h3>

              <div className="space-y-3 pt-2">
                {quiz.questions[currentQuestionIndex].options.map((option, idx) => {
                  const isSelected = userAnswers[quiz.questions[currentQuestionIndex].id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(quiz.questions[currentQuestionIndex].id, idx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFF5F5] border-[#C12223] text-[#8C1316] font-bold shadow-sm'
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isSelected ? 'bg-[#C12223] text-white' : 'bg-white text-gray-500 border border-gray-300'
                          }`}
                        >
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

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentQuestionIndex < quiz.totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
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

          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-red-100 shadow-xl space-y-6">
            <h4 className="font-heading font-black text-sm text-[#1F1A1C] uppercase tracking-wider border-b border-gray-100 pb-3">
              Question Palette
            </h4>

            <div className="grid grid-cols-5 gap-2.5">
              {quiz.questions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isMarked = markedForReview[q.id];
                const isCurrent = currentQuestionIndex === idx;

                let bgClass = 'bg-gray-100 text-gray-600 border-gray-200';
                if (isCurrent) bgClass = 'ring-2 ring-[#C12223] bg-[#FFF5F5] font-black text-[#8C1316]';
                else if (isMarked) bgClass = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
                else if (isAnswered) bgClass = 'bg-emerald-600 text-white font-bold';

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
                <span>Unanswered ({quiz.totalQuestions - Object.keys(userAnswers).length})</span>
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
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8 rounded-3xl shadow-2xl space-y-6 border border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="px-3 py-1 bg-amber-400 text-red-950 font-black text-[10px] uppercase rounded-full">
                  PERFORMANCE ANALYTICS
                </span>
                <h2 className="font-heading font-black text-2xl text-white mt-1">Quiz Scorecard &amp; Accuracy Report</h2>
                {loginRequiredNotice && (
                  <p className="text-xs text-amber-300 font-semibold mt-2">
                    Login karo taake yeh score save ho aur streak/leaderboard me count ho.
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  setUserAnswers({});
                  setQuizSubmitted(false);
                  setTimeRemaining(quiz.timeLimitMinutes * 60);
                  setCurrentQuestionIndex(0);
                }}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-300" />
                <span>Re-Attempt Quiz</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                <div className="text-2xl sm:text-3xl font-black text-amber-300">
                  {scoreResults.obtainedMarks} / {scoreResults.totalMarks}
                </div>
                <div className="text-[10px] font-bold text-gray-300 uppercase mt-0.5">Total Score</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">{scoreResults.accuracy}%</div>
                <div className="text-[10px] font-bold text-gray-300 uppercase mt-0.5">Accuracy Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {scoreResults.correctCount} / {quiz.totalQuestions}
                </div>
                <div className="text-[10px] font-bold text-gray-300 uppercase mt-0.5">Correct Qs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                <div className="text-2xl sm:text-3xl font-black text-red-400">{scoreResults.incorrectCount}</div>
                <div className="text-[10px] font-bold text-gray-300 uppercase mt-0.5">Wrong Qs (-0.25)</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-red-100 shadow-xl space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-heading font-black text-xl text-[#1F1A1C]">Detailed Question Solutions &amp; Explanations</h3>
              <p className="text-xs text-gray-500 font-medium">
                Review correct answers, formula shortcuts, and conceptual notes for every question.
              </p>
            </div>

            <div className="space-y-6">
              {quiz.questions.map((q, qIdx) => {
                const userSelected = userAnswers[q.id];
                const isCorrect = userSelected === q.correctAnswer;
                const isUnattempted = userSelected === undefined;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border space-y-4 ${
                      isCorrect ? 'bg-emerald-50/50 border-emerald-200' : isUnattempted ? 'bg-gray-50 border-gray-200' : 'bg-red-50/50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-heading font-extrabold text-sm sm:text-base text-[#1F1A1C]">
                        Q{qIdx + 1}. {q.question}
                      </h4>
                      <span
                        className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-md shrink-0 ${
                          isCorrect ? 'bg-emerald-600 text-white' : isUnattempted ? 'bg-gray-300 text-gray-800' : 'bg-red-600 text-white'
                        }`}
                      >
                        {isCorrect ? 'Correct (+1.0)' : isUnattempted ? 'Unattempted' : 'Incorrect (-0.25)'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isThisCorrect = optIdx === q.correctAnswer;
                        const isThisUserSelection = userSelected === optIdx;

                        let optStyle = 'bg-white text-gray-700 border-gray-200';
                        if (isThisCorrect) optStyle = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
                        if (isThisUserSelection && !isThisCorrect) optStyle = 'bg-red-100 text-red-900 border-red-300 font-bold line-through';

                        return (
                          <div key={optIdx} className={`p-3 rounded-xl border flex items-center justify-between ${optStyle}`}>
                            <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                            {isThisCorrect && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                            {isThisUserSelection && !isThisCorrect && <X className="w-4 h-4 text-red-700 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

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
                onClick={onExit}
                className="px-8 py-3.5 bg-[#C12223] text-white font-black text-xs rounded-xl shadow-lg hover:bg-[#A6181B] transition cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
