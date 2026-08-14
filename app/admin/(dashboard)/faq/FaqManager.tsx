'use client';
import { useState } from 'react';

interface Faq {
  id: string;
  category: string;
  question: string;
  answer: string;
  linkUrl: string | null;
}

const EMPTY_FORM = { category: 'General', question: '', answer: '', linkUrl: '' };

const PAGE_OPTIONS = [
  { label: 'No link', value: '' },
  { label: 'Home', value: '/' },
  { label: 'Courses', value: '/courses' },
  { label: 'Daily Quiz', value: '/daily-quiz' },
  { label: 'Current Affairs', value: '/current-affairs' },
  { label: 'Study Material', value: '/study-material' },
  { label: 'Downloads', value: '/downloads' },
  { label: 'FAQ / Helpdesk', value: '/faq' },
  { label: 'About', value: '/about' },
  { label: 'Contact', value: '/contact' },
];
const CUSTOM_URL = '__custom__';

export default function FaqManager({ faqs: initialFaqs }: { faqs: Faq[] }) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCreate = () => {
    setEditingId('new');
    setForm(EMPTY_FORM);
    setError(null);
  };

  const startEdit = (faq: Faq) => {
    setEditingId(faq.id);
    setForm({ category: faq.category, question: faq.question, answer: faq.answer, linkUrl: faq.linkUrl ?? '' });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      setError('Question and answer are required');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingId === 'new') {
        const res = await fetch('/api/admin/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create FAQ');
        setFaqs((prev) => [data.faq, ...prev]);
      } else if (editingId) {
        const res = await fetch(`/api/admin/faq/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update FAQ');
        setFaqs((prev) => prev.map((f) => (f.id === editingId ? data.faq : f)));
      }
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    try {
      await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete FAQ', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">FAQ</h2>
          <p className="text-sm text-[#888888] mt-0.5">{faqs.length} question{faqs.length === 1 ? '' : 's'}</p>
        </div>
        {editingId === null && (
          <button
            onClick={startCreate}
            className="px-4 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            + Add FAQ
          </button>
        )}
      </div>

      {editingId !== null && (
        <div className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-3">
          <input
            type="text"
            placeholder="Category (e.g. General, Payments)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold"
          />
          <input
            type="text"
            placeholder="Question"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold"
          />
          <textarea
            placeholder="Answer"
            rows={3}
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold"
          />
          <div>
            <label className="text-[11px] font-bold text-[#888888] uppercase tracking-wide">Link to page (optional)</label>
            <select
              value={PAGE_OPTIONS.some((o) => o.value === form.linkUrl) ? form.linkUrl : CUSTOM_URL}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value === CUSTOM_URL ? form.linkUrl || '/' : e.target.value })}
              className="w-full mt-1 px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold"
            >
              {PAGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              <option value={CUSTOM_URL}>Custom URL...</option>
            </select>
            {!PAGE_OPTIONS.some((o) => o.value === form.linkUrl) && (
              <input
                type="text"
                placeholder="/courses/ssc-cgl-2026-foundation"
                value={form.linkUrl}
                onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                className="w-full mt-1.5 px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold"
              />
            )}
          </div>
          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white p-4 rounded-2xl border border-[#F3DCDD] shadow-sm hover:shadow-md transition-shadow flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-[#C12223] uppercase">{faq.category}</span>
              <h4 className="font-bold text-sm text-[#1F1A1C]">{faq.question}</h4>
              <p className="text-xs text-[#555555] mt-1">{faq.answer}</p>
              {faq.linkUrl && (
                <p className="text-[11px] font-semibold text-[#C12223] mt-1">Links to {faq.linkUrl}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => startEdit(faq)}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
                className="px-3 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-lg cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && <p className="text-center text-sm text-[#888888] py-8">No FAQs yet.</p>}
      </div>
    </div>
  );
}
