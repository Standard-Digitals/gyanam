'use client';
import { useState } from 'react';

interface Mentor {
  id: string;
  name: string;
  title: string;
  experienceYears: number;
  qualification: string;
  exRole: string | null;
  subject: string;
  selectionsMentored: number;
  rating: number;
  image: string;
  bio: string;
}

const EMPTY_FORM = {
  name: '',
  title: '',
  experienceYears: 0,
  qualification: '',
  exRole: '',
  subject: '',
  selectionsMentored: 0,
  rating: 4.8,
  image: '',
  bio: '',
};

export default function MentorsManager({ mentors: initialMentors }: { mentors: Mentor[] }) {
  const [mentors, setMentors] = useState(initialMentors);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCreate = () => {
    setEditingId('new');
    setForm(EMPTY_FORM);
    setError(null);
  };

  const startEdit = (m: Mentor) => {
    setEditingId(m.id);
    setForm({ ...m, exRole: m.exRole ?? '' });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.bio.trim()) {
      setError('Name and bio are required');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingId === 'new') {
        const res = await fetch('/api/admin/mentors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create mentor');
        setMentors((prev) => [data.mentor, ...prev]);
      } else if (editingId) {
        const res = await fetch(`/api/admin/mentors/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update mentor');
        setMentors((prev) => prev.map((m) => (m.id === editingId ? data.mentor : m)));
      }
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this mentor?')) return;
    setMentors((prev) => prev.filter((m) => m.id !== id));
    try {
      await fetch(`/api/admin/mentors/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete mentor', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">Mentors Manager</h2>
        {editingId === null && (
          <button onClick={startCreate} className="px-4 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer">
            + Add Mentor
          </button>
        )}
      </div>

      {editingId !== null && (
        <div className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Qualification" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="text" placeholder="Ex-Role (optional)" value={form.exRole} onChange={(e) => setForm({ ...form, exRole: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </div>
          <input type="text" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          <div className="grid grid-cols-3 gap-3">
            <input type="number" placeholder="Experience (yrs)" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="number" placeholder="Selections Mentored" value={form.selectionsMentored} onChange={(e) => setForm({ ...form, selectionsMentored: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="number" step="0.1" min="0" max="5" placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </div>
          <input type="text" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          <textarea placeholder="Bio" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
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
        {mentors.map((m) => (
          <div key={m.id} className="bg-white p-4 rounded-2xl border border-[#F3DCDD] shadow-sm flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-[#C12223] uppercase">{m.subject} · {m.experienceYears} yrs</span>
              <h4 className="font-bold text-sm text-[#1F1A1C]">{m.name} — {m.title}</h4>
              <p className="text-xs text-[#555555] mt-1">{m.bio}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(m)} className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg cursor-pointer">Edit</button>
              <button onClick={() => handleDelete(m.id)} className="px-3 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-lg cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
        {mentors.length === 0 && <p className="text-center text-sm text-[#888888] py-8">No mentors yet.</p>}
      </div>
    </div>
  );
}
