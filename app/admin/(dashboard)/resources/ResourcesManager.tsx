'use client';
import { useState } from 'react';

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
  targetExamsText: '',
  isHot: false,
  inStock: true,
  price: '',
  originalPrice: '',
  author: '',
  badge: '',
};

const RESOURCE_TYPES = ['Book', 'PYQ Paper', 'Question Bank', 'Magazine', 'Current Affairs Magazine', 'Course Material', 'PDF Notes', 'Formula Sheet', 'Syllabus PDF', 'NCERT Gist'];

export default function ResourcesManager({ resources: initialResources }: { resources: Resource[] }) {
  const [resources, setResources] = useState(initialResources);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCreate = () => {
    setEditingId('new');
    setForm(EMPTY_FORM);
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
      targetExamsText: r.targetExams.join(', '),
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
      targetExams: form.targetExamsText.split(',').map((s) => s.trim()).filter(Boolean),
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">Resources Manager</h2>
        {editingId === null && (
          <button onClick={startCreate} className="px-4 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer">
            + Add Resource
          </button>
        )}
      </div>

      {editingId !== null && (
        <div className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-3">
          <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold">
              {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input type="text" placeholder="File Size (e.g. 4.5 MB)" value={form.fileSize} onChange={(e) => setForm({ ...form, fileSize: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="number" step="0.1" min="0" max="5" placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="text" placeholder="Badge (optional)" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input type="number" placeholder="Price (optional)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="number" placeholder="Original Price (optional)" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="text" placeholder="Author (optional)" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </div>
          <input type="text" placeholder="Target Exams (comma separated)" value={form.targetExamsText} onChange={(e) => setForm({ ...form, targetExamsText: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
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

      <div className="space-y-2">
        {resources.map((r) => (
          <div key={r.id} className="bg-white p-4 rounded-2xl border border-[#F3DCDD] shadow-sm flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-[#C12223] uppercase">{r.type} · {r.category} · {r.downloadsCount} downloads</span>
              <h4 className="font-bold text-sm text-[#1F1A1C]">{r.title}</h4>
              <p className="text-xs text-[#555555] mt-1">{r.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(r)} className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg cursor-pointer">Edit</button>
              <button onClick={() => handleDelete(r.id)} className="px-3 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-lg cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
        {resources.length === 0 && <p className="text-center text-sm text-[#888888] py-8">No resources yet.</p>}
      </div>
    </div>
  );
}
