'use client';
import { useState } from 'react';
import Link from 'next/link';

interface Course {
  id: string;
  slug: string;
  title: string;
  category: string;
  targetExam: string;
  badge: string | null;
  rating: number;
  reviewsCount: number;
  studentsEnrolled: number;
  instructor: { name: string; designation: string; avatar: string };
  duration: string;
  lessonsCount: number;
  language: string;
  originalPrice: number;
  discountPrice: number;
  features: string[];
  thumbnail: string;
  popular: boolean;
  syllabusOverview: { module: string; topics: string[] }[];
  startDate: string;
}

const EMPTY_FORM = {
  slug: '',
  title: '',
  category: 'SSC',
  targetExam: '',
  badge: '',
  rating: 4.8,
  reviewsCount: 0,
  studentsEnrolled: 0,
  instructorName: '',
  instructorDesignation: '',
  instructorAvatar: '',
  duration: '',
  lessonsCount: 0,
  language: 'Bilingual (Hindi + Eng)',
  originalPrice: 0,
  discountPrice: 0,
  featuresText: '',
  thumbnail: '',
  popular: false,
  syllabusText: '',
  startDate: '',
};

const CATEGORIES = ['SSC', 'Banking', 'Railway', 'UPSC', 'Assam Govt', 'State PSC', 'Defence'];

function slugify(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function parseSyllabus(text: string): { module: string; topics: string[] }[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [module, topicsStr] = line.split('|');
      return {
        module: (module || '').trim(),
        topics: (topicsStr || '').split(',').map((t) => t.trim()).filter(Boolean),
      };
    });
}

function syllabusToText(syllabus: { module: string; topics: string[] }[]): string {
  return syllabus.map((s) => `${s.module} | ${s.topics.join(', ')}`).join('\n');
}

export default function CoursesManager({ courses: initialCourses }: { courses: Course[] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCreate = () => {
    setEditingId('new');
    setForm(EMPTY_FORM);
    setError(null);
  };

  const startEdit = (c: Course) => {
    setEditingId(c.id);
    setForm({
      slug: c.slug,
      title: c.title,
      category: c.category,
      targetExam: c.targetExam,
      badge: c.badge ?? '',
      rating: c.rating,
      reviewsCount: c.reviewsCount,
      studentsEnrolled: c.studentsEnrolled,
      instructorName: c.instructor.name,
      instructorDesignation: c.instructor.designation,
      instructorAvatar: c.instructor.avatar,
      duration: c.duration,
      lessonsCount: c.lessonsCount,
      language: c.language,
      originalPrice: c.originalPrice,
      discountPrice: c.discountPrice,
      featuresText: c.features.join('\n'),
      thumbnail: c.thumbnail,
      popular: c.popular,
      syllabusText: syllabusToText(c.syllabusOverview),
      startDate: c.startDate,
    });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.thumbnail.trim()) {
      setError('Title and thumbnail are required');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    const payload = {
      slug: form.slug.trim() || slugify(form.title),
      title: form.title,
      category: form.category,
      targetExam: form.targetExam,
      badge: form.badge || undefined,
      rating: Number(form.rating),
      reviewsCount: Number(form.reviewsCount),
      studentsEnrolled: Number(form.studentsEnrolled),
      instructor: { name: form.instructorName, designation: form.instructorDesignation, avatar: form.instructorAvatar },
      duration: form.duration,
      lessonsCount: Number(form.lessonsCount),
      language: form.language,
      originalPrice: Number(form.originalPrice),
      discountPrice: Number(form.discountPrice),
      features: form.featuresText.split('\n').map((s) => s.trim()).filter(Boolean),
      thumbnail: form.thumbnail,
      popular: form.popular,
      syllabusOverview: parseSyllabus(form.syllabusText),
      startDate: form.startDate,
    };
    try {
      if (editingId === 'new') {
        const res = await fetch('/api/admin/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create course');
        setCourses((prev) => [data.course, ...prev]);
      } else if (editingId) {
        const res = await fetch(`/api/admin/courses/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update course');
        setCourses((prev) => prev.map((c) => (c.id === editingId ? data.course : c)));
      }
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete course', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-black text-2xl text-[#1F1A1C]">Courses Manager</h2>
        {editingId === null && (
          <button onClick={startCreate} className="px-4 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer">
            + Add Course
          </button>
        )}
      </div>

      {editingId !== null && (
        <div className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-3 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="text" placeholder="Slug (auto if blank)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="text" placeholder="Target Exam" value={form.targetExam} onChange={(e) => setForm({ ...form, targetExam: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="text" placeholder="Badge (optional)" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-[11px] font-bold text-[#888888] uppercase mb-2">Instructor</p>
            <div className="grid grid-cols-3 gap-3">
              <input type="text" placeholder="Name" value={form.instructorName} onChange={(e) => setForm({ ...form, instructorName: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
              <input type="text" placeholder="Designation" value={form.instructorDesignation} onChange={(e) => setForm({ ...form, instructorDesignation: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
              <input type="text" placeholder="Avatar URL" value={form.instructorAvatar} onChange={(e) => setForm({ ...form, instructorAvatar: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 pt-2 border-t border-gray-100">
            <input type="number" step="0.1" min="0" max="5" placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="number" placeholder="Reviews" value={form.reviewsCount} onChange={(e) => setForm({ ...form, reviewsCount: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="number" placeholder="Students" value={form.studentsEnrolled} onChange={(e) => setForm({ ...form, studentsEnrolled: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="number" placeholder="Lessons" value={form.lessonsCount} onChange={(e) => setForm({ ...form, lessonsCount: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input type="text" placeholder="Duration (e.g. 8 Months)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="text" placeholder="Language" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="text" placeholder="Start Date (e.g. Batch Starts 28th July)" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Original Price (Rs)" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
            <input type="number" placeholder="Discount Price (Rs)" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: Number(e.target.value) })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          </div>
          <input type="text" placeholder="Thumbnail URL" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          <textarea placeholder="Features (one per line)" rows={3} value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })} className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold" />
          <div>
            <textarea
              placeholder="Syllabus (one module per line: Module Name | topic1, topic2, topic3)"
              rows={4}
              value={form.syllabusText}
              onChange={(e) => setForm({ ...form, syllabusText: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold"
            />
            <p className="text-[10px] text-[#888888] mt-1">Format: Module 1: Quant | Algebra, Geometry, Trigonometry</p>
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#555555]">
            <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} /> Mark as Popular
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
        {courses.map((c) => (
          <div key={c.id} className="bg-white p-4 rounded-2xl border border-[#F3DCDD] shadow-sm flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-[#C12223] uppercase">{c.category} · ₹{c.discountPrice} · {c.studentsEnrolled} enrolled</span>
              <h4 className="font-bold text-sm text-[#1F1A1C]">{c.title}</h4>
              <p className="text-xs text-[#555555] mt-1">{c.instructor.name} — {c.instructor.designation}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href={`/admin/courses/${c.id}/curriculum`} className="px-3 py-1.5 bg-[#FFF5F5] text-[#C12223] font-bold text-xs rounded-lg cursor-pointer border border-[#C12223]/20">Curriculum</Link>
              <button onClick={() => startEdit(c)} className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg cursor-pointer">Edit</button>
              <button onClick={() => handleDelete(c.id)} className="px-3 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-lg cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
        {courses.length === 0 && <p className="text-center text-sm text-[#888888] py-8">No courses yet.</p>}
      </div>
    </div>
  );
}
