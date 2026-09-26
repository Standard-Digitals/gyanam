'use client';
import { useState } from 'react';
import FormField from '../_components/FormField';
import ImageUploadField from '../_components/ImageUploadField';
import CurrentAffairsImportButton from '../_components/CurrentAffairsImportButton';
import type { ParsedCurrentAffairs } from '@/lib/import/currentAffairsImport';
import { CURRENT_AFFAIRS_CATEGORIES as CATEGORIES } from '@/lib/currentAffairsCategories';

interface McqQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface CAItem {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  bullets: string[];
  impForExams: string[];
  thumbnail: string | null;
  fullContent: string[];
  keyTakeaways: string[];
  backgroundContext: string | null;
  mcqQuestion: McqQuestion | null;
  syllabusTag: string | null;
  sourceName: string | null;
  author: string | null;
}

const EMPTY_FORM = {
  title: '',
  category: CATEGORIES[0],
  date: '',
  readTime: '3 min read',
  summary: '',
  bulletsText: '',
  impForExamsText: '',
  thumbnail: '',
  fullContentText: '',
  keyTakeawaysText: '',
  backgroundContext: '',
  syllabusTag: '',
  mcqEnabled: false,
  mcqQuestionText: '',
  mcqOptions: ['', '', '', ''],
  mcqCorrectAnswer: 0,
  mcqExplanation: '',
  sourceName: '',
  author: '',
};

function toLines(text: string): string[] {
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}

export default function CurrentAffairsManager({ items: initialItems }: { items: CAItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);

  const handleImported = (fields: Partial<ParsedCurrentAffairs>, warnings: string[]) => {
    const { mcqQuestion, ...rest } = fields;
    setForm((prev) => ({
      ...prev,
      ...rest,
      ...(mcqQuestion
        ? {
            mcqEnabled: true,
            mcqQuestionText: mcqQuestion.question,
            mcqOptions: [...mcqQuestion.options, '', '', '', ''].slice(0, 4),
            mcqCorrectAnswer: mcqQuestion.correctAnswer,
            mcqExplanation: mcqQuestion.explanation,
          }
        : {}),
    }));
    setImportWarnings(warnings);
  };

  const startCreate = () => {
    setEditingId('new');
    setForm(EMPTY_FORM);
    setError(null);
    setImportWarnings([]);
  };

  const startEdit = (item: CAItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      category: item.category,
      date: item.date,
      readTime: item.readTime,
      summary: item.summary,
      bulletsText: item.bullets.join('\n'),
      impForExamsText: item.impForExams.join('\n'),
      thumbnail: item.thumbnail ?? '',
      fullContentText: item.fullContent.join('\n'),
      keyTakeawaysText: item.keyTakeaways.join('\n'),
      backgroundContext: item.backgroundContext ?? '',
      syllabusTag: item.syllabusTag ?? '',
      mcqEnabled: !!item.mcqQuestion,
      mcqQuestionText: item.mcqQuestion?.question ?? '',
      mcqOptions: item.mcqQuestion?.options?.length ? [...item.mcqQuestion.options, '', '', '', ''].slice(0, 4) : ['', '', '', ''],
      mcqCorrectAnswer: item.mcqQuestion?.correctAnswer ?? 0,
      mcqExplanation: item.mcqQuestion?.explanation ?? '',
      sourceName: item.sourceName ?? '',
      author: item.author ?? '',
    });
    setError(null);
    setImportWarnings([]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setImportWarnings([]);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.summary.trim()) {
      setError('Title and summary are required');
      return;
    }
    const mcqOptionsFilled = form.mcqOptions.map((o) => o.trim()).filter(Boolean);
    if (form.mcqEnabled) {
      if (!form.mcqQuestionText.trim() || !form.mcqExplanation.trim() || mcqOptionsFilled.length < 2) {
        setError('The MCQ needs a question, at least 2 options, and an explanation — or uncheck "Include a practice MCQ"');
        return;
      }
      if (!form.mcqOptions[form.mcqCorrectAnswer]?.trim()) {
        setError('Pick a correct answer that has text in it');
        return;
      }
    }
    setIsSubmitting(true);
    setError(null);
    const payload = {
      title: form.title,
      category: form.category,
      date: form.date,
      readTime: form.readTime,
      summary: form.summary,
      bullets: toLines(form.bulletsText),
      impForExams: toLines(form.impForExamsText),
      thumbnail: form.thumbnail || undefined,
      fullContent: toLines(form.fullContentText),
      keyTakeaways: toLines(form.keyTakeawaysText),
      backgroundContext: form.backgroundContext || undefined,
      syllabusTag: form.syllabusTag || undefined,
      mcqQuestion: form.mcqEnabled
        ? (() => {
            const correctText = form.mcqOptions[form.mcqCorrectAnswer].trim();
            const options = form.mcqOptions.map((o) => o.trim()).filter(Boolean);
            return {
              question: form.mcqQuestionText,
              options,
              correctAnswer: Math.max(0, options.indexOf(correctText)),
              explanation: form.mcqExplanation,
            };
          })()
        : null,
      sourceName: form.sourceName || undefined,
      author: form.author || undefined,
    };
    try {
      if (editingId === 'new') {
        const res = await fetch('/api/admin/current-affairs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create item');
        setItems((prev) => [data.item, ...prev]);
      } else if (editingId) {
        const res = await fetch(`/api/admin/current-affairs/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update item');
        setItems((prev) => prev.map((i) => (i.id === editingId ? data.item : i)));
      }
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this current affairs item?')) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await fetch(`/api/admin/current-affairs/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">Current Affairs</h2>
          <p className="text-sm text-[#888888] mt-0.5">{items.length} article{items.length === 1 ? '' : 's'}</p>
        </div>
        {editingId === null && (
          <button onClick={startCreate} className="px-4 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer">
            + Add Article
          </button>
        )}
      </div>

      {editingId !== null && (
        <div className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-gray-100">
            <p className="text-[11px] font-bold text-[#888888] uppercase">
              Fill the fields below one by one, or paste a whole article to auto-fill them
            </p>
            <CurrentAffairsImportButton onImported={handleImported} />
          </div>
          {importWarnings.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              {importWarnings.map((w, i) => (
                <p key={i} className="text-[11px] font-semibold text-amber-800">{w}</p>
              ))}
            </div>
          )}
          <FormField label="Title">
            <input type="text" placeholder="e.g. RBI Announces New Repo Rate" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </FormField>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Date">
              <input type="text" placeholder="e.g. Aug 10, 2026" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            </FormField>
            <FormField label="Read Time">
              <input type="text" placeholder="e.g. 3 min read" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            </FormField>
          </div>
          <FormField label="Syllabus Tag (optional)">
            <input type="text" placeholder="e.g. GS Paper 3, Prelims Focus" value={form.syllabusTag} onChange={(e) => setForm({ ...form, syllabusTag: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </FormField>
          <FormField label="Summary">
            <textarea placeholder="A short 1-2 line summary shown on the listing card" rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </FormField>
          <FormField label="Key Bullet Points (one per line)">
            <textarea placeholder={'e.g.\nRepo rate cut by 0.25% to 6.25%\nEffective from next quarter'} rows={3} value={form.bulletsText} onChange={(e) => setForm({ ...form, bulletsText: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </FormField>
          <FormField label="Important For Exams (one per line)">
            <textarea placeholder={'e.g.\nSSC CGL — Static GK\nBanking — Financial Awareness'} rows={2} value={form.impForExamsText} onChange={(e) => setForm({ ...form, impForExamsText: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </FormField>
          <FormField label="Full Content Paragraphs (one per line)">
            <textarea placeholder="Each line becomes one paragraph on the full article page" rows={4} value={form.fullContentText} onChange={(e) => setForm({ ...form, fullContentText: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </FormField>
          <FormField label="Key Takeaways (one per line)">
            <textarea placeholder="Shown as a highlighted summary box on the article page" rows={2} value={form.keyTakeawaysText} onChange={(e) => setForm({ ...form, keyTakeawaysText: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </FormField>
          <FormField label="Background Context (optional)">
            <input type="text" placeholder="Extra context shown before the main article" value={form.backgroundContext} onChange={(e) => setForm({ ...form, backgroundContext: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </FormField>

          <div className="space-y-3 pt-3 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.mcqEnabled} onChange={(e) => setForm({ ...form, mcqEnabled: e.target.checked })} />
              <span className="text-[11px] font-bold text-[#888888] uppercase">Include a practice MCQ (shown at the end of the article)</span>
            </label>
            {form.mcqEnabled && (
              <div className="space-y-3 p-3 bg-[#FFF5F5] rounded-xl border border-[#F3DCDD]">
                <FormField label="Question">
                  <textarea
                    rows={2}
                    placeholder="e.g. What is India's new repo rate after the latest MPC review?"
                    value={form.mcqQuestionText}
                    onChange={(e) => setForm({ ...form, mcqQuestionText: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-[#F3DCDD] rounded-xl text-sm font-semibold"
                  />
                </FormField>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {form.mcqOptions.map((opt, i) => (
                    <FormField key={i} label={`Option ${String.fromCharCode(65 + i)}${form.mcqCorrectAnswer === i ? ' — Correct' : ''}`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="mcqCorrect"
                          checked={form.mcqCorrectAnswer === i}
                          onChange={() => setForm({ ...form, mcqCorrectAnswer: i })}
                          title="Mark as correct answer"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const options = [...form.mcqOptions];
                            options[i] = e.target.value;
                            setForm({ ...form, mcqOptions: options });
                          }}
                          className="w-full px-3.5 py-2 bg-white border border-[#F3DCDD] rounded-xl text-sm font-semibold"
                        />
                      </div>
                    </FormField>
                  ))}
                </div>
                <FormField label="Explanation">
                  <textarea
                    rows={2}
                    placeholder="Why this is the correct answer"
                    value={form.mcqExplanation}
                    onChange={(e) => setForm({ ...form, mcqExplanation: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-[#F3DCDD] rounded-xl text-sm font-semibold"
                  />
                </FormField>
              </div>
            )}
          </div>
          <ImageUploadField label="Thumbnail" value={form.thumbnail} onChange={(url) => setForm({ ...form, thumbnail: url })} />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Source Name">
              <input type="text" placeholder="e.g. PIB, The Hindu" value={form.sourceName} onChange={(e) => setForm({ ...form, sourceName: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            </FormField>
            <FormField label="Author">
              <input type="text" placeholder="e.g. Team Gyanam" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            </FormField>
          </div>
          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={isSubmitting} className="px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl disabled:opacity-50 cursor-pointer">
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button onClick={cancelEdit} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl border border-[#F3DCDD] shadow-sm hover:shadow-md transition-shadow flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-[#C12223] uppercase">{item.category} · {item.date}</span>
              {item.mcqQuestion ? (
                <span className="ml-2 text-[9px] font-bold text-[#127A52] bg-[#E7F5EE] px-1.5 py-0.5 rounded uppercase">MCQ added</span>
              ) : (
                <span className="ml-2 text-[9px] font-bold text-[#B4590A] bg-[#FBF0DF] px-1.5 py-0.5 rounded uppercase">No MCQ</span>
              )}
              <h4 className="font-bold text-sm text-[#1F1A1C]">{item.title}</h4>
              <p className="text-xs text-[#555555] mt-1">{item.summary}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(item)} className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg cursor-pointer">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-lg cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-sm text-[#888888] py-8">No current affairs items yet.</p>}
      </div>
    </div>
  );
}
