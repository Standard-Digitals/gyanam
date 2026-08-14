'use client';
import { useMemo, useRef, useState } from 'react';
import { Clock, ClipboardCheck, BarChart3, AlertTriangle } from 'lucide-react';
import { StatCard } from '../_components/AdminUI';

interface MockTestQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  flagged?: boolean;
}

interface MockTest {
  id: string;
  title: string;
  examCategory: string;
  timeLimitMinutes: number;
  status: string;
  questions: MockTestQuestion[];
  attempts: number;
  avgScore: number;
}

interface Stats {
  liveTests: number;
  attemptsToday: number;
  avgScore: number;
  flaggedQuestions: number;
}

const EMPTY_QUESTION = (id: number): MockTestQuestion => ({
  id,
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  explanation: '',
  flagged: false,
});

const EMPTY_FORM = {
  title: '',
  examCategory: 'SSC',
  timeLimitMinutes: 60,
  status: 'ACTIVE',
  questions: [EMPTY_QUESTION(1)],
};

const CATEGORIES = ['SSC', 'Banking', 'Railway', 'UPSC', 'Assam Govt', 'State PSC', 'Defence'];
const CATEGORY_TABS = ['All tests', ...CATEGORIES];
const STATUS_OPTIONS = ['ACTIVE', 'DRAFT', 'CLOSED'];

const STATUS_DOT: Record<string, string> = {
  ACTIVE: 'bg-[#127A52]',
  DRAFT: 'bg-gray-400',
  CLOSED: 'bg-[#B7A9A9]',
};

const STATUS_TEXT: Record<string, string> = {
  ACTIVE: 'text-[#127A52]',
  DRAFT: 'text-gray-500',
  CLOSED: 'text-[#8A7A7B]',
};

export default function MockTestsManager({
  mockTests: initialMockTests,
  stats,
}: {
  mockTests: MockTest[];
  stats: Stats;
}) {
  const [mockTests, setMockTests] = useState(initialMockTests);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All tests');
  const formRef = useRef<HTMLDivElement>(null);

  const displayedTests = useMemo(() => {
    if (activeCategory === 'All tests') return mockTests;
    return mockTests.filter((t) => t.examCategory === activeCategory);
  }, [mockTests, activeCategory]);

  const scrollToForm = () => {
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  const startCreate = () => {
    setEditingId('new');
    setForm(EMPTY_FORM);
    setError(null);
    scrollToForm();
  };

  const startEdit = (t: MockTest) => {
    setEditingId(t.id);
    setForm({
      title: t.title,
      examCategory: t.examCategory,
      timeLimitMinutes: t.timeLimitMinutes,
      status: t.status,
      questions: t.questions.map((q) => ({ ...q, options: [...q.options] })),
    });
    setError(null);
    scrollToForm();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const updateQuestion = (idx: number, patch: Partial<MockTestQuestion>) => {
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
      examCategory: form.examCategory,
      timeLimitMinutes: Number(form.timeLimitMinutes),
      status: form.status,
      questions: form.questions,
    };
    try {
      if (editingId === 'new') {
        const res = await fetch('/api/admin/mock-tests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create mock test');
        setMockTests((prev) => [{ ...data.mockTest, attempts: 0, avgScore: 0 }, ...prev]);
      } else if (editingId) {
        const res = await fetch(`/api/admin/mock-tests/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update mock test');
        setMockTests((prev) =>
          prev.map((t) => (t.id === editingId ? { ...t, ...data.mockTest } : t))
        );
      }
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this mock test?')) return;
    const previous = mockTests;
    setMockTests((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/admin/mock-tests/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Server rejected the delete request');
    } catch (err) {
      console.error('Failed to delete mock test', err);
      setMockTests(previous);
      alert('Could not delete this mock test. Please try again.');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    const previous = mockTests;
    setMockTests((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      const res = await fetch(`/api/admin/mock-tests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Server rejected the status update');
    } catch (err) {
      console.error('Failed to update status', err);
      setMockTests(previous);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">Mock Tests</h2>
        <p className="text-sm text-[#888888] mt-0.5">{mockTests.length} test{mockTests.length === 1 ? '' : 's'}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Live Tests" value={stats.liveTests} icon={Clock} accent="red" />
        <StatCard label="Attempts Today" value={stats.attemptsToday} icon={ClipboardCheck} accent="blue" />
        <StatCard label="Avg. Score" value={`${stats.avgScore}%`} icon={BarChart3} accent="emerald" />
        <StatCard label="Flagged Questions" value={stats.flaggedQuestions} icon={AlertTriangle} accent="amber" />
      </div>

      {editingId !== null && (
        <div ref={formRef} className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Mock Test Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <select value={form.examCategory} onChange={(e) => setForm({ ...form, examCategory: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Time Limit (min)" value={form.timeLimitMinutes} onChange={(e) => setForm({ ...form, timeLimitMinutes: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-100">
            <p className="text-[11px] font-bold text-[#888888] uppercase">Questions ({form.questions.length})</p>
            {form.questions.map((q, qIdx) => (
              <div key={qIdx} className="p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#C12223]">Question {qIdx + 1}</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#888888] cursor-pointer">
                      <input type="checkbox" checked={q.flagged ?? false} onChange={(e) => updateQuestion(qIdx, { flagged: e.target.checked })} />
                      Flag for review
                    </label>
                    {form.questions.length > 1 && (
                      <button onClick={() => removeQuestion(qIdx)} className="text-xs font-bold text-red-600 cursor-pointer">Remove</button>
                    )}
                  </div>
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
              {isSubmitting ? 'Saving...' : 'Save Mock Test'}
            </button>
            <button onClick={cancelEdit} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      {editingId === null && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {CATEGORY_TABS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeCategory === cat
                      ? 'bg-white text-[#1F1A1C] border border-[#F3DCDD] shadow-sm'
                      : 'text-[#8A7A7B] hover:text-[#1F1A1C]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button onClick={startCreate} className="px-4 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer">
              + New Mock Test
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#F3DCDD] shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F3DCDD] text-left text-[11px] uppercase text-[#888888] font-bold font-plexmono tracking-wide">
                  <th className="px-4 py-3">Test</th>
                  <th className="px-4 py-3">Exam</th>
                  <th className="px-4 py-3">Questions</th>
                  <th className="px-4 py-3">Attempts</th>
                  <th className="px-4 py-3">Avg. Score</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {displayedTests.map((t) => (
                  <tr key={t.id} className="border-b border-[#F3DCDD] last:border-0 hover:bg-[#FFF9F9] transition-colors">
                    <td className="px-4 py-3 font-bold text-[#1F1A1C]">{t.title}</td>
                    <td className="px-4 py-3 text-[#555555]">{t.examCategory}</td>
                    <td className="px-4 py-3 font-plexmono text-[#555555]">{t.questions.length}</td>
                    <td className="px-4 py-3 font-plexmono text-[#555555]">{t.attempts.toLocaleString()}</td>
                    <td className="px-4 py-3 font-plexmono text-[#555555]">{t.attempts > 0 ? `${t.avgScore}%` : '—'}</td>
                    <td className="px-4 py-3">
                      <span className="relative inline-flex items-center">
                        <span className={`absolute left-0 w-1.5 h-1.5 rounded-full pointer-events-none ${STATUS_DOT[t.status] ?? 'bg-gray-400'}`} />
                        <select
                          value={t.status}
                          onChange={(e) => handleStatusChange(t.id, e.target.value)}
                          className={`pl-3.5 pr-1.5 py-0.5 rounded-lg text-xs font-semibold border-0 outline-none cursor-pointer bg-transparent capitalize ${STATUS_TEXT[t.status] ?? 'text-gray-600'}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s} className="capitalize">{s.toLowerCase()}</option>
                          ))}
                        </select>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(t)} className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg cursor-pointer">Edit</button>
                        <button onClick={() => handleDelete(t.id)} className="px-3 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-lg cursor-pointer">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {displayedTests.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[#888888] text-sm">
                      {mockTests.length === 0 ? 'No mock tests yet.' : `No mock tests in "${activeCategory}".`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
