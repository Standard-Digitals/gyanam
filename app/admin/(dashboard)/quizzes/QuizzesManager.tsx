'use client';
import { useMemo, useState } from 'react';
import { GripVertical } from 'lucide-react';
import ImageUploadField from '../_components/ImageUploadField';
import FormField from '../_components/FormField';
import DateField, { todayHumanDate } from '../_components/DateField';
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

interface Quiz {
  id: string;
  title: string;
  subject: string;
  examCategory: string[];
  date: string;
  timeLimitMinutes: number;
  difficulty: string;
  thumbnail: string | null;
  courseId: string | null;
  sections: string[];
  questions: RawQuestion[];
}

const EMPTY_FORM = {
  title: '',
  subject: '',
  examCategory: ['SSC'] as string[],
  date: '',
  timeLimitMinutes: 5,
  difficulty: 'Moderate',
  thumbnail: '',
  courseId: '',
  sections: [] as string[],
  questions: [] as EditableQuestion[],
};

const DIFFICULTIES = ['Easy', 'Moderate', 'Hard'];
const CATEGORY_TABS = ['All', ...CATEGORIES];
const DIFFICULTY_TABS = ['All', ...DIFFICULTIES];
const LINK_OPTIONS = [
  { value: 'all', label: 'All quizzes' },
  { value: 'linked', label: 'Linked to a course' },
  { value: 'unlinked', label: 'General (not linked)' },
] as const;

export default function QuizzesManager({ quizzes: initialQuizzes, courses }: { quizzes: Quiz[]; courses: { id: string; title: string }[] }) {
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragSectionIdx, setDragSectionIdx] = useState<number | null>(null);
  const [dragQuestionIdx, setDragQuestionIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  const [linkedFilter, setLinkedFilter] = useState<(typeof LINK_OPTIONS)[number]['value']>('all');

  const displayedQuizzes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return quizzes.filter((quiz) => {
      if (q && !quiz.title.toLowerCase().includes(q) && !quiz.subject.toLowerCase().includes(q)) return false;
      if (activeCategory !== 'All' && !quiz.examCategory.includes(activeCategory)) return false;
      if (activeDifficulty !== 'All' && quiz.difficulty !== activeDifficulty) return false;
      if (linkedFilter === 'linked' && !quiz.courseId) return false;
      if (linkedFilter === 'unlinked' && quiz.courseId) return false;
      return true;
    });
  }, [quizzes, searchQuery, activeCategory, activeDifficulty, linkedFilter]);

  const isFiltered = Boolean(searchQuery.trim()) || activeCategory !== 'All' || activeDifficulty !== 'All' || linkedFilter !== 'all';

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

  const startCreate = () => {
    setEditingId('new');
    setForm({ ...EMPTY_FORM, date: todayHumanDate() });
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
      thumbnail: quiz.thumbnail ?? '',
      courseId: quiz.courseId ?? '',
      sections: quiz.sections ?? [],
      questions: quiz.questions.map((q) => normalizeQuestion(q)),
    });
    setError(null);
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
    if (!form.title.trim() || form.examCategory.length === 0 || form.questions.length === 0 || form.questions.some((q) => !isQuestionValid(q))) {
      setError('Title, at least one exam category, and at least one question (with valid MCQ options and a correct answer, or a fill-in-the-blank answer) are required');
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
      subject: form.subject,
      examCategory: form.examCategory,
      date: form.date,
      timeLimitMinutes: Number(form.timeLimitMinutes),
      difficulty: form.difficulty,
      thumbnail: form.thumbnail || undefined,
      courseId: form.courseId || null,
      sections: form.sections,
      questions: form.questions.map(toPayloadQuestion),
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
        <div>
          <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">Daily Quiz</h2>
          <p className="text-sm text-[#888888] mt-0.5">{quizzes.length} quiz{quizzes.length === 1 ? '' : 'zes'}</p>
        </div>
        {editingId === null && (
          <button onClick={startCreate} className="px-4 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer">
            + Add Quiz
          </button>
        )}
      </div>

      {editingId === null && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Search by title or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-white border border-[#F3DCDD] rounded-xl text-sm font-semibold"
            />
            <select
              value={activeDifficulty}
              onChange={(e) => setActiveDifficulty(e.target.value)}
              className="px-3.5 py-2 bg-white border border-[#F3DCDD] rounded-xl text-sm font-semibold sm:w-44"
            >
              {DIFFICULTY_TABS.map((d) => <option key={d} value={d}>{d === 'All' ? 'All difficulties' : d}</option>)}
            </select>
            <select
              value={linkedFilter}
              onChange={(e) => setLinkedFilter(e.target.value as (typeof LINK_OPTIONS)[number]['value'])}
              className="px-3.5 py-2 bg-white border border-[#F3DCDD] rounded-xl text-sm font-semibold sm:w-52"
            >
              {LINK_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white text-[#1F1A1C] border border-[#F3DCDD] shadow-sm'
                    : 'text-[#8A7A7B] hover:text-[#1F1A1C]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {editingId !== null && (
        <div className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Quiz Title">
              <input type="text" placeholder="e.g. Daily Current Affairs Quiz" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            </FormField>
            <FormField label="Subject">
              <input type="text" placeholder="e.g. Current Affairs" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            </FormField>
          </div>
          <FormField label="Exam Category (select all that apply)">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = form.examCategory.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        examCategory: active ? form.examCategory.filter((x) => x !== c) : [...form.examCategory, c],
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      active ? 'bg-[#C12223] text-white border-[#C12223]' : 'bg-[#FFF5F5] text-[#555555] border-[#F3DCDD] hover:border-[#C12223] hover:text-[#C12223]'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </FormField>
          <div className="grid grid-cols-3 gap-3">
            <DateField value={form.date} onChange={(next) => setForm({ ...form, date: next })} />
            <FormField label="Time Limit (minutes)">
              <input type="number" placeholder="5" value={form.timeLimitMinutes} onChange={(e) => setForm({ ...form, timeLimitMinutes: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            </FormField>
            <FormField label="Difficulty">
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold">
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </FormField>
          </div>
          <ImageUploadField label="Thumbnail" value={form.thumbnail} onChange={(url) => setForm({ ...form, thumbnail: url })} />

          <FormField label="Link to Course (optional)">
            <select
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold"
            >
              <option value="">Not linked (general Daily Quiz)</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </FormField>

          <div className="space-y-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-[11px] font-bold text-[#888888] uppercase">Sections</p>
              <button onClick={addSection} className="px-3 py-1.5 bg-white border border-[#F3DCDD] text-[#C12223] font-bold text-[11px] rounded-lg cursor-pointer">
                + Add Section
              </button>
            </div>
            {form.sections.length === 0 ? (
              <p className="text-xs text-[#888888]">
                No sections yet — all questions go in one list. Add a section (e.g. "General Knowledge") to organize questions by section. Drag the grip handle to reorder sections and questions.
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
              {isSubmitting ? 'Saving...' : 'Save Quiz'}
            </button>
            <button onClick={cancelEdit} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {displayedQuizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white p-4 rounded-2xl border border-[#F3DCDD] shadow-sm hover:shadow-md transition-shadow flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {quiz.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={quiz.thumbnail} alt="" className="w-11 h-11 rounded-lg object-cover border border-[#F3DCDD] shrink-0" />
              )}
              <div>
                <span className="text-[10px] font-bold text-[#C12223] uppercase">{quiz.subject} · {quiz.examCategory.join(' / ')} · {quiz.questions.length} Qs</span>
                <h4 className="font-bold text-sm text-[#1F1A1C]">{quiz.title}</h4>
                {quiz.courseId && (
                  <p className="text-[11px] text-[#127A52] font-semibold mt-0.5">
                    Linked to: {courses.find((c) => c.id === quiz.courseId)?.title ?? 'Unknown course'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(quiz)} className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg cursor-pointer">Edit</button>
              <button onClick={() => handleDelete(quiz.id)} className="px-3 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-lg cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
        {displayedQuizzes.length === 0 && (
          <p className="text-center text-sm text-[#888888] py-8">
            {isFiltered ? 'No quizzes match these filters.' : 'No quizzes yet.'}
          </p>
        )}
      </div>
    </div>
  );
}
