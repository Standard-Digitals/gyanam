'use client';
import { useMemo, useRef, useState } from 'react';
import { Clock, ClipboardCheck, BarChart3, AlertTriangle, GripVertical } from 'lucide-react';
import { StatCard } from '../_components/AdminUI';
import FormField from '../_components/FormField';
import QuestionEditor from '../_components/QuestionEditor';
import QuestionImportButton from '../_components/QuestionImportButton';
import { EXAM_CATEGORIES as CATEGORIES } from '../_components/examCategories';
import { moveInArray } from '../_components/reorder';
import {
  type EditableQuestion,
  type RawQuestion,
  createEmptyQuestion,
  normalizeQuestion,
  isQuestionValid,
  toPayloadQuestion,
  mergeImportedQuestions,
  renameQuestionsSection,
} from '../_components/questionTypes';

interface MockTest {
  id: string;
  title: string;
  examCategory: string;
  timeLimitMinutes: number;
  status: string;
  sections: string[];
  questions: RawQuestion[];
  attempts: number;
  avgScore: number;
}

interface Stats {
  liveTests: number;
  attemptsToday: number;
  avgScore: number;
  flaggedQuestions: number;
}

const EMPTY_FORM = {
  title: '',
  examCategory: 'SSC',
  timeLimitMinutes: 60,
  status: 'ACTIVE',
  sections: [] as string[],
  questions: [] as EditableQuestion[],
};

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
  const [dragSectionIdx, setDragSectionIdx] = useState<number | null>(null);
  const [dragQuestionIdx, setDragQuestionIdx] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const displayedTests = useMemo(() => {
    if (activeCategory === 'All tests') return mockTests;
    return mockTests.filter((t) => t.examCategory === activeCategory);
  }, [mockTests, activeCategory]);

  const questionsBySection = useMemo(() => {
    const map = new Map<string, { question: EditableQuestion; index: number }[]>();
    form.questions.forEach((q, index) => {
      const key = q.section && form.sections.includes(q.section) ? q.section : '';
      const list = map.get(key) ?? [];
      list.push({ question: q, index });
      map.set(key, list);
    });
    return map;
  }, [form.questions, form.sections]);

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
      sections: t.sections ?? [],
      questions: t.questions.map((q) => normalizeQuestion(q)),
    });
    setError(null);
    scrollToForm();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const updateQuestion = (idx: number, patch: Partial<EditableQuestion>) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === idx ? { ...q, ...patch } : q)),
    }));
  };

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, createEmptyQuestion((prev.questions[prev.questions.length - 1]?.id ?? 0) + 1)],
    }));
  };

  const addQuestionToSection = (sectionName: string) => {
    setForm((prev) => {
      const nextId = (prev.questions[prev.questions.length - 1]?.id ?? 0) + 1;
      return { ...prev, questions: [...prev.questions, { ...createEmptyQuestion(nextId), section: sectionName }] };
    });
  };

  const removeQuestion = (idx: number) => {
    setForm((prev) => ({ ...prev, questions: prev.questions.filter((_, i) => i !== idx) }));
  };

  const addSection = () => {
    setForm((prev) => ({ ...prev, sections: [...prev.sections, `Section ${prev.sections.length + 1}`] }));
  };

  const renameSection = (idx: number, newName: string) => {
    setForm((prev) => {
      const oldName = prev.sections[idx];
      return {
        ...prev,
        sections: prev.sections.map((s, i) => (i === idx ? newName : s)),
        questions: renameQuestionsSection(prev.questions, oldName, newName),
      };
    });
  };

  const removeSection = (idx: number) => {
    const name = form.sections[idx];
    if (form.questions.some((q) => q.section === name)) {
      alert(`Move or delete the questions in "${name}" before removing this section.`);
      return;
    }
    setForm((prev) => ({ ...prev, sections: prev.sections.filter((_, i) => i !== idx) }));
  };

  const handleSectionDrop = (targetIdx: number) => {
    if (dragSectionIdx === null) return;
    setForm((prev) => ({ ...prev, sections: moveInArray(prev.sections, dragSectionIdx, targetIdx) }));
    setDragSectionIdx(null);
  };

  const handleQuestionDrop = (targetRealIdx: number) => {
    if (dragQuestionIdx === null) return;
    setForm((prev) => ({ ...prev, questions: moveInArray(prev.questions, dragQuestionIdx, targetRealIdx) }));
    setDragQuestionIdx(null);
  };

  const questionDragProps = (realIdx: number) => ({
    draggable: true as const,
    onDragStart: () => setDragQuestionIdx(realIdx),
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDrop: () => handleQuestionDrop(realIdx),
    onDragEnd: () => setDragQuestionIdx(null),
  });

  const handleImported = (imported: RawQuestion[], warnings: string[]) => {
    setForm((prev) => ({ ...prev, questions: mergeImportedQuestions(prev.questions, imported) }));
    setError(warnings.length ? `Imported ${imported.length} question(s) with ${warnings.length} warning(s): ${warnings.slice(0, 3).join(' | ')}` : null);
  };

  const handleSave = async () => {
    if (!form.title.trim() || form.questions.length === 0 || form.questions.some((q) => !isQuestionValid(q))) {
      setError('Title is required, and you need at least one question — each with valid MCQ options and a correct answer, or a fill-in-the-blank answer');
      return;
    }
    if (form.sections.length > 0 && form.questions.some((q) => !form.sections.includes(q.section))) {
      setError('Every question needs a section assigned — check the "Unassigned" group below.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    const payload = {
      title: form.title,
      examCategory: form.examCategory,
      timeLimitMinutes: Number(form.timeLimitMinutes),
      status: form.status,
      sections: form.sections,
      questions: form.questions.map(toPayloadQuestion),
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
            <FormField label="Mock Test Title">
              <input type="text" placeholder="e.g. SSC CGL Tier 1 — Full Mock #15" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            </FormField>
            <FormField label="Exam Category">
              <select value={form.examCategory} onChange={(e) => setForm({ ...form, examCategory: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Time Limit (minutes)">
              <input type="number" placeholder="60" value={form.timeLimitMinutes} onChange={(e) => setForm({ ...form, timeLimitMinutes: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            </FormField>
            <FormField label="Status">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-[11px] font-bold text-[#888888] uppercase">Sections</p>
              <button onClick={addSection} className="px-3 py-1.5 bg-white border border-[#F3DCDD] text-[#C12223] font-bold text-[11px] rounded-lg cursor-pointer">
                + Add Section
              </button>
            </div>
            {form.sections.length === 0 ? (
              <p className="text-xs text-[#888888]">
                No sections yet — all questions go in one list. Add a section (e.g. "Quantitative Aptitude") to organize questions by section. Drag the grip handle to reorder sections and questions.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {form.sections.map((sectionName, sIdx) => (
                  <div
                    key={sIdx}
                    draggable
                    onDragStart={() => setDragSectionIdx(sIdx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleSectionDrop(sIdx)}
                    onDragEnd={() => setDragSectionIdx(null)}
                    className={`flex items-center gap-1 bg-[#FFF5F5] border border-[#F3DCDD] rounded-lg pl-1.5 pr-1.5 py-1 cursor-grab ${dragSectionIdx === sIdx ? 'opacity-40' : ''}`}
                  >
                    <GripVertical className="w-3.5 h-3.5 text-[#C7B4B3] shrink-0" />
                    <input
                      type="text"
                      value={sectionName}
                      onChange={(e) => renameSection(sIdx, e.target.value)}
                      className="bg-transparent text-xs font-bold text-[#1F1A1C] outline-none w-32"
                    />
                    <button onClick={() => removeSection(sIdx)} title="Remove section" className="text-red-500 hover:text-red-700 text-sm font-black cursor-pointer w-5">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-[11px] font-bold text-[#888888] uppercase">Questions ({form.questions.length})</p>
              <QuestionImportButton onImported={handleImported} />
            </div>

            {form.sections.length === 0 ? (
              <>
                {form.questions.map((q, qIdx) => (
                  <QuestionEditor
                    key={qIdx}
                    index={qIdx}
                    question={q}
                    onChange={(patch) => updateQuestion(qIdx, patch)}
                    onRemove={() => removeQuestion(qIdx)}
                    canRemove={form.questions.length > 1}
                    showFlagged
                    showMeta
                    dragHandleProps={questionDragProps(qIdx)}
                    isDragging={dragQuestionIdx === qIdx}
                  />
                ))}
                <button onClick={addQuestion} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer">
                  + Add Question
                </button>
              </>
            ) : (
              <>
                {form.sections.map((sectionName, sIdx) => {
                  const items = questionsBySection.get(sectionName) ?? [];
                  return (
                    <div key={sIdx} className="space-y-3 p-3 bg-white rounded-2xl border border-[#F3DCDD]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-heading font-black text-sm text-[#1F1A1C]">{sectionName}</span>
                        <span className="text-[11px] text-[#888888] font-semibold">
                          {items.length} question{items.length === 1 ? '' : 's'}
                        </span>
                      </div>
                      {items.map(({ question, index }) => (
                        <QuestionEditor
                          key={index}
                          index={index}
                          question={question}
                          onChange={(patch) => updateQuestion(index, patch)}
                          onRemove={() => removeQuestion(index)}
                          canRemove={form.questions.length > 1}
                          showFlagged
                          showMeta
                          sections={form.sections}
                          dragHandleProps={questionDragProps(index)}
                          isDragging={dragQuestionIdx === index}
                        />
                      ))}
                      <button
                        onClick={() => addQuestionToSection(sectionName)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        + Add Question to {sectionName}
                      </button>
                    </div>
                  );
                })}
                {(questionsBySection.get('') ?? []).length > 0 && (
                  <div className="space-y-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
                    <p className="text-xs font-bold text-amber-800">Unassigned — pick a section for these questions.</p>
                    {(questionsBySection.get('') ?? []).map(({ question, index }) => (
                      <QuestionEditor
                        key={index}
                        index={index}
                        question={question}
                        onChange={(patch) => updateQuestion(index, patch)}
                        onRemove={() => removeQuestion(index)}
                        canRemove={form.questions.length > 1}
                        showFlagged
                        showMeta
                        sections={form.sections}
                        dragHandleProps={questionDragProps(index)}
                        isDragging={dragQuestionIdx === index}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
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
