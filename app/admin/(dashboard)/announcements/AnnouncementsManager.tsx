'use client';
import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import FormField from '../_components/FormField';

interface Banner {
  id: string;
  badge: string;
  message: string;
  link: string | null;
  isActive: boolean;
  order: number;
}

const EMPTY_FORM = { badge: '', message: '', link: '', isActive: true };

export default function AnnouncementsManager({ banners: initialBanners }: { banners: Banner[] }) {
  const [banners, setBanners] = useState(initialBanners);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCreate = () => {
    setEditingId('new');
    setForm(EMPTY_FORM);
    setError(null);
  };

  const startEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setForm({ badge: banner.badge, message: banner.message, link: banner.link ?? '', isActive: banner.isActive });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const handleSave = async () => {
    if (!form.badge.trim() || !form.message.trim()) {
      setError('Badge and message are required');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    const payload = { badge: form.badge, message: form.message, link: form.link || undefined, isActive: form.isActive };
    try {
      if (editingId === 'new') {
        const res = await fetch('/api/admin/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create banner');
        setBanners((prev) => [...prev, data.banner]);
      } else if (editingId) {
        const res = await fetch(`/api/admin/announcements/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update banner');
        setBanners((prev) => prev.map((b) => (b.id === editingId ? data.banner : b)));
      }
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    setBanners((prev) => prev.filter((b) => b.id !== id));
    try {
      await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete banner', err);
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= banners.length) return;
    const a = banners[index];
    const b = banners[targetIndex];
    const next = [...banners];
    next[index] = { ...b, order: a.order };
    next[targetIndex] = { ...a, order: b.order };
    setBanners(next);
    try {
      await Promise.all([
        fetch(`/api/admin/announcements/${a.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: b.order }),
        }),
        fetch(`/api/admin/announcements/${b.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: a.order }),
        }),
      ]);
    } catch (err) {
      console.error('Failed to reorder banners', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">Top Announcement Banner</h2>
          <p className="text-sm text-[#888888] mt-0.5">
            {banners.length} banner{banners.length === 1 ? '' : 's'} — active ones rotate on the site&apos;s top strip
          </p>
        </div>
        {editingId === null && (
          <button onClick={startCreate} className="px-4 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer">
            + Add Banner
          </button>
        )}
      </div>

      {editingId !== null && (
        <div className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-3">
          <FormField label="Badge">
            <input
              type="text"
              placeholder="e.g. NEW BATCH 2026"
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold"
            />
          </FormField>
          <FormField label="Message">
            <input
              type="text"
              placeholder="e.g. Admissions open for SSC CGL Tier I+II, Assam ADRE 3.0 & SBI PO"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold"
            />
          </FormField>
          <FormField label="Link (optional)">
            <input
              type="text"
              placeholder="e.g. /courses/ssc-cgl-2026-foundation"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold"
            />
          </FormField>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            <span className="text-[11px] font-bold text-[#888888] uppercase">Active (shown on the site)</span>
          </label>
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
        {banners.map((banner, i) => (
          <div key={banner.id} className="bg-white p-4 rounded-2xl border border-[#F3DCDD] shadow-sm hover:shadow-md transition-shadow flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-0.5 pt-0.5">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === banners.length - 1}
                  className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#C12223] uppercase">{banner.badge}</span>
                {banner.isActive ? (
                  <span className="ml-2 text-[9px] font-bold text-[#127A52] bg-[#E7F5EE] px-1.5 py-0.5 rounded uppercase">Active</span>
                ) : (
                  <span className="ml-2 text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase">Hidden</span>
                )}
                <p className="font-semibold text-sm text-[#1F1A1C] mt-1">{banner.message}</p>
                {banner.link && <p className="text-[11px] font-semibold text-[#C12223] mt-1">Links to {banner.link}</p>}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(banner)} className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg cursor-pointer">Edit</button>
              <button onClick={() => handleDelete(banner.id)} className="px-3 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-lg cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
        {banners.length === 0 && <p className="text-center text-sm text-[#888888] py-8">No banners yet — the top strip will be hidden until you add one.</p>}
      </div>
    </div>
  );
}
