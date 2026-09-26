'use client';
import { useState } from 'react';
import {
  Book, BookOpen, FileText, HelpCircle, Newspaper, Rss, GraduationCap, Sigma, ClipboardList, ArrowLeft, type LucideIcon,
} from 'lucide-react';
import FormField from '../_components/FormField';
import TargetExamsField from '../_components/TargetExamsField';
import { TARGET_EXAMS } from '@/lib/targetExams';

interface Resource {
  id: string;
  title: string;
  type: string;
  category: string;
  fileSize: string;
  downloadsCount: number;
  rating: number;
  description: string;
  targetExams: string[];
  isHot: boolean;
  inStock: boolean;
  price: number | null;
  originalPrice: number | null;
  author: string | null;
  badge: string | null;
}

const EMPTY_FORM = {
  title: '',
  type: 'PDF Notes',
  category: '',
  fileSize: '',
  rating: 4.8,
  description: '',
  targetExams: [] as string[],
  isHot: false,
  inStock: true,
  price: '',
  originalPrice: '',
  author: '',
  badge: '',
};

const RESOURCE_TYPES = ['Book', 'PYQ Paper', 'Question Bank', 'Magazine', 'Current Affairs Magazine', 'Course Material', 'PDF Notes', 'Formula Sheet', 'Syllabus PDF', 'NCERT Gist'];

const TYPE_ICONS: Record<string, LucideIcon> = {
  Book: Book,
  'PYQ Paper': FileText,
  'Question Bank': HelpCircle,
  Magazine: Newspaper,
  'Current Affairs Magazine': Rss,
  'Course Material': GraduationCap,
  'PDF Notes': FileText,
  'Formula Sheet': Sigma,
  'Syllabus PDF': ClipboardList,
  'NCERT Gist': BookOpen,
};

export default function ResourcesManager({ resources: initialResources }: { resources: Resource[] }) {
  const [resources, setResources] = useState(initialResources);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCreate = (type: string) => {
    setEditingId('new');
    setForm({ ...EMPTY_FORM, type });
    setError(null);
  };

  const startEdit = (r: Resource) => {
    setEditingId(r.id);
    setForm({
      title: r.title,
      type: r.type,
      category: r.category,
      fileSize: r.fileSize,
      rating: r.rating,
      description: r.description,
      targetExams: r.targetExams.filter((e) => TARGET_EXAMS.includes(e)),
      isHot: r.isHot,
      inStock: r.inStock,
      price: r.price?.toString() ?? '',
      originalPrice: r.originalPrice?.toString() ?? '',
      author: r.author ?? '',
      badge: r.badge ?? '',
    });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    const payload = {
      title: form.title,
      type: form.type,
      category: form.category,
      fileSize: form.fileSize,
      rating: Number(form.rating),
      description: form.description,
      targetExams: form.targetExams,
      isHot: form.isHot,
      inStock: form.inStock,
      price: form.price ? Number(form.price) : undefined,
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      author: form.author || undefined,
      badge: form.badge || undefined,
    };
    try {
      if (editingId === 'new') {
        const res = await fetch('/api/admin/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create resource');
        setResources((prev) => [data.resource, ...prev]);
      } else if (editingId) {
        const res = await fetch(`/api/admin/resources/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update resource');
        setResources((prev) => prev.map((r) => (r.id === editingId ? data.resource : r)));
      }
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resource?')) return;
    setResources((prev) => prev.filter((r) => r.id !== id));
    try {
      await fetch(`/api/admin/resources/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete resource', err);
    }
  };

  const isCreatingNew = editingId === 'new';
  const typedResources = selectedType ? resources.filter((r) => r.type === selectedType) : [];

  return (
    <div className="space-y-4">
      {selectedType === null ? (
        <>
          <div>
            <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">Resources</h2>
            <p className="text-sm text-[#888888] mt-0.5">{resources.length} resource{resources.length === 1 ? '' : 's'} · pick a type to view or add</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {RESOURCE_TYPES.map((t) => {
              const Icon = TYPE_ICONS[t] ?? FileText;
              const count = resources.filter((r) => r.type === t).length;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedType(t)}
                  className="text-left bg-white p-4 rounded-2xl border border-[#F3DCDD] shadow-sm hover:border-[#C12223] hover:shadow-md transition cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FDEAE9] text-[#C12223] flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-sm text-[#1F1A1C] leading-snug">{t}</p>
                  <p className="text-[11px] text-[#888888] mt-0.5">{count} resource{count === 1 ? '' : 's'}</p>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedType(null);
                  cancelEdit();
                }}
                className="w-9 h-9 flex items-center justify-center bg-white border border-[#F3DCDD] rounded-xl cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-[#1F1A1C]" />
              </button>
              <div>
                <h2 className="font-heading font-black text-xl text-[#1F1A1C]">{selectedType}</h2>
                <p className="text-xs text-[#888888] mt-0.5">{typedResources.length} resource{typedResources.length === 1 ? '' : 's'}</p>
              </div>
            </div>
            {editingId === null && (
              <button onClick={() => startCreate(selectedType)} className="px-4 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer">
                + Add New
              </button>
            )}
          </div>

          {editingId !== null && (
            <div className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-3">
              {isCreatingNew ? (
                <FormField label="Type">
                  <div className="px-3.5 py-2 bg-[#FDEAE9] text-[#C12223] rounded-xl text-sm font-bold">{form.type}</div>
                </FormField>
              ) : (
                <FormField label="Type">
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold">
                    {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </FormField>
              )}
              <FormField label="Title">
                <input type="text" placeholder="e.g. SSC CGL Previous Year Papers (2019-2025)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
              </FormField>
              <FormField label="Category">
                <input type="text" placeholder="e.g. SSC, Banking" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
              </FormField>
              <div className="grid grid-cols-3 gap-3">
                <FormField label="File Size">
                  <input type="text" placeholder="e.g. 4.5 MB" value={form.fileSize} onChange={(e) => setForm({ ...form, fileSize: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
                </FormField>
                <FormField label="Rating (0-5)">
                  <input type="number" step="0.1" min="0" max="5" placeholder="4.8" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
                </FormField>
                <FormField label="Badge (optional)">
                  <input type="text" placeholder="e.g. 🔥 Trending" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
                </FormField>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FormField label="Price (optional)">
                  <input type="number" placeholder="Leave blank if free" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
                </FormField>
                <FormField label="Original Price (optional)">
                  <input type="number" placeholder="Shown struck-through" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
                </FormField>
                <FormField label="Author (optional)">
                  <input type="text" placeholder="e.g. Gyanam Editorial Team" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
                </FormField>
              </div>
              <TargetExamsField value={form.targetExams} onChange={(next) => setForm({ ...form, targetExams: next })} />
              <FormField label="Description">
                <textarea placeholder="A short description shown on the resource card" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
              </FormField>
              <div className="flex items-center gap-6 text-xs font-bold text-[#555555]">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={form.isHot} onChange={(e) => setForm({ ...form, isHot: e.target.checked })} /> Hot / Featured
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} /> In Stock
                </label>
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

          {editingId === null && (
            <div className="space-y-2">
              {typedResources.map((r) => (
                <div key={r.id} className="bg-white p-4 rounded-2xl border border-[#F3DCDD] shadow-sm hover:shadow-md transition-shadow flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#C12223] uppercase">{r.category} · {r.downloadsCount} downloads</span>
                    <h4 className="font-bold text-sm text-[#1F1A1C]">{r.title}</h4>
                    <p className="text-xs text-[#555555] mt-1">{r.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => startEdit(r)} className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg cursor-pointer">Edit</button>
                    <button onClick={() => handleDelete(r.id)} className="px-3 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-lg cursor-pointer">Delete</button>
                  </div>
                </div>
              ))}
              {typedResources.length === 0 && <p className="text-center text-sm text-[#888888] py-8">No {selectedType} added yet.</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
