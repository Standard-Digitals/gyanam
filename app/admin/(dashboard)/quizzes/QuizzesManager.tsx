'use client';
import { useState } from 'react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  subject: string;
  examCategory: string;
  date: string;
  timeLimitMinutes: number;
  difficulty: string;
  questions: QuizQuestion[];
}

const EMPTY_QUESTION = (id: number): QuizQuestion => ({
  id,
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  explanation: '',
});

const EMPTY_FORM = {
  title: '',
  subject: '',
  examCategory: '',
  date: '',
  timeLimitMinutes: 5,
  difficulty: 'Moderate',
  questions: [EMPTY_QUESTION(1)],
};

const DIFFICULTIES = ['Easy', 'Moderate', 'Hard'];

export default function QuizzesManager({ quizzes: initialQuizzes }: { quizzes: Quiz[] }) {
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCreate = () => {
    setEditingId('new');
    setForm(EMPTY_FORM);
    setError(null);
  };

  const startEdit = (quiz: Quiz) => {
    setEditingId(quiz.id);
    setForm({
      title: quiz.title,
      subject: quiz.subject,
      examCategory: quiz.examCategory,
      date: quiz.date,
      timeLimitMinutes: quiz.timeLimitMinutes,
      difficulty: quiz.difficulty,
      questions: quiz.questions.map((q) => ({ ...q, options: [...q.options] })),
    });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const updateQuestion = (idx: number, patch: Partial<QuizQuestion>) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === idx ? { ...q, ...patch } : q)),
    }));
  };

  const updateOption = (qIdx: number, optIdx: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIdx ? { ...q, options: q.options.map((o, oi) => (oi === optIdx ? value : o)) } : q
      ),
    }));
  };

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, EMPTY_QUESTION((prev.questions[prev.questions.length - 1]?.id ?? 0) + 1)],
    }));
  };

  const removeQuestion = (idx: number) => {
    setForm((prev) => ({ ...prev, questions: prev.questions.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form.title.trim() || form.questions.some((q) => !q.question.trim() || q.options.some((o) => !o.trim()))) {
      setError('Title and all question fields (including options) are required');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    const payload = {
      title: form.title,
      subject: form.subject,
      examCategory: form.examCategory,
      date: form.date,
      timeLimitMinutes: Number(form.timeLimitMinutes),
      difficulty: form.difficulty,
      questions: form.questions,
    };
    try {
      if (editingId === 'new') {
        const res = await fetch('/api/admin/quizzes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create quiz');
        setQuizzes((prev) => [data.quiz, ...prev]);
      } else if (editingId) {
        const res = await fetch(`/api/admin/quizzes/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update quiz');
        setQuizzes((prev) => prev.map((q) => (q.id === editingId ? data.quiz : q)));
      }
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this quiz?')) return;
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
    try {
      await fetch(`/api/admin/quizzes/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete quiz', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">Daily Quiz Manager</h2>
        {editingId === null && (
          <button onClick={startCreate} className="px-4 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer">
            + Add Quiz
          </button>
        )}
      </div>

      {editingId !== null && (
        <div className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Quiz Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="text" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            <input type="text" placeholder="Exam Category" value={form.examCategory} onChange={(e) => setForm({ ...form, examCategory: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="text" placeholder="Date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="number" placeholder="Time Limit (min)" value={form.timeLimitMinutes} onChange={(e) => setForm({ ...form, timeLimitMinutes: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold">
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-100">
            <p className="text-[11px] font-bold text-[#888888] uppercase">Questions ({form.questions.length})</p>
            {form.questions.map((q, qIdx) => (
              <div key={qIdx} className="p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#C12223]">Question {qIdx + 1}</span>
                  {form.questions.length > 1 && (
                    <button onClick={() => removeQuestion(qIdx)} className="text-xs font-bold text-red-600 cursor-pointer">Remove</button>
                  )}
                </div>
                <textarea
                  placeholder="Question text"
                  rows={2}
                  value={q.question}
                  onChange={(e) => updateQuestion(qIdx, { question: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#F3DCDD] rounded-xl text-sm font-semibold"
                />
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIdx}`}
                        checked={q.correctAnswer === optIdx}
                        onChange={() => updateQuestion(qIdx, { correctAnswer: optIdx })}
                        title="Mark as correct answer"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${optIdx + 1}`}
                        value={opt}
                        onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-[#F3DCDD] rounded-lg text-xs font-semibold"
                      />
                    </div>
                  ))}
                </div>
                <textarea
                  placeholder="Explanation"
                  rows={2}
                  value={q.explanation}
                  onChange={(e) => updateQuestion(qIdx, { explanation: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#F3DCDD] rounded-xl text-xs font-semibold"
                />
              </div>
            ))}
            <button onClick={addQuestion} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer">
              + Add Question
            </button>
          </div>

          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={isSubmitting} className="px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl disabled:opacity-50 cursor-pointer">
              {isSubmitting ? 'Saving...' : 'Save Quiz'}
            </button>
            <button onClick={cancelEdit} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white p-4 rounded-2xl border border-[#F3DCDD] shadow-sm flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-[#C12223] uppercase">{quiz.subject} · {quiz.examCategory} · {quiz.questions.length} Qs</span>
              <h4 className="font-bold text-sm text-[#1F1A1C]">{quiz.title}</h4>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(quiz)} className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg cursor-pointer">Edit</button>
              <button onClick={() => handleDelete(quiz.id)} className="px-3 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-lg cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
        {quizzes.length === 0 && <p className="text-center text-sm text-[#888888] py-8">No quizzes yet.</p>}
      </div>
    </div>
  );
}
