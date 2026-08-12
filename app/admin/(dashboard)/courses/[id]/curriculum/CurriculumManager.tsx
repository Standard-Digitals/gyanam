'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Youtube, Upload, Trash2, Plus } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  order: number;
  videoType: string;
  videoUrl: string | null;
  duration: string | null;
}

interface Chapter {
  id: string;
  title: string;
  order: number;
  topics: Topic[];
}

const EMPTY_TOPIC_FORM = { title: '', order: 0, videoType: 'youtube' as 'youtube' | 'upload', videoUrl: '', duration: '' };

export default function CurriculumManager({ courseId, courseTitle, chapters: initialChapters }: { courseId: string; courseTitle: string; chapters: Chapter[] }) {
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(initialChapters[0]?.id ?? null);

  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [addingChapter, setAddingChapter] = useState(false);

  const [topicFormFor, setTopicFormFor] = useState<{ chapterId: string; topicId: string } | null>(null);
  const [topicForm, setTopicForm] = useState(EMPTY_TOPIC_FORM);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddChapter = async () => {
    if (!newChapterTitle.trim()) return;
    setAddingChapter(true);
    try {
      const res = await fetch('/api/admin/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, title: newChapterTitle, order: chapters.length }),
      });
      const data = await res.json();
      setChapters((prev) => [...prev, { ...data.chapter, topics: [] }]);
      setNewChapterTitle('');
      setExpandedChapterId(data.chapter.id);
    } finally {
      setAddingChapter(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Delete this chapter and all its lectures?')) return;
    setChapters((prev) => prev.filter((c) => c.id !== chapterId));
    await fetch(`/api/admin/chapters/${chapterId}`, { method: 'DELETE' });
  };

  const startAddTopic = (chapterId: string) => {
    setTopicFormFor({ chapterId, topicId: 'new' });
    setTopicForm(EMPTY_TOPIC_FORM);
    setError('');
  };

  const startEditTopic = (chapterId: string, topic: Topic) => {
    setTopicFormFor({ chapterId, topicId: topic.id });
    setTopicForm({
      title: topic.title,
      order: topic.order,
      videoType: topic.videoType as 'youtube' | 'upload',
      videoUrl: topic.videoUrl ?? '',
      duration: topic.duration ?? '',
    });
    setError('');
  };

  const cancelTopicForm = () => {
    setTopicFormFor(null);
    setTopicForm(EMPTY_TOPIC_FORM);
    setError('');
  };

  const handleFileSelected = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('video', file);
      const res = await fetch('/api/admin/upload-video', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setTopicForm((prev) => ({ ...prev, videoUrl: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Video upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveTopic = async () => {
    if (!topicFormFor) return;
    if (!topicForm.title.trim()) {
      setError('Lecture title is required');
      return;
    }
    if (!topicForm.videoUrl.trim()) {
      setError('Add a YouTube link or upload a video file');
      return;
    }

    const payload = { ...topicForm, chapterId: topicFormFor.chapterId };

    if (topicFormFor.topicId === 'new') {
      const res = await fetch('/api/admin/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setChapters((prev) =>
        prev.map((c) => (c.id === topicFormFor.chapterId ? { ...c, topics: [...c.topics, data.topic] } : c))
      );
    } else {
      const res = await fetch(`/api/admin/topics/${topicFormFor.topicId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setChapters((prev) =>
        prev.map((c) =>
          c.id === topicFormFor.chapterId
            ? { ...c, topics: c.topics.map((t) => (t.id === topicFormFor.topicId ? data.topic : t)) }
            : c
        )
      );
    }
    cancelTopicForm();
  };

  const handleDeleteTopic = async (chapterId: string, topicId: string) => {
    if (!confirm('Delete this lecture?')) return;
    setChapters((prev) => prev.map((c) => (c.id === chapterId ? { ...c, topics: c.topics.filter((t) => t.id !== topicId) } : c)));
    await fetch(`/api/admin/topics/${topicId}`, { method: 'DELETE' });
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/courses" className="text-xs font-bold text-[#888888] hover:text-[#C12223]">← Back to Courses</Link>
        <h2 className="font-heading font-black text-2xl text-[#1F1A1C] mt-1">Curriculum — {courseTitle}</h2>
      </div>

      {/* Add Chapter */}
      <div className="bg-white p-4 rounded-2xl border border-[#F3DCDD] shadow-sm flex gap-2">
        <input
          type="text"
          placeholder="New Chapter Title (e.g. Module 1: Quantitative Aptitude)"
          value={newChapterTitle}
          onChange={(e) => setNewChapterTitle(e.target.value)}
          className="flex-1 px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold"
        />
        <button
          onClick={handleAddChapter}
          disabled={addingChapter}
          className="px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl disabled:opacity-50 cursor-pointer flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add Chapter
        </button>
      </div>

      {/* Chapters List */}
      <div className="space-y-3">
        {chapters.map((chapter) => {
          const isExpanded = expandedChapterId === chapter.id;
          return (
            <div key={chapter.id} className="bg-white rounded-2xl border border-[#F3DCDD] shadow-sm overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setExpandedChapterId(isExpanded ? null : chapter.id)}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-[#C12223]" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                  <span className="font-bold text-sm text-[#1F1A1C]">{chapter.title}</span>
                  <span className="text-xs text-[#888888]">({chapter.topics.length} lectures)</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteChapter(chapter.id); }}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {isExpanded && (
                <div className="border-t border-[#F3DCDD] p-4 space-y-2 bg-[#FFF5F5]/50">
                  {chapter.topics.map((topic) => (
                    <div key={topic.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#F3DCDD] text-sm">
                      <div className="flex items-center gap-2">
                        {topic.videoType === 'youtube' ? <Youtube className="w-4 h-4 text-red-600" /> : <Upload className="w-4 h-4 text-blue-600" />}
                        <span className="font-semibold text-[#1F1A1C]">{topic.title}</span>
                        {topic.duration && <span className="text-xs text-[#888888]">({topic.duration})</span>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEditTopic(chapter.id, topic)} className="px-2.5 py-1 bg-gray-100 text-gray-700 font-bold text-[10px] rounded-lg cursor-pointer">Edit</button>
                        <button onClick={() => handleDeleteTopic(chapter.id, topic.id)} className="px-2.5 py-1 bg-red-50 text-red-600 font-bold text-[10px] rounded-lg cursor-pointer">Delete</button>
                      </div>
                    </div>
                  ))}

                  {topicFormFor?.chapterId === chapter.id ? (
                    <div className="p-4 bg-white rounded-xl border border-[#C12223]/30 space-y-2.5">
                      <input
                        type="text"
                        placeholder="Lecture Title"
                        value={topicForm.title}
                        onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-lg text-sm font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 24:10) - optional"
                        value={topicForm.duration}
                        onChange={(e) => setTopicForm({ ...topicForm, duration: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-lg text-sm font-semibold"
                      />

                      <div className="flex gap-2 text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setTopicForm({ ...topicForm, videoType: 'youtube', videoUrl: '' })}
                          className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-1.5 cursor-pointer ${topicForm.videoType === 'youtube' ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600'}`}
                        >
                          <Youtube className="w-3.5 h-3.5" /> YouTube Link
                        </button>
                        <button
                          type="button"
                          onClick={() => setTopicForm({ ...topicForm, videoType: 'upload', videoUrl: '' })}
                          className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-1.5 cursor-pointer ${topicForm.videoType === 'upload' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload Recording
                        </button>
                      </div>

                      {topicForm.videoType === 'youtube' ? (
                        <input
                          type="text"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={topicForm.videoUrl}
                          onChange={(e) => setTopicForm({ ...topicForm, videoUrl: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-lg text-sm font-semibold"
                        />
                      ) : (
                        <div className="space-y-1.5">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime"
                            onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                            className="w-full text-xs"
                          />
                          {uploading && <p className="text-xs text-blue-600 font-bold">Uploading video...</p>}
                          {topicForm.videoUrl && !uploading && (
                            <p className="text-xs text-emerald-600 font-bold">✓ Uploaded: {topicForm.videoUrl}</p>
                          )}
                        </div>
                      )}

                      {error && <p className="text-xs font-bold text-red-600">{error}</p>}

                      <div className="flex gap-2 pt-1">
                        <button onClick={handleSaveTopic} disabled={uploading} className="px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl disabled:opacity-50 cursor-pointer">
                          Save Lecture
                        </button>
                        <button onClick={cancelTopicForm} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => startAddTopic(chapter.id)}
                      className="w-full py-2.5 border border-dashed border-[#C12223]/40 text-[#C12223] font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Lecture
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {chapters.length === 0 && (
          <p className="text-center text-sm text-[#888888] py-8">No chapters yet — add your first chapter above.</p>
        )}
      </div>
    </div>
  );
}
