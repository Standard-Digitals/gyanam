'use client';
import { useState } from 'react';
import ImageUploadField from '../_components/ImageUploadField';
import FormField from '../_components/FormField';

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
        <div>
          <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">Mentors</h2>
          <p className="text-sm text-[#888888] mt-0.5">{mentors.length} mentor{mentors.length === 1 ? '' : 's'}</p>
        </div>
        {editingId === null && (
          <button onClick={startCreate} className="px-4 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer">
            + Add Mentor
          </button>
        )}
      </div>

      {editingId !== null && (
        <div className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Name">
              <input type="text" placeholder="e.g. Rakesh Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            </FormField>
            <FormField label="Title">
              <input type="text" placeholder="e.g. Senior Faculty, Quant" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Qualification">
              <input type="text" placeholder="e.g. M.Sc. Mathematics, IIT Delhi" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            </FormField>
            <FormField label="Ex-Role (optional)">
              <input type="text" placeholder="e.g. Ex-Central Excise Inspector" value={form.exRole} onChange={(e) => setForm({ ...form, exRole: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            </FormField>
          </div>
          <FormField label="Subject">
            <input type="text" placeholder="e.g. Quantitative Aptitude" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </FormField>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Experience (yrs)">
              <input type="number" placeholder="0" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            </FormField>
            <FormField label="Selections Mentored">
              <input type="number" placeholder="0" value={form.selectionsMentored} onChange={(e) => setForm({ ...form, selectionsMentored: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            </FormField>
            <FormField label="Rating (0-5)">
              <input type="number" step="0.1" min="0" max="5" placeholder="4.8" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            </FormField>
          </div>
          <ImageUploadField label="Photo" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
          <FormField label="Bio">
            <textarea placeholder="A short bio highlighting achievements and teaching style" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </FormField>
          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={isSubmitting} className="px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl disabled:opacity-50 cursor-pointer">
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button onClick={cancelEdit} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {mentors.map((m) => (
          <div key={m.id} className="bg-white p-4 rounded-2xl border border-[#F3DCDD] shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
            <div className="flex items-start gap-3">
              {m.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.image} alt={m.name} className="w-14 h-14 rounded-xl object-cover border border-[#F3DCDD] shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-[#FDEAE9] text-[#C12223] flex items-center justify-center shrink-0 font-heading font-black text-lg">
                  {m.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-[#C12223] uppercase">{m.subject} · {m.experienceYears} yrs</span>
                <h4 className="font-bold text-sm text-[#1F1A1C] leading-snug">{m.name} — {m.title}</h4>
              </div>
            </div>
            <p className="text-xs text-[#555555] line-clamp-3">{m.bio}</p>
            <div className="flex gap-2 mt-auto pt-1">
              <button onClick={() => startEdit(m)} className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg cursor-pointer">Edit</button>
              <button onClick={() => handleDelete(m.id)} className="flex-1 px-3 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-lg cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
        {mentors.length === 0 && <p className="col-span-full text-center text-sm text-[#888888] py-8">No mentors yet.</p>}
      </div>
    </div>
  );
}
